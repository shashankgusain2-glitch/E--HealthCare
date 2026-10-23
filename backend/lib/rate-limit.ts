// In-memory rate limits. Counters live in this backend process: they reset when it restarts
// and aren't shared between servers, which is fine while there is a single backend.
export const MINUTE = 60_000;

type Counter = { count: number; resetAt: number };
const counters = new Map<string, Counter>();

export class RateLimitError extends Error {
  constructor(message: string, readonly retryAfterSeconds: number) {
    super(message);
  }
}

// Counts one attempt against `limit` per `windowMs`. retryAfterSeconds is 0 while within the
// limit, otherwise the wait. Reaching the limit starts a fresh, full wait.
export function consume(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (counters.size > 10_000) {
    for (const [k, c] of counters) if (c.resetAt <= now) counters.delete(k);
  }

  let counter = counters.get(key);
  if (!counter || counter.resetAt <= now) {
    counter = { count: 0, resetAt: now + windowMs };
    counters.set(key, counter);
  }
  counter.count += 1;
  if (counter.count === limit) counter.resetAt = now + windowMs;

  return { count: counter.count, retryAfterSeconds: counter.count > limit ? secondsUntil(counter.resetAt, now) : 0 };
}

// Seconds to wait if `key` has already used up `limit`, else 0. Doesn't count an attempt.
export function blockedFor(key: string, limit: number) {
  const now = Date.now();
  const counter = counters.get(key);
  return counter && counter.resetAt > now && counter.count >= limit ? secondsUntil(counter.resetAt, now) : 0;
}

export function reset(key: string) {
  counters.delete(key);
}

// "1 minute" / "12 minutes", for messages shown to users.
export function waitText(seconds: number) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

// The visitor's address as forwarded by the frontend. Visitors can fake this header,
// so limits keyed on it need a second, overall limit as a safety net.
export function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function secondsUntil(time: number, now: number) {
  return Math.max(1, Math.ceil((time - now) / 1000));
}
