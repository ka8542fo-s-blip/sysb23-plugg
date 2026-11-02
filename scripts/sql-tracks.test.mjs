// SQL-flikens spår: varje övning står på exakt ett ställe, Nästa går vidare
// över sektionsgränserna, och Fortsätt hittar nästa ej klara uppgift.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { levels, sqlExercises } from "../src/data/databaser/sqlExercises.js";
import {
  allItems, countSolved, defaultHelpTab, examTrackSections, locate, resumeItem, tileState, topicSections,
} from "../src/lib/sqlTracks.js";

const course = getCourse("databaser");
const topics = topicSections(course);
const exam = examTrackSections(course);

test("varje övning står på exakt ett ställe", () => {
  const ids = [...allItems(topics), ...allItems(exam)].map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), course.sqlExercises.map((item) => item.id).sort());
});

test("ämnena är byggstenarna, tentaformen ligger i Tentanivå", () => {
  assert.deepEqual(topics.map((section) => section.id), ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9"]);
  assert.deepEqual(topics.map((section) => section.kicker), [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `Nivå ${n}`));
  assert.equal(allItems(topics).length, 53);
  const andra = exam.find((section) => section.id === "andra");
  assert.deepEqual(andra.items.map((item) => item.id), sqlExercises.filter((item) => item.level === "tenta").map((item) => item.id));
  assert.equal(exam.find((section) => section.id === "egna").items.length, 3);
});

test("varje sektion har en genomgång och en kort beskrivning", () => {
  for (const section of [...topics, ...exam]) {
    assert.ok(section.lesson?.length > 50, `${section.id}: genomgång`);
    assert.ok(section.summary?.length > 10, `${section.id}: beskrivning`);
    assert.ok(section.items.length > 0, section.id);
  }
});

test("ordningen i ett ämne tar med alla ämnets övningar", () => {
  for (const level of levels.filter((item) => item.order)) {
    const own = sqlExercises.filter((item) => item.level === level.id).map((item) => item.id);
    assert.deepEqual([...level.order].sort(), [...own].sort(), level.id);
  }
});

test("IN, EXISTS och JOIN-uppgifterna står kvar i följd, de hänvisar till varandra", () => {
  const n7 = topics.find((section) => section.id === "n7").items.map((item) => item.id);
  const at = n7.indexOf("sql-48");
  assert.deepEqual(n7.slice(at, at + 3), ["sql-48", "sql-49", "sql-50"]);
});

test("rubrik och ruta", () => {
  assert.equal(topics[4].items[0].heading, "Uppgift 5.1");
  assert.equal(topics[4].items[0].label, "1");
  const egna = exam.find((section) => section.id === "egna").items;
  assert.deepEqual(egna.map((item) => item.label), ["16 sep 2025", "24 okt 2025", "25 maj 2026"]);
  assert.equal(egna[0].heading, "Ordinarie tentamen 16 september 2025 · uppgift 4");
  assert.equal(exam[2].items[1].heading, "Steg 3 · fråga 2");
});

test("Nästa och Föregående går över sektionsgränserna", () => {
  const lastInFirst = topics[0].items.at(-1);
  const place = locate(topics, lastInFirst.id);
  assert.equal(place.section.id, "n1");
  assert.equal(place.next.section.id, "n2");
  assert.equal(place.next.item.id, topics[1].items[0].id);
  assert.equal(locate(topics, topics[1].items[0].id).prev.item.id, lastInFirst.id);
  assert.equal(locate(topics, topics[0].items[0].id).prev, null);
  assert.equal(locate(topics, allItems(topics).at(-1).id).next, null);
  assert.equal(locate(topics, "finns-inte"), null);
});

test("Fortsätt: den senaste om den inte är klar, annars nästa ej klara, annars runt", () => {
  const items = allItems(topics);
  assert.equal(resumeItem(topics, {}, undefined).id, items[0].id);
  assert.equal(resumeItem(topics, {}, items[5].id).id, items[5].id);
  assert.equal(resumeItem(topics, { [items[5].id]: "solved" }, items[5].id).id, items[6].id);
  const allButFirst = Object.fromEntries(items.slice(1).map((item) => [item.id, "solved"]));
  assert.equal(resumeItem(topics, allButFirst, items.at(-1).id).id, items[0].id);
  const all = Object.fromEntries(items.map((item) => [item.id, "solved"]));
  assert.equal(resumeItem(topics, all, items[0].id), null);
  assert.equal(countSolved(items, all), items.length);
});

test("rutans läge", () => {
  assert.equal(tileState("solved", "x"), "solved");
  assert.equal(tileState("solved-with-help", null), "help");
  assert.equal(tileState(undefined, "SELECT"), "started");
  assert.equal(tileState(undefined, "SELECT ", "SELECT "), "empty");
  assert.equal(tileState(undefined, "   "), "empty");
  assert.equal(tileState(undefined, null), "empty");
});

test("hjälpytan börjar i genomgången när ämnet är nytt, annars i tabellerna", () => {
  const section = topics[0];
  assert.equal(defaultHelpTab(section, {}, false), "genomgang");
  assert.equal(defaultHelpTab(section, { [section.items[0].id]: "solved" }, false), "tabeller");
  assert.equal(defaultHelpTab(exam[0], {}, true), "tabeller");
});
