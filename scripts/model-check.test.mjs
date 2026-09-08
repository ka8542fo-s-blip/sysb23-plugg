// Modellverkstadens rättare: jämför mängder, aldrig text. Ett fel här
// markerar tyst rätt svar som fel — då slutar man lita på verktyget.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSchema, checkModel } from "../src/lib/modelCheck.js";
import { modelExercises } from "../src/data/databaser/modelExercises.js";

const byId = Object.fromEntries(modelExercises.map((e) => [e.id, e]));
const ex5 = byId["mod-05"];
const check = (text, ex = ex5) => checkModel(text, ex.facit, ex.rules);
const rel = (result, name) => result.relations.find((r) => r.name.toLowerCase() === name.toLowerCase());

const CORRECT_5 = `TEACHER(EmployeeNo, Name, Salary)
PK = {EmployeeNo}

COURSE(CourseCode, Name, Credits, EmployeeNo)
PK = {CourseCode}
FK1: (EmployeeNo) REF TEACHER(EmployeeNo)

TEACH(EmployeeNo, CourseCode)
PK = {EmployeeNo, CourseCode}
FK1: (EmployeeNo) REF TEACHER(EmployeeNo)
FK2: (CourseCode) REF COURSE(CourseCode)`;

test("exakt rätt svar", () => {
  const r = check(CORRECT_5);
  assert.equal(r.status, "correct");
  assert.equal(r.extra.length, 0);
  assert.ok(r.relations.every((x) => x.status === "ok"));
});

test("facit rättar sig självt i alla uppgifter", () => {
  for (const ex of modelExercises) {
    for (const variant of ex.facit) {
      const r = checkModel(variant, ex.facit, ex.rules);
      assert.equal(r.status, "correct", `${ex.id}: ${JSON.stringify(r.relations.filter((x) => x.status !== "ok").map((x) => x.problems))}`);
      assert.equal(parseSchema(variant).errors.length, 0, `${ex.id} facit tolkas inte`);
    }
    // Varje facitrelation har en regeltagg.
    for (const r of parseSchema(ex.facit[0]).relations) {
      const key = r.name.toLowerCase().replace(/[\s_]+/g, "");
      assert.ok(ex.rules[key], `${ex.id}: ${r.name} saknar regeltagg`);
    }
  }
});

test("rätt svar med attribut i annan ordning och annat skiftläge", () => {
  const r = check(`course(credits, name, employeeNo, courseCode)
PK = {CourseCode}
FK1: (employeeno) REF teacher(EMPLOYEENO)

Teach(CourseCode, EmployeeNo)
PK = {CourseCode, EmployeeNo}
FK1: (CourseCode) REF Course(CourseCode)
FK2: (EmployeeNo) REF Teacher(EmployeeNo)

Teacher(Salary, Name, EmployeeNo)
PK = {EmployeeNo}`);
  assert.equal(r.status, "correct", JSON.stringify(r.relations.map((x) => x.problems)));
});

