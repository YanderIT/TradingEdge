import { rankingData } from "@/db/schema";
import { db } from "@/db";
import { eq, and, desc, asc } from "drizzle-orm";

export async function insertRankingData(
  data: typeof rankingData.$inferInsert
): Promise<typeof rankingData.$inferSelect | undefined> {
  const [result] = await db().insert(rankingData).values(data).returning();
  return result;
}

export async function insertRankingDataBatch(
  data: (typeof rankingData.$inferInsert)[]
): Promise<(typeof rankingData.$inferSelect)[]> {
  const results = await db().insert(rankingData).values(data).returning();
  return results;
}

export async function getRankingDataByDate(
  dt: string
): Promise<(typeof rankingData.$inferSelect)[]> {
  const results = await db()
    .select()
    .from(rankingData)
    .where(eq(rankingData.dt, dt))
    .orderBy(asc(rankingData.list_type), asc(rankingData.window), asc(rankingData.rank));
  
  return results;
}

export async function getRankingDataByFilters(
  dt: string,
  listType?: string,
  window?: string,
  ticker?: string
): Promise<(typeof rankingData.$inferSelect)[]> {
  const conditions = [eq(rankingData.dt, dt)];
  
  if (listType) {
    conditions.push(eq(rankingData.list_type, listType));
  }
  
  if (window) {
    conditions.push(eq(rankingData.window, window));
  }
  
  if (ticker) {
    conditions.push(eq(rankingData.ticker, ticker));
  }
  
  const results = await db()
    .select()
    .from(rankingData)
    .where(and(...conditions))
    .orderBy(asc(rankingData.rank));
  
  return results;
}

export async function getLatestRankingData(
  limit: number = 100
): Promise<(typeof rankingData.$inferSelect)[]> {
  console.log('🔍 Getting latest ranking data with limit:', limit);
  
  try {
    // First get the latest date
    const latestDateResult = await db()
      .select({ dt: rankingData.dt })
      .from(rankingData)
      .orderBy(desc(rankingData.dt))
      .limit(1);
    
    console.log('📅 Latest date query result:', latestDateResult);
    
    if (latestDateResult.length === 0) {
      console.log('❌ No data found in ranking_data table');
      return [];
    }
    
    const latestDate = latestDateResult[0].dt;
    console.log('📅 Latest date found:', latestDate);
    
    // Then get all data for that latest date
    const results = await db()
      .select()
      .from(rankingData)
      .where(eq(rankingData.dt, latestDate))
      .orderBy(asc(rankingData.rank))
      .limit(limit);
    
    console.log('✅ Latest ranking data query result count:', results.length);
    console.log('📋 First few results:', results.slice(0, 3));
    
    return results;
  } catch (error) {
    console.error('❌ Database query failed for getLatestRankingData:', error);
    throw error;
  }
}