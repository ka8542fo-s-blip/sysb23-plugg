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

  // --- Modul 9 -------------------------------------------------------------
  "ea-e9-tankande": [
    {
      block: "m9-t2",
      text: "En arkitekt accepterar inte en diagnos direkt. Det som ser ut som problemet kan vara ett symptom.",
      kalla: "modul 9: arkitektens tänkande; modul 12: arkitektens test och scenariofråga 2",
    },
    {
      block: "m9-t2",
      text: "Innan arkitekten föreslår en lösning försöker hen förstå vilka business capabilities, informationsbehov och affärsresultat som berörs, vilket strategiskt mål som ligger bakom, vilka beroenden som finns och vad det kostar och vilka risker det finns.",
      kalla: "modul 9: möjliga svar i arkitektens tänkande",
    },
    {
      block: "m9-t2",
      text: "den kan vara ett problem, men applikationerna kan också vara avsiktligt olika.",
      kalla: "modul 9: möjliga svar i arkitektens tänkande",
    },
  ],
  "ea-m9-1": [
    {
      block: "m9-t2",
      text: "Agile-arkitektur utvecklas iterativt och kan utvecklas inkrementellt, genom feedback och lärande från leveransen, och ger samtidigt lämplig riktning och guardrails.",
      kalla: "modul 9: rätt alternativ fråga 1",
    },
  ],
  "ea-m9-2": [
    {
      block: "m9-t2",
      text: "Just-enough architecture betyder endast den arkitektur som behövs för att ge lämplig riktning och hantera betydande risker och beroenden.",
      kalla: "modul 9: rätt alternativ fråga 2",
    },
  ],
  "ea-m9-3": [
    {
      block: "m9-t2",
      text: "Krav, teknik och affärsförutsättningar förändras.",
      kalla: "modul 9: rätt alternativ fråga 3",
    },
  ],
  "ea-m9-4": [
    {
      block: "m9-t2",
      text: "En guardrail är en gräns inom vilken team kan fatta beslut självständigt. Exempel är säkerhetskrav, datapolicyer, integrationsprinciper, regulatoriska krav och godkända arkitekturmönster.",
      kalla: "Word-dokumentet: lärarens modellsvar om guardrails (modul 8)",
    },
  ],
  "ea-m9-5": [
    {
      block: "m9-t2",
      text: "Architecture debt är ackumulerade arkitektoniska kompromisser som kan skapa framtida kostnader, risker eller begränsningar.",
      kalla: "modul 9: rätt alternativ fråga 5",
    },
  ],
  "ea-m9-6": [
    {
      block: "m9-t2",
      text: "Agile betyder alltså inte att arkitekturen ska överges.",
      kalla: "modul 9: kärnförklaring",
    },
  ],
  "ea-m9-7": [
    {
      block: "m9-t2",
      text: "Agile-arkitektur utvecklas iterativt och kan utvecklas inkrementellt",
      kalla: "modul 9: kärnförklaring (inkrementell leverans) och fråga 7",
    },
  ],
  "ea-m9-8": [
    {
      block: "m9-t2",
      text: "Att centralisera varje arkitekturbeslut är alltså inte nödvändigt för agilitet.",
      kalla: "modul 9: modellsvar fråga 9 och 10",
    },
  ],
  "ea-e9-9": [
    {
      block: "m9-t2",
      text: "Arkitekten kan etablera principer, standarder, guardrails och decision rights, så att team kan fatta rutinbeslut självständigt.",
      kalla: "modul 9: modellsvar fråga 9",
    },
    {
      block: "m9-t2",
      text: "Arkitekten bör då fokusera på betydande beroenden mellan team, strategiska beslut, systemrisker och frågor som kräver samordning på enterprise-nivå.",
      kalla: "modul 9: modellsvar fråga 9",
    },
    {
      block: "m9-t2",
      text: "Arkitekturen bör utvecklas med lärandet och fokusera på beslut med betydande påverkan på enterprisen.",
      kalla: "modul 9: modellsvar fråga 9",
    },
  ],
  "ea-e9-10": [
    {
      block: "m9-t2",
      text: "Enterprise Architecture bör därför ge riktning, principer, återanvändbara capabilities och guardrails och samtidigt ge leveransteamen lämplig autonomi.",
      kalla: "modul 9: modellsvar fråga 10",
    },
    {
      block: "m9-t2",
      text: "Arkitekturen bör utvecklas med lärandet och fokusera på beslut med betydande påverkan på enterprisen.",
      kalla: "modul 9: modellsvar fråga 10",
    },
    {
      block: "m9-t2",
      text: "Det möjliggör agilitet samtidigt som sammanhållningen bevaras och systemrisker hanteras.",
      kalla: "modul 9: modellsvar fråga 10",
    },
  ],

  // --- Modul 10 ------------------------------------------------------------
  "ea-m10-1": [
    {
      block: "m10-t2",
      text: "Digitization – att omvandla analog information till digital form, till exempel att skanna pappersdokument.",
      kalla: "modul 10: kärnförklaring; Word-dokumentet, modul 10 avsnitt 5",
    },
  ],
  "ea-m10-2": [
    {
      block: "m10-t2",
      text: "Digitalization – att använda digitala tekniker för att förbättra befintliga aktiviteter och processer, till exempel att automatisera ett befintligt godkännandeflöde.",
      kalla: "modul 10: kärnförklaring; Word-dokumentet, modul 10 avsnitt 5",
    },
  ],
  "ea-m10-3": [
    {
      block: "m10-t2",
      text: "Den kan förändra affärsmodeller, kundupplevelser och operating modeln.",
      kalla: "modul 10: rätt alternativ fråga 3, fråga 7",
    },
  ],
  "ea-m10-4": [
    {
      block: "m10-t2",
      text: "Att flytta teknik förändrar inte nödvändigtvis hur enterprisen skapar eller levererar värde. En molnmigrering är därför inte automatiskt digital transformation.",
      kalla: "modul 10: rätt alternativ fråga 4",
    },
  ],
  "ea-m10-5": [
    {
      block: "m10-t2",
      text: "Ett initiativ för digital transformation bör drivas av ett tydligt förstått affärsresultat och strategiskt mål",
      kalla: "modul 10: rätt alternativ fråga 5",
    },
  ],
  "ea-m10-6": [
    {
      block: "m10-t2",
      text: "Digital transformation är inte i grunden en teknikfråga, utan handlar om hur enterprisen skapar, levererar och fångar värde.",
      kalla: "modul 10: kärnförklaring; Word-dokumentet, modul 10",
    },
  ],
  "ea-m10-7": [
    {
      block: "m10-t2",
      text: "Den kan förändra affärsmodeller, kundupplevelser och operating modeln.",
      kalla: "modul 10: rätt alternativ fråga 3",
    },
  ],
  "ea-m10-8": [
    {
      block: "m10-t2",
      text: "Artificiell intelligens kan vara en enabler i vissa fall, men den krävs inte för varje digital transformation.",
      kalla: "Word-dokumentet, modul 10 (AI may be an enabler … not a requirement)",
    },
  ],
  "ea-e10-9": [
    {
      block: "m10-t2",
      text: "Digitization – att omvandla analog information till digital form",
      kalla: "modul 10: kärnförklaring, modellsvar fråga 9",
    },
    {
      block: "m10-t2",
      text: "Digitalization – att använda digitala tekniker för att förbättra befintliga aktiviteter och processer",
      kalla: "modul 10: kärnförklaring, modellsvar fråga 9",
    },
    {
      block: "m10-t2",
      text: "Digital transformation är alltså bredare än de två andra.",
      kalla: "modul 10: modellsvar fråga 9",
    },
    {
      block: "m10-t2",
      text: "Den kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik.",
      kalla: "modul 10: modellsvar fråga 9 och 10",
    },
    {
      block: "m10-t2",
      text: "Eftersom dessa förändringar hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen snarare än ett isolerat teknikinitiativ.",
      kalla: "modul 10: modellsvar fråga 10 (och fråga 9:s avbrutna slut)",
    },
  ],
  "ea-e10-10": [
    {
      block: "m10-t2",
      text: "Den kan påverka affärsmodeller, capabilities, value streams, organisationsstrukturer, information, applikationer och teknik.",
      kalla: "modul 10: modellsvar fråga 10",
    },
    {
      block: "m10-t2",
      text: "Eftersom dessa förändringar hänger ihop kräver de ett arkitektoniskt perspektiv över hela enterprisen snarare än ett isolerat teknikinitiativ.",
      kalla: "modul 10: modellsvar fråga 10",
    },
  ],

  // --- Modul 11 ------------------------------------------------------------
  "ea-m11-1": [
    {
      block: "m11-t2",
      text: "Strategiskt viktiga capabilities är det banken behöver kunna göra för att bli en digital bank, till exempel digital onboarding av kunder.",
      kalla: "modul 11: rätt alternativ fråga 1; modul 7: fråga 4",
    },
  ],
  "ea-m11-2": [
    {
      block: "m11-t2",
      text: "Flera kunddatabaser betyder att kundinformationen är fragmenterad, och det är ett arkitektoniskt problem.",
      kalla: "modul 11: fallet och rätt alternativ fråga 2; Word-dokumentet, modul 11",
    },
  ],
  "ea-e11-3": [
    {
      block: "m11-t2",
      text: "Kärnsystemet kan stödja kritiska business capabilities och innehålla komplexa beroenden.",
      kalla: "modul 11: modellsvar fråga 3",
    },
    {
      block: "m11-t2",
      text: 'En "big bang"-ersättning skulle kunna skapa stora operativa, ekonomiska och affärsmässiga risker.',
      kalla: "modul 11: modellsvar fråga 3",
    },
    {
      block: "m11-t2",
      text: "Inkrementella transition architectures kan i stället låta banken modernisera samtidigt som den fortsätter att leverera värde.",
      kalla: "modul 11: modellsvar fråga 3",
    },
  ],
  "ea-m11-4": [
    {
      block: "m11-t2",
      text: "Target architecture ska ge en sammanhållen riktning för det önskade framtida läget.",
      kalla: "modul 11: rätt alternativ fråga 4",
    },
  ],
  "ea-m11-6": [
    {
      block: "m11-t2",
      text: "En lämplig princip är därför att kundinformation bör behandlas som en tillgång för hela enterprisen",
      kalla: "modul 11: rätt alternativ fråga 6",
    },
  ],
  "ea-e11-7": [
    {
      block: "m11-t2",
      text: "Att välja en teknikplattform innan verksamhetens mål, de capabilities som krävs och de arkitektoniska begränsningarna har fastställts är ett arkitektoniskt antimönster.",
      kalla: "modul 11: modellsvar fråga 7",
    },
  ],
  "ea-e11-8": [
    {
      block: "m11-t2",
      text: "Innan arkitekten väljer teknik bör hen fastställa de strategiska målen, önskade kundresultat, de capabilities som krävs, nuvarande begränsningar, stakeholders concerns och arkitektoniska principer.",
      kalla: "modul 11: modellsvar fråga 8",
    },
  ],
  "ea-e11-8b": [
    {
      block: "m11-t2",
      text: "Transition architectures ger praktiska mellanlägen som gör att en organisation kan gå från sin baseline architecture mot target architecture samtidigt som verksamheten fortsätter och värde levereras.",
      kalla: "modul 11: svaret på den andra fråga 8",
    },
  ],
  "ea-e11-9": [
    {
      block: "m11-t2",
      text: "Banken bör först klargöra sina strategiska mål och önskade kundresultat.",
      kalla: "modul 11: modellsvar fråga 9",
    },
    {
      block: "m11-t2",
      text: "Den bör sedan bedöma baseline: capabilities, value streams, information, applikationer och teknik.",
      kalla: "modul 11: modellsvar fråga 9",
    },
    {
      block: "m11-t2",
      text: "En target architecture bör fastställa den önskade riktningen, med stöd av arkitektoniska principer och governance.",
      kalla: "modul 11: modellsvar fråga 9",
    },
    {
      block: "m11-t2",
      text: "I stället för att ersätta alla legacysystem samtidigt bör banken identifiera transition architectures och prioritera initiativ efter affärsvärde, risk och beroenden.",
      kalla: "modul 11: modellsvar fråga 9",
    },
    {
      block: "m11-t2",
      text: "Agile-leverans kan användas för att utveckla capabilities inkrementellt.",
      kalla: "modul 11: modellsvar fråga 9",
    },
  ],
  "ea-e11-10": [
    {
      block: "m11-t2",
      text: "Transformationen kan då organiseras kring inkrementella produkter och capabilities, där arkitekturen utvecklas parallellt med leveransen genom feedback och lärande.",
      kalla: "modul 11: modellsvar fråga 10",
    },
    {
      block: "m11-t2",
      text: "Det låter banken lära sig, leverera värde tidigare och justera arkitektoniska beslut allteftersom ny information blir tillgänglig.",
      kalla: "modul 11: modellsvar fråga 10",
    },
  ],

  // --- Modul 12 (får peka på text i modul 1–11) -------------------------------
  "ea-m12-1": [
    {
      block: "m11-t2",
      text: "Innan arkitekten väljer teknik bör hen fastställa de strategiska målen, önskade kundresultat, de capabilities som krävs, nuvarande begränsningar, stakeholders concerns och arkitektoniska principer.",
      kalla: "modul 11: modellsvar fråga 8; modul 12: rätt alternativ fråga 1",
    },
    { block: "m5-t3", text: "Arkitekturen börjar alltså med syftet, inte med tekniken.", kalla: "Word-dokumentet, modul 5 bild 9" },
  ],
  "ea-m12-2": [
    {
      block: "m9-t2",
      text: "Innan arkitekten föreslår en lösning försöker hen förstå vilka business capabilities, informationsbehov och affärsresultat som berörs, vilket strategiskt mål som ligger bakom, vilka beroenden som finns och vad det kostar och vilka risker det finns.",
      kalla: "modul 9: arkitektens tänkande; modul 12: rätt alternativ fråga 2",
    },
    {
      block: "m9-t2",
      text: "Om flera applikationer verkar göra samma sak behöver arkitekten också förstå skälen till dubbleringen",
      kalla: "modul 12: rätt alternativ fråga 2 och 16",
    },
  ],
  "ea-m12-3": [
    {
      block: "m4-t3",
      text: "Zachman är i första hand en ontology, en klassificeringsstruktur, snarare än en utvecklingsmetodik.",
      kalla: "modul 4: modellsvar fråga 9",
    },
  ],
  "ea-m12-4": [
    {
      block: "m3-t2",
      text: "Enterprise Architecture är praktiken att förstå, utforma, kommunicera och styra den grundläggande strukturen och utvecklingen hos en enterprise för att nå dess mål.",
      kalla: "modul 3: kärndefinition",
    },
  ],
  "ea-m12-5": [
    { block: "m2-t3", text: "Den handlar särskilt om relationer och konsekvenser.", kalla: "modul 2: kärnförklaring" },
    {
      block: "m2-t3",
      text: "Arkitektur finns för att möjliggöra förändring med ett syfte.",
      kalla: "Word-dokumentet (architecture exists to enable purposeful change)",
    },
  ],
  "ea-m12-6": [
    {
      block: "m7-t3",
      text: "Den beskriver en förmåga som organisationen har eller behöver ha, men den föreskriver inte hur capabilityn implementeras.",
      kalla: "modul 7: lärarens förklaring fråga 14",
    },
  ],
  "ea-m12-7": [
    {
      block: "m12-t3",
      text: "Business capability — En capability beskriver vad en organisation kan göra. Hur arbetet utförs beskriver i stället en process.",
      kalla: "modul 12: de tio begreppen; modul 7: kärnförklaring",
    },
  ],
  "ea-m12-8": [
    {
      block: "m12-t3",
      text: "Zachman — Zachman ger en ontology och ett klassificeringsschema för att organisera beskrivningar av en enterprise.",
      kalla: "modul 12: de tio begreppen",
    },
  ],
  "ea-m12-9": [
    {
      block: "m4-t2",
      text: "Kolumnerna är sex interrogatives, alltså grundläggande frågor om enterprisen:",
      kalla: "modul 4: de sex frågorna",
    },
    { block: "m4-t2", text: "What? — saker/data", kalla: "modul 4: de sex frågorna" },
  ],
  "ea-m12-10": [
    {
      block: "m5-t3",
      text: "ADM:s huvudsakliga syfte är alltså att utveckla och vidareutveckla Enterprise Architecture, inte att utveckla mjukvara.",
      kalla: "modul 5: rätt alternativ fråga 1",
    },
  ],
  "ea-m12-11": [
    {
      block: "m5-t3",
      text: "Zachman ger i första hand en ontology och en klassificeringsstruktur för att organisera arkitekturbeskrivningar.",
      kalla: "modul 5: modellsvar fråga 12",
    },
    {
      block: "m5-t3",
      text: "TOGAF ger vägledning och en metod för arkitekturutveckling, särskilt genom ADM",
      kalla: "modul 5: modellsvar fråga 12",
    },
  ],
  "ea-m12-12": [
    {
      block: "m12-t3",
      text: 'Architecture principle — En princip, till exempel "Information är en tillgång för hela enterprisen", ger varaktig vägledning för arkitektoniska beslut och kan fungera som en guardrail.',
      kalla: "modul 12: de tio begreppen; modul 8: principexemplet",
    },
  ],
  "ea-m12-13": [
    {
      block: "m12-t3",
      text: "Governance — Governance fastställer decision rights, ansvarsskyldighet, riktning och kontroll.",
      kalla: "modul 12: de tio begreppen",
    },
  ],
  "ea-m12-14": [
    {
      block: "m9-t2",
      text: "Agile-arkitektur utvecklas iterativt och kan utvecklas inkrementellt, genom feedback och lärande från leveransen, och ger samtidigt lämplig riktning och guardrails.",
      kalla: "modul 9: rätt alternativ fråga 1",
    },
  ],
  "ea-m12-15": [
    {
      block: "m10-t2",
      text: "Den kan förändra affärsmodeller, kundupplevelser och operating modeln.",
      kalla: "modul 10: rätt alternativ fråga 3; modul 12: rätt alternativ fråga 15",
    },
  ],
  "ea-m12-16": [
    {
      block: "m9-t2",
      text: "Om flera applikationer verkar göra samma sak behöver arkitekten också förstå skälen till dubbleringen",
      kalla: "modul 9: arkitektens tänkande; modul 12: rätt alternativ fråga 16",
    },
  ],
  "ea-m12-17": [
    {
      block: "m10-t2",
      text: "Om någon säger att transformationen är lyckad för att allt har flyttats till molnet bör arkitekten fråga vilka affärsresultat, capabilities eller värdeerbjudanden som har förändrats.",
      kalla: "modul 12: rätt alternativ fråga 17",
    },
  ],
  "ea-m12-18": [
    {
      block: "m7-t3",
      text: "Kedjan blir alltså: strategi → capabilities → arkitekturförändring → implementering → resultat.",
      kalla: "modul 12: rätt alternativ fråga 18; Word-dokumentet, modul 5 bild 4",
    },
  ],
  "ea-m12-19": [
    {
      block: "m3-t2",
      text: "Enterprise Architecture handlar alltså inte i första hand om teknik.",
      kalla: "modul 3: kärndefinition och sant/falskt fråga 6",
    },
  ],
  "ea-m12-20": [
    {
      block: "m4-t3",
      text: "Det föreskriver inte en sekvens av aktiviteter för att utveckla arkitektur.",
      kalla: "modul 4: modellsvar fråga 11",
    },
  ],
  "ea-m12-21": [
    {
      block: "m12-t3",
      text: "ADM är iterativ och inget stelt vattenfall.",
      kalla: "modul 5: kärnbudskap",
    },
  ],
  "ea-m12-22": [
    {
      block: "m12-t3",
      text: "En capability beskriver vad en organisation kan göra.",
      kalla: "modul 12: de tio begreppen",
    },
  ],
  "ea-m12-23": [
    {
      block: "m7-t3",
      text: "Därför går begreppen inte att byta ut mot varandra.",
      kalla: "modul 7: kärnförklaring och sant/falskt fråga 8",
    },
  ],
  "ea-m12-24": [
    {
      block: "m8-t3",
      text: "Principerna fungerar på så sätt som guardrails inom vilka team kan fatta beslut mer självständigt.",
      kalla: "modul 8: rätt alternativ fråga 3",
    },
  ],
  "ea-m12-25": [
    {
      block: "m12-t3",
      text: "God governance kräver inte att varje beslut godkänns centralt.",
      kalla: "modul 8: sant/falskt fråga 7; modul 12: examinationsfällorna",
    },
  ],
  "ea-m12-26": [
    {
      block: "m10-t2",
      text: "Digital transformation kräver inte nödvändigtvis ny teknik.",
      kalla: "modul 10: kärnförklaring; Word-dokumentet, modul 10",
    },
  ],
  "ea-m12-27": [
    {
      block: "m9-t2",
      text: "Arkitekturen bör alltså utvecklas i takt med att enterprisen och dess omgivning förändras.",
      kalla: "modul 9: rätt alternativ fråga 3; modul 12: sant/falskt fråga 27",
    },
  ],
  "ea-m12-28": [
    {
      block: "m12-t3",
      text: "Ett diagram är en representation av arkitekturen, inte arkitekturen själv.",
      kalla: "modul 2: kärnförklaring",
    },
  ],
  "ea-e12-29": [
    {
      block: "m3-t2",
      text: "Arkitektur finns för att stödja enterprisens mål.",
      kalla: "modul 12: modellsvar fråga 29",
    },
    {
      block: "m3-t2",
      text: "Utan att förstå strategin kan arkitekten inte avgöra vilka capabilities som behöver utvecklas, förändras eller skyddas, och arkitekturbeslut kan inte bedömas mot verksamhetens prioriteringar.",
      kalla: "modul 12: modellsvar fråga 29",
    },
  ],
  "ea-e12-30": [
    {
      block: "m7-t3",
      text: "Capabilities kan relateras till processer, människor, information och data, applikationer och teknik.",
      kalla: "modul 7: modellsvar fråga 12; modul 12: modellsvar fråga 30",
    },
    {
      block: "m7-t3",
      text: "Capability mapping låter arkitekten fokusera på vad organisationen måste kunna göra i stället för på tillfälliga organisationsstrukturer.",
      kalla: "modul 7: modellsvar kortsvarsfråga 11",
    },
    {
      block: "m7-t3",
      text: "men den föreskriver inte hur capabilityn implementeras.",
      kalla: "modul 7: lärarens förklaring fråga 14",
    },
  ],
  "ea-e12-31": [
    {
      block: "m6-t3",
      text: "En viewpoint fastställer hur en view bör hantera en viss concern hos stakeholders.",
      kalla: "modul 6: modellsvar fråga 11",
    },
    {
      block: "m6-t3",
      text: "En view är den faktiska representationen som skapas med hjälp av viewpointen.",
      kalla: "modul 6: modellsvar fråga 11",
    },
  ],
  "ea-e12-32": [
    {
      block: "m7-tillagg-1",
      text: "Det finns nästan aldrig en perfekt arkitektur.",
      kalla: "Word-dokumentet om trade-offs",
    },
    {
      block: "m7-tillagg-1",
      text: "Standardisering kan till exempel ge effektivitet men mindre flexibilitet, och centralisering kan ge kontroll men långsammare beslut.",
      kalla: "Word-dokumentet om trade-offs; modul 12: modellsvar fråga 32",
    },
    {
      block: "m7-tillagg-1",
      text: "Arkitektens uppgift är att göra sådana trade-offs tydliga och anpassa dem till enterprisens mål.",
      kalla: "modul 12: modellsvar fråga 32",
    },
  ],
  "ea-e12-33": [
    {
      block: "m9-t2",
      text: "Också en Agile-organisation behöver sammanhållning, principer, riktning och hantering av betydande beroenden och risker.",
      kalla: "modul 12: modellsvar fråga 33",
    },
    {
      block: "m9-t2",
      text: "Arkitekten kan etablera principer, standarder, guardrails och decision rights, så att team kan fatta rutinbeslut självständigt.",
      kalla: "modul 9: modellsvar fråga 9",
    },
    {
      block: "m9-t2",
      text: "Arkitekturen bör alltså utvecklas i takt med att enterprisen och dess omgivning förändras.",
      kalla: "modul 12: modellsvar fråga 33",
    },
  ],
  "ea-e12-scenario-1": [
    { block: "m5-t3", text: "Arkitekturen börjar alltså med syftet, inte med tekniken.", kalla: "modul 12: viktig lärdom scenario 1" },
    {
      block: "m11-t2",
      text: "Innan arkitekten väljer teknik bör hen fastställa de strategiska målen, önskade kundresultat, de capabilities som krävs, nuvarande begränsningar, stakeholders concerns och arkitektoniska principer.",
      kalla: "modul 11: modellsvar fråga 8",
    },
    {
      block: "m10-t2",
      text: "Artificiell intelligens kan vara en enabler i vissa fall, men den krävs inte för varje digital transformation.",
      kalla: "Word-dokumentet, modul 10",
    },
  ],
  "ea-e12-scenario-2": [
    {
      block: "m9-t2",
      text: "Antalet applikationer är alltså inte i sig ett arkitektoniskt problem. Arkitektur bör hantera problem och resultat, inte godtyckliga siffror.",
      kalla: "modul 12: modellsvar och viktig lärdom scenario 2",
    },
  ],
  "ea-e12-scenario-3": [
    {
      block: "m9-t2",
      text: "Arkitekten behöver alltså avgöra vilka beslut som verkligen kräver samordning på enterprise-nivå och vilka som kan delegeras.",
      kalla: "modul 12: modellsvar scenario 3",
    },
    {
      block: "m9-t2",
      text: "Enterprise Architecture bör därför ge riktning, principer, återanvändbara capabilities och guardrails och samtidigt ge leveransteamen lämplig autonomi.",
      kalla: "modul 9: modellsvar fråga 10",
    },
  ],
  "ea-e12-scenario-4": [
    {
      block: "m11-t2",
      text: 'Att ett system är gammalt är inte heller ensamt ett tillräckligt skäl att ersätta det: beslutet bör bygga på belägg som affärsvärde, verksamhetskritikalitet, teknisk hälsa, kostnad och strategisk riktning, inte på etiketter som "legacy".',
      kalla: "modul 12: modellsvar och viktig lärdom scenario 4",
    },
  ],
  "ea-e12-scenario-5": [
    {
      block: "m10-t2",
      text: "På samma sätt bör arkitekten fråga om en ny mobilapp har förändrat hur enterprisen skapar och levererar värde. Att bara lägga till en digital kanal kan vara digitalization snarare än bredare digital transformation.",
      kalla: "modul 12: modellsvar scenario 5",
    },
  ],
  "ea-m12-34a": [
    { block: "m12-t3", text: "Zachman — Zachman ger en ontology och ett klassificeringsschema för att organisera beskrivningar av en enterprise.", kalla: "modul 12: de tio begreppen" },
  ],
  "ea-m12-34b": [
    { block: "m12-t3", text: "TOGAF — TOGAF ger vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, inklusive ADM.", kalla: "modul 12: de tio begreppen" },
  ],
  "ea-m12-34c": [
    { block: "m4-t2", text: "Kolumnerna är sex interrogatives, alltså grundläggande frågor om enterprisen:", kalla: "modul 4: de sex frågorna" },
  ],
  "ea-m12-34d": [
    { block: "m12-t3", text: "TOGAF — TOGAF ger vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, inklusive ADM.", kalla: "modul 12: de tio begreppen" },
  ],
  "ea-m12-34e": [
    { block: "m4-t2", text: "Raderna representerar i första hand olika perspektiv eller abstraktionsnivåer.", kalla: "modul 4: rätt alternativ fråga 4" },
  ],
  "ea-m12-34f": [
    { block: "m12-t3", text: "TOGAF — TOGAF ger vägledning och ett tillvägagångssätt för att utveckla och styra Enterprise Architecture, inklusive ADM.", kalla: "modul 12: de tio begreppen" },
  ],
  "ea-e12-35": [
    {
      block: "m7-t3",
      text: "Namnet ensamt avgör inte vilket arkitektoniskt begrepp det gäller; sammanhanget spelar roll.",
      kalla: "modul 12: viktig lärdom fråga 35",
    },
    {
      block: "m7-t3",
      text: "Den exakta klassificeringen beror på modelleringssammanhanget, men i allmänhet beskriver en formulering om vad organisationen har förmåga att göra en capability, medan ett enskilt steg i arbetet är en process eller aktivitet.",
      kalla: "modul 12: modellsvar fråga 35",
    },
  ],
  "ea-e12-essay-1": [
    {
      block: "m3-t2",
      text: "Dokumentation av nuläget är användbar, men arkitekturen blir strategiskt värdefull när den förståelsen används för att fatta beslut om framtida lägen och övergångar.",
      kalla: "modul 12: modellsvar essä 1",
    },
    {
      block: "m3-t2",
      text: "Enterprise Architecture identifierar då gap, beroenden, risker och möjligheter. I en miljö som präglas av digital transformation och ständig förändring behöver arkitekturen själv utvecklas i stället för att bli en statisk dokumentationsövning.",
      kalla: "modul 12: modellsvar essä 1",
    },
    {
      block: "m3-t2",
      text: "Enterprise Architecture översätter strategiska mål till konsekvenser för arkitekturen.",
      kalla: "modul 3: modellsvar fråga 11",
    },
  ],
  "ea-e12-essay-2": [
    {
      block: "m4-t3",
      text: "Ramverket klassificerar och organiserar beskrivningar av en enterprise utifrån perspektiv och interrogatives.",
      kalla: "modul 4: modellsvar fråga 10 och 11",
    },
    {
      block: "m5-t3",
      text: "TOGAF ger vägledning och en metod för arkitekturutveckling, särskilt genom ADM, alltså ett strukturerat tillvägagångssätt för att utveckla och förvalta arkitektur.",
      kalla: "modul 5: modellsvar fråga 12",
    },
    {
      block: "m5-t3",
      text: "Ramverken svarar på olika frågor och kan därför komplettera varandra",
      kalla: "modul 4: modellsvar fråga 10",
    },
  ],
  "ea-e12-essay-3": [
    {
      block: "m7-t3",
      text: "Capabilities översätter alltså strategisk avsikt till de förmågor som enterprisen behöver för att nå sina mål",
      kalla: "modul 7: modellsvar fråga 26; modul 12: modellsvar essä 3",
    },
    {
      block: "m7-t3",
      text: "När strategins prioriteringar är översatta till capabilities kan arkitekten därför analysera vilka människor, processer, vilken information, vilka applikationer och vilken teknik som behövs för att stödja dem.",
      kalla: "modul 7: modellsvar fråga 26",
    },
    {
      block: "m10-t2",
      text: "Ofta innebär den att capabilities förändras eller att nya skapas.",
      kalla: "modul 12: modellsvar essä 3",
    },
    {
      block: "m10-t2",
      text: "Capability-baserad analys hjälper då organisationen att prioritera investeringar efter affärsvärde snarare än att bara välja tekniker.",
      kalla: "modul 12: modellsvar essä 3",
    },
  ],
  "ea-e12-essay-4": [
    {
      block: "m8-t3",
      text: "Organisationer behöver governance för att upprätthålla sammanhållning, hantera risker och säkerställa att viktiga arkitekturbeslut stödjer strategiska mål.",
      kalla: "modul 12: modellsvar essä 4",
    },
    {
      block: "m8-t3",
      text: "Alltför mycket centralt godkännande kan samtidigt sakta ner leveransen.",
      kalla: "modul 12: modellsvar essä 4",
    },
    {
      block: "m8-t3",
      text: "Effektiv governance fastställer därför principer, decision rights, guardrails och eskaleringsmekanismer: rutinbeslut kan delegeras, medan beslut med betydande konsekvenser för hela enterprisen kan få lämplig arkitektonisk tillsyn.",
      kalla: "modul 12: modellsvar essä 4",
    },
    {
      block: "m8-t3",
      text: "På så sätt kan governance ge både enhetlighet och autonomi.",
      kalla: "modul 12: modellsvar essä 4",
    },
  ],
  "ea-e12-essay-5": [
    {
      block: "m6-t3",
      text: "En förändring i verksamheten kan därför kräva förändringar i information, applikationer och teknik.",
      kalla: "modul 6: modellsvar fråga 13; modul 12: modellsvar essä 5",
    },
    {
      block: "m6-t3",
      text: "Därför är relationerna ofta viktigare än de enskilda komponenterna.",
      kalla: "modul 6: essäfråga 12",
    },
    {
      block: "m8-t3",
      text: "Ökad säkerhet kan medföra friktion, och centralisering kan ge kontroll men minska den lokala autonomin.",
      kalla: "modul 12: modellsvar essä 5",
    },
    {
      block: "m8-t3",
      text: "Arkitekter behöver därför göra trade-offs explicita och anpassa dem efter enterprisens mål.",
      kalla: "modul 12: modellsvar essä 5",
    },
  ],
  "ea-e12-slututmaning": [
    {
      block: "m12-t14",
      text: "Varför? – Vilket affärsmål eller problem hanterar vi?",
      kalla: "modul 12: arkitektens test",
    },
    {
      block: "m11-t2",
      text: "Innan arkitekten väljer teknik bör hen fastställa de strategiska målen, önskade kundresultat, de capabilities som krävs, nuvarande begränsningar, stakeholders concerns och arkitektoniska principer.",
      kalla: "modul 11: modellsvar fråga 8",
    },
  ],
};

// Frågor som inte går att täcka med lärarens material. Tom från början;
// varje id här måste stå i rapporten till Kasper.
export const SAKNAS_GODKANDA = [];
