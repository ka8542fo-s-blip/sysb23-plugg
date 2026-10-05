// Tentans uppgift 1 som övning: ett av kapitel 6:s diagram och tio
// påståenden, markera alla sanna. Poängregeln är tentans (+5, −3, 0, 25 för
// exakt rätt), andelen sanna ligger under hälften som på tentan, och varje
// påstående bär ett skäl som pekar på sin plats i diagrammet. Påståendena
// är andra än genomgångarnas i kapitel 6, så facit där inte ger svaret här.
// Alla tre är ogranskade mot kursmaterialet (reviewed: false).
//
// Uppgift 4 är övningshäftets uppgift 3: tolv påståenden, varav sju sanna
// enligt häftets facit. Den följer häftet och inte tentans form (tio
// påståenden, under hälften sanna), och är därför undantagen i
// statements.test.mjs. Diagrammet är omritat (modellfiguren stmt-haftet3).
export const statementExercises = [
  {
    id: "stmt-forening", number: 1, title: "Föreningen", diagram: "pastaenden-forening", reviewed: false,
    source: "Egen uppgift på kapitel 6:s diagram, tentans form (uppgift 1)",
    statements: [
      { text: "En förening identifieras av sitt namn.", truth: false, why: "namn under Förening är inte understruket; föreningsNo är identifieraren." },
      { text: "Två lag i olika föreningar kan ha samma lagnummer.", truth: true, why: "Lag är svag och lagNo är streckat understruket: unikt bara inom sin förening. (P1, 1) och (P2, 1) är två olika lag." },
      { text: "En spelare kan vara medlem i flera föreningar.", truth: false, why: "Ratiot bredvid Förening i MedlemI är 1, läst tvärs över: högst en förening per spelare." },
      { text: "En spelare kan spela i flera lag.", truth: true, why: "Ratiot bredvid Lag i SpelarI är N: en spelare får ha många lag." },
      { text: "En spelare måste spela i minst ett lag.", truth: false, why: "Linjen vid Spelare i SpelarI är enkel: en spelare får stå utan lag. Dubbellinjen sitter vid Lag." },
      { text: "En arena måste vara hemmaarena för minst ett lag.", truth: false, why: "Linjen vid Arena i Hemma är enkel. Läs deltagandet vid den egna änden." },
      { text: "Flera lag kan ha samma hemmaarena.", truth: true, why: "Ratiot bredvid Lag i Hemma är N: en arena får ha många lag." },
      { text: "Ett lag måste ha en hemmaarena.", truth: false, why: "Linjen vid Lag i Hemma är enkel: ett lag får sakna arena. Ratiot 1 bredvid Arena säger bara högst en." },
      { text: "En förening kan ha en medlem som inte spelar i något av föreningens lag.", truth: true, why: "Flerstegspåstående: linjen vid Spelare i SpelarI är enkel, så en spelare får sakna lag helt, och inget binder MedlemI till SpelarI." },
      { text: "Ett lag identifieras av sitt lagnummer.", truth: false, why: "Lag är svag: kompletta identiteten är {föreningsNo, lagNo}. Streckad understrykning betyder partiell identifierare." },
    ],
  },
  {
    id: "stmt-bibliotek", number: 2, title: "Biblioteket", diagram: "pastaenden-bibliotek", reviewed: false,
    source: "Egen uppgift på kapitel 6:s diagram, tentans form (uppgift 1)",
    statements: [
      { text: "En bok måste ha minst en författare.", truth: true, why: "Linjen vid Bok i SkrivenAv är dubbel: varje bok deltar minst en gång." },
      { text: "En författare kan ha skrivit flera böcker.", truth: true, why: "Ratiot bredvid Bok i SkrivenAv är N, läst tvärs över: en författare får ha många böcker." },
      { text: "Ett exemplar måste vara utlånat.", truth: false, why: "Linjen vid Exemplar i Lånar är enkel: ett exemplar får stå på hyllan." },
      { text: "Två exemplar av olika böcker kan ha samma exemplarnummer.", truth: true, why: "Exemplar är svag och exNo är partiell identifierare: unikt bara inom sin bok." },
      { text: "En låntagare kan ha flera adepter.", truth: true, why: "Ratiot vid adeptrollen i Fadder är N: en fadder får ha många adepter." },
      { text: "En låntagare kan ha flera faddrar.", truth: false, why: "Ratiot vid fadderrollen är 1: högst en fadder per låntagare." },
      { text: "En bok måste ha minst ett exemplar.", truth: false, why: "Linjen vid Bok i FinnsSom är enkel: en bok får finnas utan exemplar. Dubbellinjen sitter vid Exemplar." },
      { text: "Ett exemplar identifieras av sitt exemplarnummer.", truth: false, why: "Exemplar är svag under Bok: kompletta identiteten är {isbn, exNo}." },
      { text: "En låntagare måste ha lånat minst ett exemplar.", truth: false, why: "Linjen vid Låntagare i Lånar är enkel." },
      { text: "En författare identifieras av sitt namn.", truth: false, why: "namn under Författare är inte understruket; författarNo är identifieraren." },
    ],
  },
  {
    id: "stmt-rederi", number: 3, title: "Rederiet", diagram: "pastaenden-rederi", reviewed: false,
    source: "Egen uppgift på kapitel 6:s diagram, tentans form (uppgift 1)",
    statements: [
      { text: "Ett rederi identifieras av sitt namn.", truth: false, why: "namn under Rederi är inte understruket; rederiNo är identifieraren." },
      { text: "Två fartyg som ägs av olika rederier kan ha samma namn.", truth: true, why: "Fartyg är svag och fartygsnamn är streckat understruket: unikt bara inom sitt rederi." },
      { text: "Ett rederi kan äga flera fartyg.", truth: true, why: "Ratiot bredvid Fartyg i Äger är N: ett rederi får ha många fartyg." },
      { text: "En resa måste göras av exakt ett fartyg.", truth: true, why: "Linjen vid Resa i Gör är dubbel (minst ett) och ratiot bredvid Fartyg är 1 (högst ett)." },
      { text: "Två resor med samma fartyg kan ha samma avgångsdatum.", truth: false, why: "avgångsdatum är Resas partiella identifierare: unikt inom sitt fartyg. Samma fartyg, samma datum är samma resa." },
      { text: "En hamn identifieras av sitt namn.", truth: false, why: "Hamns identifierare är den sammansatta hamnId med delarna namn och land; namn ensamt är inte understruket." },
      { text: "En hamn kan anlöpas av flera resor.", truth: true, why: "Ratiot bredvid Resa i Anlöper är N, läst tvärs över: en hamn får ha många resor." },
      { text: "En resa kan sakna hamn.", truth: false, why: "Linjen vid Resa i Anlöper är dubbel: varje resa anlöper minst en hamn." },
      { text: "Ett fartyg kan ägas av två rederier.", truth: false, why: "Ratiot bredvid Rederi i Äger är 1: högst ett rederi per fartyg." },
      { text: "Rederiets nummer ingår inte i resans identitet.", truth: false, why: "Kedjan Resa → Fartyg → Rederi: Resas kompletta identitet är {rederiNo, fartygsnamn, avgångsdatum}." },
    ],
  },
  {
    id: "stmt-haftet3", number: 4, title: "Employee, Order och Customer", diagram: "stmt-haftet3", reviewed: false,
    source: "Övningshäftet uppgift 3 — sant och falskt ur häftets facit, skälen egna",
    statements: [
      { text: "Två anställda kan ha samma EmployeeNo.", truth: false, why: "EmployeeNo är understruket: identifieraren, unik för varje anställd." },
      { text: "En anställd kan ha flera adresser.", truth: true, why: "Address är en dubbel oval: ett flervärt attribut." },
      { text: "En anställd måste ha minst en adress.", truth: false, why: "Ett flervärt attribut säger att det får finnas flera värden, inte att det måste finnas något. Häftets facit: falskt." },
      { text: "Två anställda kan ha samma adress.", truth: true, why: "Address är inte understruket. Inget i diagrammet hindrar två anställda från att dela adress." },
      { text: "En anställd måste ha en handledare.", truth: true, why: "Linjen vid rollen Supervised_by i den unära Supervise är dubbel: varje anställd deltar som den som handleds." },
      { text: "Två olika anställda kan arbeta på samma kontor.", truth: true, why: "Work är M:N. Ratiot M bredvid Employee, läst tvärs över: ett kontor får ha många anställda." },
      { text: "En anställd måste arbeta på ett kontor.", truth: false, why: "Linjen vid Employee i Work är enkel: en anställd får stå utan kontor." },
      { text: "En kund måste ha kontakt med exakt ett kontor.", truth: true, why: "Linjen vid Customer i Contact är dubbel (minst ett) och ratiot bredvid Office är 1 (högst ett)." },
      { text: "Två kunder kan ha samma adress.", truth: true, why: "Customers identifierare är kombinationen av Address och Name. Address ensam är inte unik." },
      { text: "Två kunder kan ha samma kombination av namn och adress.", truth: false, why: "Kombinationen är identifieraren Identifier: den är unik för varje kund." },
      { text: "Det kan finnas ordrar som ingen kund har lagt.", truth: false, why: "Linjen vid Order i Places är dubbel: varje order läggs av en kund." },
      { text: "En order måste innehålla minst en produkt.", truth: true, why: "Linjen vid Order i Include är dubbel: varje order deltar minst en gång." },
    ],
  },
];
