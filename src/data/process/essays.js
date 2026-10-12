// Essäerna för Processorienterad verksamhetsutveckling (BPM).
//
// Samma fyrstegsform som Strategi: vad det är, varför det spelar roll,
// konkret, koppling. Steg 4 namnger alltid ett annat område i kursen.
// Kalibrering från Strategi: A-svaren var enkla — mekanismen med egna ord,
// ett konkret exempel och 2–4 kursbegrepp rätt använda räcker. De fyra
// första är HT25-tentornas essäfrågor med exakt lydelse; de två sista är
// egna övningsessäer.
export const essays = [
  { id: "bpm-e1",
    question: "Jeston (2022) framhåller att cirka 60 % av arbetet i ett BPM-initiativ handlar om kommunikation och mänskliga aspekter snarare än teknik eller modellering. Diskutera varför dessa delar är avgörande för att BPM-arbetet ska lyckas, och vilka risker som uppstår om de inte prioriteras.",
    context: "Förekom på ordinarie tentan 21 nov 2025, fråga 1(a) (15 p, max 300 ord).",
    examPriority: ["essa"],
    checklist: [
      { heading: "Vad det är", points: [
        "BPM är enligt Jeston implementering, exekvering och styrning av processer — inte teknik och inte bara modellering.",
        "En ny process finns bara om de som ska arbeta i den förstår den, kan den och vill den.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "People change management är en av 7FE:s tre essentials: alla berörda ska kunna och vilja ta till sig lösningen.",
        "Rädslan för nedskärningar, outsourcing och automatisering finns redan; obesvarad blir den motstånd.",
        "Engagerade medarbetare med medelbra processer slår bra processer med oengagerad personal (employee-centric).",
        "Risker: motstånd, svag användning, förbättringar som inte håller och en nytta i business case som aldrig realiseras.",
      ] },
      { heading: "Konkret", points: [
        "Rädslan är aktuell (Weaver, F3): företag som IKEA säger upp personal och hela yrkesgrupper, som mjukvarutestare, ersätts av AI — ett BPM-projekt möts av den rädslan från start.",
        "Vad arbetet består av (Weaver, F4): att hantera medarbetarnas motstånd, motivera dem, få dem att förstå och lära upp dem. Ungefär samma 60 procent ser man i dag när företag ska bli AI-redo eller genomföra AI-projekt: en mycket stor del av tiden går till att ta hand om och kommunicera med människorna. Gör man inte det är risken hög att BPM-projektet fallerar.",
        "Att bara lova att ingen sparkas räcker inte alltid; man kan sockra dealen med utbildning och empowerment, så att medarbetaren får mer intressanta uppgifter än att klicka mellan databaser.",
        "Eget exempel: ett nytt ärendeflöde som är tekniskt korrekt men där handläggarna fortsätter med sina egna kalkylark — nyttan i business case uteblir.",
      ] },
      { heading: "Koppling", points: [
        "BPR misslyckades bland annat för att det ignorerade medarbetarnas acceptans och mötte starkt motstånd.",
        "Kommunikationen är ett steg i varje fas: sist i Foundations, först och genomgående i de andra.",
      ] },
    ],
    outline: "1) BPM är människor, inte teknik — definitionen. 2) Varför: people change management, rädslan, employee-centric. 3) Exempel där tekniken fungerar men människorna inte följer med. 4) Koppling till BPR:s misslyckande och kommunikationen i faserna; riskerna som slutsats." },

  { id: "bpm-e2",
    question: "Jeston (2022) framhåller att processer bör förbättras innan de automatiseras med hjälp av teknologiska lösningar. Diskutera varför detta är en central princip i BPM-arbetet.",
    context: "Förekom på ordinarie tentan 21 nov 2025, fråga 1(b) (15 p, max 300 ord).",
    examPriority: ["essa"],
    checklist: [
      { heading: "Vad det är", points: [
        "Automatisering förstärker det som redan finns: effektiva processer blir effektivare, ineffektiva blir sämre.",
        "Technology is an enabler, not a solution — tekniken kan inte kompensera för en dålig processdesign.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Automatiserade fel körs snabbare, oftare och byggs in i systemen.",
        "Följden blir bortkastade investeringar, frustrerade medarbetare och svag användning av BPM-systemen.",
        "Ordningen blir därför: förstå, kartlägg och förbättra flöde och affärsregler — sedan system.",
      ] },
      { heading: "Konkret", points: [
        "Mekanismen (Weaver, F2): i en dålig process kompenserar erfarna medarbetare som vet hur man tar sig ur fällorna — en automatisering saknar den kunskapen och fastnar hela tiden.",
        "Spreadsheet-testet: Weaver ser varje år i projektkursen företag, även IKEA, som driver en kritisk process i ett kalkylark — ett tecken på att processen måste förbättras först.",
        "RPA (Weaver, F4): roboten tar över klicken och klipp-och-klistra mellan de system och databaser som redan finns, till exempel en kundlista i Excel som ska föras över till en annan databas. Det går snabbt och kräver inget stort pådrag från IT, men har fungerat på medarbetarnivå och varit svårt att skala till hela företaget. Egen slutsats: en robot som gör samma klick snabbare gör inte en dålig process bättre.",
        "Nyansera (Weaver, F2): Jeston tonar ned systemen, men i dag går förändringen inte att göra utan system — principen gäller ordningen, inte att tekniken är oviktig.",
      ] },
      { heading: "Koppling", points: [
        "Hammer 1990: företagen automatiserade gamla arbetssätt — \"don't automate, obliterate\".",
        "Produktivitetsparadoxen: IT-investeringar utan förändrade processer syntes inte i produktiviteten.",
        "I 7FE kommer Understand och Innovate före Develop och Implement.",
      ] },
    ],
    outline: "1) Principen och mekanismen: automatisering förstärker. 2) Konsekvenserna och ordningen. 3) Weavers RPA-exempel eller spreadsheet-testet. 4) Hammer och produktivitetsparadoxen, och var principen syns i 7FE." },

  { id: "bpm-e3",
    question: "Enligt Jeston (2022) misslyckas många organisationer inte med strategiutformning, utan med strategiimplementering. Förklara begreppet ”strategy execution void” och diskutera hur BPM och 7FE-ramverket kan bidra till att överbrygga detta gap.",
    context: "Förekom på omtentan 9 jan 2026, fråga 1 (15 p, max 300 ord).",
    examPriority: ["essa"],
    checklist: [
      { heading: "Vad det är", points: [
        "Strategy execution void är gapet mellan organisationens strategiska avsikt och dess förmåga att genomföra strategin.",
        "Två delar: management effectiveness (ledningsprocessernas förmåga och disciplin) och operational efficiency (de operativa processernas kvalitet).",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Bara operational efficiency ger \"different sameness\": små förbättringar utan verklig förändring.",
        "Management effectiveness ger uthållig konkurrensfördel när den är inbäddad i hela organisationen.",
        "BPM binder ihop dem: strategin kopplas till teman och nyckelprocesser (nivå 1–2), program riktas mot flaskhalsar, och återkoppling håller linjeringen.",
      ] },
      { heading: "Konkret", points: [
        "Foundations börjar med att förstå strategin och göra den spårbar till BPM-programmet och Red Wine Test.",
        "TOM beskriver hur organisationens delar ska fungera i framtiden, och Enablement bygger styrning, arkitektur och process asset.",
        "Process Worth Matrix (Weaver, F4): i Understand bedöms processerna efter strategisk betydelse (salience) och ekonomiskt värde (worth), för att avgöra vilka man investerar i, förbättrar, outsourcar eller tar bort. Weaver kopplar den till RBV och kärnkompetens: för Amazon, med sitt kundfokus, är det som rör kunden troligen en kompetens att ha kvar internt, och att lägga ut det vore hög risk. Ett företag som konkurrerar med produkt och varumärke kan kanske outsourca CRM.",
      ] },
      { heading: "Koppling", points: [
        "Jestons hus: blå zon (management processes) = management effectiveness, röd zon (operational processes) = operational efficiency, grön zon (Business Transformation Program Management, \"Set for Success\") binder ihop dem.",
        "Sustainability i 7FE: målet är uthållig konkurrensfördel, inte hållbarhet i miljömening.",
      ] },
    ],
    outline: "1) Definitionen och de två delarna. 2) Different sameness och varför båda krävs. 3) Hur Foundations, TOM och Enablement överbryggar. 4) Huset och Sustainability som koppling." },

  { id: "bpm-e4",
    question: "Jeston (2022) menar att ”one size fits all” inte fungerar inom BPM. Förklara vad BPM-mognad innebär och diskutera varför BPM-initiativ måste anpassas efter organisationens mognadsgrad, kultur och förutsättningar.",
    context: "Förekom på omtentan 9 jan 2026, fråga 2 (15 p, max 300 ord).",
    examPriority: ["essa"],
    checklist: [
      { heading: "Vad det är", points: [
        "BPM-mognad är hur långt organisationen kommit i att arbeta processorienterat; vissa har redan vision, mål och processarkitektur, andra börjar med splittrade insatser.",
        "Organisationer skiljer sig i mognad, kultur, ledarskap och processerfarenhet — därför passar inte ett och samma upplägg.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Jeston: går man fortare än organisationens processmognad ökar risken att misslyckas.",
        "Startpunkten varierar: vissa har redan en stabil grund, andra börjar med splittrade insatser.",
        "Faser i 7FE kan hoppas över, men bara med motivering.",
      ] },
      { heading: "Konkret", points: [
        "Eget exempel: en organisation där BPM bara skett i små informella insatser startar ett koncernbrett program — tempot går fortare än mognaden.",
        "Olika grund gäller också det konkreta (Weaver, F2): vilken IT-arkitektur och vilka system som redan finns eller måste skaffas först. Process mining finns enligt Weaver (F4) alltid med när ett moget företag gör BPM i dag, men kräver data av hög kvalitet — en snickare som tar order på telefon har inga digitala spår av det som händer mellan order och leverans.",
        "Metoden anpassas efter deltagarna (Weaver, F4): det är inte realistiskt att skicka en hel säljorganisation på BPMN-kurs, så Understand-workshoppen kan modellera med flödesscheman, swimlanes, storyboards eller sticky notes — och bara så mycket som behövs.",
        "Eget exempel, inte ur källan: en pilot som visar värde passar bättre än att gå fortare än mognaden tillåter.",
      ] },
      { heading: "Koppling", points: [
        "De fyra scenarierna: varje scenario påverkar hur noggrant och brett ramverket används.",
        "Top-down eller bottom-up väljs efter aktivitetens typ och ledningens engagemang.",
      ] },
    ],
    outline: "1) Mognad och one size fits all. 2) Tempot, startpunkten och överhoppade faser. 3) Exemplet Under the radar mot storprogram. 4) Scenarierna och angreppssättet som koppling." },

  { id: "bpm-e5",
    question: "Egen övningsessä: Ska ett BPM-initiativ drivas top-down eller bottom-up? Diskutera med hjälp av Jestons fyra scenarier.",
    context: "Egen övningsessä, inte en tentafråga. Bygger på det som prövats i HT25:s flervalsfrågor.",
    examPriority: ["essa"],
    checklist: [
      { heading: "Vad det är", points: [
        "Top-down drivs av ledningen, är strategiskt linjerat och kräver mandat och styrning; risken är att missa verkligheten.",
        "Bottom-up startas av processägare eller team, ger quick wins och engagemang; risken är att stanna lokalt.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "Jeston: en balans är bäst — top-down ger riktning, bottom-up ger fäste.",
        "Valet följer aktivitetens typ: strategiska och tvärfunktionella förändringar kräver top-down.",
        "Utan ledningens stöd ska stora program stoppas, men lokala förbättringar kan starta ändå.",
      ] },
      { heading: "Konkret", points: [
        "En myndighet som måste anpassa hela verksamheten till nya regler: top-down.",
        "Amazon (Weaver, F2): bara ledningen kan prioritera kundnära processer före leverantörsprocesser utifrån strategin — ett skäl till top-down.",
        "En avdelning utan ledningsstöd och med oklar strategi: börja lokalt med små bottom-up-förbättringar.",
        "Quick wins kommer ofta underifrån (Weaver, F4): i workshoparna pekar medarbetare på en enkel ändring som löser en stor del av problemen, som i Toyotas tipslådor där månadens bästa förslag belönades. Synliga resultat inom några veckor motiverar både medarbetarna och ledningen att fortsätta.",
      ] },
      { heading: "Koppling", points: [
        "De fyra scenarierna: Under the radar och Pilot är ofta bottom-up, In the driver's seat och Business as usual kräver ledningen.",
        "Strategy-led startar i Foundations, business issue-led och process-led längre ned i organisationen.",
      ] },
    ],
    outline: "1) De två angreppssätten och deras risker. 2) Balansen och när det ena väger tyngst. 3) Myndigheten och avdelningen. 4) Scenarierna och de tre sätten att initiera." },

  { id: "bpm-e6",
    question: "Egen övningsessä: Varför misslyckades Business Process Reengineering, och vad gör BPM annorlunda?",
    context: "Egen övningsessä, inte en tentafråga. BPR:s misslyckande prövades som flervalsfråga HT25.",
    examPriority: ["essa"],
    checklist: [
      { heading: "Vad det är", points: [
        "BPR (Hammer 1990): använd IT för att radikalt göra om processerna — \"don't automate, obliterate\".",
        "Bidraget: tänk om i grunden, se processen från början till slut, bryt silos.",
      ] },
      { heading: "Varför det spelar roll", points: [
        "BPR blev för radikalt, dyrt och riskfyllt, och tidiga framgångar blev långsiktiga misslyckanden.",
        "Det användes som ursäkt för nedskärningar och mötte starkt motstånd från medarbetare och IT.",
        "BPM tar med sig processhelheten men arbetar stegvis, med människorna och med ständig förbättring.",
      ] },
      { heading: "Konkret", points: [
        "Fords leverantörsreskontra: betala när varorna kommer, 75 % färre anställda — framgången som gjorde BPR till trend.",
        "BPR:s bortglömda syfte var empowerment (Weaver, F1): sekreteraren med dator skulle få mer varierade uppgifter, men i praktiken fick en person göra fyras jobb och resten sparkades.",
        "Lärdomen används i dag (Weaver, F4): empowerment kallar han en lärdom från BPR. RPA ska inte ersätta medarbetaren utan ta bort de tråkiga momenten — medarbetaren kan själv lära sig bygga roboten med low code och lägga tiden på den roligare delen av jobbet, som att träffa andra människor.",
        "Samma diskussion förs i dag om AI: gör om allt från grunden för att dra nytta av tekniken — och motståndet känns igen.",
      ] },
      { heading: "Koppling", points: [
        "People change management i 7FE svarar direkt på BPR:s största brist.",
        "Smith och Fingar: BPM som förändring och ständig förbättring, inte en omvälvande revolution uppifrån.",
      ] },
    ],
    outline: "1) Vad BPR var och vad det bidrog med. 2) Varför det gick för långt. 3) Ford — och varför exemplet inte gick att upprepa överallt. 4) Vad BPM och 7FE gör annorlunda." },
];
