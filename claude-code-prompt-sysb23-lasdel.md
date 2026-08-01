# PROMPT TILL CLAUDE CODE — Läsdel ("Läsesalen") för SYSB23 Plugg

## Vad du ska göra

Detta är ett **tillägg till det befintliga projektet SYSB23 Plugg** (pluggsida med Öva, Prov, Begrepp, Essä och Statistik för delkursen Strategi och ekonomistyrning). Uppgiften nu: bygg en **läsdel** — ett sammanhängande kompendium som studenten kan läsa i ett svep för att förstå ämnet *innan* övningarna börjar.

Allt textinnehåll finns färdigskrivet längre ned i detta dokument och är hämtat ur kurslitteraturen (Ax/Johansson/Kullvén "Den nya ekonomistyrningen" kap 1–3, Herrmann 2005, Kaplan & Norton 1993, Ittner & Larcker 2003, Rogers & Hudson 2011, Barney 2024) samt föreläsningsteman. **Skriv inte om, korta inte ned och lägg inte till egna fakta.** Kopiera in innehållet exakt. Din uppgift är vyn, navigationen, läsupplevelsen och kopplingen till övriga lägen.

Om projektet inte finns i mappen: bygg det enligt den tidigare prompten först, eller bygg läsdelen som fristående app med samma designspråk och lämna tydliga TODO-krokar där integrationen ska ske.

## Ny data

Skapa `src/data/strategi/reading.js` som exporterar två saker:

```js
export const reading = {
  title: "Strategi och ekonomistyrning",
  subtitle: "Läskompendium",
  intro: "…",              // kort orienteringstext, finns nedan
  chapters: [
    {
      id: "kap1",
      number: 1,
      title: "…",
      topics: ["grunder"],        // ids ur topics.js — används för "Öva på detta kapitel"
      readingMinutes: 9,
      lead: "…",                  // 1–2 meningar som visas i innehållsförteckningen
      body: `…markdown…`,         // huvudtexten
      recap: ["…"],               // "Kärnan i korthet"
      pitfalls: ["…"],            // "Se upp för"
      sources: ["AJK kap 1"]
    }
  ]
};

export const glossary = [
  { term: "Ekonomistyrning", definition: "…", chapter: "kap1" }
];
```

`body` är markdown (`##` underrubriker, `**fet**`, punktlistor, `>` för citat/definitioner). Rendera med `react-markdown` + `remark-gfm` (lägg till som dependency) och styla via en `prose`-liknande egen CSS-klass — använd inte Tailwind Typography-pluginet, styla själv med projektets tokens.

## Vyn "Läs"

Lägg till **Läs** som första flik i navigationen (före Öva) — läsning är startpunkten i pluggflödet. Två nivåer:

**A. Innehållsförteckning (landningsvy för Läs).**
- Rubrik, introtexten ur `reading.intro`, och total lästid (summan av `readingMinutes`).
- Kapitellista som numrerade rader: nummer, titel, `lead`, lästid, samt statusmarkering (oläst / pågående / läst). Läst-status sparas i `localStorage` under `sysb23:read:<delkurs>:<kapitelId>`.
- En framträdande knapp **"Fortsätt läsa"** som hoppar till första kapitlet som inte är markerat läst (annars kapitel 1).
- Progressindikator: "3 av 10 kapitel lästa" med en tunn stapel i `--pine`.

**B. Kapitelvy (läsläget).**
- Maxbredd på textkolumnen **~68 tecken** (`max-w-[68ch]`), radavstånd 1.7, brödtext 17–18 px. Rubriker i Fraunces, brödtext i Inter. Rikligt med luft mellan avsnitt. Detta ska vara behagligt att läsa i tio minuter i sträck — prioritera läsbarhet över allt annat i denna vy.
- Sidhuvud: "Kapitel N av M", titel, lästid, källhänvisning ur `sources`.
- **Läsprogress:** en 3 px tunn stapel högst upp (sticky) som fylls med `--brass` efter scrollposition i kapitlet. Respektera `prefers-reduced-motion` (ingen mjuk animering då, bara direkt uppdatering).
- Efter `body` följer i ordning:
  1. **Kärnan i korthet** — `recap` som lista i ett kort med `--correct-bg` som bakgrund.
  2. **Se upp för** — `pitfalls` i ett kort med `--wrong-bg`, rubrikikon eller etikett i `--brass`.
  3. **Åtgärdsrad:** knapp "Markera som läst" (toggle, sparas), knapp "Öva på detta kapitel" som navigerar till Öva-läget **förfiltrerat på kapitlets `topics`**, samt "Nästa kapitel →" / "← Föregående".
- **Sticky innehållsförteckning** i högerkolumn på desktop (≥1024 px) med kapitlets `##`-underrubriker som ankarlänkar och markering av var man är. På mobil ersätts den av en utfällbar "I detta kapitel"-panel högst upp.
- Tangentbord: `J`/`↓` och `K`/`↑` scrollar mjukt, `N` nästa kapitel, `P` föregående, `Esc` tillbaka till innehållsförteckningen.

## Ordlista

Lägg **Ordlista** som en flik eller som en sektion inom Läs (ditt val, men den ska vara nåbar i högst två klick):
- Alfabetiskt sorterade termer ur `glossary`, med sökfält som filtrerar på både term och definition medan man skriver.
- A–Ö-hoppnavigering (bokstäver utan träff visas nedtonade och är inte klickbara).
- Varje post visar term, definition och en liten länk "Kapitel N" som hoppar till rätt kapitel.

## Integration med resten av appen

- **Hem-vyn:** lägg till ett kort "Läs kompendiet" högst upp med läsprogressen, som primär startpunkt för nya användare. Texten ska göra ordningen tydlig: läs först, öva sedan, prova dig själv sist.
- **Begrepp-vyn** (kunskapskorten ur `topics.js`) behålls som den är — den är repetitionsformatet, läsdelen är förståelseformatet. Lägg i varje begreppskort en liten länk "Läs mer i kapitel N" som mappar via `topics`-fältet i kapitlen.
- **Öva-vyn** måste kunna ta emot ett förvalt ämnesfilter som prop/parameter (för "Öva på detta kapitel").
- **Statistik-vyn:** lägg till en rad "Lästa kapitel: X av M". "Nollställ min data" ska även rensa läsprogressen (nämn det i bekräftelsedialogen).

## Design

Återanvänd exakt de befintliga tokens (`--paper`, `--ink`, `--pine`, `--brass`, `--correct`, `--wrong`, `--line`) och typsnitten Fraunces + Inter. Inga nya färger. Läsdelen ska kännas som samma bok som resten av appen, bara med mer luft. Enda tillskottet är läsprogresstapeln i mässing.

I `body`-texten renderas följande markdown-element med särbehandling:
- `>` blockquote → definitionsruta: vänsterkant 3 px i `--pine`, ljusare bakgrund, ingen kursiv.
- `**fet**` inuti brödtext används för nyckeltermer — ge dem `--pine` som färg och weight 600.
- Punktlistor får generös radhöjd; numrerade listor används där ordningen betyder något.

---

# INNEHÅLL — kopiera in i `src/data/strategi/reading.js`

## Introtext (`reading.intro`)

```
Den här delkursen handlar om två saker som hänger ihop tätare än man först tror: hur företag bestämmer vart de ska (strategi) och hur de får verksamheten att faktiskt röra sig dit (ekonomistyrning). Kompendiet är skrivet för att läsas i ordning — varje kapitel bygger på det förra, och de sista kapitlen knyter ihop hela bilden. Räkna med ungefär en och en halv timme för hela texten. Läs först, öva sedan. Begreppen sitter mycket bättre när du redan sett dem i sitt sammanhang.
```

## Kapitel (`reading.chapters`)

```js
export const reading = {
  title: "Strategi och ekonomistyrning",
  subtitle: "Läskompendium",
  intro: "Den här delkursen handlar om två saker som hänger ihop tätare än man först tror: hur företag bestämmer vart de ska (strategi) och hur de får verksamheten att faktiskt röra sig dit (ekonomistyrning). Kompendiet är skrivet för att läsas i ordning — varje kapitel bygger på det förra, och de sista kapitlen knyter ihop hela bilden. Räkna med ungefär en och en halv timme för hela texten. Läs först, öva sedan. Begreppen sitter mycket bättre när du redan sett dem i sitt sammanhang.",
  chapters: [

  {
    id: "kap1",
    number: 1,
    title: "Vad ekonomistyrning är",
    topics: ["grunder"],
    readingMinutes: 9,
    lead: "Grundplattan: vad ekonomi och företag betyder i ämnet, hur ekonomistyrning definieras, vad den som styr faktiskt gör och vilka verktyg som finns.",
    sources: ["AJK kap 1"],
    body: `
Börja med orden. Inom företagsekonomin betyder **företag** något bredare än i vardagsspråket: en sammanslutning av personer som i någon form bedriver ett medvetet arbete för att uppnå ett eller flera mål. Det gör att även sjukvård, energiproduktion, högskolor, idrottsföreningar och kooperationer räknas som företag i ämnets mening — även om litteraturen mest handlar om affärsdrivande verksamheter.

**Ekonomi** kommer från grekiskans oikonomia, hushållning eller förvaltning, och definieras som hushållning med begränsade eller knappa resurser. Resurserna är kapital, personal, utrustning, material, kunskap och information — och inget företag har obegränsat av dem. När ett företag hushållar förnuftigt och sparsamt säger vi att **effektiviteten** är hög, vilket betyder att graden av måluppfyllelse är hög. Håll kvar den kopplingen; den återkommer i kapitel 4.

**Företagsekonomi** är alltså läran om företags hushållning med knappa resurser, och delas i delämnen: extern redovisning, marknadsföring, finansiering, management, kostnads- och intäktsanalys — och ekonomistyrning.

## Definitionen du behöver kunna

> Ekonomistyrning avser avsiktlig påverkan på en verksamhet och dess befattningshavare mot vissa ekonomiska mål.

Definitionen kommer från Nationalencyklopedin och är den kursen utgår från. Tre saker i den är värda att stanna vid. **Avsiktlig påverkan** — det är inget som händer av sig självt. **Verksamheten och dess befattningshavare** — styrningen riktas mot både processer och människor. **Ekonomiska mål** — och här gör många ett feltänk, för ekonomiska mål är inte bara pengar.

Ekonomiska mål kan nämligen vara både finansiella och icke-finansiella. Finansiella mål handlar om ett visst resultat, en viss lönsamhet, ett visst kassaflöde. Icke-finansiella mål kan vara nöjdare kunder, bättre produktkvalitet eller nöjdare medarbetare. Traditionellt har ekonomistyrningen fokuserat på det finansiella, och finansiella mål bedöms fortfarande oftast som de viktigaste — men de icke-finansiella växer i betydelse. Tankegången bakom är enkel: nöjda kunder, nöjda medarbetare och hög kvalitet antas *bidra* till att de finansiella målen uppfylls. Det är precis den idén som kapitel 7 handlar om.

## Vad ekonomistyraren gör

Uppgiftslistan är lång, men den går att gruppera. Man planerar, genomför, följer upp och anpassar verksamheten i förhållande till planer och mål. Man förser beslutsfattare med underlag och följer upp fattade beslut. Man fördelar och utkräver ansvar. Man samlar in, tolkar, sammanställer, rapporterar och kommunicerar ekonomisk information. Man analyserar orsaker till avvikelser från planer och föreslår åtgärder. Man genomför specialutredningar, analyserar hur processer och aktiviteter kan förbättras, och fungerar som rådgivare i ekonomiska frågor.

Men listan slutar inte där, och det är den mindre uppenbara delen som gärna dyker upp på tentan: ekonomistyraren ska också **utveckla och uppdatera styr- och ekonomisystem, utbilda medarbetarna i ekonomiska frågor, bidra till förutsättningar för en lärande organisation och bidra till en positiv företagskultur**. Ekonomistyrning är alltså inte enbart en formaliserad process med tekniker och metoder — mjukare element och det organisatoriska sammanhanget ingår.

## Tre slags styrmedel

För att kunna utföra uppgifterna behövs **styrmedel**. De delas i tre kategorier, och den indelningen är värd att memorera exakt eftersom den är en klassisk flervalsfråga:

1. **Formella styrmedel** — produktkalkylering, budgetering, prestationsmätning, intern redovisning, standardkostnader, internprissättning, benchmarking, processtyrning, investeringskalkylering, resultatplanering, målkostnadskalkylering.
2. **Organisationsstruktur** — organisationsform, ansvarsfördelning, belöningssystem.
3. **Mindre formaliserade styrmedel** — företagskultur, lärande, medarbetarskap (bemyndigande).

Kapitel 5 går igenom kategori 2 och 3 i detalj. Notera redan nu att budgetering är ett *formellt* styrmedel, att belöningssystem hör till *organisationsstrukturen* och att företagskultur är *mindre formaliserad* styrning — de tre blandas ofta ihop i svarsalternativ.

## Var ekonomistyrningen kommer in

Det övergripande syftet med ekonomistyrningen är att hjälpa till i arbetet med att uppnå företagets strategiska målsättningar. Ett annat sätt att säga det: **ekonomistyrningen är ett medel för att implementera företagets strategi**. Därav följer något viktigt — styrningens utformning och användning måste anpassas till den strategi företaget valt. En lågkostnadsstrategi kräver en annan styrning än en differentieringsstrategi.

Det leder till nästa kapitel, för om styrningen ska implementera strategin måste vi först veta var strategin kommer ifrån.

## En blick framåt: strategisk ekonomistyrning

Ämnet är i förändring, och en riktning kallas **strategisk ekonomistyrning**. Det finns ingen konsensus om innebörden, men de vanliga definitionerna delar några särdrag: uppgifterna breddas till att omfatta identifiering och förstärkning av konkurrensfördelar och strategiformulering; det traditionella interna fokuset kompletteras med **externt fokus** på konkurrenters priser, kostnadsnivåer och marknadsandelar samt kunders betalningsvillighet och lojalitet; man arbetar aktivt med värdekedjans länkar och strategiska kostnadsdrivare; och styrningen anpassas explicit till strategisk inriktning. Nya metoder som hör hit: strategisk kostnadsanalys, kostnadsdrivaranalys, värdekedjeanalys, livscykelkalkylering, målkostnadskalkylering och balanserat styrkort.
`,
    recap: [
      "Företag = sammanslutning som medvetet arbetar mot mål (inkluderar offentlig verksamhet och föreningar). Ekonomi = hushållning med knappa resurser.",
      "Ekonomistyrning = avsiktlig påverkan på en verksamhet och dess befattningshavare mot vissa ekonomiska mål (NE).",
      "Ekonomiska mål kan vara både finansiella (resultat, lönsamhet, kassaflöde) och icke-finansiella (kunder, kvalitet, medarbetare).",
      "Tre styrmedelskategorier: formella styrmedel, organisationsstruktur, mindre formaliserade styrmedel.",
      "Ekonomistyrningens syfte är strategiimplementering — den ska därför anpassas till vald strategi.",
      "Strategisk ekonomistyrning breddar med externt fokus (konkurrenter, kunder) och värdekedjetänkande."
    ],
    pitfalls: [
      "'Ekonomiska mål' betyder inte 'bara finansiella mål'.",
      "Budgetering är formellt styrmedel, belöningssystem hör till organisationsstruktur, kultur är mindre formaliserad styrning — sortera rätt.",
      "Ekonomistyrning är inte extern redovisning och inte statlig reglering."
    ]
  },

  {
    id: "kap2",
    number: 2,
    title: "Vision, affärsidé, strategi och verksamhetsplaner",
    topics: ["vision"],
    readingMinutes: 8,
    lead: "Kedjan från önskad framtid till konkret styrning — och exakt vad som skiljer en vision från en affärsidé.",
    sources: ["AJK kap 1"],
    body: `
Ekonomistyrningen har utgångspunkter. Den svävar inte fritt, utan är sista ledet i en kedja som börjar i företagets framtidsbild:

