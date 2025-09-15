"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RankingDataSection from "@/components/blocks/ranking-data";
import FlowDataTables from "@/components/blocks/flow-data-tables";
import SymbolSearch from "@/components/blocks/symbol-search";
import { getLatestAvailableDate, formatDate } from "@/services/rankingData";

interface TradingDashboardProps {
  locale: string;
}

export default function TradingDashboard({ locale }: TradingDashboardProps) {
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    initializeDate();
  }, []);

  const initializeDate = async () => {
    console.log('🚀 Initializing dashboard date...');
    try {
      const latestDate = await getLatestAvailableDate();
      console.log('📅 Latest date from API:', latestDate);
      
      if (latestDate) {
        console.log('✅ Setting current date to:', latestDate);
        setCurrentDate(latestDate);
      } else {
        console.log('⚠️ No data available, using today');
        const today = formatDate(new Date());
        setCurrentDate(today);
      }
    } catch (error) {
      console.error('❌ Failed to get latest date:', error);
      const today = formatDate(new Date());
      setCurrentDate(today);
    } finally {
      setInitializing(false);
      console.log('✅ Dashboard date initialization complete');
    }
  };

  return (
    <div className="space-y-8">
      {/* Ranking Data Section with Date Picker */}
      <RankingDataSection 
        locale={locale} 
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        initializing={initializing}
      />

      {/* Search Box Section */}
      <div className="flex justify-center">
        <SymbolSearch 
          locale={locale}
          placeholder="Search Symbol..."
          className="w-full max-w-md"
        />
      </div>

      {/* Flow Data Tables */}
      <FlowDataTables 
        locale={locale}
        currentDate={currentDate}
      />
    </div>
  );
}