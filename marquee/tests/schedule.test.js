import { test } from "node:test";
import assert from "node:assert/strict";
import { isOnAir, describeSchedule } from "../web/shared/schedule.js";

const at = (iso) => new Date(iso); // local time, no Z

test("items with no schedule always play", () => {
  assert.equal(isOnAir({}, at("2026-11-13T03:00:00")), true);
});

test("days of week", () => {
  const weekdays = { days: [1, 2, 3, 4, 5] };
  assert.equal(isOnAir(weekdays, at("2026-11-13T12:00:00")), true); // Friday
  assert.equal(isOnAir(weekdays, at("2026-11-14T12:00:00")), false); // Saturday
});

test("daily time window, end exclusive", () => {
  const breakfast = { start_time: "07:00:00", end_time: "11:00:00" };
  assert.equal(isOnAir(breakfast, at("2026-11-13T06:59:00")), false);
  assert.equal(isOnAir(breakfast, at("2026-11-13T07:00:00")), true);
  assert.equal(isOnAir(breakfast, at("2026-11-13T10:59:00")), true);
  assert.equal(isOnAir(breakfast, at("2026-11-13T11:00:00")), false);
});

test("window that crosses midnight", () => {
  const late = { start_time: "22:00", end_time: "02:00" };
  assert.equal(isOnAir(late, at("2026-11-13T23:30:00")), true);
  assert.equal(isOnAir(late, at("2026-11-13T01:59:00")), true);
  assert.equal(isOnAir(late, at("2026-11-13T02:00:00")), false);
  assert.equal(isOnAir(late, at("2026-11-13T12:00:00")), false);
});

test("only a start or only an end time", () => {
  assert.equal(
    isOnAir({ start_time: "17:00" }, at("2026-11-13T16:00:00")),
    false,
  );
  assert.equal(
    isOnAir({ start_time: "17:00" }, at("2026-11-13T23:59:00")),
    true,
  );
  assert.equal(isOnAir({ end_time: "09:00" }, at("2026-11-13T08:00:00")), true);
  assert.equal(
    isOnAir({ end_time: "09:00" }, at("2026-11-13T10:00:00")),
    false,
  );
});

test("date range is inclusive", () => {
  const promo = { start_date: "2026-11-20", end_date: "2026-11-27" };
  assert.equal(isOnAir(promo, at("2026-11-19T23:59:00")), false);
  assert.equal(isOnAir(promo, at("2026-11-20T00:00:00")), true);
  assert.equal(isOnAir(promo, at("2026-11-27T23:59:00")), true);
  assert.equal(isOnAir(promo, at("2026-11-28T00:00:00")), false);
});

test("schedule descriptions", () => {
  assert.equal(describeSchedule({}), "Always");
  assert.equal(describeSchedule({ days: [5, 1, 2, 3, 4] }), "Weekdays");
  assert.equal(
    describeSchedule({
      days: [0, 6],
      start_time: "10:00:00",
      end_time: "14:00:00",
    }),
    "Weekends · 10:00–14:00",
  );
});
