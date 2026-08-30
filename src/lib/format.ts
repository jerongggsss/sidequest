import { format, parseISO, isValid } from "date-fns";

export function formatEventDate(dateStr?: string | null) {
  if (!dateStr) return "Date TBA";
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, "d MMMM yyyy");
  } catch {
    return dateStr;
  }
}

export function formatEventDateShort(dateStr?: string | null) {
  if (!dateStr) return "TBA";
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, "d MMM yyyy");
  } catch {
    return dateStr;
  }
}

export function formatTimeRange(start?: string | null, end?: string | null) {
  if (!start && !end) return null;
  const to12h = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h)) return t;
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m || 0).padStart(2, "0")} ${period}`;
  };
  if (start && end) return `${to12h(start)} – ${to12h(end)}`;
  return to12h((start || end)!);
}

export function priceLabel(isFree: boolean, price?: string | null) {
  if (isFree) return "Free";
  return price && price.trim() ? price : "Paid";
}
