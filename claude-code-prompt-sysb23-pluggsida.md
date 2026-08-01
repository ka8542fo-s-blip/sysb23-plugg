# PROMPT TILL CLAUDE CODE — Pluggsida för SYSB23 (Lunds universitet)

## Din roll och målet

Du ska bygga **"SYSB23 Plugg"** — en interaktiv quiz- och pluggsida för kursen SYSB23 (Informationssystems- och verksamhetsutveckling, 30 hp, Ekonomihögskolan, Lunds universitet). Kursen består av flera delkurser som examineras med salstentor. Sidan börjar med den första delkursen, **Strategi och ekonomistyrning**, och är byggd för att enkelt kunna fyllas på med fler delkurser (Databaser, Processorienterad verksamhetsutveckling, Verksamhetsarkitektur, Säkerhet) senare.

Allt innehåll (kunskapsbas, frågebank, essäfrågor) finns färdigt i detta dokument och är framtaget ur kurslitteraturen och gamla tentor. **Hitta inte på egna fakta.** Din uppgift är arkitektur, kod, UI och finslipning — innehållet kopierar du in exakt som det står.

Viktig kontext om den riktiga tentan (styr flera designval nedan):
- 10 flervalsfrågor à 6 p. **Fel svar ger −1 p. Obesvarad fråga ger 0 p.** 2 essäfrågor à 20 p (inga minuspoäng). Max 100 p.
- Betygsskala: A = 85–100 %, B = 75–84, C = 65–74, D = 55–64, E = 50–54, U < 50.
- Inga hjälpmedel. Skrivs digitalt i Inspera.

## Teknisk spec

- **Stack:** Vite + React 18 + Tailwind CSS. Ren SPA, ingen backend, inga konton.
- **Persistens:** `localStorage` (nyckelprefix `sysb23:`). Spara: svarshistorik per fråga-id, provresultat, essäutkast, valda inställningar. En "Nollställ min data"-knapp under Statistik (med bekräftelse).
- **Navigation:** enkel view-state i React (ingen router behövs). Vyer: Hem, Öva, Prov, Begrepp, Essä, Statistik.
- **Struktur:**

```
src/
  main.jsx, App.jsx
  components/   (QuestionCard, OptionButton, ExplanationPanel, GradeGauge, TopicFilter, StatBar, ...)
  lib/          (scoring.js, storage.js, shuffle.js, weightedPick.js)
  data/
    index.js            — manifest över delkurser: [{ id: "strategi", name: "Strategi och ekonomistyrning", status: "aktiv" }]
    strategi/
      topics.js         — kunskapsbasen (avsnitt 5 nedan)
      questions.js      — frågebanken (avsnitt 6 nedan)
      essays.js         — essäfrågorna (avsnitt 7 nedan)
```

- **Blandning:** svarsalternativens ordning slumpas vid varje visning (Fisher–Yates). `correct` i datat pekar på författad ordning — mappa om efter blandning, hårdkoda aldrig index i UI.
- **Viktad repetition i Öva-läget:** frågor som tidigare besvarats fel får ~3× vikt, obesvarade ~2×, tidigare rätta 1×. Enkel viktad slumpdragning utan upprepning inom samma pass.
- **Tillgänglighet:** fullt tangentbordsnavigerbar (1–4 väljer alternativ, Enter bekräftar, → nästa), synlig fokusring, `prefers-reduced-motion` respekteras, semantiska knappar, kontrast ≥ WCAG AA.
- **Responsivt:** mobil först (mycket plugg sker i soffan) upp till desktop, maxbredd ~720 px för frågekort.
- Init:a git-repo med rimliga commits. `npm run build` ska fungera felfritt.

## Lägen (vyer)

**1. Hem.** Kort välkomst, val av delkurs (endast Strategi aktiv nu, kommande delkurser visas nedtonade som "Kommer under terminen"), snabbknappar till Öva/Prov, samt en kompakt statusrad: antal besvarade frågor, träffsäkerhet, svagaste ämne.

**2. Öva (lärläge).** Välj ett/flera ämnen och svårighetsgrad (eller "Allt"). En fråga i taget. Efter svar: omedelbar feedback — det valda alternativet markeras rätt/fel, det korrekta markeras, och **förklaringen för det valda alternativet visas alltid**, plus en utfällbar "Varför är de andra fel?" som listar övriga alternativs förklaringar. Visa källa (t.ex. "AJK kap 2" eller "Barney 2024"). Knapp: Nästa fråga. Ingen poängräkning med minuspoäng här — bara rätt/fel-statistik.

**3. Prov (tentasimulering).** Simulerar tentans flervalsdel: 10 frågor dras slumpmässigt men **balanserat över ämnena** (max 2 per ämne). Poäng exakt som tentan: +6 rätt, −1 fel, 0 för "Hoppa över" (egen tydlig knapp på varje fråga — lär studenten den taktiska poängen att inte chansa blint). Valbar timer, standard 20 min, går att stänga av. Ingen feedback under provet; fram/bak-navigering mellan frågorna med översiktsrad (besvarad/överhoppad). Resultatskärm: poäng av 60, procent (negativ totalpoäng golvas till 0), **betyg via Betygsmätaren** (se Designspec), och därefter full genomgång fråga för fråga med förklaringar. Provresultat sparas i historik.

**4. Begrepp (kunskapsbank).** Bläddringsbara kort per ämne ur `topics.js`: sammanfattning, nyckelpunkter och "Tentafällor" (vanliga förväxlingar). Sök-/filtrerbar. Detta är facit-nivån — samma fakta som frågorna bygger på.

**5. Essä.** De fyra essäfrågorna ur `essays.js` (två förekom på riktiga tentor HT24). Flöde per fråga: läs frågan → skriv eget svar i textarea (autosparas lokalt) → knapp "Visa checklista" fäller ut en poänglista över vad ett toppsvar innehåller → självskattning med kryssrutor per checklistpunkt → kryssen sparas. Ingen AI-rättning; poängen är aktiv återkallning.

**6. Statistik.** Träffsäkerhet per ämne (staplar), totalt besvarat, provhistorik med betyg, och en "Fokusera här"-rekommendation (ämnet med lägst träffsäkerhet och minst 5 besvarade frågor).

## Designspec — tema "Läsesalen"

Stabil, lugn akademisk identitet med boklig karaktär. Ingen mörk läge-toggle i v1. Definiera som CSS-variabler/Tailwind-tokens och använd konsekvent:

- `--paper` `#FBFAF6` — bakgrund, varm papperston
- `--ink` `#22282A` — brödtext
- `--pine` `#1F4E45` — primär (knappar, aktiv nav, rubrikaccent); hover `#173B34`
- `--brass` `#B9932F` — accent, används sparsamt: streaks, Betygsmätarens visare, "Tentafälla"-etiketter
- `--correct` `#2E7D5B`, `--correct-bg` `#EAF4EF`
- `--wrong` `#B3402E`, `--wrong-bg` `#F9ECE8`
- `--line` `#E5E1D6` — kortkanter, avdelare; kort är vita `#FFFFFF` med 1 px `--line`, radie 12 px, mycket luft, inga tunga skuggor

**Typografi:** rubriker i **Fraunces** (Google Fonts, weight 600, gärna optisk storlek), brödtext i **Inter**, siffror/poäng i tabellsiffror. Typskalan gör jobbet — låt rubriker vara stora och trygga, resten tyst.

**Signaturelement — Betygsmätaren:** på provets resultatskärm ritas den svenska betygsstegen U–E–D–C–B–A som en horisontell mässingsgraderad skala (SVG) med tröskelvärdena 50/55/65/75/85 utsatta, och en visare som animeras (respektera reduced motion) till uppnådd procent. Detta är sidans enda "spektakulära" inslag — allt annat hålls stramt.

**Mikrocopy på svenska**, aktiv form, inga utrop i onödan. Feedback är saklig: "Rätt.", "Fel — så här ligger det till:". Tomma lägen pekar framåt ("Du har inte gjort något prov ännu. Starta ditt första under Prov.").

## Datascheman

```js
// topics.js — export const topics = [ ... ]
{ id: "grunder", name: "Ekonomistyrningens grunder & styrmedel", examWeight: "hög",
  summary: "…", keyPoints: ["…"], pitfalls: ["…"] }

// questions.js — export const questions = [ ... ]
{ id: "str-q01", topic: "grunder", difficulty: 1,          // 1 = grund, 2 = standard, 3 = klurig
  question: "…",
  options: [ { text: "…", explain: "…" }, … ],             // exakt 4 alternativ, explain för VARJE
  correct: 0,                                              // index i författad ordning
  source: "AJK kap 1", reviewed: true }

// essays.js — export const essays = [ ... ]
{ id: "str-e1", question: "…", context: "…", checklist: ["…"], outline: "…" }
```

## INNEHÅLL A — Kunskapsbasen (`src/data/strategi/topics.js`)

Kopiera in exakt:

