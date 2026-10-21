// Öva-axeln: båda delkurserna grupperar per kapitel (Öva speglar Läs), och
// "kapitel för kapitel" sorterar i Läs-ordning.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
import { numberedChapterCount } from "../src/lib/chapterNumbering.js";
import {
  chapterPracticeGroups, groupKeyFor, groupsForTopics, orderByGroup, practiceGroups, practicedGroupIds,
} from "../src/lib/practiceAxis.js";

const databaser = getCourse("databaser");
const strategi = getCourse("strategi");

test("båda delkurserna grupperar per kapitel i Läs-ordning", () => {
  assert.deepEqual(
    practiceGroups(databaser).map((g) => g.id),
    databaser.chapters.map((c) => c.id),
  );
  assert.equal(practiceGroups(databaser)[3].name, "Modell, entiteter och attribut");
  assert.deepEqual(practiceGroups(strategi).map((g) => g.id), strategi.chapters.map((c) => c.id));
});

test("frågans grupp härleds ur ämnets kapitel utan att frågan bär kapitel", () => {
  const keyOf = groupKeyFor(databaser);
  const q = databaser.questions.find((x) => x.topic === "crowsfoot");
  assert.equal(keyOf(q), "svaga");
  assert.deepEqual(groupsForTopics(databaser, ["metamodell", "er"]), ["kap4"]);
  assert.deepEqual(groupsForTopics(strategi, ["bsc", "matt"]), ["kap7"]);
  const svaga = databaser.chapters.find((c) => c.id === "svaga");
  assert.deepEqual(chapterPracticeGroups(databaser, svaga), ["svaga"]);
  assert.equal(practicedGroupIds(databaser).size, databaser.chapters.length);
});

test("kapitel för kapitel ger Läs-ordning och bankens ordning inom kapitlet", () => {
  const shuffled = [...databaser.questions].reverse();
  const ordered = orderByGroup(databaser, shuffled);
  const keyOf = groupKeyFor(databaser);
  const position = new Map(databaser.chapters.map((c, i) => [c.id, i]));
  for (let i = 1; i < ordered.length; i++) {
    const a = position.get(keyOf(ordered[i - 1]));
    const b = position.get(keyOf(ordered[i]));
    assert.ok(a <= b, `${ordered[i - 1].id} före ${ordered[i].id}`);
    if (a === b) {
      assert.ok(
        databaser.questions.indexOf(ordered[i - 1]) < databaser.questions.indexOf(ordered[i]),
        `bankordning bruten vid ${ordered[i].id}`,
      );
    }
  }
  assert.equal(ordered.length, databaser.questions.length);
});

// Översiktskapitlet i BPM står först i Läs men har inga frågor. Det ska vara
// uttryckligen undantaget från Öva, inte visas som en tom grupp.
test("översiktskapitlet: först i Läs, ingen grupp i Öva och inga frågor", () => {
  const course = getCourse("process");
  const [first, ...rest] = course.chapters;
  assert.equal(first.overview, true);
  assert.equal(first.number, 0);
  // Kapitel 1–11 behåller sina nummer, så "kapitel 7" i löptexten stämmer.
  assert.deepEqual(rest.map((c) => c.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.ok(!practiceGroups(course).some((g) => g.id === first.id));
  assert.deepEqual(chapterPracticeGroups(course, first), []);
  assert.ok(!practicedGroupIds(course).has(first.id));
  // "Kapitel N av 11" i UI:t och i ljudet räknar inte översikten.
  assert.equal(numberedChapterCount(course.chapters), 11);
  // Bara BPM har en översikt.
  for (const other of [databaser, strategi]) assert.ok(!other.chapters.some((c) => c.overview), other.id);
});
