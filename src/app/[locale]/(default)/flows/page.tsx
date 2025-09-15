"use client";

import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Table as TableSlotType } from "@/types/slots/table";
import TableSlot from "@/components/console/slots/table";
import { TableColumn } from "@/types/blocks/table";
import SymbolSearch from "@/components/blocks/symbol-search";

export const revalidate = 60;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function FlowsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string; period?: string }>;
}) {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const tab = searchParamsData?.tab || "premium";
  const period = searchParamsData?.period || "1w"; // default 1 Week
  setRequestLocale(locale);
  const t = await getTranslations();

  const isActiveTab = (key: string) =>
    key === tab
      ? "bg-primary text-primary-foreground"
      : "border hover:bg-muted";

  const periodButtons: { key: string; label: string }[] = [
    { key: "1w", label: "1 Week" },
    { key: "2w", label: "2 Weeks" },
    { key: "1m", label: "1 Month" },
    { key: "3m", label: "3 Months" },
  ];

  const columns: TableColumn[] = [
    {
      name: "symbol",
      title: "Symbol",
      callback: (item: any) => (
        <Link
          href={`/${locale}/${item.symbol}`}
          className="text-blue-600 underline decoration-2 underline-offset-2"
        >
          {item.symbol}
        </Link>
      ),
    },
    { name: "netScore", title: "Net Score" },
    { name: "netPremium", title: "Net Premium", className: "text-emerald-600" },
    { name: "bull", title: "Bull", className: "text-emerald-600" },
    { name: "bear", title: "Bear", className: "text-red-600" },
  ];

  // TODO: Replace with actual aggregated data from flow_data table
  // This would require aggregating by ticker and calculating bull/bear metrics
  const data: any[] = []; // Empty for now - needs implementation

  const table: TableSlotType = {
    title: "Total",
    data,
    columns,
    empty_message: t("trading.no_data"),
    variant: "neutral",
  };

  return (
    <div className="space-y-6">
      {/* Centered header */}
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">Flows Over Time</h1>
        <SymbolSearch 
          locale={locale}
          placeholder="Symbol..."
          className="w-full max-w-md"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Link
          href={`/${locale}/flows?tab=premium&period=${period}`}
          className={`px-3 py-1 text-sm rounded ${isActiveTab("premium")}`}
        >
          Top Premium
        </Link>
        <Link
          href={`/${locale}/flows?tab=bullish&period=${period}`}
          className={`px-3 py-1 text-sm rounded ${isActiveTab("bullish")}`}
        >
          Top Bullish
        </Link>
        <Link
          href={`/${locale}/flows?tab=bearish&period=${period}`}
          className={`px-3 py-1 text-sm rounded ${isActiveTab("bearish")}`}
        >
          Top Bearish
        </Link>
      </div>

      {/* Period buttons */}
      <div className="flex items-center gap-2">
        {periodButtons.map((p) => {
          const active = p.key === period;
          return (
            <Link
              key={p.key}
              href={`/${locale}/flows?tab=${tab}&period=${p.key}`}
              className={`px-3 py-1 text-sm rounded border ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {p.label}
            </Link>
          );
        })}

      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border">
        <TableSlot {...table} />
      </div>
    </div>
  );
}