**Vision → Affärsidé → Strategi → Verksamhetsplanering → Ekonomistyrning**

Kunna kedjan i rätt ordning är kanske den enskilt mest lönsamma minnesinvesteringen i hela kapitlet — den frågan har flera skepnader på tentan.

## Vision

**Visionen** anger hur man vill att kunderna ska uppfatta företaget, eller den riktning i vilken företaget ska utvecklas. Enklast: ett önskvärt framtida tillstånd, en beskrivning av vart företaget är på väg och vad det ska uppnå. IKEA:s "att skapa en bättre vardag för de många människorna" är en vision; den innehåller ingen plan, inga siffror och ingen produktbeskrivning.

En vision har minst tre funktioner:

1. **Legitimerande.** Genom att ange vilken roll företaget vill ha i samverkan med intressenter sätts verksamheten in i ett samhällsperspektiv. Strävan är att övertyga viktiga intressenter om att företaget har ett socialt och samhälleligt berättigande.
2. **Ambition och fokus.** Visionen är ett samlat uttryck för företagets framtidsmål och anger en ambitionsnivå som sätter ramar för arbetet med affärsidé och strategi.
3. **Identifikation och motivation.** Den skapar motivation och engagemang internt, bidrar till att anställda känner sig delaktiga och tar initiativ och ansvar.

## Affärsidé

**Affärsidén** anger vad företaget ska ägna sig åt och hur man avser att utvecklas i förhållande till visionen. Den klargör också vad som skiljer företaget från andra företag. Alla företag har en affärsidé, men det finns ingen standardmall för innehåll eller omfattning.

Utvecklade affärsidéer klargör vilka varor och tjänster som erbjuds, vilka kunder man vänder sig till, vilka marknader man arbetar på eller avser att arbeta på, och hur verksamheten ska utvecklas. Etiska riktlinjer och uttalanden om hur företaget vill uppfattas kan ingå. Sammanfattningsvis: **affärsidén anger vad företaget ägnar sig åt eller tjänar pengar på** — nu eller i framtiden. H&M:s "mode och kvalitet till bästa pris", följt av en lista över hur det låga priset möjliggörs (få mellanhänder, stora volymer, djup kunskap om design och textil, kostnadsmedvetenhet i alla led, effektiv distribution), är ett typexempel.

Affärsidéns uppgifter är främst att ange riktning och klargöra attityder — i mindre grad att precisera mål. Den ska åstadkomma förståelse för organisationens syfte, skapa underlag för motivation, utgöra underlag för fördelning av resurser, etablera önskad ton och affärsklimat, fungera som orienteringspunkt för dem som kan identifiera sig med syftet, och möjliggöra översättning av syfte till konkreta mål och vidare till strategier.

## Strategi

I **strategin** klargörs hur företaget ska arbeta. Strategin kan därför sägas innehålla en beskrivning av eller en plan för hur affärsidén ska uppnås. Liksom för affärsidén finns ingen standardmall, men vanliga inslag är klargöranden av:

- vilka konkurrensfördelar företaget avser att utveckla och utnyttja
- företagets styrkor och svagheter samt möjligheter och hot i omvärlden
- inom vilka varu- och tjänsteområden man ska arbeta
- vilka kundkategorier man vänder sig till och hur de ska bearbetas
- hur hot från konkurrenter ska mötas
- vilken organisationsstruktur som ska användas
- vilken kompetens som krävs och hur den säkerställs
- vilka resurser som krävs och hur verksamheten ska finansieras

Mindre företag har vanligen en homogen verksamhet där strategin gäller helheten. Större företag har flera strategier, eftersom flera verksamhetsinriktningar arbetar under skilda villkor. I mycket stora företag finns strategier på flera nivåer: **koncernstrategi, affärsområdesstrategi, divisionsstrategi, affärsenhetsstrategi och funktionsstrategi**. När man diskuterar strategi håller man sig vanligen på divisions- eller affärsenhetsnivå — det är först där verksamheten kan preciseras, och det är också där ekonomistyrningen i de flesta fall förekommer.

## Verksamhetsplanering

När strategin är formulerad behöver huvudmålen brytas ned i **delmål**. Huvudmålen är en precisering och operationalisering av vision och affärsidé; strategin är sättet de ska uppnås. Delmålen väljs så att deras uppfyllelse leder till att de övergripande strategiska målen uppfylls, och de riktas mot olika organisatoriska delar. Vissa uttrycks finansiellt (räntabilitet, försäljning, kostnader), andra icke-finansiellt (kvalitet, kundtillfredsställelse, marknadsandel).

Tre saker måste klargöras för varje mål: tidshorisonten (kort, medellång, lång sikt), vem som ansvarar (vilken division, avdelning, produktområde eller marknadsområde), och vilka handlingsplaner och riktlinjer som gäller. Först därefter kan den konkreta verksamhetsplaneringen göras — produktionsstyrning, lagerstyrning, marknadsstyrning och ekonomistyrning.

Och det är den sista pusselbiten som förklarar varför kapitel 1:s definition talade om "vissa ekonomiska mål": det är de nedbrutna, operationaliserade målen som styrningen faktiskt arbetar mot, inte strategin i sig.
`,
    recap: [
      "Kedjan: Vision → Affärsidé → Strategi → Verksamhetsplanering → Ekonomistyrning.",
      "Vision = önskvärt framtida tillstånd, riktningen företaget ska utvecklas i.",
      "Visionens tre funktioner: legitimerande, ambition & fokus, identifikation & motivation.",
      "Affärsidé = vad företaget ägnar sig åt och tjänar pengar på, för vilka kunder, och vad som skiljer det från andra.",
      "Strategi = hur affärsidén ska uppnås; klargör konkurrensfördelar, produktområden, kunder, organisation, kompetens, resurser, finansiering.",
      "Strateginivåer i stora företag: koncern, affärsområde, division, affärsenhet, funktion. Ekonomistyrning sker främst på divisions-/affärsenhetsnivå.",
      "Verksamhetsplanering = nedbrytning av huvudmål till delmål med tidshorisont, ansvarig och handlingsplaner."
    ],
    pitfalls: [
      "Vision är inte en konkret plan, och inte enbart extern kommunikation.",
      "Affärsidén handlar om vad man gör och tjänar pengar på — inte om framtidsdrömmar.",
      "Blanda inte ihop ordningen: strategin kommer efter affärsidén, inte före."
    ]
  },

  {
    id: "kap3",
    number: 3,
    title: "Vad är egentligen företagets mål?",
    topics: ["mal"],
    readingMinutes: 11,
    lead: "Fem konkurrerande modeller — från den neoklassiska svarta lådan till intressentmodellen — och vad företag faktiskt säger att de vill.",
    sources: ["AJK kap 1"],
    body: `
Företag existerar för att uppfylla mål. Men vilka? Frågan har diskuterats intensivt inom företagsekonomin, och slutsatsen är att **det inte finns en teori eller modell som ger ett entydigt svar**. Det är i sig ett tentasvar värt att förstå ordentligt, för det finns fyra skäl till mångfalden:

1. **Olika sammanhang kräver olika modeller.** Vill man belysa ett preciserat problem är det både nödvändigt och önskvärt att förenkla verkligheten och bara inkludera det som är relevant.
2. **Företag och omgivning förändras ständigt.** Nya förutsättningar kräver anpassning, även av målen. Ett företag kan dessutom ändra mål utan omvärldsförändring, till exempel vid strategibyte — under en period är lönsamhet viktigast, under en annan tillväxt.
3. **Mål skiljer sig åt mellan och inom företag.** Vissa söker lönsamhet, andra tillväxt. Inom en koncern kan moderbolaget ha ett mål och dotterbolagen andra.
4. **Det finns olika uppfattningar och synsätt** — delvis av politiska, ideologiska och moraliska skäl.

## Vinstmaximeringsmodellen

I den **neoklassiska teorin** antas företag maximera sin vinst. Företaget betraktas som en förädlings- eller resursomvandlingsenhet: ett inflöde av resurser (uppoffringar) till ett visst värde omvandlas till ett utflöde (prestationer) till ett högre värde. Man bortser från individer och behandlar inte hur omvandlingen sker — därför säger man att företaget ses som en **svart låda**.

Här är effektivitet huvudproblemet, och vinsten är det enda målet och därmed det enda uttrycket för effektivitet. Begreppen har dessutom en särskild innebörd: intäkt är erhållen försäljning (pris per styck × såld kvantitet), och kostnad uttrycker vad företaget avstår från genom att använda resurser för ett visst handlingsalternativ — en **alternativkostnad** som bestäms av bästa alternativa användning. Handlandet antas rationellt: inga avsteg görs från vinstmaximeringsmålet.

Kritiken är omfattande och du bör kunna den:

- att vinstmaximering ses som **det enda** målet
- att företag antas ha **all information** som krävs för att maximera — men beslut fattas inför en osäker framtid, och det har till och med hävdats att det är tveksamt om man ens i efterhand kan avgöra om ett företag vinstmaximerat
- att det skulle finnas **en enda** effektiv kombination av pris och kvantitet — om riskattityd beaktas varierar vinst och mål med den, alltså finns flera effektiva kombinationer

Till detta kommer observationer av praktiken: företag arbetar ofta med tumregler och rutiner som inte följer teorins antaganden. Modellen har dock försvarare, som menar att den aldrig syftat till att förutsäga eller förklara hur företag faktiskt arbetar — den är en konstruktion för att belysa prisbildning och resursfördelning på marknads- och branschnivå. Med det syftet är den tillräckligt realistisk.

## Företagsledarmodeller

Här skiljs **ägande och drift** åt. När de skiljs minskar ägarnas möjlighet att kontrollera driften, och det uppstår utrymme för företagsledningen att arbeta mot egna mål. Två klassiker:

**Baumols försäljningsmaximeringsmodell:** företaget maximerar försäljningen snarare än vinsten, samtidigt som man strävar efter en vinst som ägarna uppfattar som tillfredsställande. Genom att maximera försäljningen istället för skillnaden mellan intäkter och kostnader växer företaget — och tillväxten skapar förutsättningar för högre löner, större inflytande och högre status för ledningen. Dessa fördelar antas hänga samman mer med försäljningens storlek än med vinstens.

**Williamsons modell:** företagsledningen maximerar sin **egen nytta** istället för företagets vinst, med en viss ägartillfredsställande vinst som förutsättning. Nyttan påverkas av lön, makt, status och prestige, och skapas genom att spendera medel på löner, administration (det anses prestigefyllt att ha en stor administration under sig), förmåner (flotta kontor, tjänstebilar, representation) och prioriterade investeringar som inte krävs för den normala driften.

## Satisfieringsmodellen

Nobelpristagaren **Herbert Simon** avviker från båda ovanstående. Företag strävar efter en **tillfredsställande** (satisfierande) vinst snarare än maximal. Vad som är tillfredsställande fastställs alltid i förhållande till en **anspråksnivå** — det finns ingen given vinstnivå, utan den beror på företagets situation och de vinstmöjligheter som existerar. Vinsten måste dock vara tillräckligt hög för att företaget ska överleva, och över tiden bli minst lika hög som tidigare perioder.

Bakom detta ligger **begränsad rationalitet**: beslutsfattare känner inte till samtliga tänkbara alternativ, det bästa alternativet kan på förhand endast svårligen eller inte alls fastställas, och beslutsfattaren måste aktivt skaffa sig information. Därför är man nöjd när man funnit ett alternativ som uppfyller ett preciserat minimikrav.

Viktigt: **satisfiering ska inte tolkas som lägre ambitionsnivå** än vinstmaximering. Det är helt enkelt inte möjligt att vinstmaximera på grund av den begränsade rationaliteten.

## Intressentmodellen

De tidigare modellerna betraktar företaget som ett **slutet system** utan kopplingar till omgivningen. Kritiken mot det ledde till det **öppna systemsynsättet**, och intressentmodellen är dess mest genomslagskraftiga uttryck. Liksom Simons modell bygger den på en tillfredsställande vinst utifrån en anspråksnivå; båda hör till de så kallade beteendeteorierna om företaget.

Utgångspunkten är att företaget strävar efter ett stabilt förhållande till sin omgivning — en **jämvikt**. Varje företag har ett antal intressenter som det står i beroendeförhållande till, och mellan företaget och intressenterna krävs balans mellan de **bidrag** intressenterna lämnar och de **belöningar** företaget lämnar. Intressenterna kräver belöningar som överstiger deras bidrag; annars vill de inte tillhöra intressentgruppen.

| Intressent | Bidrag | Belöning |
|---|---|---|
| Ägare | Kapital | Utdelning och avkastning |
| Medarbetare | Arbete | Lön, trygghet, personlig utveckling, medbestämmande |
| Företagsledning | Arbete | Lön, status, prestige, makt |
| Kunder | Betalningar | Varor, tjänster, kvalitet, service |
| Leverantörer | Varor, tjänster, kvalitet, service | Betalningar |
| Långivare | Kapital | Räntor, amorteringar, välskötta företag |
| Stat och kommun | Infrastruktur, utbildning, service | Skatter, avgifter, arbetstillfällen |
| Opinionsgrupper | Acceptans och legitimitet | Miljövänlighet och socialt ansvar |

Företagets mål blir enligt modellen att tillgodose intressenternas krav — alltså en **kompromiss** mellan deras mål. Kraven kan stå i konflikt och vara så stora att de inte kan tillgodoses fullt ut. Ledningens centrala uppgift blir därför att kompromissa för att säkra fortsatt drift och utveckling. Vissa krav kan på kort sikt vara ouppnådda, och den situationen hanteras genom att företaget förhåller sig **seriekopplat** till kraven: vid en tidpunkt tillgodoses en grupps krav, vid en annan nästa grupps. Samtliga intressenters krav tillgodoses, men vid olika tillfällen — så uppnås stabilitet. På längre sikt strävar man efter att i större utsträckning kunna tillgodose kraven, vilket minskar behovet av avvägningar: det kortsiktiga nollsummespelet ersätts av ett långsiktigt plussummespel.

## Kassaflödesbaserade modeller

Dessa bygger på ett kapitalmarknadssynsätt med investerarperspektiv. Målet är att **maximera nuvärdet av framtida nettokassaflöden** (inbetalningar minus utbetalningar). Ledningen inriktas på att maximera aktieägarnas förmögenhet genom att maximera aktiernas marknadsvärde.

Synsättet har mycket starkt stöd och är troligen det mest accepterade företagsmålet inom företagsekonomin — det ligger till grund för beslutsfattande, produktkalkylering och investeringskalkylering. Men det ska inte tolkas bokstavligt praktiskt: att verkligen maximera nuvärdet är mycket svårt, för att inte säga omöjligt. Företag arbetar i praktiken med flera mål och gör avvägningar, och invändningarna mot vinstmaximeringsmodellen gäller i princip även här. Många företag strävar snarare efter en avkastning som möter eller överträffar den förväntade vid given risknivå — alltså en för ägarna tillfredsställande avkastning, precis som i satisfieringsmodellen.

Två skäl till att nuvärdesberäkna: en krona idag är värd mer än en krona i morgon (den kan placeras och ge avkastning), och en riskfri krona är värd mer än en riskfylld (investerare undviker risk om de inte kompenseras). Beräkningen kräver en **kalkylränta**, vars nivå bestäms av alternativkostnaden för kapital.

## Och i praktiken?

Företag anger sällan sina mål i nuvärdestermer. I praktiken är **lönsamhet det högst rankade målet**, oftast uttryckt som räntabilitet eller avkastning. Lönsamhet är dock inte det enda ekonomiska målet — andra mål utgör ofta delmål eller restriktioner, till exempel likviditet, soliditet eller kapitalbindning, eller är uttryckta i icke-finansiella termer. Ett företag kan ha lönsamhet som huvudmål men under en period fokusera nöjda kunder, försäljningsökning eller tillväxt för att stärka marknadspositionen och skapa förutsättningar för långsiktigt tillfredsställande lönsamhet.

