// Decides whether a playlist item is on air at a given moment, using the
// screen's local clock. Shared by the player and the studio.

const toMinutes = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + (m || 0);
};

export const localDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * @param {{days?: number[]|null, start_time?: string|null, end_time?: string|null,
 *          start_date?: string|null, end_date?: string|null}} item
 * @param {Date} now
 */
export function isOnAir(item, now = new Date()) {
  if (
    Array.isArray(item.days) &&
    item.days.length > 0 &&
    !item.days.includes(now.getDay())
  )
    return false;
  const today = localDate(now);
  if (item.start_date && today < item.start_date) return false;
  if (item.end_date && today > item.end_date) return false;
  if (item.start_time || item.end_time) {
    const minute = now.getHours() * 60 + now.getMinutes();
    const start = item.start_time ? toMinutes(item.start_time) : 0;
    const end = item.end_time ? toMinutes(item.end_time) : 24 * 60;
    if (start === end) return true;
    if (start < end) return minute >= start && minute < end;
    return minute >= start || minute < end; // window crosses midnight, e.g. 22:00-02:00
  }
  return true;
}

export const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Short human description of an item's schedule, e.g. "Mon-Fri · 07:00-11:00". */
export function describeSchedule(item) {
  const parts = [];
  const days = Array.isArray(item.days) ? [...item.days].sort() : [];
  if (days.length > 0 && days.length < 7) {
    const key = days.join(",");
    parts.push(
      key === "1,2,3,4,5"
        ? "Weekdays"
        : key === "0,6"
          ? "Weekends"
          : days.map((d) => DAY_NAMES[d].slice(0, 3)).join(" "),
    );
  }
  if (item.start_time || item.end_time) {
    parts.push(
      `${(item.start_time || "00:00").slice(0, 5)}–${(item.end_time || "24:00").slice(0, 5)}`,
    );
  }
  if (item.start_date || item.end_date) {
    parts.push(`${item.start_date || "…"} → ${item.end_date || "…"}`);
  }
  return parts.length ? parts.join(" · ") : "Always";
}
