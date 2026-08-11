// Låser parserns beteende mot en sparad exempelrespons från TimeEdit
// (hämtad 2026-08-11). Ändrar TimeEdit formatet, eller ändras parsern,
// ska det synas här som testfel — inte som tyst fel skräpdata.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseTimeEdit,
  expandSessions,
  canonPlace,
  diffSchedule,
  countDiffs,
  kindOf,
  proposalLine,
} from "./timeedit-parse.mjs";
import { schedule } from "../src/data/schedule.js";

const fixture = () =>
  JSON.parse(readFileSync(new URL("./fixtures/timeedit-example.json", import.meta.url), "utf8"));
const expected = JSON.parse(
  readFileSync(new URL("./fixtures/timeedit-example.expected.json", import.meta.url), "utf8")
);

test("parseTimeEdit ger exakt den förväntade normaliseringen av exempelresponsen", () => {
  const slots = parseTimeEdit(fixture(), schedule.subcourses);
  assert.equal(slots.length, 80);
  assert.deepEqual(slots, expected);
});

test("parseTimeEdit felar högt på trasig struktur", () => {
  const cases = [
    [null, /inte ett JSON-objekt/],
    [{ reservations: [] }, /columnheaders saknas/],
    [{ columnheaders: [] }, /reservations saknas/],
    [{ columnheaders: ["Delkurs"], reservations: [] }, /reservations är tom/],
  ];
  for (const [input, re] of cases) {
    assert.throws(() => parseTimeEdit(input, schedule.subcourses), re);
  }

  const broken = (mutate) => {
    const j = fixture();
    mutate(j);
    return j;
  };
  assert.throws(
    () => parseTimeEdit(broken((j) => (j.columnheaders[1] = "Kursdel")), schedule.subcourses),
    /kolumnen "Delkurs" saknas/
  );
  assert.throws(
    () => parseTimeEdit(broken((j) => (j.reservations[0].startdate = "31/08/2026")), schedule.subcourses),
    /startdate är inte ÅÅÅÅ-MM-DD/
  );
  assert.throws(
    () => parseTimeEdit(broken((j) => (j.reservations[2].starttime = "8.00")), schedule.subcourses),
    /starttime är inte TT:MM/
  );
  assert.throws(
    () => parseTimeEdit(broken((j) => (j.reservations[0].enddate = "2026-09-01")), schedule.subcourses),
    /flera dagar/
  );
  assert.throws(
    () => parseTimeEdit(broken((j) => j.reservations[5].columns.pop()), schedule.subcourses),
    /columns har 7 fält/
  );
  assert.throws(
    () => parseTimeEdit(broken((j) => (j.reservations[1].columns[1] = "Maskininlärning")), schedule.subcourses),
    /okänd delkurs "Maskininlärning"/
  );
});

test("kindOf mappar aktivitetstexter till schedule.js-vokabulären", () => {
  assert.equal(kindOf("Digital tentamen, Omtentamen"), "tenta");
  assert.equal(kindOf("Föreläsning"), "föreläsning");
  assert.equal(kindOf("Introduktion, Obligatoriskt"), "obligatorisk");
  assert.equal(kindOf("Studiebesök"), null);
});

test("canonPlace gör kurerad och TimeEdit-form jämförbara", () => {
  assert.equal(canonPlace("EC2:PC011/015/059"), canonPlace("EC2:PC011, EC2:PC015, EC2:PC059"));
  assert.equal(canonPlace("EC2:PC015, EC2:PC011"), canonPlace("EC2:PC011, EC2:PC015"));
  assert.equal(canonPlace("EC2:241 Verona"), "EC2:241 Verona");
  assert.notEqual(canonPlace("MA 3"), canonPlace("MA 5"));
});

test("expandSessions vecklar ut grupp-tider och dateEnd-intervall", () => {
  const merged = {
    date: "2026-12-15",
    dateEnd: "2026-12-16",
    time: "09:00 / 13:00",
    subcourse: "isprojekt",
    title: "Handledning 1 — bokad tid",
    place: "EC2:241 Verona",
    kind: "handledning",
  };
  const atoms = expandSessions([merged]);
  assert.deepEqual(
    atoms.map((a) => `${a.date} ${a.start}`),
    ["2026-12-15 09:00", "2026-12-15 13:00", "2026-12-16 09:00", "2026-12-16 13:00"]
  );

  const single = expandSessions([
    { date: "2026-09-02", time: "08:00–10:00", subcourse: "databaser", title: "F2", place: "MA 3", kind: "föreläsning" },
  ]);
  assert.equal(single.length, 1);
  assert.equal(single[0].start, "08:00");

  assert.throws(
    () => expandSessions([{ date: "2026-09-02", time: "kl 8", title: "X", subcourse: "d", place: "", kind: null }]),
    /oväntat tidsformat/
  );
});

test("diffSchedule klassificerar varje skillnadstyp", () => {
  const base = {
    date: "2026-09-04",
    start: "10:00",
    end: "12:00",
    subcourse: "databaser",
    kind: "föreläsning",
    title: "Föreläsning 3",
    place: "MA 3",
  };
  const atomOf = (over = {}) =>
    expandSessions([{ date: base.date, time: "10:00–12:00", subcourse: base.subcourse, title: base.title, place: base.place, kind: base.kind, ...over }]);

  // Identiskt → inga skillnader.
  assert.equal(countDiffs(diffSchedule(atomOf(), [base])), 0);

  const salDiff = diffSchedule(atomOf(), [{ ...base, place: "MA 5" }]);
  assert.equal(salDiff.place.length, 1);
  assert.equal(countDiffs(salDiff), 1);

  const tidDiff = diffSchedule(atomOf(), [{ ...base, start: "13:00", end: "15:00" }]);
  assert.equal(tidDiff.time.length, 1);
  assert.equal(countDiffs(tidDiff), 1);

  const datumDiff = diffSchedule(atomOf(), [{ ...base, date: "2026-09-05" }]);
  assert.equal(datumDiff.date.length, 1);
  assert.equal(countDiffs(datumDiff), 1);

  const nyttOchBorttaget = diffSchedule(atomOf(), [
    base,
    { ...base, date: "2026-09-07", start: "08:00", end: "10:00", place: "MA 5", title: "Extra pass" },
  ]);
  assert.equal(nyttOchBorttaget.new.length, 1);
  assert.equal(nyttOchBorttaget.new[0].title, "Extra pass");

  const borttaget = diffSchedule(atomOf(), []);
  assert.equal(borttaget.removed.length, 1);
});

test("proposalLine ger en giltig sessions-rad", () => {
  const line = proposalLine({
    date: "2026-09-04",
    start: "10:00",
    end: "12:00",
    subcourse: "databaser",
    kind: "föreläsning",
    title: "Föreläsning 3",
    place: "MA 3",
  });
  assert.equal(
    line,
    '{ date: "2026-09-04", time: "10:00–12:00", subcourse: "databaser", title: "Föreläsning 3", place: "MA 3", kind: "föreläsning" },'
  );
});