För offentlig verksamhet gäller inte lönsamhetsmål på samma vis, men skillnaderna ska inte överdrivas: ekonomiska principer bör gälla även där. Mer resurser än nödvändigt ska inte förbrukas för att uppnå en viss effekt eller kvalitet. Uttrycket **värde för pengarna** används för att markera att resurser ska utnyttjas så att de skapar så stor nytta som möjligt, vilket kan inkludera både utförda prestationer och medborgarnas subjektiva uppfattning om servicen.
`,
    recap: [
      "Ingen enskild teori ger ett entydigt svar på vad företags mål är — svaren beror på sammanhang, tid, vems mål som avses och synsätt.",
      "Vinstmaximeringsmodellen (neoklassisk): företaget som svart låda, vinst enda målet, rationellt handlande, alternativkostnad.",
      "Kritik: flera mål förekommer, full information saknas inför en osäker framtid, flera effektiva pris-/kvantitetskombinationer finns.",
      "Företagsledarmodeller: Baumol maximerar försäljning (tillväxt ger ledningen status), Williamson maximerar ledningens egen nytta.",
      "Simon: begränsad rationalitet → satisfierande vinst i förhållande till en anspråksnivå. Inte låg ambition, utan en praktisk nödvändighet.",
      "Intressentmodellen: öppet system, jämvikt, balans mellan bidrag och belöningar, målet en kompromiss, krav tillgodoses seriekopplat över tid.",
      "Kassaflödesmodeller: maximera nuvärdet av framtida nettokassaflöden; kräver kalkylränta; teoretiskt starkt men svårt bokstavligt.",
      "I praktiken: lönsamhet högst rankat, andra mål som delmål/restriktioner. Offentlig sektor: 'värde för pengarna'."
    ],
    pitfalls: [
      "Satisfiering ≠ låg ambitionsnivå.",
      "Intressentmodellen kräver inte att alla krav uppfylls samtidigt — seriekopplingen är svaret.",
      "Kritiken mot vinstmaximering är inte att 'vinst är oviktigt', utan att den inte är det enda målet och att maximering förutsätter information man inte har."
    ]
  },

  {
    id: "kap4",
    number: 4,
    title: "Grundbegreppen: effektivitet, produktivitet, resultat, lönsamhet",
    topics: ["effektivitet"],
    readingMinutes: 11,
    lead: "Kursens mest förväxlade begrepp, sorterade en gång för alla — inklusive inre kontra yttre effektivitet och de tre begreppsparen.",
    sources: ["AJK kap 2"],
    body: `
Detta kapitel innehåller ovanligt hög täthet av tentafrågor. Ta det långsamt.

## Effektivitet

> Effektivitet definieras som grad av måluppfyllelse.

Effektiviteten är ett uttryck för i vilken utsträckning företaget uppnår ett mål, och bestäms som förhållandet mellan värdet av vad som åstadkommits (utflödet) och värdet av de resurser och prestationer som satts in (inflödet) — i förhållande till ett mål.

**Effektivitet = värdet av utflöde / värdet av inflöde**

Uppnår företaget sitt mål är effektiviteten hög. Eftersom företags mål ofta är finansiella mäts effektivitet ofta finansiellt, och resultat i förhållande till satsat kapital är ett vanligt effektivitetsmått. För sjukvård och utbildning, som inte i någon större utsträckning har finansiella mål, behöver bestämningen ofta göras i icke-finansiella termer.

### Inre och yttre effektivitet

Tillsammans utgör de den **totala effektiviteten**, och företag behöver på lång sikt höga värden på båda för att överleva.

**Inre effektivitet = "att göra saker rätt".** Förknippas med hög produktivitet, kostnadseffektivitet, ordning och reda, väl utvecklade system och rutiner. Handlar om hushållning med resurser ur ett **internt** perspektiv.

**Yttre effektivitet = "att göra rätt saker".** Rör företagets relationer till omvärlden. Här förekommer begrepp som affärsmässighet, tillväxt, kvalitet och service — och under senare år definieras det allt oftare som **kundvärde**, alltså hur kunder värderar företagets varor och tjänster. Ett **externt** perspektiv.

Den klassiska tentakonstruktionen ser ut så här: ett företag har hög produktivitet i produktionen men tappar marknadsandelar. Svar: hög inre effektivitet, **låg yttre effektivitet**. Man gör saker rätt, men inte rätt saker.

### Fyra svårigheter med effektivitetsbegreppet

1. **Effektivitet är inget objektivt mått.** Eftersom det bestäms i förhållande till ett mål beror graden på målets nivå — effektiviteten kan helt enkelt höjas genom att sänka målnivån.
2. **Orsaken är svår att fastställa.** Stigande effektivitet kan bero på konjunkturuppgång, lägre marknadsräntor eller ny teknik snarare än egna insatser.
3. **Mål kan vara motstridiga.** Lönsamhet kan stå i strid med god arbetsmiljö och höga löner.
4. **Tidshorisonten spelar roll.** På kort sikt kan effektivitet "pressas fram" genom att utnyttja befintliga resurser maximalt, men det hotar den framtida effektiviteten. Utveckling och förnyelse kräver lediga resurser — och när lediga resurser finns är företaget enligt definitionen inte så effektivt det skulle kunna vara på kort sikt. Företag som satsar på utveckling är de som på lång sikt är mest effektiva.

Svårigheterna har fått vissa att helt överge tanken att effektivitet kan fastställas. Ett förslag har därför varit att använda **överlevnad** som det slutliga effektivitetskriteriet: överlever företaget anses det effektivt.

## Produktivitet

Produktivitet avser samma förhållande som effektivitet, men uttryckt i **fysiska termer**, det vill säga kvantiteter.

**Produktivitet = kvantitet utflöde / kvantitet inflöde**

Exempel: antalet maskinbearbetade produkter per förbrukad maskintimme, antalet debiterade konsulttimmar per arbetad timme, antalet betjänade kunder per dag, antalet producerade enheter per kilo material.

Samma slags svårigheter gäller som för effektivitet — produktivitetsmål är en subjektiv storhet, orsakssamband är svåra att fastställa, mått kan vara motstridiga, och kort sikt kan stå i strid med lång. Och en poäng värd att komma ihåg: **produktiviteten kan öka utan att företaget lyckats bättre**. Minskar man tiden per kund stiger produktiviteten, men kunderna kan uppleva sämre service. Lägger en tillverkningsavdelning ner mindre tid per produkt stiger avdelningens produktivitet, men kvaliteten kan sjunka och kunderna bli negativa.

## Tre begreppspar

För att förstå intäkter och kostnader behöver tre par hållas isär. Detta är ren precisionsträning.

**Inbetalning och utbetalning** är knutna till de tillfällen då **likvida medel** överförs, alltså betalningstransaktionerna. Vid kontantförsäljning sammanfaller inbetalning och inkomst för säljaren. Vid handel mellan företag är kredit vanligare — 30 dagar från fakturadatum innebär att betalningen sker i efterskott. Förskottsbetalningar förekommer också, till exempel för lokalhyra, leasing och abonnemang. Även kapitaltillskott, räntor på bankmedel, amorteringar, skatter och aktieutdelning är in- och utbetalningar.

**Inkomst och utgift** är knutna till **affärstransaktioner med externa parter** och fokuserar tidpunkten för avyttring respektive anskaffning. Enligt redovisningspraxis uppstår inkomsten det datum fakturan är daterad, och utgiften när fakturan anländer (eller det datum den är daterad). Strikt företagsekonomiskt uppstår utgiften när varor levereras och tjänster utförs; juridiskt när avtal ingås.

**Intäkt och kostnad** är mer komplicerade, och innebörden beror på sammanhanget:

*På bokföringsmässiga grunder* (extern redovisning) utgörs intäkterna av värdet av de prestationer som utförts under perioden — alltså **periodiserade inkomster**. Kostnaderna utgörs av värdet av resursförbrukningen för att åstadkomma de prestationer som utförts — **periodiserade utgifter**. Matchningen innebär att en periods intäkt ställs mot kostnaden för de resurser som förbrukats för att producera det som sålts. Ett tillverkande företag som bara producerat mot lager under en period har därför **varken intäkter eller kostnader** för perioden; varorna är en tillgång i balansräkningen. Skillnaden mellan intäkter och kostnader är det **bokföringsmässiga resultatet**.

*På kalkylmässiga grunder* (ekonomistyrning) avses med intäkter värdet av de prestationer som **utförts**, oberoende av om försäljning skett. Kostnader är värdet av den resursförbrukning som krävs för att producera varorna eller tjänsterna, inte knuten till någon viss periods försäljning. Ibland används återanskaffningsvärde eller alternativkostnad som utgångspunkt istället för historiskt anskaffningsvärde. Skillnaderna mot den externa redovisningen kan hänföras till tre faktorer: **urval, värdering och periodisering**.

## Resultat och lönsamhet

**Resultat = intäkter − kostnader** för en period. Ett absolut tal.

Resultatbegreppet har dock begränsningar. Ett företag med stor vinst behöver inte vara mer lönsamt än ett med lägre vinst — det kan till och med vara mindre lönsamt. Och en stor vinst betyder inte automatiskt att ägarna är nöjda.

**Lönsamhet = resultat / kapital.** Ett kvotmått, ett relationstal. Storheten i nämnaren är vanligen något uttryck för det kapital som finns och används i företaget. Därför är lönsamhet ett bättre mått på hur verksamheten bedrivs: det säger något om hur väl verksamheten drivs **i förhållande till det kapital som används** för att skapa resultatet.

**Räntabilitet** (avkastning) är det vanligaste lönsamhetsmåttet, och beräknas oftast utifrån den externa redovisningen. Vanliga kapitalbegrepp: totalt kapital, eget kapital och sysselsatt kapital. Räntabilitet på sysselsatt kapital ställer resultatet i förhållande till det kapital som kräver avkastning, vilket har fördelen att finansieringen styrs mot räntefria krediter.
`,
    recap: [
      "Effektivitet = grad av måluppfyllelse = värdet av utflöde / värdet av inflöde, ställt mot ett mål.",
      "Inre effektivitet = 'göra saker rätt' (produktivitet, kostnadseffektivitet, internt). Yttre = 'göra rätt saker' (kundvärde, tillväxt, externt). Total effektivitet kräver båda.",
      "Fyra svårigheter: målnivån påverkar utfallet, orsaken är svår att isolera, mål kan vara motstridiga, kort sikt kan slå mot lång sikt. Överlevnad har föreslagits som slutligt kriterium.",
      "Produktivitet = samma kvot men i fysiska termer. Produktiviteten kan öka fast företaget presterar sämre (sämre service eller kvalitet).",
      "Inbetalning/utbetalning = när pengar överförs. Inkomst/utgift = fakturadatum vid försäljning/anskaffning. Intäkt/kostnad = periodiserade värden av prestationer och resursförbrukning.",
      "Bokföringsmässiga grunder = extern redovisning (matchning mot försäljning). Kalkylmässiga grunder = ekonomistyrning (knutna till vad som presterats). Skillnaderna: urval, värdering, periodisering.",
      "Resultat = intäkter − kostnader (absolut). Lönsamhet = resultat / kapital (relativt) — bättre mått eftersom kapitalinsatsen vägs in. Räntabilitet är vanligaste lönsamhetsmåttet."
    ],
    pitfalls: [
      "Inre och yttre effektivitet förväxlas oftare än något annat i kursen. Memorera: inre = göra saker rätt.",
      "Stort resultat betyder inte hög lönsamhet.",
      "Produktivitet mäts i kvantiteter, effektivitet i värden mot ett mål — det är skillnaden."
    ]
  },

  {
    id: "kap5",
    number: 5,
    title: "Organisation, ansvar och de mjuka styrmedlen",
    topics: ["organisation", "grunder"],
    readingMinutes: 12,
    lead: "Vertikalt mot horisontellt perspektiv, de fyra ansvarstyperna, belöningssystem, kultur, lärande — och varför teori och praktik glider isär.",
    sources: ["AJK kap 3"],
    body: `
Kapitel 1 nämnde att organisationsstruktur är en av tre styrmedelskategorier. Här packas den upp, tillsammans med den mindre formaliserade styrningen.

## Två perspektiv på företaget

### Det vertikala perspektivet — företaget som hierarki

De flesta organisationsformer — funktions-, divisions-, matris- och linjeorganisation — betraktar företaget som en **hierarki** med överordnade och underordnade enheter på olika nivåer. Högst upp finns ägarna, längst ned enskilda anställda. Ur ett styrperspektiv är ekonomistyrningen ett medel för överordnade enheter att kontrollera och instruera underordnade, möjliggjort av de formella befogenheter hierarkin ger.

Utgångspunkten är **ägarkraven**, som i en vertikal styrprocess översätts till krav på styrelse och företagsledning och vidare ned till funktionella enheter och individer. Ett övergripande krav på räntabilitet på eget kapital kan brytas ned till lönsamhets- och resultatansvar för bolag och divisioner, och till kostnadsansvar på lägre nivåer. Grundbulten är att kapital, intäkter och kostnader knyts till ansvariga.

En äldre men närliggande bild är **företaget som förädlingsenhet**: resurser anskaffas på en anskaffningsmarknad, förädlas internt och avyttras som varor och tjänster på en avsättningsmarknad. Två flöden finns i modellen — ett fysiskt och ett finansiellt.

### Det horisontella perspektivet — företaget som värdekedja

Företagsmiljön har förändrats: snabbare teknisk utveckling, hårdare konkurrens, kortare produktlivscykler, nya kritiska framgångsfaktorer, förändrade efterfrågemönster, avreglering, privatisering, hårdare miljökrav och krav på etik och samhällsansvar. Företagen svarar med nya tekniska lösningar, kundorientering, kvalitetssatsningar, tidsreduktion, nya samarbetsformer och policies för miljö och socialt ansvar.

Av dessa anpassningar är **kundorientering** troligen den mest framträdande. Kritiken mot det vertikala perspektivet är att kunderna inte explicit inkluderas i styrningen — annat än möjligen som intäkter. Kundernas behov har svårt att tränga in i enheter som inte står i direkt marknadskontakt, och det finns risk för en fackorienterad specialistkultur som leder till revirbeteende och bristande intresse för andras arbete.

Därför förespråkas ett **värdekedjeperspektiv**, där värde tolkas ur ett kundperspektiv. Företaget betraktas som en serie **processer** som består av **aktiviteter** som syftar till att skapa kundvärde. Ett viktigt inslag blir att fokusera på **värdeskapande** aktiviteter och minimera **icke-värdeskapande**. Huvudprocesser (FoU, tillverkning, marknad, distribution, service) bryts ned i delprocesser och aktiviteter, från kundbehov till kundvärde.

Ekonomistyrningens uppgift blir att länka samman och koordinera processer och aktiviteter så att hela kedjan fram till kunden blir resurssnål. Ett sätt att säkerställa det är att varje länk i kedjan ser nästa länk som sin kund. Kunderna är inte intresserade av räntabilitet per enhet eller avvikelser från standards, utan av varan, tjänsten och servicen — funktioner, egenskaper, kvalitet, design, prestanda, leveranstider, service och pris. Om styrningen ska stödja kundorientering bör den utgå från kundperspektivet. Dimensionerna överordnad och underordnad enhet minskar i betydelse och ersätts av förhållandet mellan **mottagande och avlämnande enhet** i kedjan.

### En kombination

Teoretiskt föreligger ett motsatsförhållande mellan perspektiven, men de går att kombinera — svaret på frågan "kan man betrakta företaget som både hierarki och värdekedja?" är ja.

I det vertikala perspektivet betonas enheternas **självständighet**: om varje enhet håller vad den lovat fungerar helheten. Problemet uppstår när förutsättningar ändras — delarna saknar helhetsperspektiv och varje enhet är sig själv närmast. Det horisontella perspektivet innebär motsatt filosofi: **beroendet och sambandet** mellan enheter betonas, och kommunikationen sker horisontellt. Problemet där är att ansvaren blir mindre klara och att ansvar och befogenheter kan glida isär.

