import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Database instance for Node.js environment
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function db() {
  try {
    const { env }: { env: any } = getCloudflareContext();

    // Detect if running in Cloudflare Workers environment
    const isCloudflareWorker =
      typeof globalThis !== "undefined" && "Cloudflare" in globalThis;

    // Detect if set Hyperdrive
    const isHyperdrive = env && "HYPERDRIVE" in env;

    // Only log in development environment
    if (process.env.NODE_ENV === "development") {
      console.log("is cloudflare worker:", isCloudflareWorker);
      console.log("is hyperdrive:", isHyperdrive);
    }

    let databaseUrl = process.env.DATABASE_URL;
    if (isCloudflareWorker && isHyperdrive) {
      const hyperdrive = env.HYPERDRIVE;
      databaseUrl = hyperdrive.connectionString;
      if (process.env.NODE_ENV === "development") {
        console.log("using Hyperdrive connection");
      }
    }

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    // In Cloudflare Workers, create new connection each time
    if (isCloudflareWorker) {
      if (process.env.NODE_ENV === "development") {
        console.log("in Cloudflare Workers environment");
      }
      // Workers environment uses minimal configuration
      const client = postgres(databaseUrl, {
        prepare: false,
        max: 1, // Limit to 1 connection in Workers
        idle_timeout: 10, // Shorter timeout for Workers
        connect_timeout: 5,
      });

      return drizzle(client);
    }

    // In Node.js environment, use singleton pattern
    if (dbInstance) {
      return dbInstance;
    }

    // Node.js environment with connection pool configuration
    const client = postgres(databaseUrl, {
      prepare: false,
      max: 10, // Maximum connections in pool
      idle_timeout: 30, // Idle connection timeout (seconds)
      connect_timeout: 10, // Connection timeout (seconds)
    });
    dbInstance = drizzle({ client });

    return dbInstance;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to establish database connection");
  }
}