```js
export const topics = [
  {
    id: "grunder",
    name: "Ekonomistyrningens grunder & styrmedel",
    examWeight: "hög",
    summary: "Ekonomistyrning definieras (NE) som avsiktlig påverkan på en verksamhet och dess befattningshavare mot vissa ekonomiska mål. Målen kan vara finansiella (resultat, lönsamhet, kassaflöde, soliditet, likviditet) eller icke-finansiella (nöjda kunder, kvalitet, nöjda medarbetare). Traditionellt dominerar finansiella mål, men icke-finansiella blir allt viktigare eftersom de anses driva de finansiella. Ekonomistyrningens övergripande syfte är att hjälpa till att uppnå strategiska mål — den är ett medel för strategiimplementering och ska anpassas till vald strategi.",
    keyPoints: [
      "Styrmedel delas i tre kategorier: formella styrmedel (t.ex. produktkalkylering, budgetering, prestationsmätning, intern redovisning, benchmarking), organisationsstruktur (organisationsform, ansvarsfördelning, belöningssystem) och mindre formaliserad styrning (företagskultur, lärande, medarbetarskap).",
      "Kedjan: Vision → Affärsidé → Strategi → Verksamhetsplanering → Ekonomistyrning. Huvudmål bryts ned i delmål med handlingsplaner.",
      "Vertikalt perspektiv: företaget som hierarki — ägarkrav bryts ned till räntabilitets-, resultat- och kostnadsansvar nedåt i organisationen.",
      "Horisontellt perspektiv: företaget som värdekedja — processer och aktiviteter som skapar kundvärde; fokusera värdeskapande aktiviteter, minimera icke-värdeskapande. Drivs av kundorientering.",
      "Perspektiven kan kombineras, t.ex. i en matrisorganisation med både funktionsansvar (vertikalt) och processansvar mot kund (horisontellt).",
      "Strategisk ekonomistyrning: breddar uppgifterna med externt fokus (konkurrenters kostnader, kunders betalningsvilja), värdekedjeanalys och anpassning av styrningen till strategin (lågkostnad kräver annan styrning än differentiering)."
    ],
    pitfalls: [
      "Blanda inte ihop de tre styrmedelskategorierna — budgetering är formellt styrmedel, belöningssystem hör till organisationsstruktur, företagskultur är mindre formaliserad styrning.",
      "Ekonomistyrning handlar inte bara om finansiella mått och inte bara om formella tekniker."
    ]
  },
  {
    id: "vision",
    name: "Vision, affärsidé, strategi & verksamhetsplaner",
    examWeight: "hög",
    summary: "Vision = ett önskvärt framtida tillstånd; anger vart företaget är på väg och hur det vill uppfattas. Affärsidé = vad företaget ägnar sig åt och tjänar pengar på, och vad som skiljer det från andra. Strategi = hur affärsidén ska uppnås — en plan för hur företaget ska arbeta. Verksamhetsplanering = nedbrytning av huvudmål till delmål, handlingsplaner och riktlinjer.",
    keyPoints: [
      "Visionens tre funktioner: legitimerande (roll i samhället), ambition & fokus (ramar för affärsidé och strategi), identifikation & motivation (engagemang hos anställda).",
      "Affärsidén klargör varor/tjänster, kunder, marknader och utvecklingsriktning — den beskriver hur intäkter genereras.",
      "Strategin klargör bl.a. konkurrensfördelar, styrkor/svagheter, produktområden, kundkategorier, hur konkurrenthot möts, organisation, kompetens, resurser och finansiering.",
      "Stora företag har strategier på flera nivåer: koncern-, affärsområdes-, divisions-, affärsenhets- och funktionsstrategi. Ekonomistyrning sker främst på divisions-/affärsenhetsnivå.",
      "Klassisk tentafråga: visionen beskriver företagets framtida riktning, affärsidén vad företaget gör och hur det genererar intäkter."
    ],
    pitfalls: [
      "Vision är INTE en konkret plan och INTE främst extern kommunikation — den är det önskade framtida tillståndet.",
      "Affärsidén beskriver inte framtidsdrömmar — det gör visionen."
    ]
  },
  {
    id: "mal",
    name: "Företagets mål — teorier och modeller",
    examWeight: "hög",
    summary: "Det finns ingen enskild teori som ger ett entydigt svar på vad företags mål är. Fem centrala modeller: vinstmaximeringsmodellen, företagsledarmodeller, satisfieringsmodellen, intressentmodellen och kassaflödesbaserade modeller. Vilken som passar beror på perspektiv, sammanhang och tidsaspekt.",
    keyPoints: [
      "Vinstmaximeringsmodellen (neoklassisk teori): företaget som en 'svart låda' som omvandlar inflöde till utflöde; vinst är enda målet och handlandet antas rationellt.",
      "Kritik mot vinstmaximering: företag kan ha flera mål beroende på sammanhang; full information för att maximera finns inte (osäker framtid); det finns inte en enda effektiv pris-/kvantitetskombination.",
      "Företagsledarmodeller: ägande och drift skiljs åt. Baumol — maximera försäljningen (tillväxt ger ledningen lön/status) vid tillfredsställande vinst; Williamson — ledningen maximerar egen nytta (lön, makt, status, prestige).",
      "Satisfieringsmodellen (Herbert Simon): begränsad rationalitet — beslutsfattare känner inte alla alternativ. Företag strävar efter en tillfredsställande (satisfierande) vinst i förhållande till en anspråksnivå, inte maximal vinst.",
      "Intressentmodellen: företaget som öppet system i jämvikt med intressenter (ägare, anställda, kunder, leverantörer, långivare, stat/kommun, opinionsgrupper). Balans mellan bidrag och belöningar; målet är en kompromiss mellan intressenternas krav.",
      "Kassaflödesbaserade modeller: målet är att maximera nuvärdet av framtida nettokassaflöden (aktieägarperspektiv); kräver kalkylränta; teoretiskt starkt stöd men svårt bokstavligt i praktiken.",
      "I praktiken: lönsamhet är högst rankade målet, ofta uttryckt som räntabilitet, med andra mål som delmål eller restriktioner."
    ],
    pitfalls: [
      "Satisfiering betyder inte låg ambition — det är en konsekvens av begränsad rationalitet.",
      "Intressentmodellen säger inte att alla krav uppfylls samtidigt — de tillgodoses 'seriekopplat' över tid."
    ]
  },
  {
    id: "effektivitet",
    name: "Effektivitet, produktivitet & lönsamhet",
    examWeight: "hög",
    summary: "Effektivitet = grad av måluppfyllelse, bestäms som värdet av utflödet i förhållande till värdet av inflödet mot ett mål. Produktivitet är samma kvot men i fysiska termer (kvantiteter). Total effektivitet = inre + yttre effektivitet, och båda krävs på lång sikt.",
    keyPoints: [
      "Inre effektivitet = 'att göra saker rätt': hög produktivitet, kostnadseffektivitet, ordning och reda, väl utvecklade rutiner. Internt perspektiv.",
      "Yttre effektivitet = 'att göra rätt saker': relationen till omvärlden — affärsmässighet, tillväxt, kvalitet, service; definieras allt oftare som kundvärde. Externt perspektiv.",
      "Tentaexempel: hög produktivitet men förlorade marknadsandelar = låg YTTRE effektivitet. Hög produktivitet och kostnadseffektivitet = hög INRE effektivitet.",
      "Effektivitetens svårigheter: målnivån påverkar utfallet, omvärldsfaktorer spelar in, mål kan vara motstridiga, kort sikt kan pressa effektivitet på bekostnad av lång sikt.",
      "Produktivitet kan öka fast företaget blir sämre (t.ex. snabbare men slarvigare kundservice).",
      "Resultat = intäkter − kostnader (absolut tal). Lönsamhet = resultat / kapital (relationstal, t.ex. räntabilitet) — bättre mått eftersom det relaterar utfallet till insatt kapital.",
      "Begreppspar: inbetalning/utbetalning (när pengar byter ägare), inkomst/utgift (fakturadatum vid avyttring/anskaffning), intäkt/kostnad (periodiserade — värdet av utförda prestationer resp. förbrukade resurser)."
    ],
    pitfalls: [
      "Inre/yttre förväxlas ständigt — memorera 'göra saker rätt' (inre) vs 'göra rätt saker' (yttre).",
      "Ett stort resultat betyder inte hög lönsamhet — lönsamhet kräver relation till kapitalet."
    ]
  },
  {
    id: "organisation",
    name: "Organisationsformer & ekonomiskt ansvar",
    examWeight: "medel",
    summary: "Organisationsstruktur är ett styrmedel. Vanliga organisationsformer: funktionsorganisation (indelning efter funktioner som marknadsföring, produktion, ekonomi), divisionsorganisation (indelning efter produkter/tjänster eller geografi) och matrisorganisation (kombination av vertikalt funktionsansvar och horisontellt process-/kundansvar).",
    keyPoints: [
      "Funktionsorganisation: strukturerad efter funktioner — marknadsföring, produktion, ekonomi osv.",
      "Divisionsorganisation: vanlig i stora företag eftersom den underlättar lansering av nya produktområden och inträde på nya geografiska marknader; divisioner kan få eget resultat-/lönsamhetsansvar.",
      "Matrisorganisation kombinerar det vertikala och horisontella perspektivet.",
      "Ansvarsfördelning bygger på påverkbarhets- och befogenhetsprincipen: man ska kunna påverka och ha befogenhet över det man ansvarar för.",
      "Fyra huvudslag av ekonomiskt ansvar: lönsamhetsansvar (resultat i förhållande till kapital, t.ex. räntabilitet på sysselsatt kapital), resultatansvar (intäkter − kostnader; 'rent' mot externa kunder, 'artificiellt' vid interna leveranser), intäkts-/bidragsansvar (försäljning, täckningsbidrag) och kostnadsansvar (lägsta nivån; ofta standardkostnadsansvar).",
      "Belöningssystem: finansiella och icke-finansiella belöningar, individ- eller gruppbaserade; gruppbelöningar riskerar fripassagerare.",
      "Mindre formaliserad styrning: företagskultur (organisationens inre liv), lärande och medarbetarskap (empowerment)."
    ],
    pitfalls: [
      "Divisionsorganisationens poäng är diversifiering (produkt/geografi) — inte att 'alla arbetar i samma riktning'.",
      "Lönsamhetsansvar kräver kontroll över kapital — enheter utan kapitalpåverkan får resultatansvar."
    ]
  },
  {
    id: "strategiutveckling",
    name: "Strategiämnets utveckling & Mintzberg",
    examWeight: "hög",
    summary: "Herrmann (2005) beskriver strategiämnets utveckling som evolutionscykler av variation (genombrott/diskontinuiteter), selektion (en dominant design väljs) och retention (inkrementell förfining). Fältet har gått från omvärldsfokus, via Porters positioneringsskola, till resursbaserat synsätt, och är nu inne i en era fokuserad på kunskap, lärande och innovation.",
    keyPoints: [
      "1960-talet: strategibegreppet föds (strategisk anpassning, contingencyteori — struktur ska passa omgivningen).",
      "Era 1 — omvärlden: fokus på analys av företagets omgivning; mognar när Porters branschanalys (five forces) och generiska strategier blir dominant design.",
      "Era 2 — resurserna: RBV (resource-based view) skapar ny 'era of ferment' — uthålliga konkurrensfördelar kommer från värdefulla, sällsynta och svårimiterade resurser och kärnkompetenser inuti företaget.",
      "Era 3 — nu: kunskap, lärande och innovation; lärande organisationer och kontinuerlig förnyelse som källa till uthållig konkurrensfördel.",
      "Lärande organisation: bestående beteendeförändring utifrån erfarenhet; organisatoriskt lärande uppstår när individers lärande sprids och omsätts i praktiken. Enkelkretslärande löser problemet; dubbelkretslärande ifrågasätter även orsaken.",
      "Mintzberg: strategi kan inte alltid planeras i förväg eftersom marknad och omvärld ofta är osäkra och förändras snabbt. Realiserad strategi = avsiktlig (planerad) + framväxande (emergent) strategi. Emergent betyder INTE att planering är meningslös — man anpassar och lär längs vägen."
    ],
    pitfalls: [
      "Mintzberg säger inte att planerade strategier 'alltid misslyckas' eller att strategi är irrelevant — det är klassiska felalternativ.",
      "Ordningen på erorna: omvärld/positionering FÖRE resursbaserat synsätt, som kommer FÖRE kunskaps-/lärandefokus."
    ]
  },
  {
    id: "porter",
    name: "Porters five forces & positionering",
    examWeight: "medel",
    summary: "Porters femkraftsmodell analyserar en branschs lönsamhetspotential och konkurrensintensitet. Används t.ex. när ett företag överväger att gå in i en ny bransch eller vill förstå sin branschs struktur.",
    keyPoints: [
      "De fem krafterna: (1) konkurrens mellan existerande företag i branschen, (2) hot från nya aktörer, (3) hot från substitutprodukter, (4) kundernas förhandlingsstyrka, (5) leverantörernas förhandlingsstyrka.",
      "'Lagar och regleringar' är INTE en av de fem krafterna — en återkommande distraktor på tentan.",
      "Modellen hör till positioneringsskolan: konkurrensfördel skapas genom position i branschen, via generiska strategier (kostnadsledarskap, differentiering, fokus).",
      "Typiskt användningsfall: bedöma attraktiviteten i en bransch inför inträde."
    ],
    pitfalls: [
      "Five forces analyserar branschen — inte intern arbetsmiljö, leveranskedjeoptimering eller marknadsföringskampanjer.",
      "Blanda inte ihop med SWOT eller PESTEL."
    ]
  },
  {
    id: "rbv",
    name: "Resursbaserat synsätt & Barney om AI",
    examWeight: "hög",
    summary: "RBV: uthålliga konkurrensfördelar kommer från resurser och förmågor som är värdefulla, sällsynta och svåra att imitera, och som företaget är organiserat för att utnyttja. Barney (HBR 2024) tillämpar logiken på generativ AI: AI ger dig ingen NY konkurrensfördel — men kan förstärka dem du redan har.",
    keyPoints: [
      "Historisk parallell: ångmaskinen, elmotorn och persondatorn skapade enormt värde men blev sällan källor till uthållig fördel — just för att alla tvingades införa dem. De raderade ofta etablerade företags försprång.",
      "Värdeskapande ≠ värdefångst: gen-AI sänker kostnader och driver innovation för ALLA som använder den, så besparingarna konkurreras snabbt bort.",
      "First mover-fördelar blir kortlivade: AI lär av ständigt uppdaterad data, så dina tidiga drag och strategival absorberas i den data som konkurrenternas AI sedan analyserar — sena aktörer drar nytta av dina ansträngningar.",
      "Egen 'bättre' generell modell är orealistisk mot specialiserade leverantörer; specialanpassade modeller imiteras eller köps av konkurrenter — fördelen blir tillfällig.",
      "Proprietär data skyddar sällan: konkurrenter har ofta funktionellt likvärdig data (liknande mönster ger liknande resultat), större dataset ger avtagande nytta, AI kan härleda/imitera din strategi utifrån dina synliga handlingar, och data är svår att skydda (läckor, misstag).",
      "Silverkanten: har du redan värdefulla, sällsynta, svårimiterade resurser (Barneys exempel: Amazons leverantörsrelationer, logistik och sammankopplade system) kan AI förstärka värdet av dem — insikterna är bara användbara för den som har tillgångarna.",
      "Alternativ väg: bygga hela affärsmodellen kring AI för extrem anpassningsförmåga — men tekniken är omogen och ingen har lyckats ännu."
    ],
    pitfalls: [
      "Barneys slutsats är inte 'undvik AI' — tvärtom bör AI in i beslutsprocesserna; poängen är att AI i sig inte ger uthållig fördel.",
      "Fördelen kommer från de befintliga resurserna som AI appliceras på, inte från tekniken."
    ]
  },
  {
    id: "bsc",
    name: "Balanced Scorecard (Kaplan & Norton)",
    examWeight: "hög",
    summary: "Kaplan & Norton (1993): företag har traditionellt förlitat sig för mycket på finansiella mått. Problemet: finansiella mått är historiska — de rapporterar vad som hände förra perioden utan att visa vägen framåt. BSC kompletterar det finansiella perspektivet med tre till: kund, interna processer samt innovation/lärande, och kopplar måtten till strategin.",
    keyPoints: [
      "Fyra perspektiv: finansiellt, kund, interna processer, innovation & lärande (lärande och utveckling).",
      "BSC integrerar finansiella OCH icke-finansiella mått för en bredare bild av prestationen — det är kärnskillnaden mot traditionell styrning.",
      "Balans mellan externa mått (t.ex. rörelseresultat) och interna mått (t.ex. produktutveckling); synliggör avvägningar mellan nyckelfaktorer.",
      "BSC är ingen universalmall: styrkortet skräddarsys efter affärsenhetens strategi. Transparenstest: av de 15–20 måtten ska en utomstående kunna utläsa enhetens konkurrensstrategi.",
      "Fungerar som samlingspunkt/'gemensamt språk' som integrerar förbättringsinitiativ och kommunicerar prioriteringar.",
      "Rockwater-exemplet: vision → strategi → mål → mått i alla fyra perspektiv (t.ex. anbudsträffsäkerhet, säkerhetsindex, kundnöjdhetsranking)."
    ],
    pitfalls: [
      "BSC ersätter INTE finansiella mått med kvalitativa bedömningar — det integrerar båda.",
      "BSC handlar inte primärt om miljö/CSR (det är TBL/ESG) och inte om att skydda resurser från imitation (det är RBV)."
    ]
  },
  {
    id: "matt",
    name: "Icke-finansiella mått i praktiken (Ittner & Larcker)",
    examWeight: "medel",
    summary: "Ittner & Larcker (2003): icke-finansiella mått (kundlojalitet, medarbetarnöjdhet m.m.) lovar en fylligare bild och tidigare signaler än redovisningen — men få företag lyckas, eftersom de gör fyra typiska misstag.",
    keyPoints: [
      "Misstag 1 — kopplar inte måtten till strategin: ingen orsak-verkan-modell (kausalmodell) som länkar icke-finansiella drivare till finansiella utfall; man mäter för mycket och fel saker. Positivt exempel: snabbmatskedjans kedja 'bättre rekrytering → nöjdare personal → nöjdare kunder → tillväxt och kassaflöde'.",
      "Misstag 2 — validerar inte sambanden: antagandena i modellen testas aldrig empiriskt.",
      "Misstag 3 — fel målnivåer: t.ex. jaga 100 % kundnöjdhet fast 100 %-nöjda kunder inte köper mer än 80 %-nöjda.",
      "Misstag 4 — mäter fel: ogiltiga eller opålitliga mått (för få enkätfrågor; tre team som mäter samma sak olika).",
      "Mått utan regler är lätta att manipulera: patenträkning utan lönsamhetskrav, bankkontoret som bjöd kunder på fika inför nöjdhetsmätning, kvalitetsmål som nåddes genom att omklassificera defekter.",
      "Företag som byggde och validerade kausalmodeller uppvisade signifikant högre räntabilitet (ROA/ROE) än de som inte gjorde det.",
      "Rätt arbetsgång: bygg kausalmodell → samla data → validera statistiskt → förfina → agera på fynden → utvärdera utfall."
    ],
    pitfalls: [
      "Att 'införa BSC' räcker inte — ramverket måste fyllas med företagets egna validerade samband, annars blir det en pappersprodukt.",
      "Icke-finansiella mått är minst lika manipulerbara som finansiella — de saknar redovisningens regelverk."
    ]
  },
  {
    id: "tbl",
    name: "Hållbarhet: Triple Bottom Line & ESG",
    examWeight: "hög",
    summary: "TBL (Elkington; Rogers & Hudson 2011) balanserar företagets resultat inom tre områden: socialt ansvar (People), miljömässig hållbarhet (Planet) och ekonomisk framgång (Profit/Prosperity). ESG är ett närliggande ramverk för att bedöma företag utifrån Environmental, Social och Governance.",
    keyPoints: [
      "TBL:s tre P: People = socialt ansvar och välbefinnande för anställda, samhälle och kunder; Planet = miljö; Profit/Prosperity = ekonomi. ('Purpose' är en distraktor.)",
      "Syftet med TBL: balansera resultat inom alla tre områdena — inte maximera vinst ensamt, inte bara minimera miljökostnader.",
      "Brundtlandrapportens definition av hållbar utveckling: möter dagens behov utan att äventyra kommande generationers möjligheter att möta sina.",
      "TBL gör hållbarhet mätbar ('what gets measured gets done') och synliggör både synergier (triple-win i snittet av Venn-diagrammet) och målkonflikter som kräver systemtänkande.",
      "Drivkrafter: 'pull' från ledare som ser hållbarhet som nästa utvecklingssteg, 'push' från marknadskrafter och reglering. Kräver ledarskap på alla nivåer, inte bara toppen.",
      "ESG-exempel per bokstav: E = öka energieffektivitet, minska koldioxidutsläpp; S = lika löner mellan könen, vidareutbildning av anställda; G = utvärdera styrelsens prestation och sammansättning.",
      "ESG:s syfte: skydda miljön, förbättra socialt ansvarstagande och stärka bolagsstyrningen — grund för bl.a. hållbara investeringar."
    ],
    pitfalls: [
      "Sortera ESG-exempel på rätt bokstav — löner/utbildning är S, inte G; styrelsefrågor är G.",
      "TBL handlar om balans mellan tre områden, inte om produktionskvalitet eller kostnadsminimering."
    ]
  },
  {
    id: "it",
    name: "IT & strategi: alignment och produktivitetsparadoxen",
    examWeight: "hög",
    summary: "Strategic Alignment Model (Henderson & Venkatraman 1993): IT skapar värde först när fyra domäner är i samklang — affärsstrategi, IT-strategi, organisationsinfrastruktur (och processer) samt IT-infrastruktur (och processer). Produktivitetsparadoxen: stora IT-investeringar syns inte automatiskt i produktivitetsstatistiken; lösningen anses vara att omorganisera arbetsflöden och processer så att tekniken faktiskt utnyttjas.",
    keyPoints: [
      "SAM:s fyra områden: Affärsstrategi, IT-strategi, Organisationsinfrastruktur & processer, IT-infrastruktur & processer.",
      "Två dimensioner: strategisk passform (extern strategi ↔ intern infrastruktur) och funktionell integration (verksamhet ↔ IT).",
      "Alignment är en kontinuerlig process, inte ett engångsprojekt — strategier och teknik förändras löpande.",
      "Varför viktigt: IT-investeringar utan koppling till strategi och organisation ger inte effekt (jfr produktivitetsparadoxen); väl alignad IT stödjer och kan forma affärsstrategin.",
      "Långsiktig konkurrensfördel med IT: inte tekniken i sig (den kan köpas och kopieras) utan kombinationen av IT med organisation, processer och kompetens — komplementära, svårimiterade resurser (kopplar till RBV och Barney).",
      "Produktivitetsparadoxens lösning på tentan: omorganisering av arbetsflöden och processer för att bättre utnyttja ny teknologi — inte mer teknik, inte bromsad utveckling."
    ],
    pitfalls: [
      "SAM:s fyra områden förväxlas gärna med distraktorer som 'marknadsföring', 'leveranskedja' eller 'riskhantering' — memorera de fyra rätta.",
      "Paradoxens lösning är organisatorisk förändring, inte fler teknikinvesteringar utan processförändring."
    ]
  },
  {
    id: "nyamatt",
    name: "Nya mått: hållbarhet & digitalisering",
    examWeight: "medel",
    summary: "Omvärldsförändringar — hållbarhetsmedvetenhet och digitalisering — driver fram nya typer av mått vid sidan av de traditionella finansiella. Temat knyter ihop BSC, TBL/ESG och Ittner & Larcker och är typiskt essästoff.",
    keyPoints: [
      "Hållbarhet ger ESG-/TBL-mått: koldioxidutsläpp, energieffektivitet, jämställdhet, personalomsättning, samhällspåverkan — ofta i hållbarhetsredovisning.",
      "Digitalisering ger datadrivna mått: kundnöjdhet (NKI/NPS), kundbortfall, digital användning, processdata i realtid — tidigare signaler än bokslutet.",
      "Ramverk för balansen: BSC (fyra perspektiv där icke-finansiella mått driver finansiella) och TBL (tre 'resultaträkningar').",
      "Hur måtten förändrar arbetet: 'what gets measured gets done' — mått styr beteende, belöningar och investeringar; icke-finansiella mått fungerar som ledande indikatorer för framtida finansiellt utfall.",
      "Risker (Ittner & Larcker): mät bara det som är kopplat till strategin, validera orsakssambanden, sätt rimliga målnivåer, mät korrekt — annars manipulation och felinvesteringar.",
      "Traditionella finansiella mål försvinner inte: konsten är kombinationen — finansiella mått visar utfallet, de nya måtten visar drivkrafterna."
    ],
    pitfalls: [
      "Skriv inte att nya mått ersätter finansiella — de kompletterar och driver dem.",
      "Ge alltid konkreta exempel på mått i essäsvar, inte bara ramverksnamn."
    ]
  }
];
```

