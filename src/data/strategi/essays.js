// Checklistorna följer samma fyra steg i alla essäer, eftersom läraren
// premierar "relevanta argument och resonemang som kan göra kopplingar till
// kursmaterialet": vad det är, varför det spelar roll, konkret, koppling.
// Steg 4 namnger alltid det område man kopplar till. Slutraden om 300 ord
// och de fyra styckena renderas av vyn, lika för alla essäer.
export const essays = [
  { id: "str-e1",
    question: "Varför är 'strategic alignment' mellan IT och resten av företagets verksamhet viktig? Vad innebär strategic alignment i korta drag, och hur kan man enligt synsättet uppnå långsiktiga konkurrensfördelar med hjälp av IT?",
    context: "Förekom som essäfråga på ordinarie tentan HT24 (20 p).",
    checklist: [
      { heading: "Vad det är", points: [
        "Strategic alignment är samklang mellan verksamhet och IT — IT är inte en fristående funktion vid sidan om.",
        "Fyra domäner i Henderson & Venkatramans modell: affärsstrategi, IT-strategi, organisationsinfrastruktur/processer och IT-infrastruktur/processer.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Två dimensioner: strategisk passform (strategi ↔ infrastruktur) och funktionell integration (verksamhet ↔ IT).",
        "Alignment är en kontinuerlig process och går åt båda håll, eftersom strategi, teknik och omvärld förändras.",
        "IT-investeringar utan koppling till strategi och organisation ger ingen effekt.",
        "Långsiktig fördel kommer inte av tekniken i sig, som är köp- och kopierbar, utan av kombinationen IT, processer, kompetens och organisation.",
      ] },
      { heading: "Konkret", points: [
        "Ett företag som köper ett system utan att ändra arbetssätt: investeringen syns i budgeten men inte i resultatet.",
        "E-handlaren där IT-strategi, logistikprocesser och affärsstrategi samspelar.",
      ] },
      { heading: "Koppling", points: [
        "Produktivitetsparadoxen: det är precis det som händer utan alignment — IT-investeringarna syns inte i produktiviteten.",
        "Det resursbaserade synsättet: komplementära, svårimiterade organisatoriska resurser är det som gör fördelen varaktig, inte tekniken.",
      ] },
    ],
    outline: "1) Definiera alignment + modellens fyra domäner och två dimensioner. 2) Varför: IT skapar värde först i samspel med strategi/organisation; produktivitetsparadoxen som belägg. 3) Hur långsiktig fördel: kontinuerlig alignmentförmåga + komplementära organisatoriska resurser snarare än tekniken själv. 4) Exempel + kort slutsats." },

  { id: "str-e2",
    question: "Inom vissa strategiperspektiv betonas vikten av att företag är 'lärande organisationer'. Nämn ett sådant strategiperspektiv och förklara vad som avses med begreppet lärande organisation och varför det är viktigt.",
    context: "Förekom som essäfråga på ordinarie tentan HT24 (20 p).",
    checklist: [
      { heading: "Vad det är", points: [
        "Välj ett perspektiv och håll dig till det: dynamic capabilities (Teece — sensing, seizing, transforming), RBV:s kunskapstrend (knowledge management, Nonaka) eller Mintzbergs emergent strategy.",
        "Det kunskaps- och lärandebaserade perspektivet är strategifältets nuvarande era i Herrmanns utvecklingslinje.",
        "Lärande är bestående beteendeförändringar utifrån erfarenhet. Organisatoriskt lärande uppstår när individens lärande sprids i organisationen och omsätts i praktiken.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Omvärlden ändras snabbare än planerna hinner skrivas, så kontinuerlig förnyelse krävs.",
        "Kunskap och lärandeförmåga är svåra att imitera, och därmed en källa till uthållig konkurrensfördel.",
        "Lärandet är mekanismen bakom den framväxande strategin hos Mintzberg.",
      ] },
      { heading: "Konkret", points: [
        "Ett företag som ändrar riktning efter vad kunderna faktiskt vill, inte efter vad planen sa.",
        "Poängen med exemplet: riktningen ändrades för att någon lärde sig något, inte för att planen förutsåg det.",
      ] },
      { heading: "Koppling", points: [
        "Ekonomistyrningens mjuka styrmedel: en kultur där experiment, initiativ och ifrågasättande är accepterat är förutsättningen.",
        "Medarbetarskapet hör hit — lärandet blir organisatoriskt först när det sprids och används av andra.",
        "Enkelkrets- mot dubbelkretslärande: lösa problemet, eller också ifrågasätta orsaken till det.",
      ] },
    ],
    outline: "1) Perspektiv: kunskaps-/lärandefokuset som strategifältets nuvarande era (Herrmann). 2) Definition individ → organisation, förutsättningar i kulturen, enkel-/dubbelkrets. 3) Varför: förändringstakt, innovation, svårimiterad förmåga. 4) Brygga till emergent strategi + slutsats." },

  { id: "str-e3",
    question: "Diskutera varför IT eller AI oftast inte leder till långsiktiga konkurrensfördelar. Vad krävs för att dessa teknologier ändå ska kunna skapa varaktiga konkurrensfördelar.",
    context: "HT24 och HT25 — återkommer. Omtentan HT24 (20 p) och ordinarie HT25 (15 p, max 300 ord), lätt omformulerad.",
    checklist: [
      { heading: "Vad det är", points: [
        "Tesen: tekniken i sig går att köpa och kopiera, så alla får tillgång till samma sak.",
        "Transformativa teknologier tvingar alla att införa dem — och just därför ger de sällan någon uthållig fördel. De raderade ofta etablerade försprång.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Värdeskapande är inte värdefångst: AI sänker kostnader och driver innovation för alla användare, så vinsterna konkurreras bort.",
        "First mover-fördelen är kortlivad: AI lär av uppdaterad data, och pionjärens val absorberas i den data konkurrenternas AI analyserar.",
        "Egen modell eller proprietär data skyddar sällan: konkurrenterna har funktionellt likvärdig data, större dataset ger avtagande nytta, strategin kan härledas och imiteras, och data är svår att skydda.",
      ] },
      { heading: "Konkret", points: [
        "Ångmaskinen, elmotorn, persondatorn — och nu AI. Samma mönster varje gång.",
        "Amazon som motexempel: AI läggs på resurser som redan är värdefulla, sällsynta och svårimiterade, och då förstärks fördelen.",
      ] },
      { heading: "Koppling", points: [
        "Det resursbaserade synsättet och VRIO: fördelen sitter i resurser som redan är svårkopierade — AI förstärker dem, skapar dem inte.",
        "Strategic alignment: tekniken måste dessutom hänga ihop med strategi och organisation, annars uppstår produktivitetsparadoxen. Det krävs alltså två saker, inte ett.",
        "Alternativet är att bygga hela affärsmodellen kring AI för svårkopierad agilitet, med reservationen att det är omoget och oprövat.",
        "Slutsatsen med rätt nyans: använd AI aktivt, men förvänta dig fördelen från dina unika resurser, inte från tekniken.",
      ] },
    ],
    outline: "1) Tes + historisk parallell. 2) Tre argument: värdefångstproblemet, kortlivad first mover, data/modell skyddar inte. 3) Lösningen: RBV — förstärk unika resurser med AI; ev. AI-centrerad affärsmodell. 4) Nyanserad slutsats." },

  { id: "str-e4",
    question: "Förändringar i omvärlden, som ökad medvetenhet om hållbarhet och digitalisering, driver företag att utveckla nya typer av mått för att utvärdera sin måluppfyllelse. Diskutera vilka typer av mått dessa förändringar ger upphov till och hur de påverkar företagens sätt att arbeta. Ge exempel på hur företag kan hantera både traditionella ekonomiska mål och nya omvärldsutmaningar.",
    context: "Förekom som essäfråga på omtentan HT24 (20 p).",
    checklist: [
      { heading: "Vad det är", points: [
        "Två drivkrafter ger två sorters nya mått: hållbarhetskrav och digitalisering.",
        "Hållbarhetsmått: utsläpp, energi, jämställdhet, arbetsmiljö.",
        "Digitala mått: kundnöjdhet, kundbortfall, ledtider — ofta i realtid.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Finansiella mått är historiska; de nya är ledande och signalerar tidigare.",
        "Det som mäts blir gjort — måtten styr beteende och belöningar.",
        "De nya måtten ersätter inte de finansiella utan förklarar dem.",
      ] },
      { heading: "Konkret", points: [
        "EU kräver sedan 2022 att större företag rapporterar hållbarhet enligt bestämda mått (CSRD). Tidigare var det frivilligt och ofta greenwashing.",
        "Ramverken: Triple Bottom Line (People, Planet, Profit — företagets egen redovisning) och ESG (investerarnas bedömning utifrån).",
        "Prenumerationstjänster mäter kundbortfall (churn), vad en kund är värd över tid och vad den kostar att skaffa.",
      ] },
      { heading: "Koppling", points: [
        "Ittner & Larcker: mät inte utan att veta att måttet hänger ihop med resultatet — annars blir det manipulation.",
        "Balanserat styrkort är ramverket som håller ihop det: icke-finansiella mått i tre perspektiv driver det finansiella utfallet.",
      ] },
    ],
    outline: "1) Drivkrafterna och de nya måttypernas två familjer (hållbarhet, digitalt). 2) Ramverken BSC + TBL som integrationslösning. 3) Effekter på arbetssätt + riskerna enligt Ittner & Larcker. 4) Exempel + slutsats om komplement, inte ersättning." },

  { id: "str-e5",
    question: "Nämn de fyra grundperspektiven i det balanserade styrkortet som introducerades av Kaplan och Norton. Beskriv kort vad varje perspektiv fokuserar på, och ge även exempel på andra perspektiv som kan vara relevanta i dagens verksamheter.",
    context: "Förekom som essäfråga på ordinarie tentan HT25 (15 p, max 300 ord).",
    checklist: [
      { heading: "Vad det är", points: [
        "Finansiellt: hur ser vi ut för aktieägarna?",
        "Kund: hur ser kunderna på oss?",
        "Interna processer: vad måste vi bli bra på?",
        "Innovation och lärande: kan vi fortsätta förbättra och skapa värde?",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Finansiella mått är historiska och för generella — de visar vad som hände, inte vad som händer.",
        "Styrkortet balanserar trailing och leading mått och kopplar dem till strategin.",
      ] },
      { heading: "Konkret", points: [
        "Medarbetarperspektiv: arbetstillfredsställelse, medbestämmande, mångfald.",
        "CSR- och hållbarhetsperspektiv.",
        "Offentlig verksamhet: medborgare, miljö och socialt. Projekt kan kräva egna perspektiv.",
      ] },
      { heading: "Koppling", points: [
        "Strategin: perspektiven väljs efter verksamhetens uppdrag och strategi — styrkortet är ingen mall.",
        "Transparenstestet: en utomstående ska kunna utläsa affärsenhetens konkurrensstrategi ur måtten.",
      ] },
    ],
    outline: "1) De fyra perspektiven, en mening var med frågan de svarar på. 2) Varför: finansiella mått är historiska; balansen trailing/leading kopplad till strategin. 3) Två-tre alternativa perspektiv med exempel. 4) En mening: styrkortet är ingen mall." },

  { id: "str-e6",
    question: "Tänk dig att du startar ett företag inom en valfri bransch. Vilka faktorer skulle påverka hur du resonerar kring vad som är en rimlig vinst eller avkastningsgrad för företaget på längre sikt? Utgå gärna från relevanta teorier och begrepp som diskuterats under kursen.",
    context: "Förekom som essäfråga på ordinarie tentan HT25 (15 p, max 300 ord).",
    checklist: [
      { heading: "Vad det är", points: [
        "Vinst i kronor säger ingenting i sig — sätt resultatet i relation till kapitalet.",
        "ROE = resultat / eget kapital, ägarnas avkastning. ROCE = avkastning på sysselsatt kapital, alltså allt kapital.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Branschen: lönsamheten varierar kraftigt mellan branscher.",
        "Risknivån: högre risk kräver högre avkastning.",
        "Jämförelsealternativen: vad kapitalet kunde ha gett någon annanstans.",
        "Kalkylräntans tre komponenter fångar precis detta — inflation, alternativa investeringsmöjligheter och risk.",
      ] },
      { heading: "Konkret", points: [
        "Nämn din valda bransch och vad den innebär för rimlig avkastning: en siffra, inte bara 'hög' eller 'låg'.",
        "Håll relationsmåttet i exemplet — resultatet satt mot det kapital företaget binder.",
      ] },
      { heading: "Koppling", points: [
        "Målmodellerna, satisfiering (Simon): i praktiken söker man en tillfredsställande vinst mot en anspråksnivå, inte maximal. Anspråksnivån beror på omvärld, tradition och ägarpreferenser.",
        "Intressentmodellen: ägarnas avkastningskrav är ett krav bland flera — anställda, kunder och långivare ska också tillgodoses.",
        "Kassaflödesmodellen som teoretisk kontrast: maximera nuvärdet av framtida nettokassaflöden, men svårt att tillämpa vid snabb förändring.",
      ] },
    ],
    outline: "1) Bransch vald, och vinst som relationsmått (ROE/ROCE). 2) De tre faktorerna bransch, risk och jämförelsealternativ — kalkylräntans komponenter. 3) Satisfiering mot en anspråksnivå. 4) En mening om intressenterna, eventuellt kassaflödesmodellen som teoretisk kontrast." },
];
