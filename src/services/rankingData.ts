export interface RankingData {
  dt: string;
  list_type: string;
  window: string;
  rank: number;
  ticker: string;
}

export interface GroupedRankingData {
  [listType: string]: {
    [window: string]: string[];
  };
}

export async function fetchRankingData(date: string): Promise<RankingData[]> {
  try {
    console.log('🔍 Fetching ranking data for date:', date);
    const response = await fetch(`/api/data/ranking?dt=${date}`);
    console.log('📡 API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('📊 API Result for date', date, ':', result);
    
    const data = result.data || [];
    console.log('📋 Ranking data count:', data.length);
    
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch ranking data:', error);
    return [];
  }
}

export async function getLatestAvailableDate(): Promise<string | null> {
  try {
    console.log('🔍 Fetching latest available date...');
    const response = await fetch('/api/data/ranking?limit=1');
    console.log('📡 API Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('📊 API Result:', result);

    const data = result.data || [];
    console.log('📅 Data array:', data);

    if (data.length > 0) {
      console.log('✅ Latest date found:', data[0].dt);
      return data[0].dt;
    }
    console.log('❌ No data found in database');
    return null;
  } catch (error) {
    console.error('❌ Failed to get latest available date:', error);
    return null;
  }
}

export async function getEarliestAvailableDate(): Promise<string | null> {
  try {
    console.log('🔍 Fetching earliest available date...');
    const response = await fetch('/api/data/ranking?earliest=true');
    console.log('📡 API Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('📊 API Result:', result);

    const data = result.data || [];
    console.log('📅 Data array:', data);

    if (data.length > 0) {
      console.log('✅ Earliest date found:', data[0].dt);
      return data[0].dt;
    }
    console.log('❌ No data found in database');
    return null;
  } catch (error) {
    console.error('❌ Failed to get earliest available date:', error);
    return null;
  }
}

export async function getDateRange(): Promise<{ earliest: string | null; latest: string | null }> {
  try {
    console.log('🔍 Fetching date range...');
    const [earliest, latest] = await Promise.all([
      getEarliestAvailableDate(),
      getLatestAvailableDate()
    ]);

    console.log('📅 Date range:', { earliest, latest });
    return { earliest, latest };
  } catch (error) {
    console.error('❌ Failed to get date range:', error);
    return { earliest: null, latest: null };
  }
}

export function groupRankingData(data: RankingData[]): GroupedRankingData {
  console.log('🔄 Grouping ranking data:', data);
  
  const grouped: GroupedRankingData = {};
  
  data.forEach(item => {
    console.log('📝 Processing item:', item);
    if (!grouped[item.list_type]) {
      grouped[item.list_type] = {};
    }
    if (!grouped[item.list_type][item.window]) {
      grouped[item.list_type][item.window] = [];
    }
    grouped[item.list_type][item.window].push(item.ticker);
  });
  
  // Sort by rank and take top 5 for each group
  Object.keys(grouped).forEach(listType => {
    Object.keys(grouped[listType]).forEach(window => {
      grouped[listType][window] = grouped[listType][window].slice(0, 5);
    });
  });
  
  console.log('✅ Grouped data result:', grouped);
  return grouped;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDisplayDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00'); // Use noon to avoid timezone issues
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}