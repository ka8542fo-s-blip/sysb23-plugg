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

  // --- Modul 5 -------------------------------------------------------------
  "ea-m5-1": [
    {
      block: "m5-t3",
      text: "ADM:s huvudsakliga syfte är alltså att utveckla och vidareutveckla Enterprise Architecture, inte att utveckla mjukvara.",
      kalla: "modul 5: kärnbudskap och rätt alternativ fråga 1",
    },
  ],
  "ea-m5-1b": [
    {
      block: "m5-t3",
      text: "ADM:s huvudsakliga syfte är alltså att utveckla och vidareutveckla Enterprise Architecture, inte att utveckla mjukvara.",
      kalla: "modul 5: rätt alternativ i den andra frågan 1",
    },
  ],
  "ea-m5-2": [
    { block: "m5-t3", text: "Den stödjer iteration och anpassning.", kalla: "modul 5: rätt alternativ fråga 2, modellsvar fråga 11" },
  ],
  "ea-m5-3": [
    {
      block: "m5-t3",
      text: "Architecture Vision ska skapa en gemensam övergripande bild av den önskade arkitektoniska riktningen och säkra lämplig uppslutning (commitment) från stakeholders.",
      kalla: "modul 5: rätt alternativ fråga 3",
    },
  ],
  "ea-m5-4": [
    {
      block: "m5-t3",
      text: "Arkitekturarbete är iterativt och anpassas efter förändrade krav, nya lärdomar och förändrade omständigheter.",
      kalla: "modul 5: rätt alternativ fråga 4",
    },
  ],
  "ea-m5-5": [
    {
      block: "m5-t3",
      text: "Ett ramverk ger vägledning, men organisationen måste anpassa arkitekturpraktiken till sina förhållanden.",
      kalla: "modul 5: modellsvar fråga 10",
    },
  ],
  "ea-m5-6": [
    { block: "m5-t3", text: "ADM ska inte behandlas som en alltför enkel, linjär vattenfallsprocess.", kalla: "modul 5: kärnbudskap" },
  ],
  "ea-m5-7": [
    { block: "m5-t3", text: "ADM ska inte behandlas som en alltför enkel, linjär vattenfallsprocess.", kalla: "modul 5: kärnbudskap" },
    { block: "m5-t3", text: "Den stödjer iteration och anpassning.", kalla: "modul 5: rätt alternativ fråga 2" },
  ],
  "ea-m5-8": [
    { block: "m5-t3", text: "Arkitekturarbetet kan därför behöva itereras.", kalla: "modul 5: rätt alternativ fråga 4; Word-dokumentet, modul 5 bild 31" },
  ],
  "ea-m5-9": [
    {
      block: "m5-t3",
      text: "TOGAF hjälper oss att ta fram arkitektur, men TOGAF är inte enterprisens arkitektur.",
      kalla: "modul 5: lärandemålen; Word-dokumentet, modul 5 bild 2",
    },
    {
      block: "m5-t3",
      text: "Organisationen måste själv bestämma sina mål, sina principer, sin arkitektur och sitt önskade framtida läge, sin target architecture.",
      kalla: "Word-dokumentet, modul 5 bild 2 och 19",
    },
  ],
  "ea-e5-10": [
    {
      block: "m5-t3",
      text: "Organisationer skiljer sig åt i storlek, governance, regelverk, arkitekturmognad, kultur, affärsmodell och förändringsbehov.",
      kalla: "modul 5: modellsvar fråga 10",
    },
    {
      block: "m5-t3",
      text: "Ett ramverk ger vägledning, men organisationen måste anpassa arkitekturpraktiken till sina förhållanden.",
      kalla: "modul 5: modellsvar fråga 10",
    },
  ],
  "ea-e5-11": [
    {
      block: "m5-t3",
      text: "ADM är ett strukturerat tillvägagångssätt för att utveckla, kommunicera, styra och vidareutveckla Enterprise Architecture.",
      kalla: "modul 5: modellsvar fråga 11",
    },
    {
      block: "m5-t3",
      text: "Den hjälper arkitekten att gå från att förstå arkitekturvisionen via domänarkitektur, möjligheter och migrering till Implementation Governance.",
      kalla: "modul 5: modellsvar fråga 11",
    },
    { block: "m5-t3", text: "Den stödjer iteration och anpassning.", kalla: "modul 5: modellsvar fråga 11" },
  ],
  "ea-e5-12": [
    {
      block: "m5-t3",
      text: "Zachman ger i första hand en ontology och en klassificeringsstruktur för att organisera arkitekturbeskrivningar.",
      kalla: "modul 5: modellsvar fråga 12",
    },
    { block: "m5-t3", text: "Den hjälper till att besvara vilka slags beskrivningar som behövs.", kalla: "modul 5: modellsvar fråga 12" },
    {
      block: "m5-t3",
      text: "TOGAF ger vägledning och en metod för arkitekturutveckling, särskilt genom ADM, alltså ett strukturerat tillvägagångssätt för att utveckla och förvalta arkitektur.",
      kalla: "modul 5: modellsvar fråga 12",
    },
  ],

  // --- Modul 6 -------------------------------------------------------------
  "ea-m6-1": [
    {
      block: "m6-t2",
      text: "Business (Business Architecture) – capabilities, processer, organisation, värde och verksamhetstjänster.",
      kalla: "modul 6: fyra välbekanta domäner",
    },
  ],
  "ea-m6-2": [
    {
      block: "m6-t2",
      text: "Data (Data Architecture) – information, datastrukturer, ägarskap, governance och flöden.",
      kalla: "modul 6: fyra välbekanta domäner",
    },
  ],
  "ea-m6-3": [
    {
      block: "m6-t3",
      text: "Den är alltså en specifikation av hur en view ska konstrueras och vad den ska representera.",
      kalla: "modul 6: rätt alternativ fråga 3, modellsvar fråga 11",
    },
  ],
  "ea-m6-4": [
    {
      block: "m6-t3",
      text: "Olika stakeholders har olika concerns och behöver därför olika information och olika abstraktionsnivåer.",
      kalla: "modul 6: rätt alternativ fråga 4",
    },
  ],
  "ea-m6-5": [
    {
      block: "m6-t3",
      text: "Domänerna är användbara just för att deras relationer kan analyseras.",
      kalla: "modul 6: viktig varning och rätt alternativ fråga 5",
    },
  ],
  "ea-m6-6": [
    {
      block: "m6-t3",
      text: "Hur väl applikationerna stödjer en business capability är till exempel en fråga om relationen mellan Business och Application Architecture.",
      kalla: "modul 6: viktig varning och rätt alternativ fråga 6",
    },
  ],
  "ea-m6-7": [
    {
      block: "m6-t3",
      text: "Därför behövs flera views, och ett enda diagram räcker normalt inte för alla.",
      kalla: "modul 6: viktig varning; Word-dokumentet, modul 6 essä 19",
    },
  ],
  "ea-m6-8": [{ block: "m6-t3", text: "Dessa domäner är inte oberoende silor.", kalla: "modul 6: viktig varning" }],
  "ea-m6-9": [
    { block: "m6-t3", text: "En viewpoint och en view är därför inte samma sak.", kalla: "modul 6: modellsvar fråga 11" },
  ],
  "ea-m6-10": [
    {
      block: "m6-t3",
      text: "Att utforma domänerna oberoende av varandra är därför farligt.",
      kalla: "modul 6: viktig varning, modellsvar fråga 13",
    },
  ],
  "ea-e6-11": [
    {
      block: "m6-t3",
      text: "En viewpoint fastställer hur en view bör hantera en viss concern hos stakeholders.",
      kalla: "modul 6: viktig varning, modellsvar fråga 11",
    },
    {
      block: "m6-t3",
      text: "En view är den faktiska representationen som skapas med hjälp av viewpointen.",
      kalla: "modul 6: modellsvar fråga 11",
    },
  ],
  "ea-e6-12": [
    {
      block: "m6-t3",
      text: "Relationer visar beroenden, effekter och konsekvenser av förändring.",
      kalla: "modul 6: modellsvar fråga 12",
    },
    {
      block: "m6-t3",
      text: "När arkitekten förstår att en business capability beror på vissa processer, viss information, vissa applikationer och viss teknik, går det att bedöma hur en förändring sprider sig genom enterprisen.",
      kalla: "modul 6: modellsvar fråga 12",
    },
  ],
  "ea-e6-13": [
    {
      block: "m6-t3",
      text: "Domänerna hänger ihop och är beroende av varandra",
      kalla: "modul 6: viktig varning, modellsvar fråga 13",
    },
    {
      block: "m6-t3",
      text: "En förändring i verksamheten kan därför kräva förändringar i information, applikationer och teknik.",
      kalla: "modul 6: modellsvar fråga 13",
    },
    {
      block: "m6-t3",
      text: "Det kan skapa inkonsekvenser, dubblerade capabilities och lösningar som inte stödjer verksamhetens mål.",
      kalla: "modul 6: modellsvar fråga 13",
    },
  ],

  // --- Modul 7 -------------------------------------------------------------
  "ea-m7-1": [
    { block: "m7-t3", text: "En capability beskriver vad organisationen har förmåga att göra.", kalla: "modul 7: kärnförklaring" },
  ],
  "ea-m7-2": [
    {
      block: "m7-t3",
      text: "En process beskriver hur arbetet utförs: den är en sekvens eller uppsättning aktiviteter som används för att utföra arbete.",
      kalla: "modul 7: kärnförklaring och rätt alternativ fråga 2",
    },
  ],
  "ea-m7-3": [
    {
      block: "m7-t3",
      text: "Capabilities blir därför en relativt stabil brygga mellan strategisk avsikt och implementering. De kopplar strategin till de organisationsstrukturer och den organisatoriska förändring som krävs för att nå den.",
      kalla: "modul 7: rätt alternativ fråga 3, 7 och 16",
    },
  ],
  "ea-m7-4": [
    {
      block: "m7-t3",
      text: "En capability är en förmåga på verksamhetsnivå, som bolåneutgivning i bankens exempel.",
      kalla: "modul 7: exemplet och rätt alternativ fråga 17",
    },
    {
      block: "m7-t3",
      text: "Servrar, databaser och ett REST API är teknik som kan stödja en capability men inte är den.",
      kalla: "modul 7: rätt alternativ fråga 4 och 17",
    },
  ],
  "ea-m7-5": [
    {
      block: "m7-t3",
      text: "En value stream beskriver hur värde skapas och levereras till en stakeholder.",
      kalla: "modul 7: kärnförklaring",
    },
  ],
  "ea-m7-6": [
    { block: "m7-t3", text: "En capability uttrycker vad organisationen kan göra.", kalla: "modul 7: förklaring fråga 18" },
    {
      block: "m7-t3",
      text: "En process beskriver hur arbetet utförs",
      kalla: "modul 7: kärnförklaring",
    },
  ],
  "ea-m7-7": [
    {
      block: "m7-t3",
      text: "Capabilities blir därför en relativt stabil brygga mellan strategisk avsikt och implementering.",
      kalla: "modul 7: rätt alternativ fråga 3",
    },
  ],
  "ea-m7-8": [
    { block: "m7-t3", text: "Därför går begreppen inte att byta ut mot varandra.", kalla: "modul 7: kärnförklaring, rätt alternativ fråga 6" },
  ],
  "ea-m7-9": [
    {
      block: "m7-t3",
      text: "Capabilities är särskilt användbara eftersom de kan förbli relativt stabila även när organisationsstrukturer och processer förändras.",
      kalla: "modul 7: kärnförklaring",
    },
  ],
  "ea-m7-10": [
    {
      block: "m7-t3",
      text: "Capabilities kan relateras till processer, människor, information och data, applikationer och teknik.",
      kalla: "modul 7: modellsvar fråga 12",
    },
  ],
  "ea-m7-11": [
    {
      block: "m7-t3",
      text: "Capabilities kan relateras till processer, människor, information och data, applikationer och teknik.",
      kalla: "modul 7: modellsvar fråga 12",
    },
  ],
  "ea-e7-11": [
    {
      block: "m7-t3",
      text: "Avdelningarna kan förändras medan de underliggande förmågor som enterprisen behöver finns kvar.",
      kalla: "modul 7: modellsvar på kortsvarsfråga 11",
    },
    {
      block: "m7-t3",
      text: "Capability mapping låter arkitekten fokusera på vad organisationen måste kunna göra i stället för på tillfälliga organisationsstrukturer.",
      kalla: "modul 7: modellsvar på kortsvarsfråga 11",
    },
  ],
  "ea-e7-12": [
    {
      block: "m7-t3",
      text: "Capabilities översätter alltså strategisk avsikt till de förmågor som enterprisen behöver för att nå sina mål",
      kalla: "modul 7: modellsvar fråga 12 och 26",
    },
    {
      block: "m7-t3",
      text: "Capabilities kan relateras till processer, människor, information och data, applikationer och teknik.",
      kalla: "modul 7: modellsvar fråga 12",
    },
    {
      block: "m7-t3",
      text: "På så sätt kan strategiska mål spåras till arkitektur- och investeringsbeslut.",
      kalla: "modul 7: modellsvar fråga 12",
    },
  ],
  "ea-e7-13": [
    { block: "m7-t3", text: "Strategin fastställer önskade resultat och prioriteringar.", kalla: "modul 7: modellsvar fråga 13" },
    {
      block: "m7-t3",
      text: "Av dem följer capabilities som enterprisen måste ha eller stärka.",
      kalla: "modul 7: modellsvar fråga 13",
    },
    {
      block: "m7-t3",
      text: "När strategins prioriteringar är översatta till capabilities kan arkitekten därför analysera vilka människor, processer, vilken information, vilka applikationer och vilken teknik som behövs för att stödja dem.",
      kalla: "modul 7: modellsvar fråga 13 och 26",
    },
    {
      block: "m7-t3",
      text: "Capabilities blir därför en relativt stabil brygga mellan strategisk avsikt och implementering.",
      kalla: "modul 7: modellsvar fråga 13",
    },
  ],
  "ea-m7-14": [
    {
      block: "m7-t3",
      text: "Den beskriver en förmåga som organisationen har eller behöver ha, men den föreskriver inte hur capabilityn implementeras.",
      kalla: "modul 7: lärarens förklaring fråga 14",
    },
  ],
  "ea-m7-15": [
    {
      block: "m7-t3",
      text: "Capabilities ger ofta en relativt stabil bild av organisationens förmåga, medan processer beskriver de sekvenser av aktiviteter som används för att utföra arbete.",
      kalla: "modul 7: lärarens förklaring fråga 15",
    },
  ],
  "ea-m7-16": [
    {
      block: "m7-t3",
      text: "De kopplar strategin till de organisationsstrukturer och den organisatoriska förändring som krävs för att nå den.",
      kalla: "modul 7: rätt alternativ fråga 16",
    },
    {
      block: "m7-t3",
      text: "och som organisationen måste utveckla, upprätthålla eller transformera.",
      kalla: "modul 7: lärarens förklaring fråga 16",
    },
  ],
  "ea-m7-17": [
    {
      block: "m7-t3",
      text: "En capability är en förmåga på verksamhetsnivå, som bolåneutgivning i bankens exempel.",
      kalla: "modul 7: exemplet och rätt alternativ fråga 17",
    },
    {
      block: "m7-t3",
      text: "Ett enskilt steg, som att kunden klickar på en knapp, beskrivs snarare som en del av en process eller ett steg i en value stream.",
      kalla: "modul 7: rätt alternativ fråga 17; processer implementerar delar av value streamen",
    },
  ],
  "ea-m7-18": [
    {
      block: "m7-t3",
      text: "Sekvensen av aktiviteter som används för att utföra arbetet är i första hand ett processperspektiv.",
      kalla: "modul 7: lärarens förklaring fråga 18",
    },
  ],
  "ea-m7-19": [
    {
      block: "m7-t3",
      text: "En capability map är en arkitekturrepresentation. Den ger ett viktigt verksamhetsperspektiv, men den beskriver inte hela enterprisen och är inte i sig en fullständig Enterprise Architecture.",
      kalla: "modul 7: lärarens förklaring fråga 19",
    },
  ],
  "ea-m7-20": [
    {
      block: "m7-tillagg-1",
      text: "Governance betyder inte nödvändigtvis att varje arkitekturbeslut måste godkännas centralt.",
      kalla: "modul 7: modellsvar fråga 27; modul 8: text och fråga 7",
    },
  ],
  "ea-m7-21": [
    {
      block: "m7-tillagg-1",
      text: "Principerna kan då fungera som guardrails.",
      kalla: "modul 7: modellsvar fråga 27; modul 8: modellsvar fråga 8",
    },
  ],
  "ea-m7-22": [
    {
      block: "m7-tillagg-1",
      text: "Arkitektur innebär ofta trade-offs snarare än perfekta lösningar.",
      kalla: "modul 8: lärandemålen och fråga 4; Word-dokumentet om trade-offs",
    },
  ],
  "ea-e7-23": [
    {
      block: "m7-t3",
      text: "Organisationsstrukturer kan förändras ofta genom omorganisationer, sammanslagningar och omstruktureringar.",
      kalla: "modul 7: modellsvar fråga 23",
    },
    {
      block: "m7-t3",
      text: "Capabilities ger ofta en relativt stabil bild av organisationens förmåga",
      kalla: "modul 7: modellsvar fråga 23, lärarens förklaring fråga 15",
    },
    {
      block: "m7-t3",
      text: "Det hjälper också till att identifiera capability gaps och prioritera transformation oberoende av nuvarande organisatoriska gränser.",
      kalla: "modul 7: modellsvar fråga 23",
    },
  ],
  "ea-e7-24": [
    {
      block: "m7-tillagg-1",
      text: 'Ett exempel är principen "Information är en tillgång för hela enterprisen".',
      kalla: "modul 7: modellsvar fråga 24; modul 8: principexemplet",
    },
    {
      block: "m7-tillagg-1",
      text: "Den kan påverka beslut om dataägarskap, integration, datakvalitet, säkerhet och applikationsdesign, och den ger en enhetlig riktning för beslut som rör enterprisens information.",
      kalla: "modul 7: modellsvar fråga 24",
    },
  ],
  "ea-e7-25": [
    {
      block: "m7-t3",
      text: "Ett exempel är ett företag som omorganiserar sin marknadsavdelning tre gånger på fem år men hela tiden behöver kundinsikt, kampanjhantering och marknadsanalys.",
      kalla: "modul 7: fråga 25 (lärarens exempel)",
    },
    {
      block: "m7-t3",
      text: "Organisationen kan ändra vem som utför en capability utan att capabilityn i sig försvinner.",
      kalla: "modul 7: modellsvar fråga 25",
    },
    {
      block: "m7-t3",
      text: "Capabilities är särskilt användbara eftersom de kan förbli relativt stabila även när organisationsstrukturer och processer förändras.",
      kalla: "modul 7: modellsvar fråga 25",
    },
  ],
  "ea-e7-26": [
    {
      block: "m7-t3",
      text: "Capabilities översätter alltså strategisk avsikt till de förmågor som enterprisen behöver för att nå sina mål",
      kalla: "modul 7: modellsvar fråga 26",
    },
    {
      block: "m7-t3",
      text: "När strategins prioriteringar är översatta till capabilities kan arkitekten därför analysera vilka människor, processer, vilken information, vilka applikationer och vilken teknik som behövs för att stödja dem.",
      kalla: "modul 7: modellsvar fråga 26",
    },
    {
      block: "m7-t3",
      text: "Capabilities blir därför en relativt stabil brygga mellan strategisk avsikt och implementering.",
      kalla: "modul 7: modellsvar fråga 26",
    },
  ],
  "ea-e7-27": [
    {
      block: "m7-tillagg-1",
      text: "Effektiv governance fastställer tydliga principer, decision rights och gränser och ger samtidigt team lämplig autonomi.",
      kalla: "modul 7: modellsvar fråga 27",
    },
    {
      block: "m7-tillagg-1",
      text: "I stället för att kräva centralt godkännande av varje beslut kan governance rikta uppmärksamheten mot betydande risker, beroenden tvärs över enterprisen och strategiska beslut.",
      kalla: "modul 7: modellsvar fråga 27",
    },
    {
      block: "m7-tillagg-1",
      text: "Team kan fatta många beslut själva så länge de håller sig inom de överenskomna gränserna, och därför kan de arbeta snabbt.",
      kalla: "modul 7: modellsvar fråga 27",
    },
  ],

  // --- Modul 8 -------------------------------------------------------------
  "ea-m8-1": [
    {
      block: "m8-t2",
      text: "En architecture principle är en generell regel eller riktlinje som vägleder arkitekturbeslut.",
      kalla: "modul 8: rätt alternativ fråga 1",
    },
  ],
  "ea-m8-2": [
    {
      block: "m8-t3",
      text: "Governance för arkitektur handlar om att fastställa decision rights, ansvarsskyldighet och lämpliga kontroller för arkitekturbeslut.",
      kalla: "modul 8: rätt alternativ fråga 2",
    },
  ],
  "ea-m8-3": [
    {
      block: "m8-t3",
      text: "Principerna fungerar på så sätt som guardrails inom vilka team kan fatta beslut mer självständigt.",
      kalla: "modul 8: rätt alternativ fråga 3, modellsvar fråga 8",
    },
  ],
  "ea-m8-4": [
    {
      block: "m8-t3",
      text: "Ett exempel är flexibilitet kontra standardisering: standardisering kan ge effektivitet men mindre flexibilitet.",
      kalla: "modul 8: rätt alternativ fråga 4; Word-dokumentet om trade-offs",
    },
  ],
  "ea-m8-5": [
    {
      block: "m8-t3",
      text: "Governance ska i första hand åstadkomma lämpligt beslutsfattande, ansvarsskyldighet och kontroll, inte maximal byråkrati.",
      kalla: "modul 8: rätt alternativ fråga 5",
    },
  ],
  "ea-m8-6": [
    {
      block: "m8-t2",
      text: "Dess huvudsakliga syfte är att ge enhetlig vägledning för arkitektoniska beslut.",
      kalla: "modul 8: rätt alternativ fråga 6",
    },
  ],
  "ea-m8-7": [
    {
      block: "m8-t3",
      text: "God governance kräver alltså inte nödvändigtvis godkännande av varje tekniskt beslut.",
      kalla: "modul 8: modellsvar fråga 8; modul 7: modellsvar fråga 27",
    },
  ],
  "ea-e8-8": [
    { block: "m8-t3", text: "Tydliga principer ger återanvändbar vägledning för beslut.", kalla: "modul 8: modellsvar fråga 8" },
    {
      block: "m8-t3",
      text: "Team kan fatta många beslut självständigt, utan att be om godkännande varje gång, så länge de håller sig inom de överenskomna gränserna.",
      kalla: "modul 8: modellsvar fråga 8",
    },
    {
      block: "m8-t3",
      text: "De kan öka enhetligheten och beslutshastigheten samtidigt som lämpliga beslut delegeras till leveransteam.",
      kalla: "modul 8: modellsvar fråga 8 (meningarna i rätt ordning)",
    },
    {
      block: "m8-t3",
      text: "Arkitekturen bör fokusera på betydande risker och beroenden i stället för att kräva centralt godkännande av varje beslut.",
      kalla: "modul 8: modellsvar fråga 8; modul 7: modellsvar fråga 27",
    },
  ],
};

// Frågor som inte går att täcka med lärarens material. Tom från början;
// varje id här måste stå i rapporten till Kasper.
export const SAKNAS_GODKANDA = [];
