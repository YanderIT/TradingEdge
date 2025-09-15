import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import SymbolFlowData from "@/components/blocks/symbol-flow-data";

export const revalidate = 60;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function SymbolPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; symbol: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { locale, symbol } = await params;
  const searchParamsData = await searchParams;
  const period = searchParamsData?.period || "1w"; // default 1 Week
  setRequestLocale(locale);

  const periodButtons: { key: string; label: string }[] = [
    { key: "1w", label: "1 Week" },
    { key: "2w", label: "2 Weeks" },
    { key: "1m", label: "1 Month" },
    { key: "3m", label: "3 Months" },
  ];

  return (
    <div className="space-y-6">
      {/* Period buttons */}
      <div className="flex items-center gap-2">
        {periodButtons.map((p) => {
          const active = p.key === period;
          return (
            <Link
              key={p.key}
              href={`/${locale}/${symbol}?period=${p.key}`}
              className={`px-3 py-1 text-sm rounded ${active ? "bg-primary text-primary-foreground" : "border hover:bg-muted"}`}
            >
              {p.label}
            </Link>
          );
        })}
      </div>

      {/* Flow Data Component */}
      <SymbolFlowData 
        locale={locale}
        symbol={symbol}
        period={period}
      />
    </div>
  );
}