test("rätt svar med annat relationsnamn ger rätt plus anmärkning", () => {
  const r = check(CORRECT_5.replace(/TEACH\(/, "TEACHES(").replace(/TEACH\b(?!ES|ER)/g, "TEACHES"));
  assert.equal(r.status, "correct");
  assert.ok(r.remarks.some((n) => /TEACHES/.test(n) && /Teach/i.test(n)), r.remarks.join(" | "));
});

test("alla relationer omdöpta, även kopplingsrelationen, ger rätt", () => {
  const r = check(`Larare(EmployeeNo, Name, Salary)
PK = {EmployeeNo}

Kurs(CourseCode, Name, Credits, AnsvarigLarare)
PK = {CourseCode}
FK1: (AnsvarigLarare) REF Larare(EmployeeNo)

Undervisar(EmployeeNo, CourseCode)
PK = {EmployeeNo, CourseCode}
FK1: (EmployeeNo) REF Larare(EmployeeNo)
FK2: (CourseCode) REF Kurs(CourseCode)`);
  assert.equal(r.status, "correct", JSON.stringify(r.relations.map((x) => [x.name, x.status, x.problems])));
  assert.equal(r.extra.length, 0);
  assert.equal(r.remarks.length, 4); // tre relationsnamn + ett FK-attributnamn
});

test("rätt svar med annat FK-attributnamn ger rätt plus anmärkning", () => {
  const r = check(CORRECT_5.replace("COURSE(CourseCode, Name, Credits, EmployeeNo)", "COURSE(CourseCode, Name, Credits, ResponsibleTeacher)").replace("FK1: (EmployeeNo) REF TEACHER(EmployeeNo)\n\nTEACH", "FK1: (ResponsibleTeacher) REF TEACHER(EmployeeNo)\n\nTEACH"));
  assert.equal(r.status, "correct", JSON.stringify(r.relations.map((x) => x.problems)));
  assert.ok(r.remarks.some((n) => /ResponsibleTeacher/.test(n)));
});

test("rätt svar i andra 1:1-alternativet", () => {
  // Employee — ResponsibleFor — Project, båda frivilliga: valfri riktning.
  const facit = [
    `EMPLOYEE(EmployeeNo, Name)\nPK = {EmployeeNo}\n\nPROJECT(ProjectNo, Title, ResponsibleEmployeeNo)\nPK = {ProjectNo}\nFK1: (ResponsibleEmployeeNo) REF EMPLOYEE(EmployeeNo)`,
    `EMPLOYEE(EmployeeNo, Name, ProjectNo)\nPK = {EmployeeNo}\nFK1: (ProjectNo) REF PROJECT(ProjectNo)\n\nPROJECT(ProjectNo, Title)\nPK = {ProjectNo}`,
  ];
  const second = checkModel(`PROJECT(ProjectNo, Title)\nPK = {ProjectNo}\n\nEMPLOYEE(EmployeeNo, Name, ProjectNo)\nPK = {EmployeeNo}\nFK1: (ProjectNo) REF PROJECT(ProjectNo)`, facit);
  assert.equal(second.status, "correct");
  assert.equal(second.variant, 1);
  const first = checkModel(facit[0], facit);
  assert.equal(first.status, "correct");
  assert.equal(first.variant, 0);
});

test("saknad relation", () => {
  const r = check(CORRECT_5.split("\n\nTEACH")[0]);
  assert.equal(r.status, "partial");
  assert.equal(rel(r, "TEACH").status, "missing");
  assert.equal(rel(r, "TEACH").rule.rule, "Regel 5");
  assert.match(rel(r, "TEACH").rule.why, /M:N/);
});

test("extra relation", () => {
  const r = check(CORRECT_5 + `\n\nRESPONSIBLE(EmployeeNo, CourseCode)\nPK = {EmployeeNo, CourseCode}\nFK1: (EmployeeNo) REF TEACHER(EmployeeNo)\nFK2: (CourseCode) REF COURSE(CourseCode)`);
  assert.equal(r.status, "partial");
  assert.deepEqual(r.extra, ["RESPONSIBLE"]);
});

test("fel PK", () => {
  const r = check(CORRECT_5.replace("PK = {EmployeeNo, CourseCode}", "PK = {EmployeeNo}"));
  assert.equal(r.status, "partial");
  const t = rel(r, "TEACH");
  assert.equal(t.status, "diff");
  assert.match(t.problems[0], /Primärnyckeln ska vara \{EmployeeNo, CourseCode\}, du har \{EmployeeNo\}/);
  assert.match(t.problems[0], /CourseCode saknas/);
});

test("PK som innehåller ett attribut för mycket", () => {
  const r = check(CORRECT_5.replace("PK = {CourseCode}", "PK = {CourseCode, Name}"));
  const c = rel(r, "COURSE");
  assert.equal(c.status, "diff");
  assert.match(c.problems[0], /Name ska inte ingå/);
});

test("FK mot fel mål", () => {
  const r = check(CORRECT_5.replace("FK1: (EmployeeNo) REF TEACHER(EmployeeNo)\n\nTEACH", "FK1: (EmployeeNo) REF COURSE(CourseCode)\n\nTEACH"));
  const c = rel(r, "COURSE");
  assert.equal(c.status, "diff");
  assert.ok(c.problems.some((p) => /Saknar främmande nyckel mot TEACHER/i.test(p)), c.problems.join(" | "));
  assert.ok(c.problems.some((p) => /inte hör hit: mot COURSE/i.test(p)), c.problems.join(" | "));
});

test("FK som saknas", () => {
  const r = check(CORRECT_5.replace("FK1: (EmployeeNo) REF TEACHER(EmployeeNo)\n\nTEACH", "\nTEACH"));
  const c = rel(r, "COURSE");
  assert.equal(c.status, "diff");
  // Utan FK-rad är EmployeeNo ett vanligt attribut som inte finns i facit som sådant.
  assert.ok(c.problems.some((p) => /Saknar främmande nyckel mot TEACHER/i.test(p)), c.problems.join(" | "));
});

test("skrivfel i attributnamn", () => {
  const r = check(CORRECT_5.replace("TEACHER(EmployeeNo, Name, Salary)", "TEACHER(EmployeeNo, Name, Sallary)"));
  const t = rel(r, "TEACHER");
  assert.equal(t.status, "diff");
  assert.match(t.problems.join(" "), /Saknar attribut: Salary/);
  assert.match(t.problems.join(" "), /Sallary/);
  assert.equal(r.status, "partial");
});

test("sammansatt FK jämförs som en referens (uppgift 8)", () => {
  const ex = byId["mod-08"];
  const ok = checkModel(ex.facit[0].replace("WORK(EmployeeNo, DeptName, DeptAddress, Hours)", "WORK(EmployeeNo, DName, DAddr, Hours)").replace("PK = {EmployeeNo, DeptName, DeptAddress}", "PK = {EmployeeNo, DName, DAddr}").replace("FK2: (DeptName, DeptAddress) REF DEPARTMENT(Name, Address)", "FK2: (DName, DAddr) REF DEPARTMENT(Name, Address)"), ex.facit, ex.rules);
  assert.equal(ok.status, "correct", JSON.stringify(ok.relations.map((x) => x.problems)));
  const half = checkModel(ex.facit[0].replace("FK2: (DeptName, DeptAddress) REF DEPARTMENT(Name, Address)", "FK2: (DeptName) REF DEPARTMENT(Name)").replace("WORK(EmployeeNo, DeptName, DeptAddress, Hours)", "WORK(EmployeeNo, DeptName, DeptAddress, Hours)"), ex.facit, ex.rules);
  assert.equal(rel(half, "WORK").status, "diff");
});

test("kedjade svaga entiteter: FK mot närmaste ägarens hela nyckel, omdöpta attribut", () => {
  const ex = byId["mod-10"];
  const renamed = `Festival(Name, City)
PK = {Name}

Stage(FName, StageName)
PK = {FName, StageName}
FK1: (FName) REF Festival(Name)

Slot(F, S, StartTime, Artist)
PK = {F, S, StartTime}
FK1: (F, S) REF Stage(FName, StageName)`;
  const r = checkModel(renamed, ex.facit, ex.rules);
  assert.equal(r.status, "correct", JSON.stringify(r.relations.map((x) => x.problems)));
  const wrong = checkModel(renamed.replace("FK1: (F, S) REF Stage(FName, StageName)", "FK1: (F) REF Festival(Name)"), ex.facit, ex.rules);
  assert.equal(rel(wrong, "SLOT").status, "diff");
  assert.equal(rel(wrong, "SLOT").rule.rule, "Kedjad svag");
});

test("unär relation: FK mot samma relation (uppgift 6)", () => {
  const ex = byId["mod-06"];
  const r = checkModel(ex.facit[0].replace("SupervisorNo", "Boss").replace("FK1: (SupervisorNo)", "FK1: (Boss)"), ex.facit, ex.rules);
  assert.equal(r.status, "correct", JSON.stringify(r.relations.map((x) => x.problems)));
});

test("PK = CK1 slås upp, CK-rader ignoreras i rättningen", () => {
  const r = check(CORRECT_5.replace("TEACHER(EmployeeNo, Name, Salary)\nPK = {EmployeeNo}", "TEACHER(EmployeeNo, Name, Salary)\nCK1 = {EmployeeNo}\nPK = CK1"));
  assert.equal(r.status, "correct");
});

test("helt fel svar är fel, inte delvis", () => {
  const r = check(`FOO(A, B)\nPK = {A}`);
  assert.equal(r.status, "wrong");
});

test("tolkningsfel har radnummer och begripligt meddelande", () => {
  const p = parseSchema(`TEACHER(EmployeeNo, Name)\nPK = {Nope}\n\nFK1: (X) REF Y(Z)`);
  assert.ok(p.errors.length >= 1);
  assert.match(p.errors[0].message, /^Rad 2: Nope i PK finns inte/);
  const q = parseSchema(`PK = {A}`);
  assert.match(q.errors[0].message, /^Rad 1: väntade en relationsrad/);
  const s = parseSchema(`R(A, B)\nPK = {A}\nFK1: B REF S(B)`);
  assert.match(s.errors[0].message, /^Rad 3: FK-raden ska se ut som/);
  const t = parseSchema(`R(A, B)`);
  assert.match(t.errors[0].message, /saknar PK-rad/);
  const r = checkModel(`R(A, B)`, ex5.facit);
  assert.equal(r.status, "parse-error");
});

test("svaret 3NF tolkas som 'redan i 3NF' utan relationer", () => {
  const p = parseSchema("R är redan i 3NF");
  assert.equal(p.already3NF, true);
  assert.equal(p.errors.length, 0);
});

const BLOCK_5 = `Teacher(
\tEmployeeNo,
\tName,
\tSalary,
\tCK₁ = {EmployeeNo},
\tPK = CK₁,
)

Course(
CourseCode,
Name,
Credits,
ResponsibleNo,
CK1 ={CourseCode},
PK1 = CK1,
FK (ResponsibleNo) REF Teacher(EmployeeNo)
)

Teach (
	EmployeeNo,
	CourseCode,
	CK1 = {EmployeeNo, CourseCode),
	PK1 = CK1,
	FK(EmployeeNo) REF Teacher(EmployeeNo),
	FK(CourseCode) REF Course(CourseCode)
)`;

test("föreläsningens blockform: attribut per rad, små siffror, PK1 = CK1, FK utan kolon, släpande komman", () => {
  const p = parseSchema(BLOCK_5);
  assert.deepEqual(p.errors, []);
  assert.deepEqual(p.relations.map((r) => r.name), ["Teacher", "Course", "Teach"]);
  assert.deepEqual(p.relations[1].attrs, ["CourseCode", "Name", "Credits", "ResponsibleNo"]);
  assert.deepEqual(p.relations[2].pk, ["EmployeeNo", "CourseCode"]);
  assert.equal(p.relations[1].fks[0].target, "Teacher");
  const r = check(BLOCK_5);
  assert.equal(r.status, "correct", JSON.stringify(r.relations.map((x) => x.problems)));
});

test("blockform: radnumren i felen pekar på originalraderna", () => {
  const p = parseSchema(`Teacher(\n  EmployeeNo,\n  Name,\n  CK1 = {CourseCode},\n  PK = CK1\n)`);
  assert.match(p.errors[0].message, /^Rad 4: CourseCode i CK1 finns inte/);
  const q = parseSchema(`Teacher(\n  EmployeeNo,\n  Name`);
  assert.match(q.errors[0].message, /^Rad 1: parentesen efter Teacher stängs aldrig/);
  const s = parseSchema(`Teacher(\n  EmployeeNo,\n  Name)\nPK = {EmployeeNo}`);
  assert.deepEqual(s.errors, []);
  assert.deepEqual(s.relations[0].attrs, ["EmployeeNo", "Name"]);
});
