import { flowData } from "@/db/schema";
import { db } from "@/db";
import { eq, and, desc, asc, gte, lte, sql } from "drizzle-orm";

export async function insertFlowData(
  data: typeof flowData.$inferInsert
): Promise<typeof flowData.$inferSelect | undefined> {
  const [result] = await db().insert(flowData).values(data).returning();
  return result;
}

export async function insertFlowDataBatch(
  data: (typeof flowData.$inferInsert)[]
): Promise<(typeof flowData.$inferSelect)[]> {
  const results = await db().insert(flowData).values(data).returning();
  return results;
}

export async function getFlowDataByDate(
  dt: string
): Promise<(typeof flowData.$inferSelect)[]> {
  const results = await db()
    .select()
    .from(flowData)
    .where(eq(flowData.dt, dt))
    .orderBy(desc(flowData.premium_usd));
  
  return results;
}

export async function getFlowDataByFilters(
  dt: string,
  side?: string,
  ticker?: string,
  minPremium?: number,
  maxPremium?: number,
  largestFlag?: boolean,
  firstFlag?: boolean
): Promise<(typeof flowData.$inferSelect)[]> {
  const conditions = [eq(flowData.dt, dt)];
  
  if (side) {
    conditions.push(eq(flowData.side, side));
  }
  
  if (ticker) {
    conditions.push(eq(flowData.ticker, ticker));
  }
  
  if (minPremium !== undefined) {
    conditions.push(gte(flowData.premium_usd, minPremium));
  }
  
  if (maxPremium !== undefined) {
    conditions.push(lte(flowData.premium_usd, maxPremium));
  }
  
  if (largestFlag !== undefined) {
    conditions.push(eq(flowData.largest_flag, largestFlag));
  }
  
  if (firstFlag !== undefined) {
    conditions.push(eq(flowData.first_flag, firstFlag));
  }
  
  const results = await db()
    .select()
    .from(flowData)
    .where(and(...conditions))
    .orderBy(desc(flowData.premium_usd));
  
  return results;
}

export async function getFlowDataByTicker(
  ticker: string,
  limit: number = 100
): Promise<(typeof flowData.$inferSelect)[]> {
  const results = await db()
    .select()
    .from(flowData)
    .where(eq(flowData.ticker, ticker))
    .orderBy(desc(flowData.dt), desc(flowData.premium_usd))
    .limit(limit);
  
  return results;
}

export async function getLatestFlowData(
  limit: number = 100
): Promise<(typeof flowData.$inferSelect)[]> {
  const results = await db()
    .select()
    .from(flowData)
    .orderBy(desc(flowData.dt), desc(flowData.premium_usd))
    .limit(limit);
  
  return results;
}

export async function getFlowDataByDateRange(
  startDate: string,
  endDate: string,
  ticker?: string,
  side?: string
): Promise<(typeof flowData.$inferSelect)[]> {
  const conditions = [
    gte(flowData.dt, startDate),
    lte(flowData.dt, endDate)
  ];
  
  if (ticker) {
    conditions.push(eq(flowData.ticker, ticker));
  }
  
  if (side) {
    conditions.push(eq(flowData.side, side));
  }
  
  const results = await db()
    .select()
    .from(flowData)
    .where(and(...conditions))
    .orderBy(desc(flowData.dt), desc(flowData.premium_usd));
  
  return results;
}

export async function getLatestFlowDataDate(): Promise<string | null> {
  try {
    const [result] = await db()
      .select({ dt: flowData.dt })
      .from(flowData)
      .orderBy(desc(flowData.dt))
      .limit(1);
    
    return result?.dt || null;
  } catch (error) {
    console.error('Failed to get latest flow data date:', error);
    return null;
  }
}