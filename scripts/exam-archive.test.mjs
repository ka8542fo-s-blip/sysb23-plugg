// Fliken Tenta för Verksamhetsarkitektur: de tre HT25-tentorna som
// översikt. Varje tenta är 100 p, Zachman 50 och artiklar 50; Zachman-delarna
// pekar på befintliga essäer och Zachman-uppgifter; artikelfrågorna har inget
// facit (artiklarna ingår inte i HT26-materialet, och facit gissas aldrig).
import { test } from "node:test";
import assert from "node:assert/strict";
import { ARTICLE_NOTE, examArchive } from "../src/data/arkitektur/examArchive.js";
import { taskById } from "../src/data/arkitektur/zachman.js";
import { essays } from "../src/data/arkitektur/essays.js";
import { getCourse } from "../src/data/index.js";

const sum = (parts) => parts.reduce((total, part) => total + part.points, 0);

test("tre tentor i datumordning, 100 p var: Zachman 50 och artiklar 50", () => {
  assert.deepEqual(examArchive.map((e) => e.id), ["ea-ht25-okt", "ea-ht25-dec", "ea-ht25-maj"]);
  assert.deepEqual(examArchive.map((e) => e.date), [...examArchive.map((e) => e.date)].sort());
  for (const exam of examArchive) {
    assert.equal(sum(exam.parts), 100, exam.id);
    assert.equal(sum(exam.parts.filter((p) => p.kind !== "statement")), 50, `${exam.id}: Zachman`);
    assert.equal(sum(exam.parts.filter((p) => p.kind === "statement")), 50, `${exam.id}: artiklar`);
    assert.deepEqual(exam.parts.map((p) => p.no), exam.parts.map((_, i) => i + 1), `${exam.id}: tentans ordning`);
  }
  assert.deepEqual(examArchive.map((e) => e.parts.filter((p) => p.kind === "statement").length), [25, 17, 13]);
});

test("Zachman-delarna pekar på Essä och Zachman-vyn", () => {
  const essayIds = new Set(essays.map((e) => e.id));
  for (const exam of examArchive) {
    const essay = exam.parts.find((p) => p.kind === "essay");
    assert.equal(essay.no, 1, exam.id);
    assert.equal(essay.points, 30, exam.id);
    assert.ok(essayIds.has(essay.essayId), exam.id);
    for (const part of exam.parts.filter((p) => p.kind === "zachman")) {
      assert.ok(part.taskIds.length >= 1, `${exam.id} ${part.no}`);
      for (const id of part.taskIds) assert.ok(taskById(id), `${exam.id}: ${id}`);
    }
  }
});

test("artikelfrågorna står utan facit och med texten ordagrant", () => {
  assert.equal(ARTICLE_NOTE, "Artikeln ingår inte i HT26-materialet – facit saknas.");
  for (const exam of examArchive) {
    for (const part of exam.parts.filter((p) => p.kind === "statement")) {
      for (const key of ["correct", "answer", "truth", "key"]) assert.ok(!(key in part), `${exam.id} ${part.no}: inget facit`);
      assert.ok(part.text.length > 30, `${exam.id} ${part.no}`);
      assert.doesNotMatch(part.text, /Välj ett alternativ|- [a-zåäö]+tjänster|EA- /, `${exam.id} ${part.no}: utläsningsrester`);
    }
  }
});

test("manifestet: arkitektur har fliken Tenta som översikt och inga Tentafrågor i Öva", () => {
  const course = getCourse("arkitektur");
  assert.ok(course.views.includes("tenta"));
  assert.equal(course.examArchive, examArchive);
  assert.equal(course.choiceExams.length, 0);
  assert.equal(course.pastExams.length, 0);
});
