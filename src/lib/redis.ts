import Redis from "ioredis";
import { env } from "@/config/env";

// ---------------------------------------------------------------------------
// Flag: set REDIS_ENABLED=true trong .env để dùng Redis
// Mặc định dùng in-memory cache (phù hợp cho single-instance / dev local)
// ---------------------------------------------------------------------------
const USE_REDIS = env.redisEnabled;

// --- Redis client -----------------------------------------------------------

let client: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!USE_REDIS) return null;
  if (client) return client;

  try {
    const redis = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redis.on("error", (err) => {
      console.warn("[Redis] Connection error:", err.message);
    });

    client = redis;
    return client;
  } catch (err) {
    console.warn("[Redis] Failed to create client:", err);
    return null;
  }
}

// --- In-memory cache --------------------------------------------------------

interface MemEntry {
  value: string;
  expiresAt: number;
}

const memCache = new Map<string, MemEntry>();

function memGet(key: string): string | null {
  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memCache.delete(key);
    return null;
  }
  return entry.value;
}

function memSet(key: string, value: string, ttlSeconds: number): void {
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

// --- Unified cache interface ------------------------------------------------

export async function cacheGet(key: string): Promise<string | null> {
  if (USE_REDIS) {
    const redis = getRedisClient();
    if (redis) return redis.get(key).catch(() => null);
  }
  return memGet(key);
}

export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds: number
): Promise<void> {
  if (USE_REDIS) {
    const redis = getRedisClient();
    if (redis) {
      await redis.set(key, value, "EX", ttlSeconds).catch(() => null);
      return;
    }
  }
  memSet(key, value, ttlSeconds);
}
