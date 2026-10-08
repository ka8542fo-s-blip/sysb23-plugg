// Återkopplingen på nedbrytningen i klartext (lib/decompFeedback.js): en
// rad per relation och det som saknas, utifrån de tre reglerna. Ett fall
// per feltyp med förväntad text, och att alla facit ger "Rätt".
import { test } from "node:test";
import assert from "node:assert/strict";
import { decompositionFeedback, headline } from "../src/lib/decompFeedback.js";
import { gradeAnswer } from "../src/lib/fdGrade.js";
import { facitVariants } from "../src/lib/normalize.js";
import { highestNF } from "../src/lib/fd.js";
import { normalizeExercises } from "../src/data/databaser/normalizeExercises.js";

const byId = Object.fromEntries(normalizeExercises.map((e) => [e.id, e]));
const fb = (id, text) => decompositionFeedback(byId[id], text);
const texts = (r) => r.lines.map((l) => `${l.ok ? "✓" : "✗"} ${l.text}`);

test("rubriken: Rätt / Nästan – 1 sak / Fel – N saker", () => {
  assert.equal(headline(0), "Rätt");
  assert.equal(headline(1), "Nästan – 1 sak att ändra");
  assert.equal(headline(3), "Fel – 3 saker att ändra");
});

test("helt rätt: en rad per tabell med vad den är, nyckeltabellen förklarad", () => {
  const r = fb("norm-egen-02", "R1(A, B, C)\nPK = {A}\n\nR2(C, D)\nPK = {C}\n\nR3(A, E)\nPK = {A, E}");
  assert.equal(r.headline, "Rätt");
  assert.deepEqual(texts(r), [
    "✓ R1(A, B, C) – tabellen för pilen A → {B, C}. Stämmer med facit.",
    "✓ R2(C, D) – tabellen för pilen C → D. Stämmer med facit.",
    "✓ R3(A, E) – nyckeltabellen. Behövs eftersom ingen annan tabell innehåller hela nyckeln {A, E}.",
  ]);
});

test("namn och ordning spelar ingen roll: matchas på attribut och nyckel", () => {
  const r = fb("norm-egen-02", "Nyckel(E, A)\nPK = {E, A}\n\nX(D, C)\nPK = {C}\n\nY(C, B, A)\nPK = {A}");
  assert.equal(r.headline, "Rätt");
});

test("kedja kvar i en tabell", () => {
  const r = fb("norm-egen-06", "R1(A, B, C)\nPK = {A}\n\nR3(C, D)\nPK = {C}");
  assert.equal(r.headline, "Nästan – 1 sak att ändra");
  assert.deepEqual(texts(r), [
    "✗ R1(A, B, C) – här finns kedjan A → B → C kvar. B → C ska ha en egen tabell.",
    "✓ R3(C, D) – tabellen för pilen C → D. Stämmer med facit.",
  ]);
});

test("del av nyckeln bestämmer ett attribut i tabellen", () => {
  const r = fb("norm-egen-08", "R1(A, B, C, D)\nPK = {A, B}\n\nR3(D, E)\nPK = {D}");
  assert.deepEqual(texts(r)[0], "✗ R1(A, B, C, D) – här beror D bara på B, en del av nyckeln {A, B}. B → D ska ha en egen tabell.");
  assert.equal(r.count, 1, "ingen extra Saknas-rad för B → D");
});

test("saknad tabell för en pil", () => {
  const r = fb("norm-egen-08", "R1(A, B, C)\nPK = {A, B}\n\nR2(B, D)\nPK = {B}");
  assert.deepEqual(texts(r).slice(-1), ["✗ Saknas: tabell för pilen D → E."]);
  assert.equal(r.headline, "Nästan – 1 sak att ändra");
});

test("saknad nyckeltabell", () => {
  const r = fb("norm-egen-02", "R1(A, B, C)\nPK = {A}\n\nR2(C, D)\nPK = {C}");
  assert.deepEqual(texts(r).slice(-1), ["✗ Saknas: nyckeltabell. Ingen tabell innehåller hela nyckeln {A, E}."]);
});