## INNEHÅLL B — Frågebanken (`src/data/strategi/questions.js`)

Frågorna är egenskrivna utifrån kurslitteraturen och de gamla tentornas teman (de är inte kopior av riktiga tentafrågor). Kopiera in exakt:

```js
export const questions = [
  { id: "str-q01", topic: "grunder", difficulty: 1,
    question: "Hur definieras ekonomistyrning (enligt Nationalencyklopedin, som kurslitteraturen utgår från)?",
    options: [
      { text: "Avsiktlig påverkan på en verksamhet och dess befattningshavare mot vissa ekonomiska mål.", explain: "Rätt — definitionen betonar avsiktlig påverkan, verksamheten och dess människor, samt ekonomiska mål (som kan vara både finansiella och icke-finansiella)." },
      { text: "Sammanställning och rapportering av företagets externa redovisning till ägare och långivare.", explain: "Det beskriver extern redovisning — ekonomistyrning är bredare och riktas inåt mot styrning av verksamheten." },
      { text: "Maximering av företagets vinst genom kostnadskontroll.", explain: "Vinstmaximering är en målmodell, inte definitionen av ekonomistyrning — och styrning kan avse många slags ekonomiska mål." },
      { text: "Statlig reglering av företagens ekonomiska rapportering.", explain: "Ekonomistyrning är företagets egen styrning, inte extern reglering." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q02", topic: "grunder", difficulty: 1,
    question: "Vilka tre kategorier av styrmedel brukar ekonomistyrningen delas in i?",
    options: [
      { text: "Budgetering, kalkylering och redovisning.", explain: "Detta är tre exempel inom EN kategori (formella styrmedel), inte de tre kategorierna." },
      { text: "Formella styrmedel, organisationsstruktur och mindre formaliserad styrning.", explain: "Rätt — formella styrmedel (t.ex. budgetering, produktkalkylering), organisationsstruktur (organisationsform, ansvarsfördelning, belöningssystem) och mindre formaliserad styrning (kultur, lärande, medarbetarskap)." },
      { text: "Vision, affärsidé och strategi.", explain: "Det är ekonomistyrningens utgångspunkter, inte styrmedlen." },
      { text: "Planering, genomförande och uppföljning.", explain: "Det beskriver styrprocessens faser, inte styrmedelskategorierna." }
    ],
    correct: 1, source: "AJK kap 1 & 3", reviewed: true },

  { id: "str-q03", topic: "grunder", difficulty: 2,
    question: "Vad utmärker det horisontella perspektivet på ekonomistyrning?",
    options: [
      { text: "Företaget ses som en hierarki där ägarkrav bryts ned till ansvar på lägre nivåer.", explain: "Det är det vertikala perspektivet." },
      { text: "Företaget ses som en värdekedja av processer och aktiviteter som ska skapa kundvärde.", explain: "Rätt — utgångspunkten är kunden; värdeskapande aktiviteter främjas och icke-värdeskapande minimeras, och samordning mellan leden blir styrningens uppgift." },
      { text: "Styrningen fokuserar enbart på finansiella nyckeltal per avdelning.", explain: "Snarare tvärtom — kundperspektivet lyfter fram icke-finansiella faktorer som kvalitet och leveranstid." },
      { text: "Alla beslut centraliseras till företagsledningen.", explain: "Centralisering hör ihop med hierarkitänkande, inte värdekedjeperspektivet." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q04", topic: "grunder", difficulty: 2,
    question: "Vad kännetecknar strategisk ekonomistyrning jämfört med traditionell ekonomistyrning?",
    options: [
      { text: "Den avskaffar budgetar och kalkyler helt.", explain: "Nej — den kompletterar med nya metoder (t.ex. värdekedjeanalys, balanserat styrkort) snarare än avskaffar." },
      { text: "Den fokuserar uteslutande på kostnadsminimering.", explain: "Tvärtom betonas även differentiering och icke-finansiella strategiskt viktiga aspekter." },
      { text: "Det interna fokuset kompletteras med externt fokus på konkurrenter och kunder, och styrningen anpassas till vald strategi.", explain: "Rätt — t.ex. konkurrenters kostnadsnivåer och kunders betalningsvilja analyseras, och en lågkostnadsstrategi kräver annan styrning än en differentieringsstrategi." },
      { text: "Den flyttar ansvaret för strategin från ledningen till ekonomiavdelningen.", explain: "Ansvaret flyttas inte — ekonomistyrningen ska stödja strategiarbetet." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q05", topic: "vision", difficulty: 1,
    question: "Hur skiljer sig en vision från en affärsidé?",
    options: [
      { text: "Visionen beskriver hur företaget tjänar pengar, affärsidén beskriver framtidsdrömmar.", explain: "Precis tvärtom — det är affärsidén som handlar om vad man tjänar pengar på." },
      { text: "Visionen beskriver företagets önskade framtida riktning, affärsidén vad företaget gör och hur intäkter genereras.", explain: "Rätt — vision = önskvärt framtida tillstånd; affärsidé = vad företaget ägnar sig åt, för vilka kunder, och vad som skiljer det från andra." },
      { text: "Visionen är en kortsiktig plan medan affärsidén är långsiktig.", explain: "Visionen är långsiktig och ingen konkret plan alls." },
      { text: "Visionen används internt medan affärsidén enbart kommuniceras externt.", explain: "Båda används både internt och externt; skillnaden ligger i innehållet, inte publiken." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q06", topic: "vision", difficulty: 2,
    question: "Vilka tre funktioner har en vision enligt kurslitteraturen?",
    options: [
      { text: "Legitimerande, ambition & fokus samt identifikation & motivation.", explain: "Rätt — visionen sätter in företaget i ett samhällsperspektiv, anger ambitionsnivå som ramar in affärsidé och strategi, samt skapar engagemang och delaktighet." },
      { text: "Planering, budgetering och uppföljning.", explain: "Det är styrprocessaktiviteter, inte visionens funktioner." },
      { text: "Prissättning, positionering och promotion.", explain: "Det är marknadsföringsbegrepp." },
      { text: "Rekrytering, belöning och avveckling.", explain: "Det är HR-processer, inte visionens funktioner." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q07", topic: "vision", difficulty: 1,
    question: "Vad klargör ett företags strategi, enligt kurslitteraturens grundläggande definition?",
    options: [
      { text: "Hur affärsidén ska uppnås — en plan för hur företaget ska arbeta.", explain: "Rätt — strategin beskriver bl.a. konkurrensfördelar, produktområden, kundkategorier, organisation och resurser för att förverkliga affärsidén." },
      { text: "Företagets önskade framtida tillstånd.", explain: "Det är visionen." },
      { text: "Nedbrytningen av delmål till individuella arbetsuppgifter.", explain: "Det ligger närmare verksamhetsplaneringen, som kommer efter strategin." },
      { text: "Företagets bokföringsprinciper.", explain: "Redovisningsprinciper är inte strategi." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q08", topic: "vision", difficulty: 2,
    question: "I vilken ordning hänger begreppen samman, från övergripande till konkret?",
    options: [
      { text: "Strategi → Vision → Ekonomistyrning → Affärsidé → Verksamhetsplanering.", explain: "Fel ordning — visionen är utgångspunkten, inte strategin." },
      { text: "Affärsidé → Vision → Verksamhetsplanering → Strategi → Ekonomistyrning.", explain: "Visionen kommer före affärsidén, och strategin före verksamhetsplaneringen." },
      { text: "Vision → Affärsidé → Strategi → Verksamhetsplanering → Ekonomistyrning.", explain: "Rätt — visionen ramar in affärsidén, strategin anger hur affärsidén uppnås, verksamhetsplaneringen bryter ned målen, och ekonomistyrningen styr mot de ekonomiska målen." },
      { text: "Ekonomistyrning → Strategi → Affärsidé → Vision → Verksamhetsplanering.", explain: "Ekonomistyrningen är medlet i slutet av kedjan, inte utgångspunkten." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q09", topic: "mal", difficulty: 1,
    question: "Vilken kritik brukar riktas mot vinstmaximering som företagets enda mål?",
    options: [
      { text: "Vinst är alltid oviktigt för moderna företag.", explain: "Överdrift — vinst är fortsatt centralt, kritiken gäller antagandet att den är det ENDA målet." },
      { text: "Företag kan ha flera olika mål beroende på sammanhang, och full information för att maximera saknas.", explain: "Rätt — mål varierar med situation och tid, och beslut fattas inför en osäker framtid vilket gör maximering praktiskt omöjlig att säkerställa." },
      { text: "Företag agerar alltid enligt marknadens lagar.", explain: "Det är snarare ett antagande i den neoklassiska teorin än en kritik mot den." },
      { text: "Vinstmaximering är olaglig i de flesta länder.", explain: "Det finns inget sådant förbud." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q10", topic: "mal", difficulty: 2,
    question: "Vad innebär Herbert Simons satisfieringsmodell?",
    options: [
      { text: "Företag strävar efter maximal vinst genom fullständig information.", explain: "Det är den neoklassiska vinstmaximeringsmodellen som Simon kritiserar." },
      { text: "Företagsledningen maximerar sin egen nytta i form av lön, makt och status.", explain: "Det är Williamsons företagsledarmodell." },
      { text: "Företag strävar efter en tillfredsställande vinst i förhållande till en anspråksnivå, eftersom rationaliteten är begränsad.", explain: "Rätt — beslutsfattare känner inte alla alternativ och nöjer sig därför med ett alternativ som uppfyller ett preciserat minimikrav; det är en konsekvens av begränsad rationalitet, inte låg ambition." },
      { text: "Företagets mål är en kompromiss mellan intressenternas krav.", explain: "Det är intressentmodellen." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q11", topic: "mal", difficulty: 2,
    question: "Vad är utgångspunkten i intressentmodellen?",
    options: [
      { text: "Företaget är ett slutet system utan relationer till omgivningen.", explain: "Tvärtom — intressentmodellen bygger på det öppna systemsynsättet." },
      { text: "Företaget strävar efter jämvikt med sina intressenter genom balans mellan deras bidrag och företagets belöningar.", explain: "Rätt — målet blir en kompromiss mellan intressentkraven, som ofta tillgodoses 'seriekopplat' över tid för att säkra fortsatt drift." },
      { text: "Endast aktieägarnas avkastningskrav är relevanta.", explain: "Det är närmare det kassaflödesbaserade aktieägarperspektivet." },
      { text: "Företagets mål bestäms av staten.", explain: "Staten är EN intressent bland flera, inte den som ensam bestämmer målet." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q12", topic: "mal", difficulty: 2,
    question: "Vad går de kassaflödesbaserade målmodellerna ut på?",
    options: [
      { text: "Att maximera nuvärdet av framtida nettokassaflöden, ur ett aktieägarperspektiv.", explain: "Rätt — framtida in- minus utbetalningar diskonteras med en kalkylränta; en krona idag är värd mer än en krona i morgon, och riskfria kronor värderas högre än riskfyllda." },
      { text: "Att maximera periodens bokföringsmässiga resultat.", explain: "Redovisat resultat kan avvika från kassaflödet genom periodiseringar — modellen fokuserar betalningsströmmar." },
      { text: "Att minimera företagets utbetalningar oavsett intäkter.", explain: "Det skulle strypa verksamheten — det är nettoflödets nuvärde som ska maximeras." },
      { text: "Att hålla kassan så stor som möjligt vid varje tidpunkt.", explain: "Stor kassa är inte målet; kapital ska arbeta och generera framtida flöden." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q13", topic: "mal", difficulty: 3,
    question: "Baumols försäljningsmaximeringsmodell antar att företag strävar efter att…",
    options: [
      { text: "…maximera försäljningen, under villkoret att vinsten är tillfredsställande för ägarna.", explain: "Rätt — tillväxt ger ledningen högre löner, inflytande och status, vilket antas väga tyngre än ytterligare vinst; en godtagbar vinstnivå är dock en restriktion." },
      { text: "…maximera vinsten på kort sikt.", explain: "Det är den neoklassiska modellen, inte Baumols." },
      { text: "…minimera antalet anställda.", explain: "Ingen av målmodellerna handlar om detta." },
      { text: "…maximera utdelningen till aktieägarna varje år.", explain: "Utdelningsmaximering är inte Baumols poäng — försäljningen/tillväxten står i centrum." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q14", topic: "effektivitet", difficulty: 1,
    question: "Hur definieras effektivitet i kurslitteraturen?",
    options: [
      { text: "Antal producerade enheter per arbetad timme.", explain: "Det är ett exempel på produktivitet (fysiska termer), inte effektivitetens definition." },
      { text: "Grad av måluppfyllelse — värdet av utflödet i förhållande till värdet av inflödet, ställt mot ett mål.", explain: "Rätt — effektiviteten anger hur väl företaget når sina mål; observera att den därmed beror på målnivån." },
      { text: "Skillnaden mellan intäkter och kostnader.", explain: "Det är resultatet." },
      { text: "Företagets marknadsandel i procent.", explain: "Marknadsandel kan vara ETT mål, men är inte definitionen av effektivitet." }
    ],
    correct: 1, source: "AJK kap 2", reviewed: true },

  { id: "str-q15", topic: "effektivitet", difficulty: 1,
    question: "Vad kännetecknar hög INRE effektivitet?",
    options: [
      { text: "Hög kundnöjdhet och starkt varumärke.", explain: "Det är yttre effektivitet — relationen till omvärlden." },
      { text: "Hög produktivitet och kostnadseffektivitet — att 'göra saker rätt'.", explain: "Rätt — inre effektivitet handlar om resurshushållning ur ett internt perspektiv: produktivitet, ordning och reda, väl utvecklade rutiner." },
      { text: "Snabb tillväxt på nya marknader.", explain: "Tillväxt hör till den yttre effektiviteten." },
      { text: "Många designpriser för produkterna.", explain: "Extern uppskattning av produkterna hör till yttre effektivitet." }
    ],
    correct: 1, source: "AJK kap 2", reviewed: true },

  { id: "str-q16", topic: "effektivitet", difficulty: 2,
    question: "Ett företag har mycket hög produktivitet i fabriken men tappar stadigt marknadsandelar. Vad tyder det på?",
    options: [
      { text: "Låg inre effektivitet.", explain: "Nej — hög produktivitet talar för god INRE effektivitet." },
      { text: "Låg yttre effektivitet.", explain: "Rätt — företaget 'gör saker rätt' men verkar inte 'göra rätt saker': erbjudandet skapar inte tillräckligt kundvärde relativt konkurrenterna." },
      { text: "Hög total effektivitet.", explain: "Total effektivitet kräver att BÅDE inre och yttre är höga." },
      { text: "Hög lönsamhet.", explain: "Fallande marknadsandelar hotar snarare lönsamheten på sikt." }
    ],
    correct: 1, source: "AJK kap 2", reviewed: true },

  { id: "str-q17", topic: "effektivitet", difficulty: 2,
    question: "Varför anses lönsamhet vara ett bättre mått än resultat på hur väl verksamheten går?",
    options: [
      { text: "Lönsamhet sätter resultatet i relation till det kapital som används.", explain: "Rätt — resultatet är ett absolut tal; lönsamhet (t.ex. räntabilitet) är ett relationstal som visar hur väl kapitalet förräntas, vilket gör företag jämförbara." },
      { text: "Lönsamhet är alltid högre än resultatet.", explain: "Meningslös jämförelse — de mäter olika saker (kvot respektive absolut tal)." },
      { text: "Resultatet kan inte beräknas i tjänsteföretag.", explain: "Resultat kan beräknas i alla företag." },
      { text: "Lönsamhet påverkas inte av kostnader.", explain: "Kostnader påverkar resultatet och därmed även lönsamheten." }
    ],
    correct: 0, source: "AJK kap 2", reviewed: true },

  { id: "str-q18", topic: "effektivitet", difficulty: 3,
    question: "Vilket begreppspar är knutet till tidpunkten då likvida medel faktiskt byter ägare?",
    options: [
      { text: "Inkomst och utgift.", explain: "De knyts till affärstransaktionerna (i praktiken fakturadatum), inte till betalningen." },
      { text: "Intäkt och kostnad.", explain: "De är periodiserade — värdet av utförda prestationer respektive förbrukade resurser under en period." },
      { text: "Inbetalning och utbetalning.", explain: "Rätt — dessa avser själva betalningstransaktionerna, som kan ske både före och efter att inkomsten/utgiften uppstått (t.ex. vid kreditförsäljning)." },
      { text: "Tillgång och skuld.", explain: "Det är balansräkningsposter, inte flödesbegrepp." }
    ],
    correct: 2, source: "AJK kap 2", reviewed: true },

  { id: "str-q19", topic: "organisation", difficulty: 1,
    question: "Vad kännetecknar en funktionsorganisation?",
    options: [
      { text: "Organisationen är indelad efter produkter eller tjänster.", explain: "Det beskriver en divisionsorganisation." },
      { text: "Organisationen är strukturerad efter funktioner som marknadsföring, produktion och ekonomi.", explain: "Rätt — specialistkompetens samlas per funktion; vanligt i mindre och medelstora företag med homogen verksamhet." },
      { text: "Organisationen byggs kring tillfälliga projektgrupper.", explain: "Det liknar projekt-/matrisformer snarare än funktionsorganisation." },
      { text: "Organisationen saknar chefer helt.", explain: "Funktionsorganisationen är hierarkisk med funktionschefer." }
    ],
    correct: 1, source: "AJK kap 3 / föreläsning", reviewed: true },

  { id: "str-q20", topic: "organisation", difficulty: 2,
    question: "Varför har stora företag ofta tydliga inslag av divisionsorganisation?",
    options: [
      { text: "Det underlättar att lansera nya produktområden och gå in på nya geografiska marknader.", explain: "Rätt — divisioner kan drivas som egna resultat-/lönsamhetsenheter per produktområde eller region, vilket gör diversifiering hanterbar." },
      { text: "Det garanterar att alla anställda arbetar med samma produkt.", explain: "Tvärtom — divisioner finns just för att hantera OLIKA produkter/marknader." },
      { text: "Det eliminerar behovet av ekonomistyrning.", explain: "Snarare ökar behovet av ansvarsfördelning och prestationsmätning per division." },
      { text: "Det är ett lagkrav för börsnoterade bolag.", explain: "Det finns inget sådant krav." }
    ],
    correct: 0, source: "AJK kap 3 / föreläsning", reviewed: true },

  { id: "str-q21", topic: "organisation", difficulty: 2,
    question: "Vilka två principer ska styra fördelningen av ekonomiskt ansvar?",
    options: [
      { text: "Påverkbarhetsprincipen och befogenhetsprincipen.", explain: "Rätt — befattningshavare ska kunna påverka det de ansvarar för och ha befogenheter att göra det; annars förlorar styrningen effekt." },
      { text: "Försiktighetsprincipen och matchningsprincipen.", explain: "Det är redovisningsprinciper." },
      { text: "Senioritetsprincipen och rotationsprincipen.", explain: "Dessa är inte principer för ansvarsfördelning i ekonomistyrningen." },
      { text: "Maximerings- och minimeringsprincipen.", explain: "Påhittade alternativ — inga etablerade ansvarprinciper." }
    ],
    correct: 0, source: "AJK kap 3", reviewed: true },

  { id: "str-q22", topic: "organisation", difficulty: 3,
    question: "En enhet ansvarar för intäkter och kostnader men har inte befogenhet över kapitalposter. Vilket ansvar är lämpligast?",
    options: [
      { text: "Lönsamhetsansvar.", explain: "Lönsamhetsansvar kräver möjlighet att påverka även kapitalet (resultat i förhållande till kapital)." },
      { text: "Resultatansvar.", explain: "Rätt — resultatansvar avser intäkter minus kostnader; utan kapitalpåverkan vore räntabilitetskrav orättvist enligt påverkbarhetsprincipen." },
      { text: "Kostnadsansvar.", explain: "För snävt — enheten påverkar ju även intäkter." },
      { text: "Standardkostnadsansvar.", explain: "Det är en form av kostnadsansvar för t.ex. tillverkande enheter." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q23", topic: "strategiutveckling", difficulty: 1,
    question: "Varför kan en strategi enligt Mintzberg inte alltid planeras fullt ut i förväg?",
    options: [
      { text: "Strategier som planeras i förväg misslyckas alltid.", explain: "För kategoriskt — Mintzberg avfärdar inte planering, han kompletterar den." },
      { text: "Marknad och omvärld är ofta osäkra och förändras snabbt, så strategin växer delvis fram längs vägen.", explain: "Rätt — realiserad strategi är en kombination av avsiktlig (planerad) och framväxande (emergent) strategi; företaget lär och anpassar sig." },
      { text: "Långsiktig planering är för dyr för att löna sig.", explain: "Kostnad är inte Mintzbergs argument — osäkerheten är." },
      { text: "Strategiarbete är irrelevant och bör ersättas av improvisation.", explain: "Emergent strategi är lärande anpassning, inte planlös improvisation." }
    ],
    correct: 1, source: "Mintzberg / föreläsning", reviewed: true },

  { id: "str-q24", topic: "strategiutveckling", difficulty: 2,
    question: "I vilken ordning har strategiämnets dominerande fokus utvecklats enligt Herrmann (2005)?",
    options: [
      { text: "Resurser → omvärld/positionering → kunskap och lärande.", explain: "RBV kom EFTER positioneringsskolan, inte före." },
      { text: "Kunskap och lärande → resurser → omvärld/positionering.", explain: "Omvänd ordning — kunskaps-/lärandefokus är den NUVARANDE eran." },
      { text: "Omvärld/positionering → resurser (RBV) → kunskap, lärande och innovation.", explain: "Rätt — omvärldsfokuset mognade med Porters branschanalys och generiska strategier; RBV flyttade blicken inåt mot resurser; idag dominerar kunskap, lärande och innovation." },
      { text: "Ekonomistyrning → marknadsföring → digitalisering.", explain: "Det är inte Herrmanns indelning av strategifältet." }
    ],
    correct: 2, source: "Herrmann (2005)", reviewed: true },

  { id: "str-q25", topic: "strategiutveckling", difficulty: 2,
    question: "Vad menas med en 'lärande organisation'?",
    options: [
      { text: "En organisation där alla anställda har akademisk examen.", explain: "Formell utbildning är inte poängen." },
      { text: "En organisation med kultur och klimat där erfarenheter sprids och omsätts i ständig förändring, förnyelse och förbättring.", explain: "Rätt — individers lärande blir organisatoriskt när kunskapen sprids och tillämpas; det kräver att experiment, initiativ och ifrågasättande är accepterat." },
      { text: "En organisation som outsourcar all kompetensutveckling.", explain: "Snarare motsatsen till att bygga eget lärande." },
      { text: "En organisation som enbart lär av konkurrenters misstag.", explain: "Erfarenhetsbaserat eget lärande står i centrum, inte bara omvärldsbevakning." }
    ],
    correct: 1, source: "AJK kap 3 / Herrmann (2005)", reviewed: true },

  { id: "str-q26", topic: "strategiutveckling", difficulty: 3,
    question: "Vad skiljer dubbelkretslärande från enkelkretslärande?",
    options: [
      { text: "Dubbelkretslärande innebär att två personer alltid lär sig samtidigt.", explain: "Antalet personer har inget med begreppet att göra." },
      { text: "Enkelkretslärande löser problemet; dubbelkretslärande ifrågasätter dessutom orsaken bakom problemet.", explain: "Rätt — enkelkrets 'kurerar symptomen', dubbelkrets tar sig även an 'sjukdomen' genom att ompröva underliggande antaganden och arbetssätt." },
      { text: "Dubbelkretslärande sker endast i digitala system.", explain: "Begreppen gäller mänskligt och organisatoriskt lärande." },
      { text: "Enkelkretslärande är alltid bättre eftersom det går snabbare.", explain: "Snabbare, ja — men utan orsaksanalys återkommer problemen." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q27", topic: "porter", difficulty: 1,
    question: "Vilken av följande är INTE en av Porters fem krafter?",
    options: [
      { text: "Leverantörernas förhandlingsstyrka.", explain: "Detta ÄR en av de fem krafterna." },
      { text: "Hot från substitutprodukter.", explain: "Detta ÄR en av de fem krafterna." },
      { text: "Lagar och regleringar som påverkar branschen.", explain: "Rätt — reglering ingår inte som egen kraft i modellen (den fångas i omvärldsanalyser som PESTEL); en klassisk tentadistraktor." },
      { text: "Konkurrens mellan existerande företag i branschen.", explain: "Detta ÄR en av de fem krafterna — ofta beskriven som modellens mittpunkt." }
    ],
    correct: 2, source: "Porter / föreläsning", reviewed: true },

  { id: "str-q28", topic: "porter", difficulty: 1,
    question: "I vilket sammanhang är en femkraftsanalys mest användbar?",
    options: [
      { text: "När företaget vill förbättra de anställdas arbetsmiljö.", explain: "Internt HR-arbete — inte branschstrukturanalys." },
      { text: "När företaget överväger att gå in i en ny bransch.", explain: "Rätt — modellen bedömer branschens lönsamhetspotential och konkurrenstryck, vilket är precis vad ett inträdesbeslut kräver." },
      { text: "När företaget utvärderar en enskild marknadsföringskampanj.", explain: "För operativt — modellen analyserar branschnivån." },
      { text: "När företaget optimerar sin interna leveranskedja.", explain: "Leveranskedjeoptimering är intern effektivitet, inte branschanalys." }
    ],
    correct: 1, source: "Porter / föreläsning", reviewed: true },

  { id: "str-q29", topic: "porter", difficulty: 2,
    question: "Vilka är Porters generiska strategier?",
    options: [
      { text: "Kostnadsledarskap, differentiering och fokus.", explain: "Rätt — konkurrensfördel nås genom lägst kostnad, unikt erbjudande, eller koncentration på ett smalt segment (med kostnads- eller differentieringsinriktning)." },
      { text: "Tillväxt, mognad och nedgång.", explain: "Det är produktlivscykelns faser." },
      { text: "Vision, mission och värdegrund.", explain: "Styrfilosofiska begrepp, inte konkurrensstrategier." },
      { text: "Centralisering, decentralisering och outsourcing.", explain: "Organisationsval, inte Porters generiska strategier." }
    ],
    correct: 0, source: "Porter / Herrmann (2005)", reviewed: true },

  { id: "str-q30", topic: "rbv", difficulty: 1,
    question: "Vilka egenskaper ska resurser ha för att ge uthållig konkurrensfördel enligt det resursbaserade synsättet?",
    options: [
      { text: "De ska vara billiga, standardiserade och lätta att köpa in.", explain: "Sådana resurser kan alla skaffa — ingen fördel uppstår." },
      { text: "De ska vara värdefulla, sällsynta och svåra att imitera, och företaget ska vara organiserat för att utnyttja dem.", explain: "Rätt — det är kärnan i RBV (VRIO-logiken); fördelen sitter i det konkurrenterna inte enkelt kan kopiera." },
      { text: "De ska vara immateriella och sakna marknadsvärde.", explain: "Immateriellt kan hjälpa imitationsskyddet men är inget krav — och värde krävs definitivt." },
      { text: "De ska vara godkända av branschorganisationen.", explain: "Extern certifiering är irrelevant för RBV-logiken." }
    ],
    correct: 1, source: "Barney / Herrmann (2005)", reviewed: true },

  { id: "str-q31", topic: "rbv", difficulty: 2,
    question: "Varför blir generativ AI enligt Barney (2024) sannolikt INTE en källa till uthållig konkurrensfördel?",
    options: [
      { text: "Tekniken skapar inget värde alls.", explain: "Fel — den skapar stort värde; problemet är att värdet inte kan FÅNGAS varaktigt av ett enskilt företag." },
      { text: "Tekniken blir snabbt tillgänglig för alla konkurrenter, så insikter och effektiviseringar jämnas ut.", explain: "Rätt — liksom ångmaskinen och persondatorn tvingas i princip alla införa den, och liknande algoritmer på liknande data ger liknande resultat." },
      { text: "AI är förbjuden inom de flesta branscher.", explain: "Det stämmer inte." },
      { text: "AI kan bara användas av teknikföretag.", explain: "Barneys exempel spänner över bank, industri och handel." }
    ],
    correct: 1, source: "Barney (2024)", reviewed: true },

  { id: "str-q32", topic: "rbv", difficulty: 2,
    question: "Hur kan företag enligt Barney (2024) ändå skapa hållbara konkurrensfördelar med hjälp av AI?",
    options: [
      { text: "Genom att applicera AI på redan värdefulla, sällsynta och svårimiterade resurser, så att tekniken förstärker befintliga fördelar.", explain: "Rätt — som Amazons logistik och leverantörsrelationer: AI-insikterna blir bara användbara för den som har tillgångarna, vilket ökar försprånget." },
      { text: "Genom att vara först med att köpa licenser till den senaste modellen.", explain: "First mover-fördelar blir kortlivade — konkurrenter följer snabbt efter och AI:n lär dessutom av dina drag." },
      { text: "Genom att hemlighålla att man använder AI.", explain: "Hemlighetsmakeri skyddar inte — resultatet av strategin syns och kan härledas/imiteras." },
      { text: "Genom att samla världens största dataset oavsett innehåll.", explain: "Större dataset ger avtagande nytta när mönstren redan framträder i mindre mängder, och konkurrenter har ofta funktionellt likvärdig data." }
    ],
    correct: 0, source: "Barney (2024)", reviewed: true },

  { id: "str-q33", topic: "rbv", difficulty: 3,
    question: "Varför ger proprietär (egen) data sällan uthållig AI-fördel enligt Barney?",
    options: [
      { text: "Egen data är alltid av för dålig kvalitet.", explain: "Kvalitet är inte huvudargumentet." },
      { text: "Konkurrenter har ofta funktionellt likvärdig data, mönster kan härledas ur dina synliga handlingar, och dataset är svåra att skydda mot läckor.", explain: "Rätt — liknande data ger liknande mönster, AI kan imitera din strategi utifrån utfallen, och 'en missnöjd anställd' kan räcka för att datan sprids." },
      { text: "Det är olagligt att träna AI på egen kunddata.", explain: "Reglering finns, men det är inte Barneys argument här." },
      { text: "Egen data blir automatiskt publik efter fem år.", explain: "Ingen sådan regel finns." }
    ],
    correct: 1, source: "Barney (2024)", reviewed: true },

  { id: "str-q34", topic: "rbv", difficulty: 3,
    question: "Vad menar Barney med att 'first mover'-fördelar med gen-AI blir kortlivade?",
    options: [
      { text: "Tidiga användare straffas av myndigheterna.", explain: "Inget sådant argument förs fram." },
      { text: "AI lär av ständigt uppdaterad data, så pionjärens val absorberas i den data som sena aktörers AI analyserar — de drar nytta av dina ansträngningar.", explain: "Rätt — därför bör AI ändå integreras i beslutsprocesserna för tillfälliga försprång, men utan förväntan om varaktig fördel." },
      { text: "Tekniken slutar utvecklas efter lansering.", explain: "Tvärtom — den blir ständigt 'smartare', vilket är en del av poängen." },
      { text: "Tidiga investeringar går aldrig att räkna hem.", explain: "Tillfälligt värde kan visst fångas — det varaktiga försprånget uteblir." }
    ],
    correct: 1, source: "Barney (2024)", reviewed: true },

  { id: "str-q35", topic: "bsc", difficulty: 1,
    question: "Varför är ett ensidigt fokus på finansiella mått problematiskt enligt Kaplan & Norton?",
    options: [
      { text: "Finansiella mått är historiska — de visar vad som hände förra perioden men ger ingen vägledning framåt.", explain: "Rätt — de rapporterar utfall utan att visa hur prestationen förbättras nästa period; därför behövs kompletterande, framåtblickande mått." },
      { text: "Finansiella mått är alltid missvisande och bör avskaffas.", explain: "För starkt — de behövs, men behöver kompletteras." },
      { text: "Finansiella mått är för svåra att beräkna.", explain: "Beräkningssvårighet är inte argumentet." },
      { text: "Finansiella mått gynnar bara små företag.", explain: "Ingen sådan poäng görs." }
    ],
    correct: 0, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q36", topic: "bsc", difficulty: 1,
    question: "Vilka är det balanserade styrkortets fyra perspektiv?",
    options: [
      { text: "Finansiellt, kund, interna processer samt innovation & lärande.", explain: "Rätt — tillsammans balanserar de externa och interna mått och kopplar dagens aktiviteter till morgondagens finansiella utfall." },
      { text: "Ekonomi, juridik, teknik och miljö.", explain: "Det liknar en PESTEL-uppdelning, inte BSC." },
      { text: "People, Planet, Profit och Purpose.", explain: "Det blandar ihop BSC med Triple Bottom Line (och Purpose är en distraktor även där)." },
      { text: "Vision, strategi, budget och bokslut.", explain: "Styrprocessens artefakter — inte styrkortets perspektiv." }
    ],
    correct: 0, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q37", topic: "bsc", difficulty: 2,
    question: "Hur skiljer sig Balanced Scorecard från traditionell, finansiellt fokuserad styrning?",
    options: [
      { text: "Det ersätter alla finansiella mått med kvalitativa bedömningar.", explain: "Nej — det finansiella perspektivet finns kvar som ett av fyra." },
      { text: "Det integrerar finansiella och icke-finansiella mått för en bredare bild av företagets prestation.", explain: "Rätt — balansen mellan utfallsmått och drivande mått kopplar styrningen till strategin." },
      { text: "Det fokuserar enbart på miljö och socialt ansvar.", explain: "Det är TBL/ESG-ramverkens fokus." },
      { text: "Det skyddar företagets resurser från att kopieras.", explain: "Imitationsskydd är RBV-logik, inte BSC." }
    ],
    correct: 1, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q38", topic: "bsc", difficulty: 3,
    question: "Vad menar Kaplan & Norton med styrkortets 'transparenstest'?",
    options: [
      { text: "Alla mått ska publiceras offentligt i årsredovisningen.", explain: "Offentlighet är inte poängen." },
      { text: "En utomstående ska kunna utläsa affärsenhetens konkurrensstrategi ur de 15–20 valda måtten.", explain: "Rätt — styrkortet är inte en universalmall utan skräddarsys, och måttvalen ska tydligt spegla strategin." },
      { text: "Måtten ska uppdateras i realtid.", explain: "Uppdateringsfrekvens är inte testet." },
      { text: "Endast finansiella mått får ingå.", explain: "Motsatsen till hela idén med balansen." }
    ],
    correct: 1, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q39", topic: "matt", difficulty: 2,
    question: "Vilket är det FÖRSTA och vanligaste misstaget företag gör med icke-finansiella mått enligt Ittner & Larcker?",
    options: [
      { text: "De mäter för sällan.", explain: "Frekvens är inte något av de fyra misstagen." },
      { text: "De kopplar inte måtten till strategin — ingen kausalmodell länkar icke-finansiella drivare till finansiella utfall.", explain: "Rätt — utan orsak-verkan-modell kan man inte välja rätt bland hundratals möjliga mått och mäter för många, irrelevanta saker." },
      { text: "De använder för få konsulter.", explain: "Konsultanvändning nämns inte som misstag." },
      { text: "De offentliggör måtten för konkurrenterna.", explain: "Sekretess är inte poängen." }
    ],
    correct: 1, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q40", topic: "matt", difficulty: 2,
    question: "Ett företag satte målet 100 % kundnöjdhet trots att helt nöjda kunder inte spenderade mer än 80 %-nöjda. Vilket misstag illustrerar det?",
    options: [
      { text: "Att inte validera sambanden.", explain: "Nära — men här FANNS data om sambandet; felet låg i målsättningen." },
      { text: "Att sätta fel prestationsmål.", explain: "Rätt — Ittner & Larckers tredje misstag: målnivåer som kostar mer än de ger; marginalnyttan av de sista procenten var noll." },
      { text: "Att mäta inkorrekt.", explain: "Mätningen i sig var inte problemet i exemplet." },
      { text: "Att belöna fel personer.", explain: "Inte ett av de fyra misstagen." }
    ],
    correct: 1, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q41", topic: "matt", difficulty: 3,
    question: "Vad fann Ittner & Larcker hos företag som byggde OCH validerade kausalmodeller för sina icke-finansiella mått?",
    options: [
      { text: "De presterade signifikant högre avkastning (ROA/ROE) än företag som inte gjorde det.", explain: "Rätt — den empiriska poängen: rätt använda icke-finansiella mått ger mätbar finansiell utdelning; slarvigt använda ger felinvesteringar." },
      { text: "De övergav snabbt alla icke-finansiella mått.", explain: "Tvärtom — de fick ut värdet av dem." },
      { text: "Ingen skillnad kunde uppmätas.", explain: "En tydlig skillnad var just studiens huvudfynd." },
      { text: "De drabbades oftare av manipulation.", explain: "Manipulation frodas snarare när mått SAKNAR koppling och validering." }
    ],
    correct: 0, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q42", topic: "tbl", difficulty: 1,
    question: "Vilken kategori i Triple Bottom Line rör socialt ansvar och välbefinnande för anställda, samhälle och kunder?",
    options: [
      { text: "Planet.", explain: "Planet avser miljödimensionen." },
      { text: "People.", explain: "Rätt — People är den sociala dimensionen: människors välbefinnande inom och utanför organisationen." },
      { text: "Prosperity.", explain: "Prosperity/Profit är den ekonomiska dimensionen." },
      { text: "Purpose.", explain: "Purpose ingår inte i TBL — en klassisk distraktor." }
    ],
    correct: 1, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q43", topic: "tbl", difficulty: 1,
    question: "Vad är syftet med Triple Bottom Line som ramverk?",
    options: [
      { text: "Att maximera ekonomisk vinst och börsvärde.", explain: "Det är precis den ensidighet TBL vill bredda." },
      { text: "Att balansera företagets resultat inom socialt ansvar, miljömässig hållbarhet och ekonomisk framgång.", explain: "Rätt — tre 'resultaträkningar' som gör hållbarhet mätbar och synliggör både synergier och målkonflikter." },
      { text: "Att minimera kostnader kopplade till miljö och socialt ansvar.", explain: "TBL handlar om att skapa resultat i alla tre dimensioner, inte om att minimera hållbarhetskostnader." },
      { text: "Att förbättra produktionskvaliteten.", explain: "Kvalitetsarbete är något annat." }
    ],
    correct: 1, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q44", topic: "tbl", difficulty: 2,
    question: "Vilken åtgärd hör hemma under 'S' i ESG-ramverket?",
    options: [
      { text: "Öka energieffektiviteten i produktionen.", explain: "Miljöåtgärd — hör till E." },
      { text: "Införa en policy för lika löner mellan könen.", explain: "Rätt — jämställdhet, arbetsvillkor och kompetensutveckling är sociala frågor (S)." },
      { text: "Utvärdera styrelsens sammansättning och arbete.", explain: "Bolagsstyrning — hör till G." },
      { text: "Minska koldioxidutsläppen från transporter.", explain: "Miljöåtgärd — hör till E." }
    ],
    correct: 1, source: "ESG / tentatema HT24", reviewed: true },

  { id: "str-q45", topic: "tbl", difficulty: 2,
    question: "Hur definierar Brundtlandrapporten hållbar utveckling?",
    options: [
      { text: "Utveckling som möter dagens behov utan att äventyra kommande generationers möjligheter att möta sina behov.", explain: "Rätt — definitionen betonar globalt ansvar, gränser för (eller omriktning av) tillväxt, social rättvisa och långsiktigt tänkande." },
      { text: "Utveckling som maximerar BNP-tillväxten varje år.", explain: "Ren tillväxtmaximering är snarare det som problematiseras." },
      { text: "Utveckling som helt stoppar användning av naturresurser.", explain: "Rapporten kräver inte nollanvändning utan ansvarsfull hushållning över generationer." },
      { text: "Utveckling som enbart gynnar utvecklingsländer.", explain: "Social rättvisa ingår, men definitionen är generationsövergripande och global." }
    ],
    correct: 0, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q46", topic: "it", difficulty: 1,
    question: "Vilka fyra områden ska anpassas till varandra enligt Strategic Alignment Model (Henderson & Venkatraman)?",
    options: [
      { text: "Affärsstrategi, IT-strategi, organisationsinfrastruktur och IT-infrastruktur.", explain: "Rätt — med två dimensioner: strategisk passform (strategi ↔ infrastruktur) och funktionell integration (verksamhet ↔ IT)." },
      { text: "Personal, affärsverksamhet, IT-strategi och leveranskedja.", explain: "Personal och leveranskedja är inte modellens domäner." },
      { text: "Produktutveckling, IT-strategi, affärsstrategi och riskhantering.", explain: "Produktutveckling och riskhantering ingår inte som domäner." },
      { text: "IT-strategi, IT-infrastruktur, marknadsföring och ekonomi.", explain: "Marknadsföring och ekonomi är fel — verksamhetssidan representeras av affärsstrategi och organisationsinfrastruktur." }
    ],
    correct: 0, source: "Henderson & Venkatraman / föreläsning", reviewed: true },

  { id: "str-q47", topic: "it", difficulty: 2,
    question: "Vad brukar lyftas fram som lösningen på produktivitetsparadoxen vid införande av ny informationsteknologi?",
    options: [
      { text: "Att investera i ännu mer teknik utan att ändra arbetssätten.", explain: "Det är receptet på att paradoxen består — tekniken utnyttjas inte." },
      { text: "Att omorganisera arbetsflöden och processer så att organisationen faktiskt utnyttjar den nya teknologin.", explain: "Rätt — produktivitetsvinsterna realiseras först när komplementära organisationsförändringar görs (nya processer, roller, kompetens)." },
      { text: "Att bromsa den teknologiska utvecklingen.", explain: "Att avstå teknik löser inte paradoxen — den handlar om hur tekniken används." },
      { text: "Att undvika teknikinvesteringar och bevara status quo.", explain: "Passivitet ger varken produktivitet eller konkurrenskraft." }
    ],
    correct: 1, source: "Föreläsning / tentatema HT24", reviewed: true },

  { id: "str-q48", topic: "it", difficulty: 2,
    question: "Varför ger IT-investeringar i sig sällan långsiktig konkurrensfördel?",
    options: [
      { text: "IT saknar helt betydelse för företags prestationer.", explain: "IT har stor betydelse — men som möjliggörare i kombination med annat." },
      { text: "Tekniken kan köpas och kopieras av konkurrenter; fördelen uppstår först i kombinationen med strategi, processer och kompetens.", explain: "Rätt — alignment plus komplementära, svårimiterade organisatoriska resurser är det som är svårt att kopiera (jfr RBV och Barney)." },
      { text: "IT-system blir alltid omoderna inom ett år.", explain: "Livslängden varierar — och är inte kärnargumentet." },
      { text: "Lagstiftning förbjuder konkurrensfördelar via IT.", explain: "Ingen sådan lag finns." }
    ],
    correct: 1, source: "Henderson & Venkatraman / Barney (2024)", reviewed: true },

  { id: "str-q49", topic: "it", difficulty: 3,
    question: "Varför beskrivs strategic alignment som en kontinuerlig process snarare än ett engångsprojekt?",
    options: [
      { text: "Eftersom modellen kräver årlig omcertifiering.", explain: "Ingen certifiering existerar." },
      { text: "Eftersom både affärsstrategi, teknik och omvärld förändras löpande, måste samspelet mellan domänerna ständigt underhållas.", explain: "Rätt — alignment är ett rörligt mål; ett läge som var i samklang i fjol kan vara i otakt i år, och själva förmågan att kontinuerligt anpassa blir en källa till fördel." },
      { text: "Eftersom IT-avdelningen byts ut varje år.", explain: "Personalomsättning är inte argumentet." },
      { text: "Eftersom modellen bara gäller nystartade företag.", explain: "Modellen gäller alla slags organisationer." }
    ],
    correct: 1, source: "Henderson & Venkatraman / föreläsning", reviewed: true }
];
```

