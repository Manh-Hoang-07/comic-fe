import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (client) return client;

  try {
    const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
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
