import { useEffect, useState } from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyMeta {
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
  /** Multiplier applied to base amounts, which are stored in INR. */
  rateFromINR: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  INR: { code: "INR", label: "Indian Rupee (₹)", symbol: "₹", locale: "en-IN", rateFromINR: 1 },
  USD: { code: "USD", label: "US Dollar ($)", symbol: "$", locale: "en-US", rateFromINR: 0.012 },
  EUR: { code: "EUR", label: "Euro (€)", symbol: "€", locale: "de-DE", rateFromINR: 0.011 },
  GBP: { code: "GBP", label: "British Pound (£)", symbol: "£", locale: "en-GB", rateFromINR: 0.0094 },
  AED: { code: "AED", label: "UAE Dirham (د.إ)", symbol: "د.إ", locale: "en-AE", rateFromINR: 0.044 },
};

const STORAGE_KEY = "dyc-currency";
const EVENT = "dyc-currency-change";

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

export const getCurrency = (): CurrencyCode => {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
  return stored && stored in CURRENCIES ? stored : DEFAULT_CURRENCY;
};

export const setCurrency = (code: CurrencyCode) => {
  window.localStorage.setItem(STORAGE_KEY, code);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: code }));
};

/** Formats an amount stored in INR into the active currency. */
export const formatAmount = (
  amountInINR: number,
  code: CurrencyCode = getCurrency(),
  options: { compact?: boolean; decimals?: number } = {}
) => {
  const meta = CURRENCIES[code];
  const value = amountInINR * meta.rateFromINR;
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.code,
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits: options.decimals ?? 0,
  }).format(value);
};

export const useCurrency = () => {
  const [code, setCode] = useState<CurrencyCode>(getCurrency);

  useEffect(() => {
    const sync = () => setCode(getCurrency());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    currency: code,
    meta: CURRENCIES[code],
    setCurrency: (next: CurrencyCode) => {
      setCurrency(next);
      setCode(next);
    },
    format: (amountInINR: number, options?: { compact?: boolean; decimals?: number }) =>
      formatAmount(amountInINR, code, options),
  };
};
