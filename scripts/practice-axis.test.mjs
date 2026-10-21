// Öva-axeln: båda delkurserna grupperar per kapitel (Öva speglar Läs), och
// "kapitel för kapitel" sorterar i Läs-ordning.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getCourse } from "../src/data/index.js";
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

// Sammanfattningarna (BPM och Databaser) är inga kapitel: de står som ett
// eget kort ovanför kapitlen i Läs och har inga frågor. Kapitlen och Öva ska
// inte märka av dem.
for (const [id, numbers] of [
  ["process", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  ["databaser", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
]) {
  test(`sammanfattningen i ${id}: inget kapitel, ingen grupp i Öva`, () => {
    const course = getCourse(id);
    assert.equal(course.summary.id, "sammanfattning");
    assert.equal(course.summary.summary, true);
    assert.ok(!course.chapters.some((c) => c.id === course.summary.id));
    // Kapitlen behåller sina nummer, så "kapitel 7" i löptexten stämmer.
    assert.deepEqual(course.chapters.map((c) => c.number), numbers);
    assert.ok(!practiceGroups(course).some((g) => g.id === course.summary.id));
    assert.deepEqual(chapterPracticeGroups(course, course.summary), []);
  });
}

test("Strategi har ingen sammanfattning", () => {
  assert.equal(strategi.summary, undefined);
});
