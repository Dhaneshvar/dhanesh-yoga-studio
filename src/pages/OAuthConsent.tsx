import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

interface OAuthClient {
  name?: string;
  redirect_uri?: string;
}
interface AuthorizationDetails {
  client?: OAuthClient;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
}

// The `auth.oauth` namespace is still beta in the SDK types.
const oauth = () =>
  (supabase.auth as unknown as {
    oauth: {
      getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
      approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
      denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
    };
  }).oauth;

const scopeLabel = (scope: string) => {
  switch (scope) {
    case "openid":
      return "Confirm your identity";
    case "email":
      return "Share your email address";
    case "profile":
      return "Share your basic profile";
    default:
      return `Additional permission requested: ${scope}`;
  }
};

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [account, setAccount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in the request URL.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/account?next=" + encodeURIComponent(next);
        return;
      }
      setAccount(sess.session.user.email ?? sess.session.user.id);
      const { data, error: err } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const api = oauth();
    const { data, error: err } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect was returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? "this application";
  const scopes = (details?.scope ?? "").split(" ").filter(Boolean);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        {error ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
              Could not load this request
            </h1>
            <p className="font-body text-sm text-muted-foreground">{error}</p>
          </>
        ) : !details ? (
          <div className="flex flex-col items-center gap-3 py-6 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
            <p className="font-body text-sm">Loading authorization request…</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </span>
              <h1 className="font-display text-xl font-semibold text-foreground leading-tight">
                Connect {clientName} to Dhanesh Yoga Studio
              </h1>
            </div>

            <p className="font-body text-sm text-muted-foreground mb-4">
              {clientName} will be able to call this app&apos;s enabled tools while you are signed in.
            </p>

            <dl className="space-y-2 text-sm font-body mb-5">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Signed in as</dt>
                <dd className="text-foreground text-right break-all">{account}</dd>
              </div>
              {details.client?.redirect_uri && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Redirects to</dt>
                  <dd className="text-foreground text-right break-all">{details.client.redirect_uri}</dd>
                </div>
              )}
            </dl>

            {scopes.length > 0 && (
              <ul className="mb-5 space-y-1.5 text-sm font-body text-foreground list-disc pl-5">
                {scopes.map((s) => (
                  <li key={s}>{scopeLabel(s)}</li>
                ))}
              </ul>
            )}

            <p className="font-body text-xs text-muted-foreground mb-6">
              This does not bypass this app&apos;s permissions or backend policies.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => decide(true)}
                disabled={busy}
                className="flex-1"
                title="Approve this connection"
                aria-label="Approve this connection"
              >
                {busy ? "Working…" : "Approve"}
              </Button>
              <Button
                variant="outline"
                onClick={() => decide(false)}
                disabled={busy}
                className="flex-1"
                title="Cancel this connection"
                aria-label="Cancel this connection"
              >
                Cancel connection
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthConsent;
