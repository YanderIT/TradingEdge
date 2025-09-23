import { respData, respErr, respJson } from "@/lib/resp";
import {
  getRankingDataByDate,
  getRankingDataByFilters,
  getLatestRankingData,
  getEarliestRankingDate,
  getLatestRankingDate,
  insertRankingData,
  insertRankingDataBatch,
} from "@/models/rankingData";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dt = searchParams.get("dt");
    const listType = searchParams.get("list_type");
    const window = searchParams.get("window");
    const ticker = searchParams.get("ticker");
    const limit = searchParams.get("limit");
    const earliest = searchParams.get("earliest");

    console.log('🔍 API ranking GET request params:', {
      dt, listType, window, ticker, limit, earliest
    });

    let results: any[] = [];

    if (earliest === 'true') {
      console.log('📅 Fetching earliest date');
      const earliestDate = await getEarliestRankingDate();
      if (earliestDate) {
        results = await getRankingDataByDate(earliestDate);
      } else {
        results = [];
      }
    } else if (dt) {
      console.log('📅 Fetching data for specific date:', dt);
      if (listType || window || ticker) {
        console.log('🔍 Using filters:', { listType, window, ticker });
        results = await getRankingDataByFilters(dt, listType || undefined, window || undefined, ticker || undefined);
      } else {
        console.log('📊 Getting all data for date:', dt);
        results = await getRankingDataByDate(dt);
      }
    } else {
      const limitNum = limit ? parseInt(limit) : 100;
      console.log('📈 Getting latest ranking data, limit:', limitNum);
      results = await getLatestRankingData(limitNum);
    }

    console.log('✅ API results count:', results?.length || 0);
    console.log('📋 First few results:', results?.slice(0, 3));

    return respData(results);
  } catch (error) {
    console.error("❌ Get ranking data failed:", error);
    return respErr("Failed to get ranking data");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      const results = await insertRankingDataBatch(body);
      return respData(results);
    } else {
      const result = await insertRankingData(body);
      return respData(result);
    }
  } catch (error) {
    console.error("Insert ranking data failed:", error);
    return respErr("Failed to insert ranking data");
  }
}