/**
 * Date formatting utilities
 */

export type DateFormat = "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd";

export interface FormatDateOptions {
  includeTime?: boolean;
  shortFormat?: boolean;
}

export function formatDate(
  date: string | Date | null | undefined,
  formatOrOptions?: DateFormat | FormatDateOptions
): string {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  if (formatOrOptions && typeof formatOrOptions === "object" && "includeTime" in formatOrOptions) {
    const { includeTime = true, shortFormat = false } = formatOrOptions;

    const formatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: shortFormat ? "short" : "long",
      day: "numeric",
    };

    if (includeTime) {
      formatOptions.hour = "2-digit";
      formatOptions.minute = "2-digit";
    }

    return d.toLocaleDateString("vi-VN", formatOptions);
  }

  const format = (formatOrOptions as DateFormat) || "dd/MM/yyyy";

  switch (format) {
    case "yyyy-MM-dd":
      return d.toISOString().slice(0, 10);
    case "MM/dd/yyyy":
      return d.toLocaleDateString("en-US");
    case "dd/MM/yyyy":
    default:
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
  }
}

export function formatDateTime(date: string | Date | null | undefined, locale: string = "vi-VN"): string {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(num: number | string | undefined | null): string {
  const value = typeof num === 'string' ? parseInt(num, 10) : (num ?? 0);
  if (isNaN(value)) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatCurrency(num: number | string | undefined | null): string {
  const value = typeof num === 'string' ? parseInt(num, 10) : (num ?? 0);
  if (isNaN(value)) return '0 ₫';
  // Standard VND format: 100.000 ₫
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}
