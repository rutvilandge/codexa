import type { NextFunction, Request, Response } from "express";

type RateLimitEntry = { count: number; resetAt: number };
const entries = new Map<string, RateLimitEntry>();

export function rateLimit(limit: number, windowMs = 60_000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
    const entry = entries.get(key);
    const active = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + windowMs };
    active.count += 1;
    entries.set(key, active);
    res.setHeader("RateLimit-Limit", limit);
    res.setHeader("RateLimit-Remaining", Math.max(limit - active.count, 0));
    if (active.count > limit) return res.status(429).json({ message: "Too many requests. Please try again shortly." });
    next();
  };
}
