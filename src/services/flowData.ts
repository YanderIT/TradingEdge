export interface FlowData {
  dt: string;
  side: string;
  ticker: string;
  strike: number;
  moneyness_pct: number | null;
  expiration: string | null;
  premium_usd: number | null;
  largest_flag: boolean | null;
  first_flag: boolean | null;
}

export interface FormattedFlowData {
  ticker: string;
  strike: string;
  exp: string;
  premium: string;
}

export async function fetchFlowDataByDate(date: string): Promise<FlowData[]> {
  try {
    console.log('🔍 Fetching flow data for date:', date);
    const response = await fetch(`/api/data/flow?dt=${date}`);
    console.log('📡 Flow API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('📊 Flow API Result for date', date, ':', result);
    
    const data = result.data || [];
    console.log('📋 Flow data count:', data.length);
    
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch flow data:', error);
    return [];
  }
}

export function filterFlowDataBySide(data: FlowData[], side: string): FlowData[] {
  return data.filter(item => item.side === side);
}

export function formatFlowDataForTable(data: FlowData[]): FormattedFlowData[] {
  return data.map(item => {
    // Format strike with moneyness percentage
    let strikeDisplay = `${item.strike.toFixed(2)}`;
    if (item.moneyness_pct !== null) {
      const sign = item.moneyness_pct >= 0 ? '+' : '';
      strikeDisplay += ` [${sign}${item.moneyness_pct.toFixed(0)}%]`;
    }

    // Format expiration date
    let expDisplay = '';
    if (item.expiration) {
      const expDate = new Date(item.expiration + 'T12:00:00');
      expDisplay = expDate.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit'
      });
    }

    // Format premium
    let premiumDisplay = '';
    if (item.premium_usd !== null) {
      const premium = item.premium_usd;
      if (premium >= 1000000) {
        premiumDisplay = `${(premium / 1000000).toFixed(1)}M`;
      } else if (premium >= 1000) {
        premiumDisplay = `${(premium / 1000).toFixed(0)}K`;
      } else if (premium >= 1) {
        premiumDisplay = `${premium.toFixed(0)}%`;
      } else {
        premiumDisplay = `${(premium * 100).toFixed(0)}%`;
      }
    }

    return {
      ticker: item.ticker,
      strike: strikeDisplay,
      exp: expDisplay,
      premium: premiumDisplay
    };
  });
}

export async function getFlowTableData(date: string, side: string, limit: number = 10): Promise<FormattedFlowData[]> {
  const allData = await fetchFlowDataByDate(date);
  const filteredData = filterFlowDataBySide(allData, side);
  
  // Sort by premium_usd descending and take top N
  const sortedData = filteredData
    .sort((a, b) => (b.premium_usd || 0) - (a.premium_usd || 0))
    .slice(0, limit);
  
  return formatFlowDataForTable(sortedData);
}

export interface SymbolFlowData {
  dt: string;
  side: string;
  ticker: string;
  strike: string;
  exp: string;
  premium: string;
  orderType: string;
  isExpired: boolean;
  rawExpiration: string | null;
  rawPremium: number;
}

