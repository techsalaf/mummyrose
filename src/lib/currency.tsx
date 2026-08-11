import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DollarSign, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rateFromNaira: number; // 1 NGN = X units of currency
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  NGN: { code: "NGN", symbol: "₦", label: "Nigerian Naira (NGN)", flag: "🇳🇬", rateFromNaira: 1 },
  USD: { code: "USD", symbol: "$", label: "US Dollar (USD)", flag: "🇺🇸", rateFromNaira: 1 / 1450 },
  GBP: { code: "GBP", symbol: "£", label: "British Pound (GBP)", flag: "🇬🇧", rateFromNaira: 1 / 1850 },
  EUR: { code: "EUR", symbol: "€", label: "Euro (EUR)", flag: "🇪🇺", rateFromNaira: 1 / 1550 },
};

const STORAGE_KEY = "mr.currency.v1";

interface CurrencyContextValue {
  currency: CurrencyCode;
  config: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInNaira: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "NGN",
  config: CURRENCIES.NGN,
  setCurrency: () => {},
  formatPrice: (amt) => `₦${amt.toLocaleString()}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // localStorage disabled or SSR fallback
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  };

  const config = CURRENCIES[currency] ?? CURRENCIES.NGN;

  const formatPrice = (amountInNaira: number): string => {
    const num = Number(amountInNaira);
    if (isNaN(num)) return `${config.symbol}0`;

    if (currency === "NGN") {
      return `₦${Math.round(num).toLocaleString("en-NG")}`;
    }

    const converted = num * config.rateFromNaira;
    return `${config.symbol}${converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, config, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, config, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 gap-1.5 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground ${className}`}
        >
          <span className="text-base leading-none">{config.flag}</span>
          <span>{config.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
          const item = CURRENCIES[code];
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code)}
              className={`flex items-center justify-between text-xs font-medium cursor-pointer ${
                currency === code ? "bg-accent/10 font-bold text-primary" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">{item.flag}</span>
                <span>{item.code}</span>
              </span>
              <span className="text-muted-foreground font-semibold">{item.symbol}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
