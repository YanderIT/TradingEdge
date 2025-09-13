import { respData, respErr, respJson } from "@/lib/resp";
import {
  getFlowDataByDate,
  getFlowDataByFilters,
  getFlowDataByTicker,
  getLatestFlowData,
  getFlowDataByDateRange,
  insertFlowData,
  insertFlowDataBatch,
} from "@/models/flowData";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dt = searchParams.get("dt");
    const side = searchParams.get("side");
    const ticker = searchParams.get("ticker");
    const minPremium = searchParams.get("min_premium");
    const maxPremium = searchParams.get("max_premium");
    const largestFlag = searchParams.get("largest_flag");
    const firstFlag = searchParams.get("first_flag");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const limit = searchParams.get("limit");

    let results;

    if (startDate && endDate) {
      results = await getFlowDataByDateRange(startDate, endDate, ticker || undefined, side || undefined);
    } else if (ticker && !dt) {
      const limitNum = limit ? parseInt(limit) : 100;
      results = await getFlowDataByTicker(ticker, limitNum);
    } else if (dt) {
      const minPrem = minPremium ? parseFloat(minPremium) : undefined;
      const maxPrem = maxPremium ? parseFloat(maxPremium) : undefined;
      const largest = largestFlag ? largestFlag === "true" : undefined;
      const first = firstFlag ? firstFlag === "true" : undefined;

      if (side || ticker || minPrem !== undefined || maxPrem !== undefined || largest !== undefined || first !== undefined) {
        results = await getFlowDataByFilters(dt, side || undefined, ticker || undefined, minPrem, maxPrem, largest, first);
      } else {
        results = await getFlowDataByDate(dt);
      }
    } else {
      const limitNum = limit ? parseInt(limit) : 100;
      results = await getLatestFlowData(limitNum);
    }

    return respData(results);
  } catch (error) {
    console.error("Get flow data failed:", error);
    return respErr("Failed to get flow data");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      const results = await insertFlowDataBatch(body);
      return respData(results);
    } else {
      const result = await insertFlowData(body);
      return respData(result);
    }
  } catch (error) {
    console.error("Insert flow data failed:", error);
    return respErr("Failed to insert flow data");
  }
}