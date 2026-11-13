// Blandningen av alternativ: `last` står kvar sist och `fixedOrder` lämnar
// datafilens ordning orörd (Verksamhetsarkitekturens sant/falskt, parfrågor
// och "All of the above").
import { test } from "node:test";
import assert from "node:assert/strict";
import { shuffleQuestion } from "../src/lib/shuffle.js";

const options = ["A", "B", "C", "D", "E"].map((text) => ({ text }));

test("fixedOrder behåller ordningen och rätt svar", () => {
  const tf = { options: [{ text: "True" }, { text: "False" }], correct: 1, fixedOrder: true };
  const all = { options, correct: 4, fixedOrder: true };
  for (let run = 0; run < 30; run++) {
    const a = shuffleQuestion(tf);
    assert.deepEqual(a.options.map((o) => o.text), ["True", "False"]);
    assert.equal(a.correct, 1);
    const b = shuffleQuestion(all);
    assert.deepEqual(b.options.map((o) => o.text), ["A", "B", "C", "D", "E"]);
    assert.equal(b.correct, 4);
  }
});

test("utan fixedOrder blandas alternativen och rätt svar följer med", () => {
  const q = { options, correct: 2 };
  const orders = new Set();
  for (let run = 0; run < 60; run++) {
    const view = shuffleQuestion(q);
    assert.equal(view.options[view.correct].text, "C");
    orders.add(view.options.map((o) => o.text).join(""));
  }
  assert.ok(orders.size > 1, "alternativen blandas");
});
