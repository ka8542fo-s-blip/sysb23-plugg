// Zachman-vyn: facit och placeringslogik. Varje uppgift har minst en giltig
// cell, alla celler är R1–R6/K1–K6, majfrågornas rätta alternativ finns och
// poängen stämmer, tolkningar har motivering, och de omvända frågorna
// täcker affischens 36 celler en gång var.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CELLS, CELL_CODES, COLUMNS, ROWS, MEMORY_ID, TASK_GROUPS, taskById, zachmanTasks,
} from "../src/data/arkitektur/zachman.js";
import { gradeChoice, gradeMemory, gradePlacement, memoryFieldOk, normalize } from "../src/lib/zachman.js";
import { modelProgressIds } from "../src/data/progressLists.js";

const CELL_RE = /^R[1-6]K[1-6]$/;

test("rutnätet: 6 rader, 6 kolumner, 36 celler med namn", () => {
  assert.deepEqual(ROWS.map((r) => r.code), ["R1", "R2", "R3", "R4", "R5", "R6"]);
  assert.deepEqual(COLUMNS.map((c) => c.code), ["K1", "K2", "K3", "K4", "K5", "K6"]);
  assert.equal(CELL_CODES.length, 36);
  for (const code of CELL_CODES) {
    assert.match(code, CELL_RE);
    assert.ok(CELLS[code].name, code);
    assert.ok(CELLS[code].v3, code);
  }
  // Stickprov mot 2003-affischen.
  assert.equal(CELLS.R2K3.name, "Logistics Network");
  assert.equal(CELLS.R2K4.name, "Work Flow Model");
  assert.equal(CELLS.R3K6.name, "Business Rule Model");
  assert.equal(CELLS.R5K2.name, "Program");
  assert.equal(CELLS.R1K5.name, "List of Cycles");
  assert.equal(CELLS.R4K1.pair, "ENTITY = Table/Segment/etc., RELATION = Key/Pointer/etc.");
});

test("varje uppgift har giltiga celler, unika id:n och motivering vid tolkning", () => {
  const ids = new Set();
  for (const task of zachmanTasks) {
    assert.ok(!ids.has(task.id), `dubblett ${task.id}`);
    ids.add(task.id);
    if (task.kind === "place" || task.kind === "reverse") {
      assert.ok(task.cells.length >= 1, `${task.id}: minst en cell`);
      for (const code of [...task.cells, ...task.also]) assert.match(code, CELL_RE, task.id);
      assert.ok(!task.cells.some((c) => task.also.includes(c)), `${task.id}: samma cell som facit och alternativ`);
    }
    if (task.kind !== "memory") {
      assert.ok(["S", "T"].includes(task.grade), task.id);
      assert.ok(task.why?.length > 20, `${task.id}: motivering`);
    }
  }
});

test("majtentans sju flerval: rätt alternativ finns, cellkoderna är giltiga, 20 p", () => {
  const may = zachmanTasks.filter((task) => task.kind === "choice");
  assert.equal(may.length, 7);
  assert.equal(may.reduce((sum, task) => sum + task.points, 0), 20);
  for (const task of may) {
    assert.ok(task.correct >= 0 && task.correct < task.options.length, task.id);
    for (const option of task.options) {
      if (/^Inget av de övriga alternativen/.test(option)) continue;
      for (const code of option.replace(/\.$/, "").split(/,\s*/)) assert.match(code, CELL_RE, `${task.id}: ${option}`);
    }
  }
  assert.equal(taskById("zm-7").options[taskById("zm-7").correct], "Inget av de övriga alternativen.");
});

test("de omvända frågorna täcker alla 36 celler en gång", () => {
  const reverse = zachmanTasks.filter((task) => task.kind === "reverse");
  assert.deepEqual(reverse.map((task) => task.cells[0]).sort(), [...CELL_CODES].sort());
  for (const task of reverse) assert.equal(task.grade, "S");
});

test("uppgiftsgrupperna följer tentorna och pekar på befintliga uppgifter", () => {
  const counts = Object.fromEntries(TASK_GROUPS.map((g) => [g.key, g.ids.length]));
  assert.deepEqual(counts, { okt: 10, dec: 10, maj: 7, omvant: 36 });
  for (const group of TASK_GROUPS) for (const id of group.ids) assert.ok(taskById(id), id);
  // Sex objekt står på båda tentorna och är samma uppgift.
  const shared = TASK_GROUPS[0].ids.filter((id) => TASK_GROUPS[1].ids.includes(id));
  assert.equal(shared.length, 6);
});

test("placering: rätt, delvis och fel", () => {
  const task = { cells: ["R2K4"], also: ["R1K4"], maxCells: 2 };
  assert.equal(gradePlacement(task, ["R2K4"]).status, "ratt");
  assert.equal(gradePlacement(task, ["R1K4"]).status, "ratt");
  assert.equal(gradePlacement(task, ["R2K4", "R1K4"]).status, "ratt");
  assert.equal(gradePlacement(task, ["R2K4", "R3K4"]).status, "delvis");
  assert.equal(gradePlacement(task, ["R3K4"]).status, "fel");
  assert.equal(gradePlacement(task, []).status, "tom");
  const single = { cells: ["R5K2"], also: [], maxCells: 1 };
  assert.equal(gradePlacement(single, ["R5K2"]).status, "ratt");
  assert.equal(gradePlacement(single, ["R5K2", "R4K2"]).status, "delvis");
  const three = { cells: ["R3K3"], also: ["R4K3", "R2K3"], maxCells: 2 };
  assert.equal(gradePlacement(three, ["R3K3", "R4K3", "R2K3"]).status, "delvis", "fler än två celler");
});

test("flerval: exakt det rätta alternativet", () => {
  const task = { correct: 2 };
  assert.equal(gradeChoice(task, [2]).status, "ratt");
  assert.equal(gradeChoice(task, [2, 0]).status, "delvis");
  assert.equal(gradeChoice(task, [1]).status, "fel");
  assert.equal(gradeChoice(task, []).status, "tom");
});

test("memorering: varianter godtas, fel ord gör det inte", () => {
  assert.equal(normalize("Varför?"), "varfor");
  assert.ok(memoryFieldOk("K6", "Varför"));
  assert.ok(memoryFieldOk("K6", "Why / Motivation"));
  assert.ok(memoryFieldOk("K3", "var"));
  assert.ok(!memoryFieldOk("K3", "Varför"), "var ≠ varför");
  assert.ok(memoryFieldOk("K5", "NÄR"));
  assert.ok(memoryFieldOk("R1", "Scope – Planner"));
  assert.ok(memoryFieldOk("R2", "Business Mgmt Perspective"));
  assert.ok(memoryFieldOk("R5", "Subcontractor"));
  assert.ok(memoryFieldOk("R6", "Functioning Enterprise"));
  assert.ok(!memoryFieldOk("R2", "Business"));
  assert.ok(!memoryFieldOk("R1", ""));
  const all = {
    K1: "Vad", K2: "How", K3: "Var", K4: "Who", K5: "När", K6: "Why",
    R1: "Planner", R2: "Owner", R3: "Designer", R4: "Builder", R5: "Subcontractor", R6: "Functioning Enterprise",
  };
  assert.equal(gradeMemory(all).done, true);
  assert.equal(gradeMemory({ ...all, R4: "Designer" }).correct, 11);
});

test("alla uppgifter, memoreringen inräknad, laddas som framsteg", () => {
  const loaded = new Set(modelProgressIds());
  assert.ok(loaded.has(MEMORY_ID));
  for (const task of zachmanTasks) assert.ok(loaded.has(task.id), task.id);
});