export async function fetchFlowDataBySymbol(
  symbol: string, 
  startDate: string, 
  endDate: string
): Promise<FlowData[]> {
  try {
    const params = new URLSearchParams({
      ticker: symbol,
      start_date: startDate,
      end_date: endDate
    });

    console.log('🔍 Fetching symbol flow data:', { symbol, startDate, endDate });
    const response = await fetch(`/api/data/flow?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const data = result.data || [];
    console.log('📊 Symbol flow data loaded:', data.length);
    
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch symbol flow data:', error);
    return [];
  }
}

export function mapSideToOrderType(side: string): string {
  const sideMap: Record<string, string> = {
    'call_bought': 'Buy Call',
    'put_sold': 'Sell Put',
    'put_bought': 'Buy Put',
    'call_sold': 'Sell Call'
  };
  
  return sideMap[side] || side;
}

export function formatFlowDataForSymbolTable(data: FlowData[]): SymbolFlowData[] {
  return data.map(item => {
    // Format date as M/D/YY
    const date = new Date(item.dt + 'T12:00:00');
    const dtDisplay = date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    });

    // Format strike with moneyness percentage
    let strikeDisplay = `${item.strike.toFixed(2)}`;
    if (item.moneyness_pct !== null) {
      const sign = item.moneyness_pct >= 0 ? '+' : '';
      strikeDisplay += ` (${sign}${item.moneyness_pct.toFixed(0)}%)`;
    }

    // Check if option is expired compared to real-world current time
    let isExpired = false;
    let expDisplay = '';
    if (item.expiration) {
      const expDate = new Date(item.expiration + 'T12:00:00');
      const currentDate = new Date(); // Real-world current date/time
      
      // Check if expiration is before current real-world date
      isExpired = expDate < currentDate;
      
      expDisplay = expDate.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit'
      });
    }

    // Format premium
    let premiumDisplay = '';
    if (item.premium_usd !== null) {
      const premium = item.premium_usd;
      if (premium >= 1000000) {
        premiumDisplay = `${(premium / 1000000).toFixed(1)}M`;
      } else if (premium >= 1000) {
        premiumDisplay = `${(premium / 1000).toFixed(0)}K`;
      } else {
        premiumDisplay = `${premium.toFixed(0)}`;
      }
    }

    return {
      dt: dtDisplay,
      side: item.side,
      ticker: item.ticker,
      strike: strikeDisplay,
      exp: expDisplay,
      premium: premiumDisplay,
      orderType: mapSideToOrderType(item.side),
      isExpired,
      rawExpiration: item.expiration,
      rawPremium: item.premium_usd || 0
    };
  });
}

export function calculateNetScore(data: FlowData[]): number {
  let score = 0;
  
  data.forEach(item => {
    const premium = item.premium_usd || 0;
    
    // Bullish signals contribute positively
    if (item.side === 'call_bought' || item.side === 'put_sold') {
      score += premium / 1000000; // Convert to millions for scoring
    }
    // Bearish signals contribute negatively  
    else if (item.side === 'put_bought' || item.side === 'call_sold') {
      score -= premium / 1000000;
    }
  });
  
  return Math.round(score);
}

export async function getLatestFlowDate(): Promise<string | null> {
  try {
    const response = await fetch('/api/data/flow?limit=1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const data = result.data || [];
    
    if (data.length > 0) {
      return data[0].dt;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to get latest flow date:', error);
    return null;
  }
}

function getMondayOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days; otherwise go back to Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  return monday;
}

function getStartDateForPeriod(latestDate: string, period: string): string {
  const endDateObj = new Date(latestDate + 'T12:00:00');
  let startDateObj: Date;
  
  switch (period) {
    case '1w':
      // Current week's Monday
      startDateObj = getMondayOfWeek(endDateObj);
      break;
    case '2w':
      // Previous week's Monday (2 weeks total)
      const currentMonday = getMondayOfWeek(endDateObj);
      startDateObj = new Date(currentMonday);
      startDateObj.setDate(currentMonday.getDate() - 7);
      break;
    case '1m':
      // Approximately 4 weeks back to nearest Monday
      const monthMonday = getMondayOfWeek(endDateObj);
      startDateObj = new Date(monthMonday);
      startDateObj.setDate(monthMonday.getDate() - 21); // 3 weeks back from current week
      break;
    case '3m':
      // Approximately 12 weeks back to nearest Monday
      const quarterMonday = getMondayOfWeek(endDateObj);
      startDateObj = new Date(quarterMonday);
      startDateObj.setDate(quarterMonday.getDate() - 77); // 11 weeks back from current week
      break;
    default:
      // Default to current week's Monday
      startDateObj = getMondayOfWeek(endDateObj);
  }
  
  return startDateObj.toISOString().split('T')[0];
}

export async function getDateRangeFromLatest(period: string): Promise<{ startDate: string, endDate: string } | null> {
  try {
    const latestDate = await getLatestFlowDate();
    if (!latestDate) {
      console.error('No latest date found in flow data');
      return null;
    }
    
    const endDate = latestDate;
    const startDate = getStartDateForPeriod(latestDate, period);
    
    console.log('📅 Week-based date range calculated:', { 
      period, 
      startDate, 
      endDate, 
      latestDate,
      latestDayOfWeek: new Date(latestDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })
    });
    
    return { startDate, endDate };
  } catch (error) {
    console.error('❌ Failed to calculate date range:', error);
    return null;
  }
}