Eftersom nästan inga helt hierarkilösa företag existerar bör båda dimensionerna beaktas. Det kan göras genom **matrisorganisation**, tvärfunktionella grupper eller samordnade avdelningar — där varje process har kundansvar (horisontellt) samtidigt som varje funktion ansvarar uppåt (vertikalt).

## Organisationsformer

- **Funktionsorganisation** — strukturerad efter funktioner: marknadsföring, produktion, ekonomi, inköp. Samlar specialistkompetens.
- **Divisionsorganisation** — indelad efter produkter, tjänster eller geografiska marknader. Vanlig i stora företag eftersom den underlättar lansering av nya produktområden och inträde på nya geografiska marknader. Divisioner kan drivas som egna resultat- eller lönsamhetsenheter.
- **Matrisorganisation** — kombinerar vertikalt funktionsansvar med horisontellt process- eller kundansvar.

## Ansvarsfördelning

Två principer styr: **påverkbarhetsprincipen** och **befogenhetsprincipen**. Befattningshavare ska kunna påverka det de ansvarar för och ha befogenheter att göra det. Utkrävs ansvar för något som inte kan påverkas minskar styrningens effekt.

Det finns fyra huvudslag av ekonomiskt ansvar:

1. **Lönsamhetsansvar** (räntabilitets- eller investeringsansvar). Ansvaret svarar mot ägarnas avkastningskrav och innebär ansvar för skillnaden mellan intäkter och kostnader **i förhållande till det kapital** som tagits i anspråk. Enheten måste ha både befogenheter och möjligheter att påverka intäkter, kostnader och kapital. Mått: kvotmått som räntabilitet på sysselsatt kapital, eller residualmått (resultat belastat med kalkylmässig ränta).
2. **Resultatansvar.** För enheter som har intäkter och kostnader men **inte** befogenhet över kapitalposter. Mål kan sättas i absoluta resultattermer eller som marginaler. **Rent resultatansvar** innebär att intäkterna kommer från externa kunder och att enheten har full beslutsrätt över intäkter och kostnader — typiskt produktdivisioner. **Artificiellt resultatansvar** gäller enheter som säljer internt med restriktioner för prissättning och omfattning — typiskt serviceenheter som IT-avdelningar. I praktiken förekommer ofta en mix. Risk: ensidigt resultatfokus kan öka kapitalbindningen och skada räntabiliteten, varför man ofta kompletterar med ansvar för lager och kundfordringar, eller mått som lageromsättningshastighet.
3. **Intäkts- eller bidragsansvar.** Krav uttrycks i intäkter, det vill säga försäljning. Renodlat intäktsansvar är svårt att finna i praktiken, utom möjligen för individuella säljare. Försäljnings- och marknadsavdelningar arbetar ofta med **täckningsbidragsansvar**, där enhetens egna kostnader och oftast tillverknings- eller inköpskostnaden dras från intäkten.
4. **Kostnadsansvar.** Vanligast på den lägsta organisatoriska nivån — administrativa avdelningar, FoU, tillverkande enheter. Tillverkande enheter har ofta **standardkostnadsansvar**: i förkalkyler fastställs standardkostnader, enheten gottskrivs en standardkostnad per färdigställd produkt, och gottskrivningen jämförs med det verkliga utfallet så att avvikelser kan analyseras. Mått: kostnader, avvikelser mot standard, produktivitetsmått.

## Belöningssystem

Syftet är vanligen att motivera anställda att prestera utöver det vanliga, men även att få dem att stanna. Belöningar kan vara **finansiella** (bonus) eller **icke-finansiella** (ledighet, befordran, utvidgat ansvar och befogenheter), och riktas mot individer eller grupper.

Vid individuella belöningar är det väsentligt att individuella prestationer går att urskilja och att ingen upplever favorisering. När det inte fungerar är grupprelaterade belöningar mer ändamålsenliga — men de har sitt eget problem: **fripassagerare**, anställda som bidrar lite men ändå belönas. Det kan skapa missnöje och till och med motverka syftet med systemet.

## Mindre formaliserad styrning

### Företagskultur

> Med en organisations kultur menas dess inre liv, det vill säga sättet att leva, tänka, handla och vara.

Kulturen påverkar hur personer fattar beslut, kommunicerar och bedömer vad som är bra eller dåligt, önskvärt eller icke-önskvärt. Den består av handlingar och beteenden, uttryckta känslor, rutiner och ceremonier, historier och myter, språk och jargong, objekt och ting, rekryterings-, belönings- och karriärsystem, fysisk struktur och arkitektur, uttalade värderingar och uttalade normer.

Intresset för kultur förklaras av behovet av mer ändamålsenliga medel för att planera, samordna och motivera, av decentraliseringssträvanden och flexibilitetsbehov, av missnöje med det traditionella planeringsinriktade ledningssynsättet, och av intresset för japansk företagsledning.

### Lärande

Bakgrunden är samma omvärldsförändringar plus debatten om demokratisering och inflytande i arbetslivet. Utgångspunkten är att luckra upp byråkratiska, hierarkiska och förändringströga företag där kulturen sätter produktion och kapital i fokus och styrningen är toppstyrd och formaliserad.

**Lärande** kan definieras som bestående förändringar i beteendet hos en individ eller grupp på grundval av gjorda erfarenheter eller samspel med omgivningen. Mer konkret: uppfattningar om hur arbetet ska utföras förändras till det bättre.

Är det organisationer eller individer som lär? De flesta är överens om att det **först är individer** som lär sig. När lärandet sprids till andra och nya kunskaper omsätts i praktiken har ett **organisatoriskt lärande** kommit till stånd. Organisatoriskt lärande kan därför beskrivas som en ständigt pågående förändrings-, förnyelse- och förbättringsprocess. Förutsättningen är en kultur där det är accepterat att experimentera, ta initiativ och föreslå nya vägar — och där människan ses som något annat än en produktionsfaktor.

Man kan lära genom arbetsrotation, samarbete, mentorskap, nätverk, utbildning, företagsbesök och seminarier, men mycket talar för att **erfarenhetsbaserat lärande** är mest ändamålsenligt. Två lärprocesser skiljs åt:

- **Enkelkretslärande** (single-loop): något oönskat inträffar och man löser det utan att gå till botten med orsaken.
- **Dubbelkretslärande** (double-loop): man löser problemet **och** ifrågasätter själva orsaken till det inträffade. Man kurerar både symptomen och sjukdomen.

### Medarbetarskap (empowerment)

Handlar om demokratisering av arbetslivet — mer än att anställda ska kunna påverka sitt arbete. För att kalla ett företag demokratiskt organiserat krävs enligt förespråkarna att anställda har befogenheter och inflytande över arbetsplatsens utformning, arbetets utförande, investeringar, tillsättning av chefer och anställningsförhållanden. Ett medarbetarskapsinriktat företag utmärks av att anställda upplever arbetet som meningsfullt, att kompetensen tas tillvara och att företaget litar på dem.

Förutsättningar: befogenheter och inflytande, tydlig organisation med klara roller och ansvarsfördelning, delegerat ansvar, samt möjligheter till utveckling och lärande. Det stora hindret är **motstånd från chefer** som inte litar på medarbetarna och inte vill acceptera förlusten av kontroll.

Ett andra argument för medarbetarskap, vid sidan av demokratiseringen: de organisatoriska krav som uppstår när företag kund- och marknadsorienterar sig och satsar på kvalitet och service stämmer inte med kraven i en traditionell hierarkisk och byråkratisk struktur.

## Gapet mellan teori och praktik

I början av 1980-talet uppmärksammades att det finns en stor skillnad mellan ekonomistyrning i teorin (som den framställs i läroböcker) och i praktiken. Studier visar att metoder som enligt teorin bör användas ofta inte används, att företag föredrar enkla varianter framför mer sofistikerade, och att majoriteten av företag inte är särskilt benägna att implementera nya metoder.

Fyra förklaringar anges oftast:

1. Det finns en **tidseftersläpning** mellan utveckling av teori och implementering. (Svag förklaring — metoderna har funnits länge.)
2. Man har i praktiken **för liten kunskap** om teorin. (Också svag — många praktiker är utbildade i ämnet.)
3. Teorin **fångar inte in den verklighet** praktiker upplever. (Starkt stöd — mycket forskning har bedrivits utan utgångspunkt i verkliga situationer, ibland kallat "fåtöljforskning".)
4. Teorin beaktar inte **kostnads- och nyttokriteriet** i tillräcklig grad. (Starkast stöd.)

**Kostnads- och nyttokriteriet** innebär att en metods nytta för måluppfyllelsen ska vägas mot metodens kostnad. Metoder är inte kostnadsfria: konsultarvoden, kalkylsystem, beräkningar och analyser, utbildning, insamling och rapportering av information. Nyttan varierar också: kvalitet på beslutsunderlag, styreffekt, effektivitet i kostnadskontroll, tidsbesparing. Man ska välja det alternativ som ger störst **nettonytta**. Praktiker tillämpar kriteriet; teorin bortser ofta från det.

Slutsatsen är viktig och kan användas i essäsvar: litteraturens metoder utgör **inte** en samling metoder som ska användas, utan en samling tillgängliga metoder att välja bland. Det är inte möjligt att kategoriskt hävda att ABC-kalkylen är bättre än bidragskalkylen, att icke-finansiella mått är bättre än finansiella, eller att den processorienterade organisationsformen är bättre än den hierarkiska.
`,
    recap: [
      "Vertikalt perspektiv: företaget som hierarki, ägarkrav bryts ned till ansvar. Horisontellt: företaget som värdekedja av processer och aktiviteter som skapar kundvärde.",
      "Perspektiven kan kombineras, t.ex. i matrisorganisation med både funktions- och kundansvar.",
      "Funktionsorganisation = indelning efter funktioner. Divisionsorganisation = efter produkter/geografi, underlättar nya produktområden och marknader.",
      "Ansvarsfördelning styrs av påverkbarhetsprincipen och befogenhetsprincipen.",
      "Fyra ansvarstyper: lönsamhetsansvar (resultat/kapital), resultatansvar (rent eller artificiellt), intäkts-/bidragsansvar (täckningsbidrag), kostnadsansvar (ofta standardkostnadsansvar).",
      "Belöningssystem: finansiella/icke-finansiella, individ/grupp; gruppbelöningar riskerar fripassagerare.",
      "Kultur = organisationens inre liv. Lärande: individer lär först, organisatoriskt lärande när kunskapen sprids och tillämpas. Enkelkrets löser problemet, dubbelkrets ifrågasätter orsaken.",
      "Medarbetarskap = demokratisering och reellt inflytande; största hindret är chefers motstånd.",
      "Gapet teori–praktik förklaras främst av kostnads- och nyttokriteriet: metoder ska väljas efter nettonytta, inte efter teoretisk finhet."
    ],
    pitfalls: [
      "Divisionsorganisationens poäng är diversifiering (produkt/geografi) — inte att alla arbetar mot samma sak.",
      "Lönsamhetsansvar kräver kontroll över kapitalet; utan den blir det resultatansvar.",
      "Skriv aldrig i essäsvar att en metod är kategoriskt 'bäst' — kostnads- och nyttokriteriet gör svaret situationsberoende."
    ]
  },

  {
    id: "kap6",
    number: 6,
    title: "Strategiämnets utveckling: från omvärld till kunskap",
    topics: ["strategiutveckling", "porter", "rbv"],
    readingMinutes: 11,
    lead: "Herrmanns evolutionslinje, Porters positioneringsskola, det resursbaserade synsättet och Mintzbergs framväxande strategi.",
    sources: ["Herrmann (2005)", "Porter", "Mintzberg"],
    body: `
Strategifältet har inte utvecklats linjärt utan i vågor. Herrmann (2005) beskriver det med ett lån från teorin om teknisk utveckling, och det är en bild som gör hela ämnet begripligt.

## Variation, selektion, retention

Teknisk utveckling drivs enligt Anderson och Tushman av samspelet mellan tekniska processer och samhälleliga dynamiker, i en cykel av tre steg:

1. **Variation** uppstår genom **tekniska diskontinuiteter** — genombrott som avviker dramatiskt från de kontinuerliga, inkrementella innovationerna. De inleder en "era of ferment", en jäsningsperiod präglad av teknisk osäkerhet, fokus på produktteknik och kamp om branschdominans.
2. **Selektion** avslutar jäsningen när en **dominant design** väljs — och det är inte teknisk logik som avgör, utan sociala, politiska och organisatoriska dynamiker.
3. **Retention** följer: en era av inkrementell förändring med fokus på processteknik.

Bilexemplet illustrerar: när Ford T blev branschens dominanta design övergick företagen till processutveckling som drastiskt sänkte tid och kostnad, medan produktinnovationerna blev inkrementella. Efter nästan ett sekel utvecklas nu nästa dominanta design — vilken den blir är oklart, men den kommer inte drivas av olja.

Herrmanns poäng är att strategiämnet följer samma cykel. Uppdelningen mellan **strategy content** (vad: utfall, positioner, omfattning, sätt att konkurrera) och **strategy process** (hur: system och processer som leder till utfallen) motsvarar växlingen mellan produkt- och processteknik. Och i det akademiska fallet är det inte heller teknisk förtjänst som avgör vilka idéer som blir dominanta, utan sociala och organisatoriska dynamiker bland forskare och praktiker.

## Fältets faser

**1960-talet: strategibegreppet föds.** Utvecklingen börjar med idéer om strategisk anpassning, ursprungligen genom fallstudier. Forskare favoriserade tanken om situationsanpassad design framför universella administrationsprinciper. Flera metaforer lades då: March och Simon förde fram en informationsbehandlingsmetafor; Burns och Stalker kontrasterade **organiska** och **mekanistiska** organisationstyper; Cyert och March beskrev i sin beteendeteori företaget som en **koalition där målkonflikter aldrig löses permanent**, med beteende som är målsökande och satisfierande och lärande som modifiering av rutiner utifrån återkoppling. Andra hypoteserade att organisationer vars struktur matchade omgivningen presterade bättre — därmed föddes **contingencyteorin**.

**Era 1: omvärlden.** Fokus riktas mot analys av företagets omgivning. Eran mognar när en dominant design väljs: **Porters branschanalys och generiska strategier**.

**Era 2: resurserna.** Förnyad uppmärksamhet på resurser och kärnkompetenser inleder en ny jäsningsperiod — det **resursbaserade synsättet** (RBV).

**Era 3: kunskapen.** Nuvarande fas. Aktuella förändringar i akademin, i företagens omvärld och i praktiken visar att strategiämnets viktigaste fokus nu är **hur företag får kunskap och hur de lär** för att uppnå uthålliga konkurrensfördelar baserade på kontinuerlig innovation.

Ordningen — omvärld, resurser, kunskap — är det som prövas på tentan.

## Porter och positioneringsskolan

**Femkraftsmodellen** analyserar en branschs lönsamhetspotential och konkurrensintensitet. De fem krafterna är:

1. Konkurrens mellan existerande företag i branschen
2. Hot från nya aktörer
3. Hot från substitutprodukter
4. Kundernas förhandlingsstyrka
5. Leverantörernas förhandlingsstyrka

Observera vad som **inte** är en kraft: lagar och regleringar. Det är en återkommande distraktor, och regleringar hör snarare till bredare omvärldsanalyser som PESTEL. Modellens typiska användningsfall är att bedöma attraktiviteten i en bransch, exempelvis inför ett inträde på en ny marknad.

Porters **generiska strategier** är kostnadsledarskap, differentiering och fokus (koncentration på ett smalt segment, med kostnads- eller differentieringsinriktning). Logiken i hela skolan är att konkurrensfördel skapas genom **position** i branschen.

## Det resursbaserade synsättet

RBV flyttar blicken inåt. Uthålliga konkurrensfördelar kommer från resurser och förmågor som är **värdefulla, sällsynta och svåra att imitera**, och som företaget är organiserat för att utnyttja. Är en resurs lätt att köpa eller kopiera kan alla skaffa den, och då uppstår ingen varaktig fördel — hur värdefull den än är.

