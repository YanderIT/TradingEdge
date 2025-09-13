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