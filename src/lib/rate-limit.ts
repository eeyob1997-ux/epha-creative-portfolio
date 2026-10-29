const requests = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  limit = 3,
  windowMs = 60_000,
): boolean {
  const now = Date.now();

  const recent = (requests.get(key) ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recent.length >= limit) {
    requests.set(key, recent);
    return true;
  }

  recent.push(now);
  requests.set(key, recent);
  return false;
}