Skillnaden mot Porter är instruktiv: positioneringsskolan frågar "vilken bransch och vilken position?", RBV frågar "vad har vi som andra inte kan skaffa?". Kapitel 9 visar hur Barney använder exakt den frågan på generativ AI.

Från RBV går utvecklingen vidare mot kunskap, lärande och dynamiska förmågor — förmågan att kontinuerligt förnya sina resurser blir själv den svåraste resursen att imitera. Det knyter samman kapitel 5:s avsnitt om lärande organisationer med strategifältets nuvarande era: en lärande organisation är inte en trivsamhetsfråga, den är en strategisk position.

## Mintzberg: strategi som kan växa fram

En strategi kan inte alltid planeras fullt ut i förväg, eftersom marknaden och omvärlden ofta är osäkra och förändras snabbt. Den **realiserade** strategin är därför en kombination av två delar:

- **Avsiktlig (deliberate) strategi** — det som planerades och genomfördes.
- **Framväxande (emergent) strategi** — mönster som växer fram ur handlingar och beslut längs vägen, ofta som svar på det man lär sig.

Två feltolkningar att undvika, eftersom de dyker upp som svarsalternativ: Mintzberg hävdar **inte** att planerade strategier alltid misslyckas, och **inte** att strategiarbete är meningslöst och bör ersättas av improvisation. Poängen är att planering behöver kompletteras med lärande och anpassning — och att lärandet är själva mekanismen bakom den framväxande strategin.
`,
    recap: [
      "Herrmanns cykel: variation (diskontinuiteter, era of ferment) → selektion (dominant design, avgörs socialt/organisatoriskt) → retention (inkrementell processförfining).",
      "Fältets ordning: 1960-talets strategibegrepp och contingencyteori → omvärld/positionering (Porter blir dominant design) → resursbaserat synsätt → kunskap, lärande och innovation.",
      "Content-forskning studerar vad (positioner, utfall), processforskning studerar hur (system, processer).",
      "Porters fem krafter: befintlig konkurrens, nya aktörer, substitut, kundernas och leverantörernas förhandlingsstyrka. Lagar och regleringar är INTE en kraft.",
      "Generiska strategier: kostnadsledarskap, differentiering, fokus. Femkraftsanalys används t.ex. inför inträde i ny bransch.",
      "RBV: uthållig fördel från värdefulla, sällsynta, svårimiterade resurser som företaget är organiserat att utnyttja.",
      "Mintzberg: realiserad strategi = avsiktlig + framväxande. Osäker och föränderlig omvärld gör fullständig förhandsplanering omöjlig."
    ],
    pitfalls: [
      "Kasta inte om ordningen: positionering före RBV, RBV före kunskaps-/lärandeeran.",
      "Mintzberg avfärdar inte planering — han kompletterar den.",
      "Femkraftsmodellen analyserar branschen, inte arbetsmiljö, leveranskedja eller enskilda kampanjer."
    ]
  },

  {
    id: "kap7",
    number: 7,
    title: "Att mäta rätt saker: styrkortet och dess fallgropar",
    topics: ["bsc", "matt"],
    readingMinutes: 11,
    lead: "Kaplan & Nortons fyra perspektiv, och Ittner & Larckers fyra sätt att misslyckas med icke-finansiella mått.",
    sources: ["Kaplan & Norton (1993)", "Ittner & Larcker (2003)"],
    body: `
Kapitel 1 slog fast att ekonomiska mål kan vara både finansiella och icke-finansiella. Det här kapitlet handlar om vad som händer när man försöker mäta det icke-finansiella — först idén, sedan verklighetens problem.

## Problemet med enbart finansiella mått

Kaplan & Nortons utgångspunkt är kort och slagkraftig: **traditionella finansiella mått rapporterar vad som hände förra perioden utan att ange hur cheferna kan förbättra prestationen nästa period.** De är alltså bakåtblickande — historiska utfallsmått. Styrkortet ska istället fungera som hörnstenen i företagets nuvarande *och* framtida framgång.

## Balanced Scorecard: fyra perspektiv

Styrkortet kompletterar det finansiella perspektivet med tre andra:

1. **Finansiellt perspektiv** — hur ser vi ut för aktieägarna?
2. **Kundperspektiv** — hur ser kunderna på oss?
3. **Interna processer** — vad måste vi bli bra på?
4. **Innovation och lärande** — kan vi fortsätta förbättra och skapa värde?

Poängen är **balansen**. Informationen från de fyra perspektiven ger jämvikt mellan **externa** mått som rörelseresultat och **interna** mått som produktutveckling. Uppsättningen synliggör de avvägningar cheferna redan gjort mellan olika prestationsmått, och uppmuntrar dem att nå målen framöver utan att behöva göra avvägningar mellan nyckelfaktorer.

Ett tredje värde: många företag som försöker införa lokala förbättringsprogram — processomläggning, kvalitetsarbete, medarbetarinflytande — saknar en känsla av integration. Styrkortet kan bli **den samlande punkten** som definierar och kommunicerar prioriteringar till chefer, anställda, investerare och till och med kunder. En chef i litteraturen beskriver att där ettårsbudgeten tidigare var det primära planeringsverktyget, blev styrkortet istället språket och riktmärket som alla nya projekt och verksamheter utvärderas mot.

## Styrkortet är ingen mall

Detta är en av artikelns mest citerade poänger. Styrkortet är **inte en template** som kan appliceras generellt eller ens branschvis. Olika marknadssituationer, produktstrategier och konkurrensmiljöer kräver olika styrkort. Affärsenheter utformar därför skräddarsydda styrkort som passar deras uppdrag, strategi, teknik och kultur.

Och därav följer **transparenstestet**: ett kritiskt prov på ett styrkorts framgång är dess genomlysbarhet. Av de **15 till 20 måtten** ska en utomstående betraktare kunna se igenom till affärsenhetens konkurrensstrategi. Kan man inte det, mäter man inte rätt saker.

## Rockwater — exemplet

Rockwater, ett dotterbolag inom undervattensteknik och konstruktion, är litteraturens illustration. Branschen hade förändrats: konkurrensen hårdnade under 1980-talet, många mindre aktörer försvann, och flera oljebolag ville nu utveckla **långsiktiga partnerskap** med sina leverantörer snarare än att välja utifrån lägsta pris.

VD:n formulerade en vision om att som kundernas föredragna leverantör bli branschledande inom säkerhet och kvalitet, och en strategi med fem element: tjänster som överträffar kundernas förväntningar, höga nivåer av kundnöjdhet, kontinuerlig förbättring av säkerhet, utrustningens tillförlitlighet, responsivitet och kostnadseffektivitet, högkvalitativa medarbetare, samt realisering av aktieägarnas förväntningar.

Detta översattes till mått i alla fyra perspektiv:

- **Finansiellt:** räntabilitet på sysselsatt kapital, kassaflöde, prognossäkerhet (för att minska den historiska osäkerheten kring oväntade resultatvariationer), projektlönsamhet och orderstock.
- **Kund:** företaget skilde mellan Tier I-kunder (som ville ha en värdeskapande relation) och Tier II-kunder (som valde leverantör enbart på pris). Ett prisindex säkerställde att man kunde behålla Tier II-affärer när konkurrensen krävde det, medan strategin i övrigt betonade värdebaserad affär. En oberoende organisation genomförde en årlig undersökning av kundernas uppfattning jämfört med konkurrenterna, och Tier I-kunder fick lämna månatliga nöjdhets- och prestationsbetyg. Marknadsandel hos nyckelkunder gav objektiv evidens för att förbättrad kundnöjdhet omsattes i konkreta fördelar.
- **Interna processer:** cheferna definierade projektets livscykel från identifiering av kundbehov till avslut, och tog fram mått för varje fas — antal timmar tillsammans med potentiella kunder, träffsäkerhet i anbud, ett index för projektprestation, säkerhet och omarbetning, samt längden på avslutsfasen. Den nya inriktningen betonade **mått som integrerade nyckelprocesser** istället för prestation per funktionsavdelning.

## Ittner & Larcker: fyra misstag

Så långt idén. Ittner & Larcker undersökte över 60 tillverknings- och tjänsteföretag samt 297 chefer och fann att **få företag realiserar fördelarna**. Orsaken: de misslyckas med att identifiera, analysera och agera på rätt icke-finansiella mått. Många har adopterat mallversioner av ramverk som Balanced Scorecard — trots att ramverkens egna upphovsmän insisterar på att varje företag måste gräva djupt för att hitta just de aktiviteter som verkligen påverkar de breda domänerna.

**Misstag 1: Att inte koppla måtten till strategin.** Få företag knyter måtten till strategiska mål eller utvecklar en **kausalmodell** som länkar icke-finansiella drivare till finansiella utfall. Litteraturens positiva motexempel är en snabbmatskedja som ville bli branschens främsta kassaflödesgenerator och aktiekursvinnare, och som definierade en kausalkedja: bättre personalurval ökar medarbetarnöjdhet och prestation, vilket driver kundnöjdhet, köpfrekvens och återköp, vilket förbättrar tillväxt, resultat och kassaflöde. Utan sådana länkar kan chefer inte välja de få rätta måtten bland hundratals möjliga — resultatet blir att de mäter för många och irrelevanta saker.

**Misstag 2: Att inte validera länkarna.** Bland de företag som faktiskt utvecklar kausalmodeller är det många som aldrig verifierar antagandena bakom dem. Vilken typ av ledarskap och stöd driver egentligen medarbetarnöjdhet? Hur ökar nöjda medarbetare kundnöjdheten? Sears används som exempel på det rätta arbetssättet: regressionsanalys på data från många butiker för att testa om personalrelationer, kundnöjdhet och lojalitet verkligen drev finansiell prestation.

**Misstag 3: Att sätta fel prestationsmål.** Företag som testar sina antaganden sätter ofta målen för högt. Ett företag siktade på **100 procent kundnöjdhet** trots att helt nöjda kunder inte spenderade mer än de som var 80 procent nöjda. Andra använder icke-finansiella mått för att lansera initiativ som lovar kortsiktiga finansiella resultat, när andra initiativ skulle ge högre långsiktig avkastning.

**Misstag 4: Att mäta felaktigt.** Många använder ogiltiga mått som inte fångar det de ska — kundenkäter med för få frågor, till exempel. Opålitliga mått ger motstridiga resultat, som när tre interna team mäter företagets renommé med olika tekniker.

## Manipulation

Eftersom länkarna ofta saknas kan självintresserade chefer välja **och manipulera** mått enbart för att se bra ut och tjäna bonus. Tre exempel ur artikeln:

- En av världens ledande informationstjänstleverantörer började utvärdera chefer efter hur många patent företaget ansökte om varje år. Om det hade varit klokare att licensiera någon annans teknik, om patenten någonsin användes, eller om de tjänade in sin kostnad, beaktades inte. Skälet till att räkna patent: en mer framgångsrik konkurrent hade fler.
- En stor detaljhandelsbank baserade bonusar på kundnöjdhetsmätningar. Undersökningsföretaget frågade bara kunder som fysiskt besökte bankkontoren — så en kontorschef med tidigare låga betyg lockade in kunder och bjöd dem på mat och dryck.
- Chefer hos en fordonskomponenttillverkare nådde kvalitetsmålen genom att **omklassificera** vissa defekter som acceptabla, sådana som tidigare hade lett till att delen kasserades.

När detta händer glider företagets finansiella och icke-finansiella prestation isär — ironiskt, eftersom hela syftet med icke-finansiella mått var att komplettera den bild redovisningen ger. Och notera: icke-finansiella mått är minst lika manipulerbara som finansiell redovisning, med den skillnaden att redovisningen åtminstone har regler.

## Det empiriska argumentet

Här ligger kapitlets tyngsta belägg, användbart i essäsvar: **företag som införde icke-finansiella mått och etablerade en kausal koppling mellan dessa mått och finansiella utfall producerade signifikant högre räntabilitet på tillgångar (ROA) och eget kapital (ROE) över en femårsperiod än de som inte gjorde det.** Missbruk av icke-finansiella mått kan dessutom vara mer skadligt än missbruk av finansiella, på grund av de betydande alternativkostnaderna.

## Rätt arbetsgång

1. **Utveckla en kausalmodell** — föreslå orsakssamband mellan valda icke-finansiella drivare och specifika utfall kopplade till strategin.
2. **Samla data** — inventera befintliga informationssystem för att se vilka användbara mått som redan följs, och utveckla konkreta, konsekventa mått för hela organisationen.
3. **Gör data till information** — validera länkarna med etablerade kvantitativa metoder (korrelationsanalys, multipel regression) och kvalitativa (fokusgrupper, intervjuer).
4. **Förfina modellen kontinuerligt** — fördjupa förståelsen av drivarna bakom drivarna. Låg sjukfrånvaro kan förbättra resultatet, men vad minskar frånvaron? Rimlig lön? Bra arbetsmiljö?
5. **Agera på fynden** — prioritera de slutsatser som ger störst finansiell avkastning. Ett finansbolag baserade sina rekommendationer för kapitalallokering på den relativa betydelsen av tre drivare: medarbetarnöjdhet, antal handläggningsfel och kundnöjdhet.
6. **Utvärdera utfallen** — avgör om handlingsplanerna gav önskat resultat. Även nedslående efterhandsgranskningar hjälper till att revidera modellen och avslöja fel i datainsamlingen.
`,
    recap: [
      "Finansiella mått är historiska — de visar vad som hände utan att peka framåt. Det är BSC:s utgångspunkt.",
      "BSC:s fyra perspektiv: finansiellt, kund, interna processer, innovation & lärande. Balans mellan externa och interna mått; integrerar förbättringsinitiativ.",
      "Styrkortet är ingen mall — det skräddarsys per affärsenhet. Transparenstestet: av 15–20 mått ska en utomstående kunna utläsa konkurrensstrategin.",
      "Rockwater: vision → strategi → mål → mått i alla fyra perspektiv; Tier I/Tier II-kunder, projektlivscykelmått, integrerade processer istället för funktionsprestation.",
      "Ittner & Larckers fyra misstag: ingen koppling till strategin (ingen kausalmodell), ingen validering, fel målnivåer (100 %-exemplet), felaktig mätning.",
      "Mått utan validerad koppling inbjuder till manipulation: patenträkning, fika inför nöjdhetsmätning, omklassificerade defekter.",
      "Empiriskt fynd: företag med validerade kausalmodeller hade signifikant högre ROA och ROE över fem år.",
      "Rätt arbetsgång: kausalmodell → data → validering → förfining → agera → utvärdera."
    ],
    pitfalls: [
      "BSC ersätter inte finansiella mått — det integrerar finansiella och icke-finansiella.",
      "Att 'införa BSC' räcker inte; mallversioner utan egna validerade samband ger ingen effekt.",
      "Blanda inte ihop BSC (styrning mot strategi) med TBL/ESG (hållbarhetsdimensioner)."
    ]
  },

  {
    id: "kap8",
    number: 8,
    title: "Hållbarhet: Triple Bottom Line och ESG",
    topics: ["tbl"],
    readingMinutes: 8,
    lead: "Tre resultaträkningar istället för en — Brundtland, Elkington, Venn-diagrammet och hur ESG-exempel sorteras rätt.",
    sources: ["Rogers & Hudson (2011)", "ESG-tema"],
    body: `
Hållbarhet är det tema som starkast präglar nyare tentafrågor, och det hänger direkt på föregående kapitel: hållbarhetsarbete blir styrning först när det mäts.

## Hållbar utveckling — definitionen

Begreppet fick världens uppmärksamhet genom FN-arbetet som resulterade i **Brundtlandrapporten**, publicerad som boken *Our Common Future* (1987) av Världskommissionen för miljö och utveckling.

> Hållbar utveckling är utveckling som möter dagens behov utan att äventyra kommande generationers förmåga att möta sina egna behov.

