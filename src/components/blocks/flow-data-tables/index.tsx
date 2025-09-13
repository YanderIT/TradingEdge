"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import TableSlot from "@/components/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { TableColumn } from "@/types/blocks/table";
import { fetchFlowDataByDate, filterFlowDataBySide, formatFlowDataForTable, FormattedFlowData } from "@/services/flowData";

interface FlowDataTablesProps {
  locale: string;
  currentDate: string | null;
}

export default function FlowDataTables({ locale, currentDate }: FlowDataTablesProps) {
  const [loading, setLoading] = useState(true);
  const [callsBoughtData, setCallsBoughtData] = useState<FormattedFlowData[]>([]);
  const [putsSoldData, setPutsSoldData] = useState<FormattedFlowData[]>([]);
  const [putsBoughtData, setPutsBoughtData] = useState<FormattedFlowData[]>([]);
  const [callsSoldData, setCallsSoldData] = useState<FormattedFlowData[]>([]);

  const t = useTranslations();

  useEffect(() => {
    if (currentDate) {
      loadFlowData();
    }
  }, [currentDate]);

  const loadFlowData = async () => {
    if (!currentDate) return;

    console.log('🔄 Loading flow data for date:', currentDate);
    setLoading(true);

    try {
      // Single API call to get all flow data
      const allFlowData = await fetchFlowDataByDate(currentDate);
      console.log('📊 All flow data loaded:', allFlowData.length);

      // Filter and format data for each table
      const callsBoughtFiltered = filterFlowDataBySide(allFlowData, 'call_bought')
        .sort((a, b) => a.ticker.localeCompare(b.ticker));
      const putsSoldFiltered = filterFlowDataBySide(allFlowData, 'put_sold')
        .sort((a, b) => a.ticker.localeCompare(b.ticker));
      const putsBoughtFiltered = filterFlowDataBySide(allFlowData, 'put_bought')
        .sort((a, b) => a.ticker.localeCompare(b.ticker));
      const callsSoldFiltered = filterFlowDataBySide(allFlowData, 'call_sold')
        .sort((a, b) => a.ticker.localeCompare(b.ticker));

      // Format data for tables
      const callsBought = formatFlowDataForTable(callsBoughtFiltered);
      const putsSold = formatFlowDataForTable(putsSoldFiltered);
      const putsBought = formatFlowDataForTable(putsBoughtFiltered);
      const callsSold = formatFlowDataForTable(callsSoldFiltered);

      console.log('📊 Flow data processed:', {
        callsBought: callsBought.length,
        putsSold: putsSold.length,
        putsBought: putsBought.length,
        callsSold: callsSold.length
      });

      setCallsBoughtData(callsBought);
      setPutsSoldData(putsSold);
      setPutsBoughtData(putsBought);
      setCallsSoldData(callsSold);
    } catch (error) {
      console.error('❌ Failed to load flow data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Define common columns for all tables
  const commonColumns: TableColumn[] = [
    {
      name: "ticker",
      title: t("trading.table.ticker"),
      callback: (item: FormattedFlowData) => (
        <Link
          href={`/${locale}/${item.ticker}`}
          className="text-blue-600 underline decoration-2 underline-offset-2"
        >
          {item.ticker}
        </Link>
      ),
    },
    { name: "strike", title: t("trading.table.strike") },
    { name: "exp", title: t("trading.table.exp") },
    { name: "premium", title: t("trading.table.premium") }
  ];

  // Calls Bought table
  const callsBoughtTable: TableSlotType = {
    title: "Calls Bought",
    columns: commonColumns,
    data: callsBoughtData,
    empty_message: t("trading.no_data"),
    variant: "bullish",
  };

  // Puts Sold table  
  const putsSoldTable: TableSlotType = {
    title: "Puts Sold",
    columns: commonColumns,
    data: putsSoldData,
    empty_message: t("trading.no_data"),
    variant: "bullish",
  };

  // Puts Bought table
  const putsBoughtTable: TableSlotType = {
    title: "Puts Bought",
    columns: commonColumns,
    data: putsBoughtData,
    empty_message: t("trading.no_data"),
    variant: "bearish",
  };

  // Calls Sold table
  const callsSoldTable: TableSlotType = {
    title: "Calls Sold",
    columns: commonColumns,
    data: callsSoldData,
    empty_message: t("trading.no_data"),
    variant: "bearish",
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-t mb-4"></div>
              <div className="space-y-3 p-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Calls Bought */}
      <div className="bg-card rounded-lg border">
        <TableSlot {...callsBoughtTable} />
      </div>

      {/* Middle: Puts Sold */}
      <div className="bg-card rounded-lg border">
        <TableSlot {...putsSoldTable} />
      </div>

      {/* Right: Puts Bought (top) and Calls Sold (bottom) stacked */}
      <div className="flex flex-col gap-4">
        <div className="bg-card rounded-lg border">
          <TableSlot {...putsBoughtTable} />
        </div>
        <div className="bg-card rounded-lg border">
          <TableSlot {...callsSoldTable} />
        </div>
      </div>
    </div>
  );
}