test("övernormaliserat: nycklar som bestämmer varandra ska vara en tabell", () => {
  const r = fb("norm-11-02", "R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}\n\nR3(C, D)\nPK = {C}");
  assert.deepEqual(texts(r), [
    "✓ R1(A, B) – tabellen för pilen A → B. Stämmer med facit.",
    "✗ R2 och R3 har nycklar som bestämmer varandra (B → C och C → B) – de ska vara en tabell.",
  ]);
  // Tre tabeller där facit har en.
  const s = fb("norm-12-04", "R1(A, B, C)\nPK = {A, B}\n\nR2(C, D)\nPK = {C}\n\nR3(D, E)\nPK = {D}\n\nR4(E, F)\nPK = {E}\n\nR5(F, G)\nPK = {F}");
  assert.equal(texts(s)[0], "✗ R1, R2 och R3 ska vara en tabell: nycklarna {A, B}, C och D bestämmer varandra.");
  assert.equal(s.count, 1);
});

test("samma nyckel i två tabeller ska vara en tabell", () => {
  const r = fb("norm-11-05", "R1(A, B, C)\nPK = {A, B}\n\nR2(A, B, D)\nPK = {A, B}\n\nR3(D, E)\nPK = {D}\n\nR4(A, B, F)\nPK = {A, B, F}");
  assert.ok(texts(r).includes("✗ R1 och R2 har samma nyckel {A, B} – de ska vara en tabell."), texts(r).join("\n"));
});

test("onödig tabell: allt i den finns redan i en annan", () => {
  const r = fb("norm-egen-08", "R1(A, B, C)\nPK = {A, B}\n\nR2(B, D)\nPK = {B}\n\nR3(D, E)\nPK = {D}\n\nR4(A, B)\nPK = {A, B}");
  assert.deepEqual(texts(r).slice(-1), ["✗ R4 behövs inte – allt i den finns redan i R1."]);
  assert.equal(r.count, 1);
});

test("fel primärnyckel", () => {
  const r = fb("norm-egen-08", "R1(A, B, C)\nPK = {A, B}\n\nR2(B, D)\nPK = {B, D}\n\nR3(D, E)\nPK = {D}");
  assert.ok(texts(r).includes("✗ R2:s nyckel ska vara {B}, eftersom pilen startar i B."));
  const k = fb("norm-egen-02", "R1(A, B, C)\nPK = {A}\n\nR2(C, D)\nPK = {C}\n\nR3(A, E)\nPK = {A}");
  assert.ok(texts(k).includes("✗ R3:s nyckel ska vara hela {A, E} – det är nyckeltabellen."));
});

test("attribut i fel tabell", () => {
  const r = fb("norm-12-01", "R1(A, B, D)\nPK = {A}\n\nR2(C, D)\nPK = {C}\n\nR3(A, C)\nPK = {A, C}");
  assert.equal(texts(r)[0], "✗ D hör inte hemma i R1 – D beror på C, inte på A.");
  assert.equal(r.count, 1);
  // Steget har redan en egen tabell.
  const s = fb("norm-13-09", "R1(A, B, C, D)\nPK = {A, B}\n\nR3(D, C)\nPK = {D}");
  assert.equal(texts(s)[0], "✗ C hör inte hemma i R1 – C beror på D, och D → C har redan en egen tabell (R3).");
});

test("tabell som saknar attribut den ska ha", () => {
  const r = fb("norm-11-05", "R1(A, B, C)\nPK = {A, B}\n\nR2(D, E)\nPK = {D}\n\nR3(A, B, F)\nPK = {A, B, F}");
  assert.equal(texts(r)[0], "✗ R1 saknar D – {A, B} pekar direkt på D, så det ska stå i samma tabell.");
});

test("R var redan i 3NF", () => {
  const r = fb("norm-11-04", "R1(A, B, C)\nPK = {A}\n\nR2(C, D, E)\nPK = {C}");
  assert.deepEqual(texts(r), ["✗ R var redan i 3NF – ingen nedbrytning behövs."]);
  assert.equal(fb("norm-11-04", "").count, 0);
});

test("ingen nedbrytning alls när R inte är i 3NF: alla tabeller saknas", () => {
  assert.deepEqual(texts(fb("norm-11-01", "")), ["✗ Saknas: tabell för pilen A → B.", "✗ Saknas: tabell för pilen B → C."]);
});

