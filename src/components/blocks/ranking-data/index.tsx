"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { 
  fetchRankingData, 
  groupRankingData, 
  formatDate, 
  formatDisplayDate, 
  getLatestAvailableDate,
  GroupedRankingData 
} from "@/services/rankingData";

interface RankingDataSectionProps {
  locale: string;
  currentDate: string | null;
  onDateChange: (date: string | null) => void;
  initializing?: boolean;
}

export default function RankingDataSection({ locale, currentDate, onDateChange, initializing = false }: RankingDataSectionProps) {
  const [rankingData, setRankingData] = useState<GroupedRankingData>({});
  const [loading, setLoading] = useState(true);
  
  const t = useTranslations();

  useEffect(() => {
    if (currentDate) {
      loadRankingData();
    }
  }, [currentDate]);

  const loadRankingData = async () => {
    if (!currentDate) {
      console.log('⚠️ No current date set, skipping data load');
      return;
    }
    
    console.log('🔄 Loading ranking data for date:', currentDate);
    setLoading(true);
    
    try {
      console.log('📅 Using date string directly:', currentDate);
      
      const data = await fetchRankingData(currentDate);
      console.log('📊 Fetched data:', data);
      
      const grouped = groupRankingData(data);
      console.log('🔄 Grouped data:', grouped);
      
      setRankingData(grouped);
      console.log('✅ Ranking data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load ranking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (!currentDate) return;
    
    const dateObj = new Date(currentDate + 'T12:00:00'); // Use noon to avoid timezone issues
    
    if (direction === 'prev') {
      dateObj.setDate(dateObj.getDate() - 1);
      // Skip weekends when going backward
      if (dateObj.getDay() === 0) {
        // If we land on Sunday, go to Friday
        dateObj.setDate(dateObj.getDate() - 2);
      } else if (dateObj.getDay() === 6) {
        // If we land on Saturday, go to Friday
        dateObj.setDate(dateObj.getDate() - 1);
      }
    } else {
      dateObj.setDate(dateObj.getDate() + 1);
      // Skip weekends when going forward
      if (dateObj.getDay() === 6) {
        // If we land on Saturday, go to Monday
        dateObj.setDate(dateObj.getDate() + 2);
      } else if (dateObj.getDay() === 0) {
        // If we land on Sunday, go to Monday
        dateObj.setDate(dateObj.getDate() + 1);
      }
    }
    
    const newDateStr = formatDate(dateObj);
    console.log('📅 Navigating from', currentDate, 'to', newDateStr, '(Day of week:', dateObj.getDay(), ')');
    onDateChange(newDateStr);
  };

  const getRankingTickers = (listType: string, window: string): string[] => {
    return rankingData[listType]?.[window] || [];
  };

  const renderTickerGroup = (window: string, tickers: string[]) => (
    <div className="flex items-center justify-center gap-3">
      <span className="text-sm text-muted-foreground font-bold">{window}</span>
      <div className="flex items-center justify-center gap-2">
        {tickers.map((ticker, index) => (
          <Link 
            key={index}
            href={`/${locale}/${ticker}`} 
            className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors"
          >
            {ticker}
          </Link>
        ))}
      </div>
    </div>
  );

  if (initializing || loading || !currentDate) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border border-border py-6 px-4 shadow-sm">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="space-y-3">
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
    <>
      {/* Date Selector */}
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Unusual Options Flow</h1>
        
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              ←
            </Button>
            <span className="text-sm font-medium px-4 py-2 bg-muted rounded">
              {currentDate ? formatDisplayDate(currentDate) : ''}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateDate('next')}
            >
              →
            </Button>
          </div>
        </div>
      </div>

      {/* Ranking Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Premium */}
        <div className="bg-card rounded-lg border border-border py-6 px-4 shadow-sm">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">🏆</span>
              <Link
                href={`/${locale}/flows?tab=premium&period=3d`}
                className="font-bold text-foreground text-lg hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors"
              >
                Top Premium
              </Link>
            </div>
            <div className="h-px bg-border"></div>
          </div>
          
          <div className="space-y-3 text-base">
            {renderTickerGroup("1W", getRankingTickers("top_premium", "1w"))}
            {renderTickerGroup("3D", getRankingTickers("top_premium", "3d"))}
          </div>
        </div>

        {/* Top Bullish */}
        <div className="bg-card rounded-lg border border-border py-6 px-4 shadow-sm">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">📈</span>
              <Link
                href={`/${locale}/flows?tab=bullish&period=3d`}
                className="font-bold text-foreground text-lg hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors"
              >
                Top Bullish
              </Link>
            </div>
            <div className="h-px bg-border"></div>
          </div>
          
          <div className="space-y-3 text-base">
            {renderTickerGroup("1W", getRankingTickers("top_bullish", "1w"))}
            {renderTickerGroup("3D", getRankingTickers("top_bullish", "3d"))}
          </div>
        </div>

        {/* Top Bearish */}
        <div className="bg-card rounded-lg border border-border py-6 px-4 shadow-sm">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">📉</span>
              <Link
                href={`/${locale}/flows?tab=bearish&period=3d`}
                className="font-bold text-foreground text-lg hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors"
              >
                Top Bearish
              </Link>
            </div>
            <div className="h-px bg-border"></div>
          </div>
          
          <div className="space-y-3 text-base">
            {renderTickerGroup("1W", getRankingTickers("top_bearish", "1w"))}
            {renderTickerGroup("3D", getRankingTickers("top_bearish", "3d"))}
          </div>
        </div>
      </div>
    </>
  );
}