Fyra nyckeldrag i definitionen är värda att kunna:

1. Hållbarhet erkänns som ett **globalt problem** med globala ansvar.
2. Det finns **gränser för tillväxt** — eller åtminstone ett behov av att styra om tillväxten i mindre miljöförstörande riktning.
3. **Social rättvisa** är en huvudfråga, särskilt vad gäller vägar till ekonomiskt och socialt framsteg för mindre utvecklade länder.
4. Ny prioritet för **långsiktigt tänkande** om framtida generationer, med insikten att marknadsekonomin tenderar att kraftigt diskontera framtida värden till förmån för kortsiktiga vinster.

Hållbarhet har definierats på nästan oändligt många sätt, konstaterar John Elkington — en av fältets ledande tänkare och praktiker.

## Triple Bottom Line

Elkington är också den som formulerade **Triple Bottom Line** (TBL), som blivit den samlande idén: hållbarhetens **sociala, miljömässiga och ekonomiska** komponenter. På svenska brukar de kallas **People, Planet, Profit** (eller Prosperity).

- **People** — socialt ansvar och välbefinnande för anställda, samhälle och kunder.
- **Planet** — miljömässig hållbarhet.
- **Profit / Prosperity** — ekonomisk framgång.

Ett vanligt fjärde alternativ i tentafrågor är "Purpose". **Purpose ingår inte i TBL.**

Ramverket tillför två saker till diskussionen.

**För det första riktar det uppmärksamheten mot konkreta kriterier** för framsteg inom var och en av de tre domänerna, och hjälper till att föra in alla tre i den affärsmässiga bokföringens ansvarsutkrävande — där **"what gets measured gets done"**. Det är samma logik som Ittner & Larcker beskriver, tillämpad på hållbarhet: utan mått blir hållbarhet retorik.

**För det andra synliggör det relationerna mellan de tre elementen.** TBL brukar illustreras som ett Venn-diagram med tre överlappande cirklar, och snitten har egna namn:

- Socialt + miljö = **bearable** (uthärdligt)
- Socialt + ekonomiskt = **equitable** (rättvist)
- Miljö + ekonomiskt = **viable** (bärkraftigt)
- Alla tre = **hållbart**

Idealet är att arbeta i mitten av diagrammet, där alla tre mål uppfylls. När man kommer ner på konkreta program och policyer upptäcker man ofta en **trippelvinst** av synergier. Men TBL avslöjar också **spänningar och avvägningar** mellan konkurrerande mål, där val måste göras på en högre nivå av systemtänkande och affärsbeslut fattas i ett bredare sammanhang.

## Push och pull

Forskningen visar att två slags mekanismer driver organisationer mot hållbarhet:

- **Pull** — från organisationsledare som ser hållbarhet som nästa gräns inom organisationsutveckling.
- **Push** — från marknadskrafter och regulatoriskt tryck som kräver att ledare hittar innovativa vägar att nå sina mål med hänsyn till TBL.

Eftersom människorna är många, planeten är en enda och vinsterna är osäkra, är resursfrågan en betydande källa till både stress och möjligheter för en ledare.

## Varför hållbarhet är en annan sorts utmaning

Det som skiljer hållbarhet från många andra organisatoriska utmaningar är att den kräver **förändringar i tänkande och praktik på varje nivå**, byggda på initiativ från varje individ i organisationen. Den bygger på praktik, inte bara teori, genom att verkliga erfarenheter delas över organisatoriska gränser, ekonomiska sektorer och nationsgränser.

Ledarskapet som behövs är därför inte detsamma som vd:ar som tänker på vad som sker inom organisationens väggar. Praktiker som inte sitter i toppen men som ser sig som en del av ett större sammanhang av samhälle och planet kan faktiskt vara bättre positionerade för att omfatta den vidare synen — det som kallats **distribuerad intelligens** eller "ledarskap från en annan plats".

## ESG

ESG är det närliggande ramverket för att bedöma och rapportera företags hållbarhetsarbete, med tre bokstäver:

- **E — Environmental:** öka energieffektiviteten, minska koldioxidutsläpp, avfall, vattenanvändning.
- **S — Social:** lika löner mellan könen, arbetsvillkor, vidareutbildning av anställda, arbetsmiljö, mångfald, relationer till lokalsamhället.
- **G — Governance:** utvärdera styrelsens prestation och sammansättning, ersättningsstrukturer, antikorruption, transparens, ägarstyrning.

Syftet med ramverket är att skydda miljön, förbättra det sociala ansvarstagandet och stärka bolagsstyrningen — och det används bland annat som grund för hållbara investeringar.

Sorteringsövningen är den vanliga tentaformen: löner och kompetensutveckling är **S** (inte G), styrelsefrågor är **G**, utsläpp och energi är **E**. Var uppmärksam när ett svarsalternativ placerar en personalfråga under Governance — det är fel bokstav.
`,
    recap: [
      "Brundtland: hållbar utveckling möter dagens behov utan att äventyra kommande generationers förmåga att möta sina.",
      "Definitionens fyra drag: globalt problem, gränser för/omriktning av tillväxt, social rättvisa, långsiktighet mot marknadens kortsiktighet.",
      "TBL (Elkington): People, Planet, Profit/Prosperity. 'Purpose' ingår inte.",
      "TBL:s två bidrag: konkreta kriterier per domän ('what gets measured gets done') och synliggörande av relationer — synergier och målkonflikter.",
      "Venn-snitten: bearable (social+miljö), equitable (social+ekonomi), viable (miljö+ekonomi), hållbart i mitten.",
      "Pull = ledare som ser hållbarhet som nästa utvecklingssteg. Push = marknadskrafter och reglering.",
      "Hållbarhet kräver förändring på alla nivåer; distribuerad intelligens och ledarskap även utanför toppen.",
      "ESG: E = energi/utsläpp, S = löner/utbildning/arbetsvillkor, G = styrelse/ersättning/transparens."
    ],
    pitfalls: [
      "'Purpose' är en distraktor i TBL-frågor.",
      "Sortera ESG-exempel rätt: personalfrågor är S, styrelsefrågor är G.",
      "TBL syftar till balans mellan tre områden — inte till vinstmaximering och inte till att minimera hållbarhetskostnader."
    ]
  },

  {
    id: "kap9",
    number: 9,
    title: "IT, AI och strategi",
    topics: ["it", "rbv"],
    readingMinutes: 11,
    lead: "Strategic alignment, produktivitetsparadoxen och Barneys argument om varför AI inte ger dig någon ny konkurrensfördel.",
    sources: ["Henderson & Venkatraman", "Barney (2024)"],
    body: `
Här möts kursens två halvor: IT är kärnan i informatikprogrammet, och strategiteorin ger verktygen för att avgöra när IT-investeringar faktiskt betalar sig.

## Produktivitetsparadoxen

Fenomenet är känt sedan 1980-talet: företag och hela ekonomier investerade enorma summor i informationsteknologi utan att produktivitetsstatistiken visade motsvarande uppgång. Tekniken fanns, men vinsterna syntes inte.

Förklaringen — och lösningen — som kursen lyfter fram är organisatorisk. Produktivitetsvinsterna realiseras först när **arbetsflöden och processer omorganiseras** så att den nya teknologin faktiskt utnyttjas. Att lägga ny teknik ovanpå gamla arbetssätt ger kostnaden utan nyttan.

Notera vad som **inte** är svaret, eftersom det figurerar som svarsalternativ: att investera i ännu mer teknik utan att ändra arbetssätten, att bromsa den teknologiska utvecklingen, eller att avstå från investeringar och bevara status quo.

## Strategic Alignment Model

Henderson och Venkatramans modell från 1993 svarar på samma problem strukturellt. IT skapar värde först när fyra domäner är i samklang:

1. **Affärsstrategi** — verksamhetens externa strategiska val: marknad, erbjudande, konkurrensfördelar.
2. **IT-strategi** — de externa teknologiska valen: teknikomfång, systemkompetenser, IT-styrning.
3. **Organisationsinfrastruktur och processer** — den interna verksamhetssidan: struktur, processer, kompetenser, roller.
4. **IT-infrastruktur och processer** — den interna tekniksidan: arkitektur, system, IT-processer, IT-kompetens.

Modellen arbetar i två dimensioner:

- **Strategisk passform** (strategic fit) — den vertikala kopplingen mellan extern strategi och intern infrastruktur. En strategi som inte har någon infrastruktur bakom sig är en önskelista.
- **Funktionell integration** — den horisontella kopplingen mellan verksamhet och IT. IT-strategin måste hänga ihop med affärsstrategin, och IT-infrastrukturen med organisationsinfrastrukturen.

Två saker gör modellen prövningsbar på tenta. Först: **alignment är en kontinuerlig process, inte ett engångsprojekt.** Affärsstrategi, teknik och omvärld förändras löpande, så ett läge som var i samklang i fjol kan vara i otakt i år. Sedan: relationen går i **båda riktningarna** — IT ska inte bara stödja affärsstrategin, den kan också möjliggöra och forma den (nya affärsmodeller som bara är tänkbara med viss teknik).

## Var kommer den långsiktiga fördelen ifrån?

Här kopplar vi in RBV från kapitel 6. Tekniken i sig är sällan en källa till uthållig konkurrensfördel: den kan köpas, licensieras och kopieras, ofta av vem som helst med tillräcklig budget. Vad som är svårt att kopiera är **kombinationen** av IT med processer, kompetens, organisation och kultur — komplementära resurser som byggts upp över tid.

Det är alltså inte systemet som ger fördelen, utan det sammanvävda paketet av system, arbetssätt och människor. Och den logiken tar oss direkt till Barney.

## Barney: AI ger dig ingen ny konkurrensfördel

Jay Barney (RBV:s upphovsman) och Martin Reeves publicerade 2024 i Harvard Business Review en artikel med undertiteln som säger allt: *men att använda den kan förstärka de du redan har.*

### Den historiska parallellen

Ångmaskinen på 1700-talet, elmotorn på 1800-talet, persondatorn på 1970-talet — var och en transformerade många sektorer och frigjorde enormt värde. Men relativt få av dem blev **direkta källor till uthållig konkurrensfördel** för de företag som införde dem, och det just för att effekterna var så genomgripande och utbredda att i princip varje företag tvingades ta till sig dem. I många fall **eliminerade de tvärtom de fördelar etablerade aktörer haft**, och lät nya konkurrenter komma in på tidigare stabila marknader.

Generativ AI är den senaste teknologin med potential att radikalt förändra hur affärer görs. Den identifierar mönster i data för att skapa nytt innehåll som liknar mänskligt skapande — och eftersom resultaten förs tillbaka in i de dataset den analyserar kan den över tid lära sig att skapa mer innovativt, mer värdefullt och mer människolikt innehåll. Att förstå de strategiska implikationerna kräver därför att man tänker inte bara på vad AI kan göra nu utan vad den kan komma att göra.

### Värdeskapande är inte värdefångst

Det finns ingen tvekan om att AI skapar mycket värde. Artikeln redovisar exempel från en konferens 2024: Ally Financials CIO om sänkta kostnader för att sammanfatta kundinteraktioner, Ciscos CIO om allt effektivare kodgenerering, Dows CIO om minskade kostnader för materialhantering och patenterbarhetsbedömning. Klarna rapporterade i februari 2024 att två tredjedelar av kundtjänstchattarna hanterades av en AI-assistent under programmets första månad, med betydande kostnadsminskningar, ökad hastighet och ingen nedgång i kundnöjdhet.

Problemet: **AI kan leverera liknande besparingar till varje företag som inför den.** Värde skapas men fångas inte — åtminstone inte länge.

Samma sak gäller innovation. Empiriska studier visar att generativ AI kan vara skickligare än erfarna yrkespersoner på att komma på nya produkter och affärsidéer. Men när de flesta konkurrenter också har tillgång kan de generera samma eller liknande resultat. Artikelns experiment: be din ledningsgrupp använda AI för att ta fram en lista på nya typer av tandborstar. Ni får biologiskt nedbrytbara, eltandborstar med UV-sanering, silikontandborstar för känsliga tänder. Alla potentiellt värdefulla idéer — men varje annat företag som gör experimentet får i stort sett samma lista, eftersom listorna genereras av liknande algoritmer som identifierar mönster i liknande databaser.

### Varför first mover-fördelen är kortlivad

Detta är artikelns mest eleganta argument. Eftersom generativ AI använder **ständigt uppdaterad data** absorberas dina "first mover"-tillämpningar i den data som analyseras när konkurrenterna använder AI som "late movers". De drar nytta inte bara av sina egna ansträngningar utan **också av dina tidigare**.

Antag att du först i din sektor frågar AI: vad ska vår strategi vara? Programmet ger ett antal intressanta möjligheter. Du implementerar några, förkastar andra. Men dina handlingar skapar information om dina strategiska val, information som förs in i de dataset som senare AI-tillämpningar analyserar — antingen för att du offentliggör valen eller för att AI kan härleda dem ur de handlingar du vidtar. Ställer en konkurrent sedan samma fråga får den en analys av både ett stort generiskt dataset **och** dina specifika val, tillsammans med deras konsekvenser för din prestation.

Slutsatsen är inte att avstå: AI bör vara en integrerad del av de löpande beslutsprocesserna, så att man kan fånga de tillfälliga fördelar tidiga tillämpningar kan ge samtidigt som man drar nytta av teknikens lärande. Men förvänta dig inte att försprånget varar.

### Kan man bygga ett bättre program?

Det är sannolikt sant att en organisation kan tjäna på en specialanpassad version optimerad för sin bransch — särskilt om mönsterigenkänningen där har unika egenskaper eller kräver ovanlig data som allmänna modeller hanterar dåligt.

Men det skulle vara förvånande om en användare hade resurserna att utveckla en "bättre" **generell** plattform som kan konkurrera med de specialiserade leverantörerna, som har års erfarenhet av att utveckla, skala och optimera sina system. Man gör klokare i att lägga ut det, precis som man lägger ut ordbehandlingsprogram. Dessutom är AI-algoritmer ofta öppen källkod, vilket underlättar snabb spridning av kunskap och kompetens.

Och även om ett företag kunde designa en specialanpassad AI skulle konkurrenterna dra samma slutsats och antingen utveckla en egen, samarbeta om en, anpassa en allmän modell för sektorn, eller betala externa utvecklare. Fördelen finns — men blir tillfällig.

### Skyddar proprietär data?

Många pekar på just detta som den möjliga källan till uthållig fördel. Om liknande algoritmer appliceras på olika dataset kan de generera olika resultat, och dataset som byggts upp under många år är kostsamma att duplicera. I teorin kan fördelen alltså vara hållbar. I praktiken uppstår flera problem:

- Konkurrenterna måste sakna **funktionellt likvärdig** data. Du kanske har samlat data om medarbetare, leverantörer och kunder i åratal — men det har antagligen de också. Dataseten skiljer sig, men **mönstren i dem kan vara mycket lika**, vilket ger liknande AI-resultat och därmed ingen fördel.
- Större dataset är inte automatiskt en fördel. Ditt kan ha en miljard datapunkter mot konkurrentens 50 miljoner — men om mönstren redan framträder i ett urval på 50 miljoner påverkar den extra informationen inte resultatet nämnvärt.
- Även med genuint unik data kan AI, när den blir mer sofistikerad och inkorporerar större och mer varierade dataset, komma att identifiera **vilken typ av data ett företag måste ha** för att fatta de beslut det fattar. Den kan till och med helt enkelt **imitera din strategi** efter att ha observerat de gynnsamma resultaten. Konkurrenter kan kopiera dina framgångar utan tillgång till primärdatan.
- Slutligen är proprietära dataset **anmärkningsvärt svåra att skydda**. Även de som anses mycket säkra läcker rutinmässigt. Du kan vara en missnöjd anställd från att din data delas med hela världen — och ofta är det inte en missnöjd anställd utan en välmenande som gör ett säkerhetsmisstag.

### Silverkanten

