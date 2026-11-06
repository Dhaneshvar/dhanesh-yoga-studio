import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Keeps a route-level rendering fault from becoming a blank screen. Errors are
 * deliberately not displayed to visitors because they can expose implementation
 * details; browser logs retain the technical trace for development.
 */
class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Dhanesh Yoga application render error", error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-background px-4 py-10 grid place-items-center">
        <section className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-elevated">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground">We need a moment</h1>
          <p className="mt-3 font-body leading-relaxed text-muted-foreground">
            This page could not finish loading. Your account and any saved information are safe.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-body font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 font-body font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Return home
            </a>
          </div>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;
