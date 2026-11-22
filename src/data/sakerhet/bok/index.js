// Bokens kapitel (Stallings & Brown, Computer Security, 5:e uppl.), ett per
// fil: { chapter, topic, glossary, questions, notes }. Listan står i bokens
// ordning; reading.js lägger dem efter föreläsningarna, topics.js och
// questions.js samlar ämnen och frågor. Nytt bokkapitel = en fil här och en
// rad i listan.
import * as bok1 from "./bok1.js";
import * as bok4 from "./bok4.js";
import * as bok6 from "./bok6.js";
import * as bok9 from "./bok9.js";

export const BOOK_CHAPTERS = [bok1, bok4, bok6, bok9];