Även om AI sannolikt "ändrar allt" är den — i sig själv eller med data som inte är funktionellt unik och kan härledas — osannolik som källa till uthållig konkurrensfördel för det enskilda företag som inför den.

**Men:** har din organisation värdefulla förmågor och unika resurser som inte kan replikeras? Då kan tillämpning av AI för att förbättra hur du utnyttjar dessa tillgångar generera affärsidéer som inte skulle uppstå om AI applicerades på mer generiska resurser. Är dina tillgångar sällsynta och svåra för andra att imitera kan AI:s insikter bli en källa till uthållig konkurrensfördel — förutsatt att du är tillräckligt snabbfotad att agera på dem, vilket i sig är en sällsynt förmåga.

Artikelns exempel är **Amazon**, vars framgång bygger på ovanliga resurser och förmågor: relationer med miljontals leverantörer, mjukvara som länkar leverantörer till kunder, flera informationssystem som hänger samman och fungerar holistiskt, komplex lagerhållning och leverans, samt mekanismer för returhantering — allt inom en kulturell kontext som belönar effektivitet och initiativ. AI kan förbättra många delar av affärsmodellen och sänka kostnader eller öka intäkter. Men de specifika fördelarna kan bara tillfalla företag med resurser liknande Amazons. Walmart och Carrefour kanske kommer nära; få andra existerar. Och det vore mycket svårt för konkurrenter att bygga motsvarande tillgångar. Därför kan AI-tillämpningar hos Amazon — eller andra företag med unika och kostsamt imiterade resurser — generera insikter som främst är användbara internt, vilket placerar dessa företag ännu längre fram.

### Den andra vägen: bygg affärsmodellen kring AI

Saknar du sällsynta förmågor och resurser finns en möjlig väg: **bygg affärsmodellen runt AI**. Det innebär mer än att skapa en egen plattform — en sådan kan vanligtvis imiteras. För att bygga hela affärsmodellen kring AI måste varje affärsprocess i organisationen integrera insikter från AI, och den data du tränar din AI på måste inkorporera alla dessa insikter.

Då blir AI mer än ett program för att förbättra affärsmodellen — den möjliggör att hela verksamheten anpassar sig till en föränderlig omvärld, automatiskt och mycket snabbt. Det kan skapa en **agilitet** som är svår för konkurrenter att duplicera, åtminstone till dess att även de byggt om sina modeller kring AI. Men så långt har inget företag lyckats med det, och det är ännu inte klart att tekniken är mogen nog att motivera investeringen och risken.
`,
    recap: [
      "Produktivitetsparadoxen: stora IT-investeringar syns inte i produktiviteten. Lösningen är att omorganisera arbetsflöden och processer så tekniken utnyttjas.",
      "Strategic Alignment Model: affärsstrategi, IT-strategi, organisationsinfrastruktur & processer, IT-infrastruktur & processer.",
      "Två dimensioner: strategisk passform (strategi ↔ infrastruktur) och funktionell integration (verksamhet ↔ IT). Alignment är kontinuerligt och går i båda riktningarna.",
      "Långsiktig fördel kommer inte från tekniken (köp- och kopierbar) utan från kombinationen med processer, kompetens och organisation.",
      "Barney: transformativa teknologier (ångmaskin, elmotor, PC) gav sällan uthållig fördel eftersom alla tvingades införa dem — de raderade ofta etablerades försprång.",
      "Värdeskapande ≠ värdefångst: AI:s besparingar och idéer är tillgängliga för alla (tandborstexperimentet).",
      "First mover-fördelen är kortlivad: dina val absorberas i data som konkurrenternas AI analyserar.",
      "Proprietär data skyddar sällan: funktionellt likvärdig data finns, större dataset ger avtagande nytta, strategin kan härledas och imiteras, data läcker.",
      "Silverkanten: applicera AI på befintliga värdefulla, sällsynta, svårimiterade resurser (Amazon) — plus snabbfotadhet att agera.",
      "Alternativ väg: bygg hela affärsmodellen kring AI för agilitet — men omoget och ingen har lyckats än."
    ],
    pitfalls: [
      "Barneys slutsats är inte 'undvik AI' — AI bör integreras i beslutsprocesserna. Poängen är var fördelen kommer ifrån.",
      "Paradoxens lösning är organisatorisk förändring, inte mer teknik.",
      "SAM:s fyra domäner förväxlas med distraktorer som marknadsföring, leveranskedja, personal och riskhantering."
    ]
  },

  {
    id: "kap10",
    number: 10,
    title: "Så hänger allt ihop — och så skriver du tentan",
    topics: ["nyamatt", "grunder", "bsc", "tbl"],
    readingMinutes: 8,
    lead: "Syntesen av kursens delar, temat 'nya mått' som knyter ihop dem, och konkret tentataktik för både flervals- och essädelen.",
    sources: ["Syntes av kursmaterialet"],
    body: `
Läser du kapitlen som nio separata teman blir kursen svårare än den är. Läser du dem som en enda argumentationslinje blir essäfrågorna nästan självskrivna.

## Kursens röda tråd

Företag hushållar med knappa resurser för att nå mål (kap 1). Vilka mål är inte självklart — det finns flera konkurrerande modeller, och i praktiken dominerar lönsamhet med andra mål som delmål och restriktioner (kap 3). För att röra sig mot målen formulerar företaget en riktning: vision, affärsidé, strategi, verksamhetsplaner (kap 2). Strategin i sig kan komma från olika logiker — positionering i branschen, unika resurser, eller kontinuerligt lärande (kap 6) — och den kan inte alltid planeras i förväg.

För att strategin ska bli verklighet krävs styrmedel: formella metoder, organisationsstruktur med tydligt ansvar, och mjukare styrning genom kultur, lärande och medarbetarskap (kap 1 och 5). Hur bra det går mäts som effektivitet — inre och yttre — och lönsamhet (kap 4).

Men mätningen är själv ett problem. Rena finansiella mått är bakåtblickande, så styrningen kompletteras med icke-finansiella mått i fyra perspektiv (kap 7). Görs det slarvigt — utan kausalmodell, utan validering, med fel målnivåer — blir det manipulation och felinvesteringar istället för styrning.

Och nu kommer två omvärldsförändringar som ställer nya krav på samma mätapparat: **hållbarheten** (kap 8), som gör att företaget ska redovisa resultat i tre dimensioner istället för en, och **digitaliseringen** (kap 9), som både ger nya mått och ställer frågan om var konkurrensfördelen egentligen sitter. Svaret på den frågan visar sig vara detsamma som RBV gav på 1990-talet: i det som är svårt att kopiera.

## Temat "nya mått" — kursens favoritessä

Eftersom det knyter ihop nästan allt är detta värt att kunna som ett färdigt resonemang:

**Drivkrafterna.** Ökad hållbarhetsmedvetenhet (från konsumenter, investerare, reglering) och digitalisering (mer data, snabbare återkoppling, nya affärsmodeller).

**De nya måtten.** Hållbarhetsmått enligt ESG och TBL: koldioxidutsläpp, energieffektivitet, andel förnybart, jämställdhet och lönegap, personalomsättning, arbetsmiljö, leverantörsgranskning. Digitala mått: kundnöjdhet (NKI/NPS), kundbortfall, digital användning och konvertering, ledtider och processdata i realtid.

**Ramverken som håller ihop dem.** Balanced Scorecard, där icke-finansiella mått i kund-, process- och lärandeperspektivet fungerar som drivare av det finansiella utfallet. Triple Bottom Line, där tre resultatdimensioner redovisas parallellt.

**Hur arbetet påverkas.** "What gets measured gets done" — mått styr beteende, belöningar och investeringsbeslut. Icke-finansiella mått är **ledande indikatorer**: de ger signaler innan bokslutet. Ansvarsfördelning och belöningssystem måste följa med, annars styr måtten ingenting.

**Riskerna.** Ittner & Larckers fyra misstag, med den empiriska poängen att validerade kausalmodeller gav högre ROA och ROE. Plus manipulationsexemplen — mått utan regelverk inbjuder till kreativitet.

**Slutsatsen.** De nya måtten **ersätter inte** de finansiella målen, de kompletterar och driver dem. Finansiella mått visar utfallet, de nya visar drivkrafterna. Konsten ligger i att välja få, strategikopplade, validerade mått — och att sätta rimliga målnivåer.

## Tentataktik: flervalsdelen

Tio frågor à 6 poäng, **−1 poäng för fel svar**, 0 för obesvarad. Det förändrar hur du ska svara.

- Kan du eliminera minst två alternativ är gissningen matematiskt värd att ta: du har då minst 50 procents chans på +6 mot −1.
- Kan du inte eliminera något och saknar all känsla för frågan är det rationellt att lämna den obesvarad — men det är sällan läget om du läst kompendiet.
- Läs frågan efter negationer. "Vilken är **inte** en av Porters fem krafter" har fällt fler än okunskap gjort.
- Distraktorerna i den här kursen följer mönster: rätt begrepp men fel kategori (personalfråga under Governance), rätt modell men fel upphovsman (Baumol/Williamson/Simon), rätt idé men överdriven till en absolut ("alltid", "aldrig", "enbart"). Absoluta formuleringar är nästan alltid fel i det här ämnet.

## Tentataktik: essädelen

Två frågor à 20 poäng — 40 procent av tentan, och där betyget avgörs. En struktur som fungerar för samtliga fyra kända essätyper:

1. **Definiera begreppen** som frågan använder, kort och korrekt. Nämn upphovsman och årtal när du har det (Henderson & Venkatraman 1993, Kaplan & Norton 1993, Elkington, Barney 2024).
2. **Redogör för modellen eller argumentet** strukturerat — punktvis eller i tydliga stycken. Räkna upp de fyra domänerna, de fyra perspektiven, de tre P:na, de fyra misstagen.
3. **Besvara "varför"-delen** av frågan explicit. Frågorna innehåller nästan alltid ett varför, och det är där poängen sitter.
4. **Ge ett konkret exempel.** Amazon för RBV och AI, Rockwater för styrkortet, snabbmatskedjans kausalkedja för icke-finansiella mått, en e-handlare för alignment.
5. **Koppla till en annan del av kursen.** Alignment till produktivitetsparadoxen och RBV; lärande organisation till Mintzberg och till Herrmanns tredje era; nya mått till både BSC och TBL. Den som visar att delarna hänger ihop skriver ett A-svar.
6. **Avsluta med en kort slutsats** som svarar på frågan i en eller två meningar.

Undvik: att bara lista modellnamn utan innehåll, att skriva kategoriskt ("metod X är bäst") när kursens hållning är situationsberoende, och att glömma exempel.

## Sista genomläsningen

Kan du dessa utan att titta är du klar: kedjan vision→ekonomistyrning, visionens tre funktioner, de fem målmodellerna med upphovsmän, inre kontra yttre effektivitet, de tre begreppsparen, de fyra ansvarstyperna, Herrmanns tre eror i rätt ordning, Porters fem krafter och tre generiska strategier, VRIO-logikens tre krav, BSC:s fyra perspektiv, Ittner & Larckers fyra misstag, TBL:s tre P och ESG:s tre bokstäver med exempel, SAM:s fyra domäner, produktivitetsparadoxens lösning och Barneys tre argument plus silverkanten.
`,
    recap: [
      "Kursens tråd: mål → riktning (vision/affärsidé/strategi) → styrmedel → mätning → nya krav från hållbarhet och digitalisering.",
      "Nya mått-resonemanget: drivkrafter → måttyper (ESG/TBL och digitala) → ramverk (BSC, TBL) → effekter på arbetssätt → risker (Ittner & Larcker) → slutsats om komplement, inte ersättning.",
      "Flervalstaktik: gissa om du kan eliminera två alternativ, hoppa över vid total osäkerhet, läs efter negationer, misstro absoluta formuleringar.",
      "Essästruktur: definiera → redogör strukturerat → besvara varför → konkret exempel → koppla till annan kursdel → kort slutsats.",
      "Essäerna är 40 % av poängen — där avgörs betyget."
    ],
    pitfalls: [
      "Att lista modellnamn utan innehåll ger få poäng.",
      "Kategoriska påståenden om att en metod är bäst strider mot kursens hållning (kostnads- och nyttokriteriet).",
      "Att chansa blint kostar poäng — men att lämna frågor tomma av ren försiktighet kostar också."
    ]
  }

  ]
};
```

## Ordlistan (`glossary`)