## INNEHÅLL C — Essäträning (`src/data/strategi/essays.js`)

Kopiera in exakt:

```js
export const essays = [
  { id: "str-e1",
    question: "Varför är 'strategic alignment' mellan IT och resten av företagets verksamhet viktig? Vad innebär strategic alignment i korta drag, och hur kan man enligt synsättet uppnå långsiktiga konkurrensfördelar med hjälp av IT?",
    context: "Förekom som essäfråga på ordinarie tentan HT24 (20 p).",
    checklist: [
      "Definierar strategic alignment: samklang mellan affärsstrategi, IT-strategi, organisationsinfrastruktur/processer och IT-infrastruktur/processer (Henderson & Venkatramans modell).",
      "Nämner modellens två dimensioner: strategisk passform (strategi ↔ infrastruktur) och funktionell integration (verksamhet ↔ IT).",
      "Förklarar varför det är viktigt: IT-investeringar utan koppling till strategi och organisation ger inte effekt — koppla gärna till produktivitetsparadoxen.",
      "Betonar att alignment är en kontinuerlig process eftersom strategi, teknik och omvärld förändras.",
      "Förklarar vägen till långsiktig fördel: inte tekniken i sig (köp- och kopierbar) utan kombinationen av IT med processer, kompetens och organisation — komplementära, svårimiterade resurser (RBV-koppling).",
      "Ger ett konkret exempel (t.ex. e-handlare där IT-strategi, logistikprocesser och affärsstrategi samspelar)."
    ],
    outline: "1) Definiera alignment + modellens fyra domäner och två dimensioner. 2) Varför: IT skapar värde först i samspel med strategi/organisation; produktivitetsparadoxen som belägg. 3) Hur långsiktig fördel: kontinuerlig alignmentförmåga + komplementära organisatoriska resurser snarare än tekniken själv. 4) Exempel + kort slutsats." },

  { id: "str-e2",
    question: "Inom vissa strategiperspektiv betonas vikten av att företag är 'lärande organisationer'. Nämn ett sådant strategiperspektiv och förklara vad som avses med begreppet lärande organisation och varför det är viktigt.",
    context: "Förekom som essäfråga på ordinarie tentan HT24 (20 p).",
    checklist: [
      "Namnger ett perspektiv: det kunskaps-/lärandebaserade strategiperspektivet (den nuvarande eran i Herrmanns utvecklingslinje; kan även kopplas till RBV:s förlängning mot dynamiska förmågor).",
      "Definierar lärande: bestående beteendeförändringar utifrån erfarenhet; organisatoriskt lärande uppstår när individers lärande sprids i organisationen och omsätts i praktiken.",
      "Beskriver förutsättningarna: kultur där experiment, initiativ och ifrågasättande är accepterat.",
      "Nämner enkelkrets- kontra dubbelkretslärande (lösa problemet vs även ifrågasätta orsaken).",
      "Förklarar varför det är viktigt: snabbt föränderlig omvärld kräver kontinuerlig förnyelse; kunskap och lärandeförmåga är svåra att imitera och därmed en källa till uthållig konkurrensfördel.",
      "Knyter gärna an till Mintzbergs emergenta strategi — lärande är mekanismen bakom framväxande strategi."
    ],
    outline: "1) Perspektiv: kunskaps-/lärandefokuset som strategifältets nuvarande era (Herrmann). 2) Definition individ → organisation, förutsättningar i kulturen, enkel-/dubbelkrets. 3) Varför: förändringstakt, innovation, svårimiterad förmåga. 4) Brygga till emergent strategi + slutsats." },

  { id: "str-e3",
    question: "Jay Barney hävdar att företags investeringar i och användning av AI inte i sig leder till långsiktiga konkurrensfördelar. Vilka är hans huvudsakliga argument, och hur menar han att företag kan använda AI för att faktiskt skapa hållbara konkurrensfördelar?",
    context: "Förekom som essäfråga på omtentan HT24 (20 p).",
    checklist: [
      "Historisk parallell: ångmaskin, elmotor, PC — transformativa teknologier som alla tvingades införa och som därför sällan gav uthållig fördel (raderade ofta etablerade försprång).",
      "Värdeskapande ≠ värdefångst: AI sänker kostnader och driver innovation för alla användare, så vinsterna konkurreras bort.",
      "First mover-fördelar kortlivade: AI lär av uppdaterad data — pionjärens val absorberas i den data som konkurrenternas AI analyserar.",
      "Egen modell/proprietär data skyddar sällan: funktionellt likvärdig data hos konkurrenter, avtagande nytta av större dataset, strategin kan härledas/imiteras, data svår att skydda.",
      "Silverkanten (RBV-logiken): applicera AI på befintliga värdefulla, sällsynta, svårimiterade resurser — då förstärks fördelen (Amazon-exemplet).",
      "Nämner alternativet att bygga hela affärsmodellen kring AI (agilitet), med reservationen att det är omoget och oprövat.",
      "Slutsats med rätt nyans: använd AI aktivt — men förvänta dig fördel av dina unika resurser, inte av tekniken."
    ],
    outline: "1) Tes + historisk parallell. 2) Tre argument: värdefångstproblemet, kortlivad first mover, data/modell skyddar inte. 3) Lösningen: RBV — förstärk unika resurser med AI; ev. AI-centrerad affärsmodell. 4) Nyanserad slutsats." },

  { id: "str-e4",
    question: "Förändringar i omvärlden, som ökad medvetenhet om hållbarhet och digitalisering, driver företag att utveckla nya typer av mått för att utvärdera sin måluppfyllelse. Diskutera vilka typer av mått dessa förändringar ger upphov till och hur de påverkar företagens sätt att arbeta. Ge exempel på hur företag kan hantera både traditionella ekonomiska mål och nya omvärldsutmaningar.",
    context: "Förekom som essäfråga på omtentan HT24 (20 p).",
    checklist: [
      "Hållbarhetsmått: ESG/TBL — koldioxidutsläpp, energieffektivitet, jämställdhet, personalomsättning; hållbarhetsredovisning.",
      "Digitaliseringsmått: kundnöjdhet (NKI/NPS), kundbortfall, digital användningsdata, processmått i realtid — tidigare signaler än bokslutet.",
      "Ramverk för att kombinera: Balanced Scorecard (icke-finansiella mått som drivare av finansiella i fyra perspektiv) och Triple Bottom Line (tre resultatdimensioner).",
      "Hur arbetet påverkas: 'what gets measured gets done' — mått styr beteende, belöningar och investeringar; ledande vs släpande indikatorer.",
      "Risker och hantverk (Ittner & Larcker): koppla mått till strategin via kausalmodell, validera sambanden, sätt rimliga målnivåer, mät korrekt; annars manipulation och felinvesteringar.",
      "Balansen: nya mått ersätter inte finansiella mål utan kompletterar dem — finansiella mått visar utfallet, de nya visar drivkrafterna. Konkret företagsexempel ger högre betyg."
    ],
    outline: "1) Drivkrafterna och de nya måttypernas två familjer (hållbarhet, digitalt). 2) Ramverken BSC + TBL som integrationslösning. 3) Effekter på arbetssätt + riskerna enligt Ittner & Larcker. 4) Exempel + slutsats om komplement, inte ersättning." }
];
```