test("attribut som inte finns i R", () => {
  const r = fb("norm-11-01", "R1(A, B)\nPK = {A}\n\nR2(B, X)\nPK = {B}");
  assert.ok(texts(r).includes("✗ X finns inte i R (R2(B, X))."));
});

test("alla facit och alla deras PK-alternativ ger Rätt utan något att ändra", () => {
  for (const item of normalizeExercises) {
    if (!item.facit) continue;
    for (const text of facitVariants(item)) {
      const r = decompositionFeedback(item, text);
      assert.equal(r.count, 0, `${item.id}: ${texts(r).join(" | ")}`);
      assert.ok(r.lines.every((l) => l.ok));
    }
  }
});

test("rättningen och återkopplingen säger samma sak", () => {
  const perfect = (item, text) => {
    const a = highestNF(item.attrs, item.fds);
    const roles = Object.fromEntries(item.attrs.split(", ").map((x) => [x, a.prime.includes(x) ? "PA" : "NP"]));
    return { cks: a.cks, roles, nf: `${a.nf}NF`, motivation: {}, text };
  };
  const cases = [
    ["norm-egen-08", "R1(A, B, C)\nPK = {A, B}\n\nR2(B, D)\nPK = {B}\n\nR3(D, E)\nPK = {D}", true],
    ["norm-egen-08", "R1(A, B, C)\nPK = {A, B}\n\nR2(B, D, E)\nPK = {B}", false],
    ["norm-11-02", "R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}\n\nR3(C, D)\nPK = {C}", false],
  ];
  for (const [id, text, ok] of cases) {
    const d = gradeAnswer(byId[id], perfect(byId[id], text)).fields.decomposition;
    assert.equal(d.ok, ok, id);
    assert.equal(d.feedback.count === 0, ok, `${id}: ${texts(d.feedback).join(" | ")}`);
  }
});

test("ingen text nämner rättningstekniken eller ⋈", () => {
  const all = [];
  for (const item of normalizeExercises.filter((e) => e.facit)) {
    all.push(...texts(decompositionFeedback(item, "R1(A, B)\nPK = {A}")));
    const d = gradeAnswer(item, { cks: [], roles: {}, nf: item.nf, motivation: {}, text: "R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}" }).fields.decomposition;
    all.push(...d.properties.lossText);
  }
  const joined = all.join("\n");
  assert.doesNotMatch(joined, /⋈|prövad med|sker mot facit|motorn/);
});

test("12:9: övningshäftets R4(B, D) underkänns med förklaring", () => {
  const text = "R1(A, B)\nPK = {A}\n\nR2(B, C)\nPK = {B}\n\nR3(D, C)\nPK = {D}\n\nR4(B, D)\nPK = {B, D}";
  const r = fb("norm-12-09", text);
  assert.deepEqual(texts(r).slice(-1), ["✗ Nyckeltabellen ska innehålla hela nyckeln {A, D}. (B, D) kopplar inte ihop A och D – en join via B ger rader som aldrig fanns (spurious tuples)."]);
  assert.equal(r.count, 1);
  const d = gradeAnswer(byId["norm-12-09"], { cks: [["A", "D"]], roles: {}, nf: "1NF", motivation: {}, text }).fields.decomposition;
  assert.equal(d.ok, false);
});

test("13:9: övningshäftets tre tabeller underkänns med förklaring", () => {
  const text = "R1(A, B, C)\nPK = {A, B}\n\nR2(A, B, D)\nPK = {A, B}\n\nR3(D, C)\nPK = {D}";
  const r = fb("norm-13-09", text);
  assert.equal(texts(r)[0], "✗ R1(A, B, C) behövs inte – C nås redan via {A, B} → D → C. Två tabeller med samma nyckel {A, B} är övernormalisering.");
  assert.equal(r.count, 1);
  const d = gradeAnswer(byId["norm-13-09"], { cks: [["A", "B"]], roles: {}, nf: "2NF", motivation: {}, text }).fields.decomposition;
  assert.equal(d.ok, false);
  assert.equal(fb("norm-13-09", "R1(A, B, D)\nPK = {A, B}\n\nR2(D, C)\nPK = {D}").headline, "Rätt");
});
