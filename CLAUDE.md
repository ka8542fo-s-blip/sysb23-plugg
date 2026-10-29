# CLAUDE.md

Projektets handbok är HANDOFF.md. Läs den innan du ändrar något.

## Grundregel: allt sparas

Allt användaren gör på sidan ska sparas och finnas kvar efter omladdning,
både vad hen klarat (bockar, status, poäng) och vad hen skrivit (svar,
markeringar, val, ritningar). Inget får försvinna utom när användaren själv
nollställer med en uttrycklig knapp.

- Tänk på det i allt du bygger eller ändrar: ny flik, ny övning, nytt fält.
- Spara i localStorage med prefixet `sysb23:` via `lib/storage.js`, och
  skriv vid varje ändring, inte först när något är klart. Egna svar i
  övningsytor går genom `lib/useDrafts.js` (`svar:<id>`).
- En ny övningslista som visar bockar ska in i `data/progressLists.js`
  (testet `progress-lists.test.mjs` vaktar det).
- "Nollställ" tar bort både status och svar för just den uppgiften.
- Innan du säger att något är klart: ladda om sidan i webbläsaren och
  kontrollera att både status och det du skrivit finns kvar.
