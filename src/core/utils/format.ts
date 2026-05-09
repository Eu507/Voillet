export function formatAddress(address: string, size = 4): string {
  if (address.length <= size * 2) {
    return address;
  }

  return `${address.slice(0, size)}...${address.slice(-size)}`;
}

export function formatSol(lamports: number): string {
  const sol = lamports / 1_000_000_000;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: sol >= 1 ? 2 : 4,
    maximumFractionDigits: sol >= 1 ? 4 : 6,
  }).format(sol);
}

export function formatSignedSol(lamports: number): string {
  const formatted = formatSol(Math.abs(lamports));
  const prefix = lamports > 0 ? "+" : lamports < 0 ? "-" : "";

  return `${prefix}${formatted} SOL`;
}

export function formatTokenAmount(value: number | string): string {
  const numericValue = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: numericValue >= 1 ? 2 : 0,
    maximumFractionDigits: numericValue >= 1 ? 4 : 6,
  }).format(numericValue);
}

export function formatDateTime(timestamp: number | null): string {
  if (!timestamp) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp * 1000));
}

export function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp) {
    return "Pending";
  }

  const diffSeconds = Math.round(timestamp - Date.now() / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) {
    return formatter.format(diffSeconds, "second");
  }

  if (absSeconds < 3600) {
    return formatter.format(Math.round(diffSeconds / 60), "minute");
  }

  if (absSeconds < 86400) {
    return formatter.format(Math.round(diffSeconds / 3600), "hour");
  }

  return formatter.format(Math.round(diffSeconds / 86400), "day");
}
