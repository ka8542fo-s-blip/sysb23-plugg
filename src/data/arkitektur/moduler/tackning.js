// Täckningskartan för fliken Moduler (Kaspers beslut 23 nov 2026): för varje
// fråga och fritextfråga i m01–m12 pekar den ut meningen i modulens svenska
// text som bär svaret, och var innehållet kommer ifrån. Filen används bara av
// moduler.test.mjs och importeras inte av appen.
//
// - `block`: ett textblock före frågan i samma modul (modul 12 får också
//   peka på text i modul 1–11, eftersom den repeterar hela kursen).
// - `text`: står ordagrant i blockets `sv` när markdown är borttagen.
// - `kalla`: lärarens material som meningen bygger på. "Word-dokumentet"
//   är lärarens råmaterial; det nämns aldrig på sidan.
//
// Nycklarna är id:t i modulfilen: frågans id (ea-mN-…) och fritextens
// essä-id (ea-eN-…).
export const TACKNING = {
  // --- Modul 1 -------------------------------------------------------------
  "ea-m1-ex": [
    {
      block: "m1-t4",
      text: "Avgränsningen fastställer vilka delar av enterprisen och dess omgivning som är relevanta för arkitekturproblemet.",
      kalla: "modul 1: lärarens förklaring och rätt alternativ i exempelfrågan och fråga 2",
    },
  ],
  "ea-m1-1": [
    {
      block: "m1-t3",
      text: "En enterprise är vilken samling som helst av organisationer, organisatoriska enheter eller capabilities som har en gemensam uppsättning mål.",
      kalla: "modul 1: kärnbudskap",
    },
  ],
  "ea-m1-2": [
    {
      block: "m1-t4",
      text: "Avgränsningen fastställer vilka delar av enterprisen och dess omgivning som är relevanta för arkitekturproblemet.",
      kalla: "modul 1: rätt alternativ fråga 2",
    },
  ],
  "ea-m1-3": [
    {
      block: "m1-t3",
      text: "Ett affärsresultat kan bero på partner, leverantörer, tillsynsmyndigheter och andra externa aktörer.",
      kalla: "modul 1: rätt alternativ fråga 3",
    },
    {
      block: "m1-t3",
      text: "Då kan enterprisen sträcka sig utanför den juridiska organisationens gränser.",
      kalla: "modul 1: modellsvar fråga 10",
    },
  ],
  "ea-m1-4": [
    {
      block: "m1-t4",
      text: 'Därför frågar arkitekten: "Vilka delar av omgivningen är relevanta för att nå de arkitektoniska målen?"',
      kalla: "modul 1: rätt alternativ fråga 4",
    },
  ],
  "ea-m1-5": [
    {
      block: "m1-t4",
      text: "Gränserna för en enterprise är därför inte alltid fasta, och de är inte alltid desamma som organisationens gränser.",
      kalla: "modul 1: lärarens förklaring (Volvoexemplet)",
    },
    {
      block: "m1-t4",
      text: "De beror delvis på syftet med och avgränsningen av arkitekturarbetet.",
      kalla: "modul 1: lärarens förklaring och rätt alternativ fråga 5",
    },
  ],
  "ea-m1-6": [
    {
      block: "m1-t3",
      text: "En enterprise behöver inte vara en enda juridisk organisation.",
      kalla: "modul 1: kärnbudskap; Word-dokumentet, lärarens facit till modul 1",
    },
  ],
  "ea-m1-7": [
    {
      block: "m1-t4",
      text: "Enterprise Architecture kan alltså omfatta relationer med externa partner och ekosystem.",
      kalla: "modul 1: modellsvar fråga 9",
    },
  ],
  "ea-m1-8": [
    {
      block: "m1-t4",
      text: "Blir avgränsningen för snäv kan viktiga beroenden missas.",
      kalla: "Word-dokumentet: lärarens modellsvar till essä 12 i modul 1",
    },
    {
      block: "m1-t4",
      text: "Att definiera avgränsningen är därför i sig en arkitektonisk concern.",
      kalla: "modul 1: lärarens förklaring (avgränsningen bestäms av problemet)",
    },
  ],
  "ea-e1-9": [
    {
      block: "m1-t4",
      text: "Digitala produkter och tjänster är ofta beroende av organisationer utanför den juridiska enterprisen.",
      kalla: "modul 1: modellsvar fråga 9",
    },
    {
      block: "m1-t4",
      text: "Kunder, leverantörer, tillsynsmyndigheter, plattformar och teknikleverantörer kan alla bidra till ett affärsresultat.",
      kalla: "modul 1: modellsvar fråga 9",
    },
    {
      block: "m1-t4",
      text: "De capabilities som krävs för att leverera resultatet kan alltså sträcka sig utanför en organisations juridiska gränser.",
      kalla: "modul 1: exempelsvaret i inledningen",
    },
    {
      block: "m1-t4",
      text: "Arkitekten behöver därför avgöra vilka externa relationer som är relevanta för det arkitektoniska målet.",
      kalla: "modul 1: modellsvar fråga 9",
    },
  ],
  "ea-e1-10": [
    {
      block: "m1-t3",
      text: "Enterprise Architecture handlar om en enterprises struktur och utveckling i förhållande till dess mål.",
      kalla: "modul 1: modellsvar fråga 10",
    },
    {
      block: "m1-t3",
      text: "Då kan enterprisen sträcka sig utanför den juridiska organisationens gränser.",
      kalla: "modul 1: modellsvar fråga 10",
    },
    {
      block: "m1-t3",
      text: "Den som bara ser till företaget kan därför få en ofullständig bild av arkitekturen.",
      kalla: "modul 1: modellsvar fråga 10",
    },
    {
      block: "m1-t4",
      text: "Arkitekten fastställer avgränsningen utifrån verksamhetsproblemet och det önskade resultatet.",
      kalla: "modul 1: modellsvar fråga 10",
    },
  ],

  // --- Modul 2 -------------------------------------------------------------
  "ea-m2-1": [
    {
      block: "m2-t2",
      text: "Arkitektur är den grundläggande organisationen av något. Den omfattar delarna (komponenterna), relationerna mellan dem, principerna och hur helheten utvecklas över tid.",
      kalla: "modul 2: kärnbegrepp",
    },
  ],
  "ea-m2-2": [
    {
      block: "m2-t3",
      text: "Arkitektur handlar också om relationer, beroenden, ansvar, principer, begränsningar och syfte.",
      kalla: "modul 2: modellsvar på essäfrågan utan nummer",
    },
    {
      block: "m2-t3",
      text: "Att förstå relationerna gör det möjligt för arkitekten att bedöma konsekvenserna av en förändring.",
      kalla: "modul 2: modellsvar på essäfrågan utan nummer",
    },
  ],
  "ea-m2-3": [
    {
      block: "m2-t3",
      text: "Abstraktion är användbar för att dölja irrelevanta detaljer, så att en fråga kan förstås på en lämplig nivå.",
      kalla: "modul 2: rätt alternativ fråga 3, modellsvar fråga 10",
    },
  ],
  "ea-m2-4": [
    {
      block: "m2-t3",
      text: "Arkitektur fastställer den grundläggande organisationen: relationerna, principerna och begränsningarna.",
      kalla: "modul 2: modellsvar fråga 11",
    },
    {
      block: "m2-t3",
      text: "Implementering förverkligar designen i praktiken, i en driftsmiljö.",
      kalla: "modul 2: modellsvar fråga 11",
    },
    {
      block: "m2-t3",
      text: "arkitekturen gäller den grundläggande organisationen, och implementeringen förverkligar den organisationen i praktiken.",
      kalla: "modul 2: rätt alternativ fråga 4",
    },
  ],
  "ea-m2-5": [
    {
      block: "m2-t3",
      text: 'Ett exempel på en arkitektonisk fråga är: "Vilka beroenden finns mellan en kritisk business capability och de applikationer som stödjer den?"',
      kalla: "modul 2: kärnförklaring och rätt alternativ fråga 5",
    },
  ],
  "ea-m2-6": [
    {
      block: "m2-t2",
      text: "Ett diagram är en representation av arkitekturen, alltså en bild av den. Diagrammet och arkitekturen är inte samma sak.",
      kalla: "modul 2: kärnbegrepp",
    },
  ],
  "ea-m2-7": [
    {
      block: "m2-t3",
      text: "Arkitektur är inte bara en samling komponenter.",
      kalla: "modul 2: kärnförklaring",
    },
    {
      block: "m2-t3",
      text: "Den handlar särskilt om relationer och konsekvenser.",
      kalla: "modul 2: kärnförklaring",
    },
  ],
  "ea-m2-8": [
    {
      block: "m2-t3",
      text: "En arkitektur behöver därför inte beskriva varje implementeringsdetalj.",
      kalla: "modul 2: modellsvar fråga 10 och 11 (abstraktion; design tar fram detaljerna)",
    },
  ],
  "ea-m2-9": [
    {
      block: "m2-t3",
      text: "Arkitektur och implementering är alltså inte samma sak:",
      kalla: "modul 2: modellsvar fråga 11",
    },
  ],
  "ea-e2-10": [
    {
      block: "m2-t3",
      text: "Enterprise Architecture hanterar en mycket komplex verklighet.",
      kalla: "modul 2: modellsvar fråga 10",
    },
    {
      block: "m2-t3",
      text: "Vilka detaljer som är relevanta beror på vilken concern man har.",
      kalla: "modul 2: modellsvar fråga 10",
    },
    {
      block: "m2-t3",
      text: "Därför kan olika stakeholders arbeta med olika nivåer och ändå tala om samma enterprise.",
      kalla: "modul 2: modellsvar fråga 10",
    },
  ],
  "ea-e2-x": [
    {
      block: "m2-t3",
      text: "Komponenterna ensamma förklarar inte hur enterprisen fungerar.",
      kalla: "modul 2: modellsvar på essäfrågan utan nummer",
    },
    {
      block: "m2-t3",
      text: "Arkitektur handlar också om relationer, beroenden, ansvar, principer, begränsningar och syfte.",
      kalla: "modul 2: modellsvar på essäfrågan utan nummer",
    },
    {
      block: "m2-t3",
      text: "Att förstå relationerna gör det möjligt för arkitekten att bedöma konsekvenserna av en förändring.",
      kalla: "modul 2: modellsvar på essäfrågan utan nummer",
    },
  ],
  "ea-e2-11": [
    {
      block: "m2-t3",
      text: "Arkitektur fastställer den grundläggande organisationen: relationerna, principerna och begränsningarna.",
      kalla: "modul 2: modellsvar fråga 11",
    },
    {
      block: "m2-t3",
      text: "Design tar fram mer detaljerade lösningar inom de ramar som arkitekturen sätter.",
      kalla: "modul 2: modellsvar fråga 11",
    },
    {
      block: "m2-t3",
      text: "Implementering förverkligar designen i praktiken, i en driftsmiljö.",
      kalla: "modul 2: modellsvar fråga 11",
    },
    {
      block: "m2-t3",
      text: "Skillnaderna mellan de tre är inte absoluta, men de motsvarar olika nivåer av beslutsfattande och abstraktion.",
      kalla: "modul 2: modellsvar fråga 11",
    },
  ],

  // --- Modul 3 -------------------------------------------------------------
  "ea-m3-1": [
    {
      block: "m3-t2",
      text: "Enterprise Architecture kopplar alltså verksamhetens mål till enterprisens struktur och utveckling.",
      kalla: "modul 3: kärndefinition och rätt alternativ fråga 1",
    },
  ],
  "ea-m3-2": [
    {
      block: "m3-t2",
      text: "Den har en bredare avgränsning som omfattar hela enterprisen: affärsstrategi, capabilities, organisation, information, applikationer, teknik och relationerna mellan dem.",
      kalla: "modul 3: modellsvar fråga 10",
    },
  ],
  "ea-m3-3": [
    {
      block: "m3-t2",
      text: "Därför bör stora arkitekturbeslut normalt styras av verksamhetens mål och stakeholders concerns.",
      kalla: "modul 3: rätt alternativ fråga 3",
    },
  ],
  "ea-m3-4": [
    {
      block: "m3-t2",
      text: "En enterprise måste ständigt anpassa sig till strategi, marknader, teknik och andra förändringar i omvärlden.",
      kalla: "modul 3: rätt alternativ fråga 4",
    },
  ],
  "ea-m3-5": [
    {
      block: "m3-t2",
      text: "Därför kan Enterprise Architecture stödja beslutsfattande, transformation och governance.",
      kalla: "modul 3: rätt alternativ fråga 5",
    },
  ],
  "ea-m3-6": [
    {
      block: "m3-t2",
      text: "Tekniken kan vara en del av svaret, men den är inte nödvändigtvis utgångspunkten.",
      kalla: "modul 3: kärndefinition; Word-dokumentet avsnitt 3.1",
    },
    {
      block: "m3-t2",
      text: "Enterprise Architecture handlar alltså inte i första hand om teknik.",
      kalla: "modul 3: kärndefinition",
    },
  ],
  "ea-m3-7": [
    {
      block: "m3-t2",
      text: "Arkitekturen blir på så sätt en brygga mellan strategisk avsikt och implementering, och den kan koppla strategi till organisatorisk förändring.",
      kalla: "modul 3: modellsvar fråga 11",
    },
  ],
  "ea-m3-8": [
    {
      block: "m3-t2",
      text: "IT architecture kan därför ses som en del av det bredare Enterprise Architecture-landskapet.",
      kalla: "modul 3: modellsvar fråga 10",
    },
  ],
  "ea-m3-9": [
    {
      block: "m3-t2",
      text: "Den är mer än dokumentation eller en förteckning över IT-system, och den handlar inte i första hand om att dokumentera IT-system.",
      kalla: "modul 3: rätt alternativ fråga 5; Word-dokumentet avsnitt 3.3",
    },
    {
      block: "m3-t2",
      text: "Att en organisation har fin dokumentation av sina system betyder inte nödvändigtvis att den har en Enterprise Architecture som fungerar.",
      kalla: "Word-dokumentet avsnitt 3.3",
    },
  ],
  "ea-e3-10": [
    {
      block: "m3-t2",
      text: 'IT architecture frågar: "Hur ska vår teknik vara strukturerad?" Den fokuserar i första hand på informationsteknikens strukturer och lösningar.',
      kalla: "modul 3: kärndefinition och modellsvar fråga 10",
    },
    {
      block: "m3-t2",
      text: "Den har en bredare avgränsning som omfattar hela enterprisen: affärsstrategi, capabilities, organisation, information, applikationer, teknik och relationerna mellan dem.",
      kalla: "modul 3: modellsvar fråga 10",
    },
    {
      block: "m3-t2",
      text: "IT architecture kan därför ses som en del av det bredare Enterprise Architecture-landskapet.",
      kalla: "modul 3: modellsvar fråga 10",
    },
  ],
  "ea-e3-11": [
    {
      block: "m3-t2",
      text: "Enterprise Architecture översätter strategiska mål till konsekvenser för arkitekturen.",
      kalla: "modul 3: modellsvar fråga 11",
    },
    {
      block: "m3-t2",
      text: "Strategin identifierar de resultat man vill nå.",
      kalla: "modul 3: modellsvar fråga 11",
    },
    {
      block: "m3-t2",
      text: "Arkitekturen identifierar de capabilities, strukturer, den information, de applikationer, den teknik och de organisationsförändringar som krävs för att nå dem.",
      kalla: "modul 3: modellsvar fråga 11",
    },
    {
      block: "m3-t2",
      text: "Arkitekturen blir på så sätt en brygga mellan strategisk avsikt och implementering",
      kalla: "modul 3: modellsvar fråga 11",
    },
  ],

  // --- Modul 4 -------------------------------------------------------------
  "ea-m4-1": [
    {
      block: "m4-t1",
      text: "Zachman-ramverket förstås bäst som en ontology och ett klassificeringsschema för beskrivningar av en enterprise.",
      kalla: "modul 4: lärarens text efter lärandemålen",
    },
  ],
  "ea-m4-2": [{ block: "m4-t2", text: "How? — processer/funktioner", kalla: "modul 4: de sex frågorna" }],
  "ea-m4-3": [{ block: "m4-t2", text: "Why? — motivation/mål", kalla: "modul 4: de sex frågorna" }],
  "ea-m4-4": [
    {
      block: "m4-t2",
      text: "Raderna representerar i första hand olika perspektiv eller abstraktionsnivåer.",
      kalla: "modul 4: rätt alternativ fråga 4; Word-dokumentet avsnitt 4.3",
    },
  ],
  "ea-m4-5": [
    {
      block: "m4-t3",
      text: "Det föreskriver inte en sekvens av aktiviteter för att utveckla arkitektur.",
      kalla: "modul 4: modellsvar fråga 11",
    },
  ],
  "ea-m4-6": [
    {
      block: "m4-t3",
      text: "Raderna är inga projektfaser, och ramverket föreskriver ingen bestämd ordning att fylla i cellerna.",
      kalla: "Word-dokumentet: lärarens facit till modul 4 (structure ≠ sequence)",
    },
    {
      block: "m4-t3",
      text: "Det föreskriver inte en sekvens av aktiviteter för att utveckla arkitektur.",
      kalla: "modul 4: modellsvar fråga 11",
    },
  ],
  "ea-m4-7": [
    {
      block: "m4-t2",
      text: "Kolumnerna är sex interrogatives, alltså grundläggande frågor om enterprisen:",
      kalla: "modul 4: de sex frågorna; Word-dokumentet avsnitt 4.2",
    },
  ],
  "ea-m4-8": [
    {
      block: "m4-t2",
      text: "Därför kan Zachman hjälpa till att visa var beskrivningar saknas eller är ofullständiga.",
      kalla: "Word-dokumentet: lärarens facit till modul 4, fråga 6 och 12",
    },
  ],
  "ea-e4-9": [
    {
      block: "m4-t3",
      text: "En metodik föreskriver aktiviteter, processer eller steg för att åstadkomma något.",
      kalla: "modul 4: modellsvar fråga 9",
    },
    {
      block: "m4-t3",
      text: "En ontology fastställer begrepp och relationer som beskriver vad som finns inom en domän och hur det kan klassificeras.",
      kalla: "modul 4: modellsvar fråga 9",
    },
    {
      block: "m4-t3",
      text: "Zachman är i första hand en ontology, en klassificeringsstruktur, snarare än en utvecklingsmetodik.",
      kalla: "modul 4: modellsvar fråga 9",
    },
  ],
  "ea-e4-10": [
    {
      block: "m4-t3",
      text: "Ramverket klassificerar och organiserar beskrivningar av en enterprise utifrån perspektiv och interrogatives.",
      kalla: "modul 4: modellsvar fråga 10",
    },
    {
      block: "m4-t3",
      text: "TOGAF ger vägledning och ett tillvägagångssätt för att utveckla arkitektur, särskilt genom ADM (Architecture Development Method).",
      kalla: "modul 4: modellsvar fråga 10",
    },
    {
      block: "m4-t3",
      text: "TOGAF ger alltså en metod för att utveckla och styra arkitektur. Zachman hjälper i stället till att organisera vilka slags beskrivningar som kan behövas.",
      kalla: "modul 4: modellsvar fråga 10",
    },
    {
      block: "m4-t3",
      text: "Ramverken svarar på olika frågor och kan därför komplettera varandra.",
      kalla: "modul 4: modellsvar fråga 10",
    },
  ],
  "ea-e4-11": [
    {
      block: "m4-t3",
      text: "En metodik föreskriver aktiviteter, processer eller steg för att åstadkomma något.",
      kalla: "modul 4: modellsvar fråga 11",
    },
    {
      block: "m4-t3",
      text: "Ramverket klassificerar och organiserar beskrivningar av en enterprise utifrån perspektiv och interrogatives.",
      kalla: "modul 4: modellsvar fråga 11",
    },
    {
      block: "m4-t3",
      text: "Det föreskriver inte en sekvens av aktiviteter för att utveckla arkitektur.",
      kalla: "modul 4: modellsvar fråga 11",
    },
  ],
};

// Frågor som inte går att täcka med lärarens material. Tom från början;
// varje id här måste stå i rapporten till Kasper.
export const SAKNAS_GODKANDA = [];