```js
export const glossary = [
  { term: "Affärsidé", definition: "Vad företaget ägnar sig åt och tjänar pengar på, för vilka kunder och på vilka marknader, samt vad som skiljer det från andra företag.", chapter: "kap2" },
  { term: "Affärsstrategi", definition: "Domänen i Strategic Alignment Model som avser verksamhetens externa strategiska val: marknad, erbjudande och konkurrensfördelar.", chapter: "kap9" },
  { term: "Alternativkostnad", definition: "Vad företaget avstår från genom att använda en resurs för ett visst handlingsalternativ; bestäms av bästa alternativa användning.", chapter: "kap3" },
  { term: "Anspråksnivå", definition: "Den nivå som avgör vad som räknas som en tillfredsställande vinst i Simons satisfieringsmodell. Ingen given nivå finns; den beror på situationen.", chapter: "kap3" },
  { term: "Artificiellt resultatansvar", definition: "Resultatansvar för enheter som säljer internt och har restriktioner för prissättning och verksamhetens omfattning, t.ex. IT-avdelningar.", chapter: "kap5" },
  { term: "Balanced Scorecard", definition: "Kaplan & Nortons styrkort som kompletterar det finansiella perspektivet med kund, interna processer samt innovation och lärande.", chapter: "kap7" },
  { term: "Baumols modell", definition: "Företagsledarmodell där företaget maximerar försäljningen vid en för ägarna tillfredsställande vinst, eftersom tillväxt ger ledningen lön, inflytande och status.", chapter: "kap3" },
  { term: "Begränsad rationalitet", definition: "Simons insikt att beslutsfattare inte känner alla alternativ och inte på förhand kan fastställa det bästa; grunden för satisfiering.", chapter: "kap3" },
  { term: "Befogenhetsprincipen", definition: "Principen att den som ansvarar för något också ska ha befogenheter att påverka det.", chapter: "kap5" },
  { term: "Bidragsansvar", definition: "Ansvar för täckningsbidrag, där enhetens egna kostnader och ofta tillverknings- eller inköpskostnaden dras från intäkten. Vanligt hos försäljningsavdelningar.", chapter: "kap5" },
  { term: "Bokföringsmässiga grunder", definition: "Extern redovisnings sätt att bestämma intäkter och kostnader genom periodisering och matchning mot periodens försäljning.", chapter: "kap4" },
  { term: "Brundtlandrapporten", definition: "FN-rapporten Our Common Future (1987) som definierade hållbar utveckling som utveckling som möter dagens behov utan att äventyra kommande generationers.", chapter: "kap8" },
  { term: "Contingencyteori", definition: "Teorin att organisationer vars struktur och delsystem matchar omgivningen presterar bättre än de med sämre passform.", chapter: "kap6" },
  { term: "Differentiering", definition: "Generisk strategi där konkurrensfördel skapas genom ett unikt erbjudande som kunder värderar högre.", chapter: "kap6" },
  { term: "Distribuerad intelligens", definition: "Idén att hållbarhetsledarskap kan komma från praktiker utanför toppledningen som ser sig som del av ett större samhälleligt sammanhang.", chapter: "kap8" },
  { term: "Divisionsorganisation", definition: "Organisationsform indelad efter produkter, tjänster eller geografiska marknader; underlättar nya produktområden och marknader.", chapter: "kap5" },
  { term: "Dominant design", definition: "Den branschstandard som väljs och avslutar en jäsningsperiod. Valet avgörs av sociala, politiska och organisatoriska dynamiker, inte av teknisk logik.", chapter: "kap6" },
  { term: "Dubbelkretslärande", definition: "Lärande där man både löser det oönskade och ifrågasätter själva orsaken till det: kurerar både symptom och sjukdom.", chapter: "kap5" },
  { term: "Effektivitet", definition: "Grad av måluppfyllelse; värdet av utflödet i förhållande till värdet av inflödet, ställt mot ett mål.", chapter: "kap4" },
  { term: "Ekonomistyrning", definition: "Avsiktlig påverkan på en verksamhet och dess befattningshavare mot vissa ekonomiska mål (Nationalencyklopedin).", chapter: "kap1" },
  { term: "Emergent strategi", definition: "Framväxande strategi: mönster som växer fram ur handlingar och lärande längs vägen. Del av den realiserade strategin enligt Mintzberg.", chapter: "kap6" },
  { term: "Enkelkretslärande", definition: "Lärande där ett problem löses utan att man går till botten med orsaken.", chapter: "kap5" },
  { term: "ESG", definition: "Ramverk för att bedöma företag utifrån Environmental (miljö), Social (socialt ansvar) och Governance (bolagsstyrning).", chapter: "kap8" },
  { term: "Fokusstrategi", definition: "Generisk strategi där företaget koncentrerar sig på ett smalt segment, med kostnads- eller differentieringsinriktning.", chapter: "kap6" },
  { term: "Formella styrmedel", definition: "Styrmedelskategori som omfattar produktkalkylering, budgetering, prestationsmätning, intern redovisning, benchmarking m.m.", chapter: "kap1" },
  { term: "Fripassagerare", definition: "Anställd som bidrar lite eller inget till gruppens arbete men ändå får del av gruppbelöningen.", chapter: "kap5" },
  { term: "Funktionell integration", definition: "Dimensionen i Strategic Alignment Model som avser kopplingen mellan verksamhet och IT.", chapter: "kap9" },
  { term: "Funktionsorganisation", definition: "Organisationsform strukturerad efter funktioner som marknadsföring, produktion och ekonomi.", chapter: "kap5" },
  { term: "Företag", definition: "I företagsekonomisk mening en sammanslutning av personer som medvetet arbetar för att uppnå ett eller flera mål; inkluderar offentlig verksamhet och föreningar.", chapter: "kap1" },
  { term: "Företagskultur", definition: "Organisationens inre liv: sättet att leva, tänka, handla och vara. Ett mindre formaliserat styrmedel.", chapter: "kap5" },
  { term: "Företagsledarmodeller", definition: "Målmodeller som utgår från att ägande och drift är åtskilda, vilket ger ledningen utrymme att arbeta mot egna mål (Baumol, Williamson).", chapter: "kap3" },
  { term: "Gapet mellan teori och praktik", definition: "Skillnaden mellan ekonomistyrning i läroböcker och i praktiken; förklaras främst av kostnads- och nyttokriteriet.", chapter: "kap5" },
  { term: "Generiska strategier", definition: "Porters tre vägar till konkurrensfördel: kostnadsledarskap, differentiering och fokus.", chapter: "kap6" },
  { term: "Horisontellt perspektiv", definition: "Synen på företaget som en värdekedja av processer och aktiviteter som skapar kundvärde; styrningens uppgift blir koordinering fram till kunden.", chapter: "kap5" },
  { term: "Hållbar utveckling", definition: "Utveckling som möter dagens behov utan att äventyra kommande generationers förmåga att möta sina egna behov.", chapter: "kap8" },
  { term: "Icke-finansiella mål", definition: "Ekonomiska mål uttryckta i annat än pengar, t.ex. nöjda kunder, produktkvalitet eller nöjda medarbetare.", chapter: "kap1" },
  { term: "Inbetalning och utbetalning", definition: "Begreppspar knutet till de tillfällen då likvida medel överförs, alltså betalningstransaktionerna.", chapter: "kap4" },
  { term: "Inkomst och utgift", definition: "Begreppspar knutet till affärstransaktioner med externa parter; enligt praxis fakturans datering respektive fakturans ankomst.", chapter: "kap4" },
  { term: "Inre effektivitet", definition: "Att göra saker rätt: hög produktivitet, kostnadseffektivitet och väl utvecklade rutiner ur ett internt perspektiv.", chapter: "kap4" },
  { term: "Intressentmodellen", definition: "Målmodell där företaget strävar efter jämvikt med sina intressenter genom balans mellan deras bidrag och företagets belöningar; målet blir en kompromiss.", chapter: "kap3" },
  { term: "Intäkt och kostnad", definition: "Periodiserade begrepp: värdet av utförda prestationer respektive av den resursförbrukning som krävts.", chapter: "kap4" },
  { term: "IT-infrastruktur och processer", definition: "Domänen i Strategic Alignment Model som avser den interna tekniksidan: arkitektur, system, IT-processer och IT-kompetens.", chapter: "kap9" },
  { term: "IT-strategi", definition: "Domänen i Strategic Alignment Model som avser de externa teknologiska valen: teknikomfång, systemkompetenser och IT-styrning.", chapter: "kap9" },
  { term: "Jäsningsperiod (era of ferment)", definition: "Perioden efter en teknisk diskontinuitet, präglad av osäkerhet, produktfokus och kamp om branschdominans.", chapter: "kap6" },
  { term: "Kalkylmässiga grunder", definition: "Ekonomistyrningens sätt att bestämma intäkter och kostnader utifrån vad som presterats, oberoende av periodens försäljning.", chapter: "kap4" },
  { term: "Kalkylränta", definition: "Räntan som används vid nuvärdesberäkning; nivån bestäms av alternativkostnaden för kapital.", chapter: "kap3" },
  { term: "Kassaflödesbaserade modeller", definition: "Målmodeller där målet är att maximera nuvärdet av framtida nettokassaflöden ur ett aktieägarperspektiv.", chapter: "kap3" },
  { term: "Kausalmodell", definition: "Modell som länkar icke-finansiella drivare till finansiella utfall. Att sakna en är Ittner & Larckers första misstag.", chapter: "kap7" },
  { term: "Kostnadsansvar", definition: "Ansvar för resursförbrukningen för att fullgöra sin uppgift; vanligast på lägsta organisatoriska nivån, ofta som standardkostnadsansvar.", chapter: "kap5" },
  { term: "Kostnadsledarskap", definition: "Generisk strategi där konkurrensfördel skapas genom lägst kostnad i branschen.", chapter: "kap6" },
  { term: "Kostnads- och nyttokriteriet", definition: "Kriteriet att en metods nytta för måluppfyllelsen ska vägas mot dess kostnad; störst nettonytta väljs. Främsta förklaringen till gapet teori–praktik.", chapter: "kap5" },
  { term: "Kundvärde", definition: "Hur kunder värderar företagets varor och tjänster; det moderna uttrycket för yttre effektivitet.", chapter: "kap4" },
  { term: "Lärande organisation", definition: "Organisation där individers lärande sprids och omsätts i praktiken i en ständig förändrings-, förnyelse- och förbättringsprocess.", chapter: "kap5" },
  { term: "Lönsamhet", definition: "Resultat i förhållande till kapital; ett relationstal som visar hur väl verksamheten bedrivs relativt insatt kapital.", chapter: "kap4" },
  { term: "Lönsamhetsansvar", definition: "Ansvar för resultatet i förhållande till det kapital som tagits i anspråk; kräver befogenhet över intäkter, kostnader och kapital.", chapter: "kap5" },
  { term: "Medarbetarskap", definition: "Empowerment: demokratisering av arbetslivet genom reella befogenheter och inflytande. Största hindret är chefers motstånd.", chapter: "kap5" },
  { term: "Mindre formaliserade styrmedel", definition: "Styrmedelskategori som omfattar företagskultur, lärande och medarbetarskap.", chapter: "kap1" },
  { term: "Nuvärde", definition: "Vad framtida in- och utbetalningar är värda idag. Motiveras av att en krona idag kan placeras och att riskfria kronor värderas högre.", chapter: "kap3" },
  { term: "Organisationsstruktur", definition: "Styrmedelskategori som omfattar organisationsform, ansvarsfördelning och belöningssystem.", chapter: "kap1" },
  { term: "Porters fem krafter", definition: "Befintlig konkurrens, hot från nya aktörer, substitut, kundernas förhandlingsstyrka och leverantörernas förhandlingsstyrka. Lagar och regleringar ingår inte.", chapter: "kap6" },
  { term: "Produktivitet", definition: "Kvantitet utflöde i förhållande till kvantitet inflöde; samma förhållande som effektivitet men i fysiska termer.", chapter: "kap4" },
  { term: "Produktivitetsparadoxen", definition: "Att stora IT-investeringar inte automatiskt syns i produktiviteten. Lösningen anses vara omorganisering av arbetsflöden och processer.", chapter: "kap9" },
  { term: "Påverkbarhetsprincipen", definition: "Principen att den som ansvarar för något ska kunna påverka det.", chapter: "kap5" },
  { term: "Rent resultatansvar", definition: "Resultatansvar där intäkterna kommer från externa kunder och enheten har full beslutsrätt över intäkter och kostnader.", chapter: "kap5" },
  { term: "Resultat", definition: "Intäkter minus kostnader för en period; ett absolut tal.", chapter: "kap4" },
  { term: "Resultatansvar", definition: "Ansvar för intäkter minus kostnader, utan befogenhet över kapitalposter. Kan vara rent eller artificiellt.", chapter: "kap5" },
  { term: "Resursbaserat synsätt (RBV)", definition: "Synsättet att uthållig konkurrensfördel kommer från resurser som är värdefulla, sällsynta och svåra att imitera och som företaget är organiserat att utnyttja.", chapter: "kap6" },
  { term: "Retention", definition: "Fasen efter att en dominant design valts, präglad av inkrementell förändring och fokus på processteknik.", chapter: "kap6" },
  { term: "Räntabilitet", definition: "Vanligaste lönsamhetsmåttet; resultat i relation till totalt, eget eller sysselsatt kapital.", chapter: "kap4" },
  { term: "Satisfiering", definition: "Simons idé att företag söker en tillfredsställande snarare än maximal vinst, som konsekvens av begränsad rationalitet.", chapter: "kap3" },
  { term: "Seriekoppling", definition: "Att företaget tillgodoser olika intressentgruppers krav vid olika tidpunkter, vilket skapar stabilitet över tid.", chapter: "kap3" },
  { term: "Strategi", definition: "Hur affärsidén ska uppnås; en plan för hur företaget ska arbeta, inklusive konkurrensfördelar, kunder, resurser och organisation.", chapter: "kap2" },
  { term: "Strategisk ekonomistyrning", definition: "Inriktning som breddar ekonomistyrningen med externt fokus på konkurrenter och kunder, värdekedjeanalys och anpassning till strategisk inriktning.", chapter: "kap1" },
  { term: "Strategisk passform", definition: "Dimensionen i Strategic Alignment Model som avser kopplingen mellan extern strategi och intern infrastruktur.", chapter: "kap9" },
  { term: "Strategic Alignment Model", definition: "Henderson & Venkatramans modell där affärsstrategi, IT-strategi, organisationsinfrastruktur och IT-infrastruktur ska vara i samklang.", chapter: "kap9" },
  { term: "Styrmedel", definition: "Medel för att utföra ekonomistyrningens uppgifter; delas i formella styrmedel, organisationsstruktur och mindre formaliserad styrning.", chapter: "kap1" },
  { term: "Svart låda", definition: "Bilden av företaget i neoklassisk teori: en resursomvandlingsenhet där individer och omvandlingens innehåll bortses från.", chapter: "kap3" },
  { term: "Teknisk diskontinuitet", definition: "Genombrott som avviker dramatiskt från inkrementella innovationer och inleder en jäsningsperiod.", chapter: "kap6" },
  { term: "Total effektivitet", definition: "Summan av inre och yttre effektivitet; båda krävs på lång sikt för att företaget ska överleva.", chapter: "kap4" },
  { term: "Transparenstestet", definition: "Kravet att en utomstående ska kunna utläsa affärsenhetens konkurrensstrategi ur styrkortets 15–20 mått.", chapter: "kap7" },
  { term: "Triple Bottom Line", definition: "Elkingtons ramverk med tre resultatdimensioner: People (socialt), Planet (miljö) och Profit/Prosperity (ekonomi).", chapter: "kap8" },
  { term: "Verksamhetsplanering", definition: "Nedbrytning av huvudmål till delmål med handlingsplaner, riktlinjer, tidshorisont och ansvarig.", chapter: "kap2" },
  { term: "Vertikalt perspektiv", definition: "Synen på företaget som en hierarki där ägarkrav bryts ned till ansvar på lägre nivåer.", chapter: "kap5" },
  { term: "Vinstmaximeringsmodellen", definition: "Neoklassisk målmodell där vinst är företagets enda mål och handlandet antas rationellt.", chapter: "kap3" },
  { term: "Vision", definition: "Ett önskvärt framtida tillstånd: hur företaget vill uppfattas och i vilken riktning det ska utvecklas.", chapter: "kap2" },
  { term: "Värdekedja", definition: "Företaget sett som en serie processer och aktiviteter som skapar kundvärde; värdeskapande aktiviteter främjas, icke-värdeskapande minimeras.", chapter: "kap5" },
  { term: "Värde för pengarna", definition: "Uttryck för att resurser i offentlig verksamhet ska utnyttjas så att de skapar så stor nytta som möjligt.", chapter: "kap3" },
  { term: "Williamsons modell", definition: "Företagsledarmodell där ledningen maximerar sin egen nytta i form av lön, makt, status och prestige.", chapter: "kap3" },
  { term: "Yttre effektivitet", definition: "Att göra rätt saker: relationen till omvärlden i form av kundvärde, tillväxt, kvalitet och service.", chapter: "kap4" },
  { term: "Öppet systemsynsätt", definition: "Synsättet att företag har kopplingar till och relationer med sin omgivning; grunden för intressentmodellen.", chapter: "kap3" }
];
```

## Regler för innehållet

- Ändra inte faktainnehållet i `reading.js` på eget initiativ. Misstänker du ett sakfel: flagga det för användaren istället för att korrigera.
- Kortar du något för layoutskäl är det fel väg — layouten ska anpassas till texten, inte omvänt.
- Ska nya kapitel läggas till senare (för andra delkurser) används samma schema i `src/data/<delkurs>/reading.js`, och Läs-vyn läser rätt fil utifrån vald delkurs i manifestet.

## Acceptanskriterier

- [ ] `npm run build` går igenom; inga konsolfel.
- [ ] Alla 10 kapitel finns med **oförkortat** innehåll, plus alla 90+ ordlisteposter.
- [ ] Läs är första fliken; Hem har ett kort med läsprogress som pekar på läsdelen först.
- [ ] Innehållsförteckningen visar nummer, titel, lead, lästid, status och total lästid, samt en fungerande "Fortsätt läsa".
- [ ] Kapitelvyn: textkolumn ~68ch, markdown renderas korrekt (rubriker, listor, tabellen i kapitel 3, blockquotes som definitionsrutor, fetstil i `--pine`), sticky läsprogressstapel i `--brass`.
- [ ] "Kärnan i korthet" och "Se upp för" visas efter varje kapitel i rätt färgkort.
- [ ] "Markera som läst" sparas i localStorage och överlever omladdning. "Öva på detta kapitel" öppnar Öva förfiltrerat på kapitlets topics.
- [ ] Kapitelnavigering fungerar både med knappar och tangentbord (J/K, N/P, Esc).
- [ ] Sticky underrubriks-navigering på desktop, utfällbar panel på mobil.
- [ ] Ordlistan är sökbar, alfabetiskt sorterad, med A–Ö-hopp och kapitellänkar.
- [ ] Statistik visar lästa kapitel; nollställning rensar även läsprogress.
- [ ] Inga nya färger utanför de befintliga tokens; Fraunces + Inter används; mobilvänligt; synlig fokusring; reduced motion respekteras.
- [ ] All UI-text på svenska.

Bygg klart, läs själv igenom ett kapitel i webbläsaren för att kontrollera radlängd och luft, verifiera mot listan ovan och sammanfatta sedan kort vad du byggt.