## Utökning över tid (viktigt — bygg för detta)

1. **Ny delkurs:** skapa `src/data/<delkursId>/` med samma tre filer, registrera i `data/index.js` — inget annat ska behöva ändras. Hem-vyn läser manifestet dynamiskt.
2. **Fler frågor:** när användaren ber dig generera fler frågor får du ENDAST utgå från fakta i kunskapsbasen (`topics.js`) eller nytt källmaterial användaren klistrar in. Regler: exakt 4 alternativ, `explain` för varje alternativ, distraktorer byggda på förväxlingarna i `pitfalls`, varierat `correct`-index, tentaliknande sakligt språk, sätt `reviewed: false` så användaren kan granska innan de blandas in i Prov-läget (Öva kan visa dem med en liten "Ogranskad"-etikett).
3. **Innehållet är sanningen:** ändra aldrig faktainnehåll i topics/questions/essays på eget initiativ — vid misstänkt fel, flagga det för användaren i stället.

## Acceptanskriterier

- [ ] `npm install && npm run dev` startar felfritt; `npm run build` går igenom.
- [ ] Alla 49 frågor, 13 ämnen och 4 essäfrågor finns med oförändrat innehåll.
- [ ] Öva: ämnesfilter, omedelbar feedback med förklaring för valt alternativ + "Varför är de andra fel?", viktad repetition av fel-svarade frågor fungerar.
- [ ] Prov: 10 balanserade frågor, poäng +6/−1/0 med Hoppa över-knapp, valbar timer, resultat med Betygsmätaren (trösklar 50/55/65/75/85) och full genomgång; historik sparas.
- [ ] Begrepp: alla ämneskort med nyckelpunkter och Tentafällor, sökbara.
- [ ] Essä: skriv → visa checklista → självskattning med sparade kryss; utkast autosparas.
- [ ] Statistik: träffsäkerhet per ämne, provhistorik, "Fokusera här", nollställningsknapp med bekräftelse.
- [ ] Svarsalternativ blandas vid varje visning; correct-mappningen förblir korrekt.
- [ ] Designtokens enligt "Läsesalen" används konsekvent; Fraunces + Inter laddas; mobilvänligt; tangentbordsnavigering och synlig fokus fungerar; reduced motion respekteras.
- [ ] All UI-text på svenska.

Bygg klart, verifiera mot acceptanskriterierna (kör gärna igenom ett helt prov själv i webbläsaren) och sammanfatta sedan kort vad du byggt och hur man lägger till nästa delkurs.
