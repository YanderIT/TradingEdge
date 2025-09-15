"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SymbolSearch from "@/components/blocks/symbol-search";
import { 
  fetchFlowDataBySymbol, 
  formatFlowDataForSymbolTable, 
  getDateRangeFromLatest,
  FlowData 
} from "@/services/flowData";
import type { SymbolFlowData } from "@/services/flowData";

interface SymbolFlowDataProps {
  locale: string;
  symbol: string;
  period: string;
}

export default function SymbolFlowData({ locale, symbol, period }: SymbolFlowDataProps) {
  const [loading, setLoading] = useState(true);
  const [flowData, setFlowData] = useState<SymbolFlowData[]>([]);
  const [netScore, setNetScore] = useState(0);
  const [showExpired, setShowExpired] = useState(false);
  const [bullishTotal, setBullishTotal] = useState<string>('0');
  const [bearishTotal, setBearishTotal] = useState<string>('0');
  const t = useTranslations();

  useEffect(() => {
    loadSymbolFlowData();
  }, [symbol, period]);

  // Helper function to format premium for display
  const formatPremiumDisplay = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    } else {
      return amount.toFixed(0);
    }
  };

  // Recalculate net score and premium totals whenever flowData or showExpired changes
  useEffect(() => {
    if (flowData.length > 0) {
      const visibleData = flowData.filter(row => showExpired || !row.isExpired);
      
      let score = 0;
      let bullishSum = 0;
      let bearishSum = 0;
      
      visibleData.forEach(row => {
        // Calculate net score (count of records)
        if (row.side === 'call_bought' || row.side === 'put_sold') {
          score += 1;
          bullishSum += row.rawPremium;
        } else if (row.side === 'put_bought' || row.side === 'call_sold') {
          score -= 1;
          bearishSum += row.rawPremium;
        }
      });
      
      setNetScore(score);
      setBullishTotal(formatPremiumDisplay(bullishSum));
      setBearishTotal(formatPremiumDisplay(bearishSum));
    } else {
      setNetScore(0);
      setBullishTotal('0');
      setBearishTotal('0');
    }
  }, [flowData, showExpired]);

  const loadSymbolFlowData = async () => {
    console.log('🔄 Loading symbol flow data:', { symbol, period });
    setLoading(true);

    try {
      const dateRange = await getDateRangeFromLatest(period);
      if (!dateRange) {
        console.error('❌ Failed to get date range');
        setLoading(false);
        return;
      }
      
      const { startDate, endDate } = dateRange;
      const rawData = await fetchFlowDataBySymbol(symbol, startDate, endDate);
      console.log('📊 Raw symbol flow data:', rawData.length);

      // Format data for display
      const formattedData = formatFlowDataForSymbolTable(rawData);
      
      // Sort by date descending, then by premium
      const sortedData = formattedData.sort((a, b) => {
        // Convert date strings back to Date objects for comparison
        const dateA = new Date(a.dt);
        const dateB = new Date(b.dt);
        const dateDiff = dateB.getTime() - dateA.getTime();
        if (dateDiff !== 0) return dateDiff;
        
        // Secondary sort by premium (extract number from string like "1.9M")
        const premiumA = parsePremium(a.premium);
        const premiumB = parsePremium(b.premium);
        return premiumB - premiumA;
      });

      setFlowData(sortedData);
      // Net score will be calculated in useEffect based on visible data
    } catch (error) {
      console.error('❌ Failed to load symbol flow data:', error);
    } finally {
      setLoading(false);
    }
  };


  const parsePremium = (premiumStr: string): number => {
    if (!premiumStr) return 0;
    
    const num = parseFloat(premiumStr);
    if (premiumStr.includes('M')) {
      return num * 1000000;
    } else if (premiumStr.includes('K')) {
      return num * 1000;
    }
    return num;
  };

  const getOrderTypeColor = (orderType: string): string => {
    if (orderType === 'Buy Call' || orderType === 'Sell Put') {
      return 'text-emerald-600';
    } else if (orderType === 'Buy Put' || orderType === 'Sell Call') {
      return 'text-red-600';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
          <div className="flex-1 flex justify-center">
            <div className="h-10 w-96 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="w-[320px] h-20 bg-muted rounded animate-pulse"></div>
        </div>
        
        {/* Table skeleton */}
        <div className="bg-card rounded-lg border">
          <div className="animate-pulse p-4 space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title and centered search */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{symbol}</h1>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 w-full max-w-xl">
            <span className="text-sm text-muted-foreground">Recent Flow</span>
            <SymbolSearch 
              locale={locale}
              placeholder="Symbol..."
              defaultValue={symbol}
              className="flex-1"
            />
          </div>
        </div>
        <div className="w-[320px]">
          <Card className="py-0">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Net Score</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className={`text-center text-base font-semibold ${
                netScore > 0 ? 'text-emerald-600' : netScore < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {netScore > 0 ? '+' : ''}{netScore}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data table */}
      <div className="bg-card rounded-lg border">
        {/* Table header with toggle */}
        <div className="flex items-center justify-between p-3 border-b">
          <span className="font-medium text-sm">Flow Data</span>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
              className="rounded"
            />
            Show Expired
          </label>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Trade Date</th>
                <th className="text-left p-3">Order Type</th>
                <th className="text-left p-3">Symbol</th>
                <th className="text-left p-3">Strike</th>
                <th className="text-left p-3">Exp</th>
                <th className="text-left p-3">Premium</th>
              </tr>
            </thead>
            <tbody>
              {flowData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    {t("trading.no_data")}
                  </td>
                </tr>
              ) : (
                flowData
                  .filter(row => showExpired || !row.isExpired)
                  .map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-muted/40" : "bg-muted/20"}>
                      <td className="p-3">{row.dt}</td>
                      <td className={`p-3 ${getOrderTypeColor(row.orderType)}`}>
                        {row.orderType}
                      </td>
                      <td className="p-3">{row.ticker}</td>
                      <td className="p-3">{row.strike}</td>
                      <td className={`p-3 ${row.isExpired ? 'text-red-600 line-through' : ''}`}>
                        {row.exp}
                      </td>
                      <td className="p-3 text-green-600">{row.premium}</td>
                    </tr>
                  ))
              )}
              
              {/* Premium totals summary row */}
              {flowData.length > 0 && flowData.filter(row => showExpired || !row.isExpired).length > 0 && (
                <tr className="border-t-2 border-border bg-muted/20">
                  <td colSpan={5} className="p-3"></td>
                  <td className="p-3 font-semibold text-center">
                    <span className="text-emerald-600">{bullishTotal}</span>
                    <span className="text-muted-foreground mx-1">:</span>
                    <span className="text-red-600">{bearishTotal}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}