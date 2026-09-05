// Frågebank Databaser — Öva speglar Läs: ett kapitel i Läs = en kvizz i Öva.
// Nio kapitel, 6–7 frågor var, alla besvarbara enbart ur kapiteltexten.
// Syfte: förståelsekontroll av läsmaterialet, inte tentasimulering.
//
// Samma designregler som strategi/questions.js: fyra jämnlånga alternativ
// (längsta högst 25 % längre än kortaste), inga skämtdistraktorer, jämn
// positionsfördelning, rätt svar inte det enda nyanserade, explain per
// alternativ. Låses av scripts/fragebank-balans.test.mjs.
//
// `topic` är ämnet i topics.js; Öva grupperar per kapitel via ämnets
// kapitel (manifestets practiceBy: "chapter"), så varje fråga hamnar i sitt
// kapitels kvizz. Frågor med id db1-/db4- är behållna ur leveransen
// 2026-09-05 (formuleringar och alternativ oförändrade, utom tre
// längdrättningar där det längsta alternativet var det rätta); dbq- är
// skrivna mot kapiteltexten och märkta reviewed: false tills de granskats.
//
// SQL-frågespråket saknar kapitel i Läs; de sex SQL-frågorna ur leveransen
// väntar i questions-pending.js.

// Frågor som får bryta spridningsregeln (längsta alternativ högst 25 % längre
// än kortaste). Varje post kräver ett skäl i klartext — testet vägrar tomma
// skäl, så listan kan ändras men inte i tysthet. Grundregeln: en distraktor
// får vara längst (längden avslöjar inte facit); är rätt svar längst ska
// alternativen rättas, inte flaggas.
export const LENGTH_FLAGGED = [
  { id: "db4-12", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,53)." },
  { id: "db4-14", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,46)." },
  { id: "db4-16", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,51)." },
  { id: "db4-20", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,26)." },
  { id: "db4-21", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,27)." },
  { id: "db4-23", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,32)." },
  { id: "db4-26", reason: "Behållen ur leveransen 2026-09-05; längsta alternativet är en distraktor (spridning 1,27)." },
];

export const questions = [
  { id: "db1-01", topic: "grunder", difficulty: 1,
    question: "Vad är skillnaden mellan TimeEdit-applikationen och TimeEdit-databasen?",
    options: [
      { text: "Applikationen och databasen är samma sak, beskrivna på två olika abstraktionsnivåer", explain: "Två abstraktionsnivåer av samma sak blandar ihop gränssnittet med den lagrade datan." },
      { text: "Applikationen är databasen sedd genom en webbläsare i stället för genom ett program", explain: "Webbläsaren är också bara ett gränssnitt; databasen visas aldrig direkt för dig." },
      { text: "Applikationen lagrar data lokalt, medan databasen bara är en säkerhetskopia av den", explain: "Applikationen lagrar inte schemat lokalt, och databasen är ingen säkerhetskopia." },
      { text: "Applikationen är gränssnittet du ser och använder; databasen är den lagrade bokningsdatan", explain: "Rätt. Det du ser är applikationens gränssnitt; databasen är den lagrade datan bakom det." }
    ],
    correct: 3, source: "Kompendiet kap. 1", reviewed: true },

  { id: "db1-02", topic: "grunder", difficulty: 1,
    question: "I klient–server-bilden: vad är det som faktiskt hämtar data ur databasen?",
    options: [
      { text: "Servern hämtar data ur sin databas och skickar svaret tillbaka till klienten", explain: "Rätt. Klienten pratar med servern över internet, och servern hämtar ur sin databas." },
      { text: "Klienten hämtar en kopia av databasen till telefonen och läser ur den lokalt", explain: "Ingen kopia laddas ner; klienten skickar en förfrågan och får ett svar från servern." },
      { text: "Klienten hämtar direkt ur databasen och servern vidarebefordrar bara svaret", explain: "Klienten når aldrig databasen direkt — att hämta data är serverns uppgift." },
      { text: "Databasen skickar data till klienten utan att någon server är inblandad", explain: "Utan server finns ingen som tar emot förfrågan, hämtar ur databasen och svarar." }
    ],
    correct: 0, source: "Kompendiet kap. 1", reviewed: true },

  { id: "db1-06", topic: "grunder", difficulty: 1,
    question: "Vad händer med en `ArrayList<Employee>` när programmet avslutas?",
    options: [
      { text: "Den skrivs automatiskt till disk och läses in igen vid nästa start", explain: "Ingenting skrivs till disk av sig självt; persistens kräver ett explicit skrivsteg." },
      { text: "Den ligger kvar i RAM tills operativsystemet startas om nästa gång", explain: "RAM töms när processen avslutas; ingenting ligger kvar till nästa körning." },
      { text: "Den försvinner, eftersom RAM är flyktig lagring (volatile storage)", explain: "Rätt. Data i RAM är volatil lagring och försvinner när programmet stängs." },
      { text: "Den behålls om klassen deklarerat kollektionsfältet som `final`", explain: "final låser referensen i koden, inte innehållet i minnet när processen dör." }
    ],
    correct: 2, source: "Kompendiet kap. 1", reviewed: true },

  { id: "db1-08", topic: "grunder", difficulty: 2,
    question: "Vad är normalisering, och var i designkedjan hör den hemma?",
    options: [
      { text: "En städning av tabellernas rader, efter att databasen implementerats", explain: "Normalisering är ett designsteg före implementationen, inte en städning av rader efteråt." },
      { text: "Ett obligatoriskt steg i konceptuell design, före ER-diagrammet ritas", explain: "Den hör till logisk design och görs bara om det behövs — inte alltid, inte före ER-diagrammet." },
      { text: "En kontroll av den logiska modellen, före den fysiska designens DDL", explain: "Rätt. Steg två: transformation till relationer, följt av normalisering om det behövs, före DDL." },
      { text: "En optimering som databashanteraren utför automatiskt vid varje INSERT", explain: "Databashanteraren normaliserar ingenting automatiskt — normalformen är designerns beslut." }
    ],
    correct: 2, source: "Kompendiet kap. 1", reviewed: true },

  { id: "dbq-01", topic: "grunder", difficulty: 1,
    question: "Vem avgör vad databasen ska lagra data om?",
    options: [
      { text: "Databasadministratören ensam, eftersom det är ett tekniskt beslut", explain: "Kapitlet säger uttryckligen att administratören inte bestämmer ensam." },
      { text: "Verksamhetssidan i dialog med IT, utifrån vad processerna kräver", explain: "Rätt. Frågan är vad verksamheten behöver lagra för att fungera, och verksamheten konsulteras alltid." },
      { text: "Systemleverantören, som levererar en färdig och generell datamodell", explain: "En generell modell svarar inte på vad just den här verksamheten kräver." },
      { text: "Utvecklarna, som vet vilka tabeller applikationens kod behöver", explain: "Tabellerna följer av verksamhetens behov, inte tvärtom." }
    ],
    correct: 1, source: "Kompendiet kap. 1", reviewed: false },

  { id: "dbq-02", topic: "grunder", difficulty: 2,
    question: "Vad producerar den logiska databasdesignen?",
    options: [
      { text: "Ett ER-diagram som abstraherar verksamhetens krav", explain: "Det är det konceptuella stegets resultat, före transformationen." },
      { text: "Körbara CREATE TABLE-satser för den valda databashanteraren", explain: "DDL-koden hör till fysisk design, det sista steget." },
      { text: "En kravlista i löpande text, avstämd med verksamheten", explain: "Kravtexten är designprocessens utgångspunkt, inte ett resultat." },
      { text: "Relationer i textform, normaliserade om det behövs", explain: "Rätt. Den konceptuella modellen transformeras till relationer i textform och normaliseras vid behov." }
    ],
    correct: 3, source: "Kompendiet kap. 1", reviewed: false },

  { id: "dbq-03", topic: "relationsmodellen", difficulty: 2,
    question: "Raden E1 | Alice | 20000 | Engineering | 500000 pekar framåt mot normalisering. Varför?",
    options: [
      { text: "Den berättar två saker samtidigt — en om en anställd och en om en avdelning", explain: "Rätt. Att en rad bär två fakta är just det som ger upphov till anomalierna." },
      { text: "Den innehåller både text och tal, vilket bryter mot kravet på en domän per attribut", explain: "Olika attribut får ha olika domäner; det är inom ett attribut domänen ska vara en." },
      { text: "Den saknar en surrogatnyckel, så raden går inte att identifiera entydigt", explain: "E1 identifierar raden; surrogatnycklar hör till fysisk design." },
      { text: "Den har fler än fyra attribut, vilket relationsmodellen inte tillåter", explain: "Graden är fri — relationsmodellen sätter ingen gräns för antalet attribut." }
    ],
    correct: 0, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-04", topic: "relationsmodellen", difficulty: 2,
    question: "Vad skiljer en domän från en datatyp?",
    options: [
      { text: "Datatypen är snävare än domänen och anger det tillåtna intervallet", explain: "Omvänt: datatypen säger bara INT, domänen lägger till intervallet." },
      { text: "Domänen gäller bara textattribut, datatypen bara numeriska attribut", explain: "Båda gäller alla slags attribut; skillnaden ligger i vad de uttrycker." },
      { text: "Domänen bär affärsregeln, datatypen anger bara hur värdet lagras", explain: "Rätt. SalaryType kan kräva 10 000–30 000; datatypen säger bara INT." },
      { text: "De är synonymer — domän är relationsmodellens ord för datatyp", explain: "De överlappar men är inte samma sak; domänen är det snävare begreppet." }
    ],
    correct: 2, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-05", topic: "relationsmodellen", difficulty: 1,
    question: "Vad anger en relations grad respektive kardinalitet?",
    options: [
      { text: "Grad är antalet tupler och kardinalitet är antalet attribut i relationen", explain: "Termerna är omkastade." },
      { text: "Grad är antalet attribut och kardinalitet är antalet tupler i relationen", explain: "Rätt. Grad räknar kolumner, kardinalitet räknar rader." },
      { text: "Grad är antalet nycklar och kardinalitet är antalet relationer i databasen", explain: "Ingen av termerna räknar nycklar eller relationer." },
      { text: "Grad är antalet domäner och kardinalitet är antalet distinkta värden", explain: "Domäner och distinkta värden är inte vad termerna mäter." }
    ],
    correct: 1, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-06", topic: "relationsmodellen", difficulty: 2,
    question: "Varför saknar en SQL-fråga utan ORDER BY garanterad radordning?",
    options: [
      { text: "Därför att databasen sparar raderna i slumpmässig ordning på disken", explain: "Lagringsordningen är inte poängen; ordningen är odefinierad i modellen." },
      { text: "Därför att primärnyckeln bara ger en sortering när den är numerisk", explain: "Primärnyckeln definierar ingen radordning över huvud taget." },
      { text: "Därför att SQL Server alltid sorterar efter tidpunkten för senaste ändring", explain: "Ingen sådan regel finns; utan ORDER BY är ordningen inte garanterad." },
      { text: "Därför att tuplernas ordning saknar betydelse i relationsmodellen", explain: "Rätt. Egenskap 6: tuplernas ordning har ingen betydelse, så ingen ordning kan förutsättas." }
    ],
    correct: 3, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-07", topic: "relationsmodellen", difficulty: 3,
    question: "Vad gäller för dubblettupler?",
    options: [
      { text: "Relationsmodellen tillåter dem, men SQL Server avvisar dem alltid", explain: "Omvänt: modellen förbjuder dem, SQL-tabellen kan innehålla dem." },
      { text: "Relationsmodellen förbjuder dem, men en SQL-tabell kan innehålla dem utan nyckel", explain: "Rätt. Egenskap 7 är ett ideal som SQL bara upprätthåller om en nyckel hindrar dubbletter." },
      { text: "Både modellen och SQL tillåter dem så länge raderna får olika radnummer", explain: "Radnummer finns inte i modellen, och identiska rader är ändå dubbletter." },
      { text: "Varken modellen eller SQL tillåter dem, oberoende av vilka nycklar som finns", explain: "SQL-tabeller utan nyckel tar emot identiska rader utan protest." }
    ],
    correct: 1, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-08", topic: "relationsmodellen", difficulty: 2,
    question: "Varför är första normalformen sällan ett problem i praktiken?",
    options: [
      { text: "Därför att SQL Server delar upp listvärden automatiskt vid varje INSERT", explain: "Ingen databas delar upp Alice, Bob åt dig — det är designerns ansvar." },
      { text: "Därför att 1NF bara gäller relationer som har en sammansatt kandidatnyckel", explain: "1NF handlar om atomära värden och gäller alla relationer." },
      { text: "Därför att kravet på atomära värden först ställs i den fysiska designen", explain: "Kravet ligger redan i relationsbegreppet, långt före fysisk design." },
      { text: "Därför att en tabell med icke-atomära värden inte är en relation till att börja med", explain: "Rätt. Egenskap 2 kräver atomära värden, så 1NF är uppfyllt av varje riktig relation." }
    ],
    correct: 3, source: "Kompendiet kap. 2", reviewed: false },

  { id: "dbq-09", topic: "nycklar", difficulty: 1,
    question: "Vad skiljer en primärnyckel från en kandidatnyckel?",
    options: [
      { text: "Primärnyckeln är den kandidatnyckel som databasarkitekten väljer", explain: "Rätt. Kandidatnycklarna är alla som kan användas; primärnyckeln är valet bland dem." },
      { text: "Primärnyckeln består alltid av ett attribut, kandidatnyckeln kan vara sammansatt", explain: "Båda kan vara sammansatta; skillnaden ligger i valet, inte i formen." },
      { text: "Kandidatnyckeln genereras av databasen, primärnyckeln är den naturliga", explain: "Generering hör till surrogatnycklar och har inget med indelningen att göra." },
      { text: "Kandidatnyckeln får innehålla NULL, primärnyckeln får det aldrig", explain: "Unik identifiering utesluter NULL för båda; det är inte skillnaden." }
    ],
    correct: 0, source: "Kompendiet kap. 3", reviewed: false },

  { id: "dbq-10", topic: "nycklar", difficulty: 3,
    question: "En relation har två kandidatnycklar. Vilka attribut är primärattribut?",
    options: [
      { text: "Bara attributen i den kandidatnyckel som har valts till primärnyckel", explain: "Definitionen säger någon kandidatnyckel, inte den valda." },
      { text: "Bara de attribut som ingår i båda kandidatnycklarna samtidigt", explain: "Det räcker att ingå i en av dem." },
      { text: "Alla attribut i relationen, eftersom två nycklar tillsammans täcker allt", explain: "Attribut utanför båda nycklarna är icke-primära." },
      { text: "Alla attribut som ingår i någon av de två kandidatnycklarna", explain: "Rätt. Primärattribut är medlem i någon kandidatnyckel — attribut ur båda räknas." }
    ],
    correct: 3, source: "Kompendiet kap. 3", reviewed: false },

  { id: "db1-09", topic: "nycklar", difficulty: 2,
    question: "I Patient-tabellen finns både `PatientId` och `PatientNo`. Vad skiljer dem?",
    options: [
      { text: "PatientId är verksamhetens identifierare, PatientNo genereras av databasen", explain: "Omvänt: det är PatientNo som är verksamhetens nummer och PatientId som genereras." },
      { text: "PatientId identifierar raden, PatientNo den avdelning patienten tillhör", explain: "PatientNo pekar inte på någon avdelning; det är patientens eget nummer i verksamheten." },
      { text: "PatientId är genererad surrogate primary key, PatientNo en naturlig nyckel", explain: "Rätt. Surrogatnyckeln genereras av databasen, den naturliga nyckeln kommer från verksamheten." },
      { text: "PatientId används i JOIN, PatientNo används enbart i WHERE-villkor", explain: "Var en nyckel används i en fråga säger ingenting om vilken sorts nyckel den är." }
    ],
    correct: 2, source: "Kompendiet kap. 3", reviewed: true },

  { id: "db1-10", topic: "nycklar", difficulty: 3,
    question: "Vad gäller för en surrogate key i förhållande till foreign keys?",
    options: [
      { text: "Den är alltid en foreign key om samma kolumnnamn finns i en annan tabell", explain: "Samma kolumnnamn i två tabeller bevisar ingen koppling alls." },
      { text: "Den blir en FK så snart tabellen ingår i en JOIN med en annan tabell", explain: "En JOIN skapar inga nycklar; den använder de som redan finns deklarerade." },
      { text: "Den kan aldrig refereras av en FK, eftersom den saknar verksamhetsbetydelse", explain: "Surrogatnycklar refereras av främmande nycklar hela tiden — det är normalfallet." },
      { text: "Den kan refereras av en FK, men är inte i sig en FK — namnet bevisar ingenting", explain: "Rätt. En surrogatnyckel kan refereras av en FK men är inte själv en FK." }
    ],
    correct: 3, source: "Kompendiet kap. 3", reviewed: true },

  { id: "dbq-11", topic: "nycklar", difficulty: 2,
    question: "Vad innebär referensintegritet i praktiken?",
    options: [
      { text: "Databasen kopierar automatiskt den refererade raden in i den refererande tabellen", explain: "Ingenting kopieras; referensen är en pekare som måste hålla." },
      { text: "Databasen vägrar rader som pekar på något som saknas, och radering av det som refereras", explain: "Rätt. Ingen anställd på ett projekt som saknas, ingen radering av ett projekt med anställda." },
      { text: "Databasen kräver att den främmande nyckeln heter samma sak som primärnyckeln", explain: "Namnen är fria; det är referensen som deklareras." },
      { text: "Databasen tillåter radering men sätter den främmande nyckeln till NULL automatiskt efteråt", explain: "Kapitlet beskriver vägran, inte automatisk nollställning." }
    ],
    correct: 1, source: "Kompendiet kap. 3", reviewed: false },

  { id: "dbq-12", topic: "nycklar", difficulty: 2,
    question: "När får en främmande nyckel vara NULL?",
    options: [
      { text: "När den refererade relationen saknar en egen primärnyckel", explain: "En främmande nyckel refererar alltid en primärnyckel; det är förutsättningen." },
      { text: "När den ingår i en sammansatt primärnyckel i sin egen relation", explain: "Primärnyckelattribut får aldrig vara NULL." },
      { text: "När deltagandet i relationen är frivilligt, som bilen utan ägare", explain: "Rätt. Frivilligt deltagande ger NULL; obligatoriskt deltagande ger NOT NULL." },
      { text: "Aldrig — en främmande nyckel måste alltid peka på en existerande rad", explain: "Vid frivilligt deltagande får den vara NULL." }
    ],
    correct: 2, source: "Kompendiet kap. 3", reviewed: false },

  { id: "db4-02", topic: "metamodell", difficulty: 2,
    question: "Vad är förhållandet mellan en modell och ett diagram av den?",
    options: [
      { text: "Diagrammet är en representation av modellen, inte modellen självt", explain: "Rätt. Samma modell kan ritas, skrivas som text eller XML — ingen representation är modellen." },
      { text: "Diagrammet är modellen, uttryckt i grafisk i stället för textuell form", explain: "Diagrammet är ett sätt att visa modellen, inte modellen i grafisk form." },
      { text: "Diagrammet är en förenklad modell där vissa fakta har utelämnats", explain: "Ett diagram utelämnar inte fakta; det representerar samma modell som texten." },
      { text: "Diagrammet är en instans av modellen på samma sätt som data är det", explain: "Instanser hör till populationen — diagrammet visar typerna, inte data." }
    ],
    correct: 0, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-03", topic: "metamodell", difficulty: 2,
    question: "Ett nytt stopp läggs till på linjen. Vad förändras?",
    options: [
      { text: "Endast modellen — metamodellens begrepp är desamma som förut", explain: "Rätt. Stop C är två nya fakta i modellen; metamodellens begrepp är desamma." },
      { text: "Varken modellen eller metamodellen, bara diagrammets utseende", explain: "Ett nytt stopp är ett nytt faktum, alltså en ändring i modellen." },
      { text: "Endast metamodellen, som måste tillåta det nya elementet", explain: "Metamodellen tillåter redan Stop; vokabulären behöver inte utökas." },
      { text: "Både modellen och metamodellen, eftersom vokabulären utökas", explain: "Bara modellen växer — metamodellen säger fortfarande Line, Stop och Line has stops." }
    ],
    correct: 0, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-07", topic: "er", difficulty: 2,
    question: "Hur skiljer man ett mandatory från ett optional attribute i Chen-notation?",
    options: [
      { text: "Man kan inte se skillnaden — båda använder vanlig oval", explain: "Rätt. Chen saknar symbol för skillnaden; villkoret skrivs ut explicit." },
      { text: "Mandatory ritas med heldragen linje, optional med streckad linje", explain: "Streckad oval betyder härlett attribut, inte frivilligt." },
      { text: "Mandatory understryks, optional lämnas utan markering", explain: "Understrykning markerar identifierare, inte obligatoriskhet." },
      { text: "Mandatory ritas med dubbel oval, optional med enkel oval", explain: "Dubbel oval betyder flervärdesattribut, inte obligatoriskt." }
    ],
    correct: 0, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-10", topic: "er", difficulty: 2,
    question: "Var dokumenteras ett value domain i ett vanligt Chen-diagram?",
    options: [
      { text: "I en separat specifikation utanför diagrammet", explain: "Rätt. Ovalen namnger bara attributet; domänen dokumenteras separat." },
      { text: "Inuti ovalen, tillsammans med attributets namn", explain: "Ovalen rymmer bara namnet, inte de tillåtna värdena." },
      { text: "I en egen oval som kopplas till attributets oval", explain: "Chen har ingen egen oval för värdemängder." },
      { text: "I relationship-romben som attributet hör till", explain: "Romben är relationstypen, inte attributets värdemängd." }
    ],
    correct: 0, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-12", topic: "er", difficulty: 3,
    question: "En kolumn råkar ha unika värden i all data som finns i dag. Är den en identifier?",
    options: [
      { text: "Ja, unika värden i populationen är precis vad en identifier innebär i modellen", explain: "Unika värden just nu är data, inte en regel som håller för varje giltig population." },
      { text: "Ja, så länge inga dubbletter har uppstått är identifieringsregeln uppfylld", explain: "Att dubbletter inte uppstått ännu är ingen garanti för nästa population." },
      { text: "Nej, en identifier måste dessutom vara en simple attribute", explain: "En identifierare får vara sammansatt; enkelhet är inget krav." },
      { text: "Nej, regeln måste hålla för varje giltig population", explain: "Rätt. Identifikation är en modellnivåregel som måste hålla för varje giltig population." }
    ],
    correct: 3, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-13", topic: "er", difficulty: 3,
    question: "Hur markeras ett composite attribute som fungerar som identifier?",
    options: [
      { text: "Man understryker både parent och samtliga komponenter", explain: "Föräldern och delarna stryks inte under samtidigt — det vore två identifierare." },
      { text: "Man understryker varje komponent för sig, inte föräldern", explain: "Delarna identifierar inte var för sig; 2026-1 och 2026-2 delar år." },
      { text: "Man understryker the composite parent, inte komponenterna", explain: "Rätt. Den sammansatta föräldern stryks under; identifikationen använder hela värdet." },
      { text: "Man ringar in komponenterna med en gemensam streckad ram", explain: "Streckad ram finns inte; streckat markerar partiell identifierare." }
    ],
    correct: 2, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-14", topic: "er", difficulty: 2,
    question: "Vad betyder två separata understrykningar i samma entity type?",
    options: [
      { text: "Att de två attributen tillsammans bildar en composite identifier för entityn", explain: "En sammansatt identifierare stryks under som en helhet, inte som två." },
      { text: "Att det finns två identifiers som var för sig räcker", explain: "Rätt. employeeNo och workEmail identifierar var för sig — två identifierare." },
      { text: "Att attributen är kandidater, men att ingen av dem har valts ännu", explain: "Understrykningen är själva regeln, inte en lista över kandidater." },
      { text: "Att det ena identifierar entityn och det andra dess owner", explain: "Ägarberoende markeras med streckad understrykning, inte en andra hel." }
    ],
    correct: 1, source: "Kompendiet kap. 4", reviewed: true },

  { id: "db4-16", topic: "relationstyper", difficulty: 2,
    question: "När blir role names nödvändiga?",
    options: [
      { text: "När relationen har fler än två deltagande entity types i modellen", explain: "Antalet deltagande typer avgör inte; rollerna behövs när samma typ deltar två gånger." },
      { text: "När samma entity type deltar mer än en gång", explain: "Rätt. I Supervises deltar Employee två gånger — utan roller är ändarna tvetydiga." },
      { text: "När relationen äger ett eget attribute utöver de deltagandes", explain: "Ett relationsattribut gör inte rollerna tvetydiga." },
      { text: "När multipliciteten är M:N i stället för 1:N", explain: "Multipliciteten påverkar inte om rollnamnen behövs." }
    ],
    correct: 1, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-18", topic: "relationstyper", difficulty: 2,
    question: "Hur förhåller sig maximum cardinality och participation till varandra?",
    options: [
      { text: "Participation följer av multipliciteten och sätts därför inte separat", explain: "Deltagandet följer inte av kardinaliteten; de sätts var för sig." },
      { text: "De sätts oberoende av varandra och besvarar olika frågor", explain: "Rätt. Kardinalitet svarar på hur många, deltagande på om man måste delta alls." },
      { text: "Maximum cardinality anger minimum och participation anger maximum", explain: "Kardinalitetsetiketten anger maxima, inte minimum." },
      { text: "De är två namn på samma constraint i olika Chen-varianter", explain: "De är två olika constraints med olika symboler, inte två namn på en." }
    ],
    correct: 1, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-19", topic: "relationstyper", difficulty: 3,
    question: "I `Employee — Leads — Project` står `1` bredvid Employee. Vad betyder det?",
    options: [
      { text: "Att varje Project får ha högst en Employee kopplad", explain: "Rätt. Ratio-etiketten läses tvärs över: talet vid Employee gäller varje Project." },
      { text: "Att exakt en Employee finns för varje Project i modellen", explain: "Exakt en kräver också dubbel linje — etiketten anger bara ett maximum." },
      { text: "Att varje Employee får leda högst ett Project i modellen", explain: "Det vore att läsa etiketten vid sin egen ände; den läses tvärs över." },
      { text: "Att Employee måste delta i relationen Leads minst en gång", explain: "Deltagande uttrycks av linjen, inte av ratio-etiketten." }
    ],
    correct: 0, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-20", topic: "relationstyper", difficulty: 2,
    question: "Vad betyder ratio-etiketten `1` i kursens Chen-konvention?",
    options: [
      { text: "At least one — den kräver minst ett deltagande", explain: "Minst en uttrycks av dubbel linje, inte av etiketten." },
      { text: "Exactly one — den anger både minimum och maximum", explain: "Etiketten anger bara maximum; exakt en kräver dubbel linje därtill." },
      { text: "At most one — den anger enbart ett maximum", explain: "Rätt. Ratio-etiketterna anger endast maxima — 1 betyder högst en." },
      { text: "One only if the participation line is doubled as well", explain: "Etiketten betyder högst en oavsett linje; linjen lägger till minst en." }
    ],
    correct: 2, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-21", topic: "relationstyper", difficulty: 1,
    question: "Vad betyder en dubbel linje mellan en entity och en romb?",
    options: [
      { text: "Att relationen är identifying och entityn därmed är weak", explain: "Identifierande relation ritas med dubbel romb, inte dubbel linje." },
      { text: "Att entityn deltar minst en gång — total participation", explain: "Rätt. Dubbel linje är total participation, läst vid sin egen ände." },
      { text: "Att multipliciteten i den änden är exakt ett", explain: "Multipliciteten sätts av ratio-etiketten, inte av linjen." },
      { text: "Att entityn deltar i två olika relationships samtidigt", explain: "Linjen hör till en relation; den säger inget om andra relationer." }
    ],
    correct: 1, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-23", topic: "relationstyper", difficulty: 3,
    question: "Vad gäller när min–max-notation `(0,N)` används?",
    options: [
      { text: "Tuplerna läses across, precis som vanliga ratio labels alltid gör", explain: "Min–max-tupler läses vid sin egen entitet, inte tvärs över." },
      { text: "Tuplerna ersätter ratio labels, medan dubbellinjerna behålls som förut", explain: "Dubbellinjerna används inte alls när tuplerna bär deltagandekravet." },
      { text: "Tuplerna läses vid sin egen entity, utan dubbellinjer", explain: "Rätt. Tuplerna läses vid egen entitet, med enkla linjer genomgående." },
      { text: "Tuplerna anger enbart maxima, precis som ratio labels gör", explain: "Tupelns första värde är ett minimum, inte bara ett maximum." }
    ],
    correct: 2, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-25", topic: "relationstyper", difficulty: 3,
    question: "Ratiot 1:N med enkla linjer används för Supervises. Vad tillåter modellen fortfarande?",
    options: [
      { text: "Att en Employee har flera supervisors samtidigt", explain: "1 vid supervisor begränsar varje underställd till högst en handledare." },
      { text: "Att en Employee handleder sig själv och att cykler uppstår", explain: "Rätt. Basic Chen saknar symbol för supervisor ≠ report och för acyklicitet." },
      { text: "Att en Employee saknar både supervisor och reports", explain: "Det tillåts av enkla linjer, men det är inget fel — frågan gäller ogiltiga populationer." },
      { text: "Att relationen läses i motsatt riktning mot rollnamnen", explain: "Läsriktningen styrs av rollnamnen och kan inte vändas godtyckligt." }
    ],
    correct: 1, source: "Kompendiet kap. 5", reviewed: true },

  { id: "db4-26", topic: "svaga", difficulty: 3,
    question: "Vad krävs för att en entity type ska vara weak?",
    options: [
      { text: "Att den deltar obligatoriskt i minst en relationship", explain: "Total participation gör inte en entitet svag — Project i Leads förblir stark." },
      { text: "Att den saknar egna attributes utöver sin partial identifier", explain: "Svaghet handlar om identitet, inte om antalet attribut." },
      { text: "Att den har färre instanser än den entity type den är kopplad till", explain: "Antalet instanser har inget med svaghet att göra." },
      { text: "Att dess identitet är beroende av en entity av annan type", explain: "Rätt. Svaghet kräver identitetsberoende av en entitet av annan typ." }
    ],
    correct: 3, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-27", topic: "svaga", difficulty: 3,
    question: "Två relationship types kring ProjectTask har båda multipliciteten 1:N. Vilken är owner?",
    options: [
      { text: "Den som har total participation på ProjectTask-sidan", explain: "Total participation pekar inte ut ägaren." },
      { text: "Den vars entity type har flest attributes av de två", explain: "Antalet attribut säger ingenting om vem som äger." },
      { text: "Det går inte att avgöra — double diamond avgör", explain: "Rätt. Multipliciteterna avslöjar inte ägaren — dubbel romb och dubbel rektangel gör det." },
      { text: "Den som står till vänster enligt diagrammets läsordning", explain: "Diagrammets placering är bara schematisk." }
    ],
    correct: 2, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-30", topic: "svaga", difficulty: 2,
    question: "När bör ett par reifieras till en egen entity type?",
    options: [
      { text: "När paret behöver egen identitet eller eget lifecycle", explain: "Rätt. Reifiera när paret ska refereras, delta i andra relationer eller ha egen livscykel." },
      { text: "Så snart relationen äger minst ett eget attribute i modellen", explain: "Relationsattribut i sig tvingar inte fram reifiering." },
      { text: "När multipliciteten är M:N i stället för 1:N mellan de två", explain: "Multipliciteten avgör inte; ett M:N-par kan förbli en relation." },
      { text: "När de deltagande entity types hör till olika verksamhetsdelar", explain: "Organisatorisk hemvist är inget skäl i modellen." }
    ],
    correct: 0, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-32", topic: "crowsfoot", difficulty: 2,
    question: "Varför måste ett Employee–Project-par bli en associative entity i Crow's Foot?",
    options: [
      { text: "Därför att Crow's Foot inte tillåter M:N-relationer alls", explain: "Crow's Foot uttrycker M:N; det är attributen som inte får plats på linjen." },
      { text: "Därför att romben saknas och relationer därför måste bli entities", explain: "Att romben saknas gör inte relationer till entiteter i sig." },
      { text: "Därför att notationen kräver en identifier på varje relation", explain: "Notationen kräver ingen identifierare på relationer." },
      { text: "Därför att en relationship line inte har utrymme för attributes", explain: "Rätt. En Crow's Foot-linje kan inte bära attribut, så paret blir en associativ entitet." }
    ],
    correct: 3, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-33", topic: "crowsfoot", difficulty: 2,
    question: "Hur läses de två märkena vid en endpoint i common IE?",
    options: [
      { text: "Det yttre visar one eller many, det inre visar optional eller required", explain: "Omvänt: det yttre märket är optional/required, det inre one/many." },
      { text: "Det yttre visar optional eller required, det inre visar one eller many", explain: "Rätt. Yttre: cirkel = optional, streck = required. Inre: streck = one, fork = many." },
      { text: "Det yttre visar minimum och det inre visar maximum antal", explain: "Märkena anger inte minimum och maximum som tal." },
      { text: "Båda visar samma sak och det ena är enbart en förstärkning", explain: "De två märkena betyder olika saker och ger tillsammans fyra mönster." }
    ],
    correct: 1, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-34", topic: "crowsfoot", difficulty: 3,
    question: "Vad kan en heldragen linje betyda i olika Crow's Foot-verktyg?",
    options: [
      { text: "Alltid required participation, oavsett vilket verktyg", explain: "I vissa verktyg betyder heldragen linje identifying, inte required." },
      { text: "Alltid en identifying relationship, oavsett verktyg", explain: "I Barker/Oracle betyder heldragen halvlinje must, inte identifying." },
      { text: "Antingen \"must\" eller identifying — läs legenden", explain: "Rätt. Samma linjestil betyder olika saker i olika dialekter — läs legenden." },
      { text: "Alltid many i den ände där linjen är som tjockast", explain: "Många visas med fork, inte med linjens tjocklek." }
    ],
    correct: 2, source: "Kompendiet kap. 6", reviewed: true },

  { id: "db4-35", topic: "crowsfoot", difficulty: 2,
    question: "Hur visar Crow's Foot att en ProjectTask identifieras av sitt Project?",
    options: [
      { text: "Med upprepade ID-markörer som bildar en composite identifier", explain: "Rätt. Upprepade ID-markörer gör project_no och task_no till en sammansatt identifierare." },
      { text: "Med en dubbel ram runt entity boxen och streckad understrykning", explain: "Dubbel ram och streckad understrykning är Chens symboler, inte Crow's Foots." },
      { text: "Med en särskild symbol för identifying relationship vid linjen", explain: "Crow's Foot har ingen särskild symbol för identifierande relation." },
      { text: "Det går inte att visa i Crow's Foot och måste dokumenteras separat", explain: "Det går att visa — direkt i identifieraren med två ID-markörer." }
    ],
    correct: 0, source: "Kompendiet kap. 6", reviewed: true },

  { id: "dbq-13", topic: "transformation", difficulty: 1,
    question: "Var hamnar den främmande nyckeln vid en binär 1:M-relation?",
    options: [
      { text: "I ett-sidans relation, som referens till många-sidans primärnyckel", explain: "Ett projekt har många anställda — det går inte att lagra i en cell på ett-sidan." },
      { text: "I många-sidans relation, som referens till ett-sidans primärnyckel", explain: "Rätt. En anställd har ett projekt, så projektets nyckel får plats i den anställdas rad." },
      { text: "I en ny kopplingsrelation som får båda primärnycklarna", explain: "Kopplingsrelationen är M:N-regeln; 1:M behöver ingen ny relation." },
      { text: "I båda relationerna, så att kopplingen kan följas åt båda hållen", explain: "En främmande nyckel räcker; joinen går åt båda hållen ändå." }
    ],
    correct: 1, source: "Kompendiet kap. 7", reviewed: false },

  { id: "dbq-14", topic: "transformation", difficulty: 3,
    question: "En 1:1-relation har ett obligatoriskt och ett frivilligt deltagande. Var läggs den främmande nyckeln?",
    options: [
      { text: "I den frivilliga sidans relation, så att NULL blir tillåtet där det behövs", explain: "Då blir kolumnen NULL för alla som inte deltar — precis det man vill undvika." },
      { text: "I en ny relation, eftersom 1:1 alltid transformeras med en kopplingstabell", explain: "1:1 kräver ingen ny relation; det är M:N-regelns lösning." },
      { text: "I valfri riktning — vid 1:1 väljer arkitekten oavsett deltagandet", explain: "Fri riktning gäller bara när båda sidor deltar frivilligt." },
      { text: "I den obligatoriska sidans relation, så att kolumnen aldrig blir NULL", explain: "Rätt. Den obligatoriska sidan har alltid en motpart, så nyckeln från den frivilliga sidan läggs där." }
    ],
    correct: 3, source: "Kompendiet kap. 7", reviewed: false },

  { id: "dbq-15", topic: "transformation", difficulty: 2,
    question: "Work(EmployeeNo, ProjectNo, Hours) uppstår ur en M:N-relation. Vad gäller för Hours?",
    options: [
      { text: "Det är ett icke-nyckelattribut utanför den sammansatta primärnyckeln", explain: "Rätt. Ingick Hours i nyckeln kunde samma par förekomma två gånger med olika timmar." },
      { text: "Det ingår i primärnyckeln, eftersom det kommer från relationen själv", explain: "Då skulle samma anställd kunna finnas på samma projekt flera gånger." },
      { text: "Det blir en främmande nyckel mot en ny relation som lagrar timmarna", explain: "Relationsattribut läggs direkt i kopplingsrelationen som vanliga attribut." },
      { text: "Det flyttas till Employee, eftersom timmarna beskriver den anställda", explain: "Timmarna beskriver paret anställd–projekt, inte den anställda ensam." }
    ],
    correct: 0, source: "Kompendiet kap. 7", reviewed: false },

  { id: "dbq-16", topic: "transformation", difficulty: 2,
    question: "Hur bildas primärnyckeln i relationen för en svag entitet?",
    options: [
      { text: "Av den partiella nyckeln ensam, eftersom den är unik inom sin ägare", explain: "Unik inom ägaren räcker inte — RoomNo upprepas mellan hotellen." },
      { text: "Av ägarens primärnyckel ensam, eftersom den svaga entiteten saknar egen nyckel", explain: "Ägarens nyckel skiljer inte två rum på samma hotell åt." },
      { text: "Av ägarens primärnyckel som främmande nyckel tillsammans med den partiella nyckeln", explain: "Rätt. Kombinationen HotelName + RoomNo är unik och speglar beroendet i ER-modellen." },
      { text: "Av ett nytt löpnummer, eftersom kombinationen inte kan vara nyckel", explain: "Löpnummer är fysisk design; kombinationen är precis vad regeln föreskriver." }
    ],
    correct: 2, source: "Kompendiet kap. 7", reviewed: false },

  { id: "dbq-17", topic: "transformation", difficulty: 2,
    question: "Address som flervärdesattribut ger EmployeeAddress(EmployeeNo, Address). Vilken konsekvens har det?",
    options: [
      { text: "Varje adress kan bara höra till en anställd, eftersom den är en egen entitet", explain: "Det hade gällt om adressen modellerats som entitet — inte som attribut." },
      { text: "Adressen måste vara unik i hela databasen, eftersom den ingår i nyckeln", explain: "Nyckeln är kombinationen; samma adress får förekomma med olika EmployeeNo." },
      { text: "Anställda utan adress kan inte lagras, eftersom nyckeln då blir NULL", explain: "En anställd utan adress får helt enkelt ingen rad i EmployeeAddress." },
      { text: "Två anställda kan dela samma adress, eftersom adressen bara är ett värde", explain: "Rätt. Vill man hindra det ska adressen modelleras som en egen entitet." }
    ],
    correct: 3, source: "Kompendiet kap. 7", reviewed: false },

  { id: "dbq-18", topic: "transformation", difficulty: 2,
    question: "Hur transformeras en unär 1:M-relation som chef–anställd?",
    options: [
      { text: "Som en ny relation med två attribut som båda refererar till Employee", explain: "Det är lösningen för unär M:N, inte för 1:M." },
      { text: "Som en kopia av Employee-relationen med namnet Manager och samma attribut", explain: "Chefer är anställda; ingen ny entitetsrelation behövs." },
      { text: "Som en främmande nyckel i samma relation, med rollnamnet som attributnamn", explain: "Rätt. ManagerNo i Employee refererar tillbaka till EmployeeNo; högsta chefen har NULL." },
      { text: "Inte alls — unära relationer representeras inte i den logiska modellens relationer", explain: "Den binära regeln av samma form tillämpas, med samma entitet på båda sidor." }
    ],
    correct: 2, source: "Kompendiet kap. 7", reviewed: false },

  { id: "dbq-19", topic: "normalisering", difficulty: 2,
    question: "Varför blir en M:N-relation tre relationer och inte en enda?",
    options: [
      { text: "En relation som lagrar två saker samtidigt får uppdaterings- och raderingsanomalier", explain: "Rätt. Budgeten måste ändras på flera rader, och sista anställda tar projektet med sig." },
      { text: "Relationsmodellen tillåter högst ett främmande nyckelattribut i varje relation", explain: "Ingen sådan gräns finns; kopplingsrelationen har två." },
      { text: "SQL Server kan inte skapa en primärnyckel som sträcker sig över fler än två attribut", explain: "Sammansatta nycklar över flera attribut är helt tillåtna." },
      { text: "Tre relationer ger alltid snabbare frågor än en enda, oavsett vad de innehåller", explain: "Prestanda är inte skälet — det är redundansen och dess anomalier." }
    ],
    correct: 0, source: "Kompendiet kap. 8", reviewed: false },

  { id: "dbq-20", topic: "normalisering", difficulty: 2,
    question: "En relation i 1NF har en enkel kandidatnyckel. Vad gäller om 2NF?",
    options: [
      { text: "Den kan bryta mot 2NF om något icke-primärattribut beror på ett annat", explain: "Beroende mellan icke-primära attribut är ett 3NF-problem, inte 2NF." },
      { text: "Den är automatiskt i 2NF — en enkel nyckel har inga äkta delmängder", explain: "Rätt. Partiellt beroende kräver en sammansatt nyckel att vara delmängd av." },
      { text: "Den måste först dekomponeras i två relationer innan 2NF kan prövas", explain: "Dekomposition görs bara när ett test misslyckas." },
      { text: "Den är i 2NF bara om alla attribut är atomära och dessutom unika", explain: "Unikhet är inget 2NF-krav; atomära värden är 1NF." }
    ],
    correct: 1, source: "Kompendiet kap. 8", reviewed: false },

  { id: "dbq-21", topic: "normalisering", difficulty: 3,
    question: "A → B, B → A och B → C gäller. Är C transitivt beroende av A?",
    options: [
      { text: "Ja, eftersom A bestämmer B och B bestämmer C", explain: "Kedjan finns, men B → A gör att undantaget i definitionen slår till." },
      { text: "Ja, eftersom C inte ingår i någon kandidatnyckel", explain: "Att C är icke-primärt räcker inte; mellanledet får inte vara en nyckel." },
      { text: "Nej, eftersom C beror direkt på B och inte på A", explain: "C beror visserligen av B, men skälet är ett annat." },
      { text: "Nej, eftersom B → A gör B till en kandidatnyckel", explain: "Rätt. Definitionen undantar fallet Y → X; då är Y själv en kandidatnyckel." }
    ],
    correct: 3, source: "Kompendiet kap. 8", reviewed: false },

  { id: "dbq-22", topic: "normalisering", difficulty: 3,
    question: "Vad kräver 3NF utöver 2NF?",
    options: [
      { text: "Att inget icke-primärattribut beror på en äkta delmängd av någon kandidatnyckel", explain: "Det är 2NF-kravet, som redan förutsätts." },
      { text: "Att relationen har exakt en kandidatnyckel som består av ett attribut", explain: "3NF ställer inga krav på antalet eller formen på nycklarna." },
      { text: "Att alla värden är atomära och att primärnyckeln är ett enda attribut", explain: "Atomära värden är 1NF; nyckelns form spelar ingen roll." },
      { text: "Att varje icke-primärattribut är icke-transitivt beroende av varje kandidatnyckel", explain: "Rätt. Ordagrant: varje icke-primärattribut, varje kandidatnyckel." }
    ],
    correct: 3, source: "Kompendiet kap. 8", reviewed: false },

  { id: "dbq-23", topic: "normalisering", difficulty: 2,
    question: "Hur härleds kandidatnyckeln ur de funktionella beroendena?",
    options: [
      { text: "Som det attribut som förekommer i flest beroenden på vänster sida av pilen", explain: "Antal förekomster säger inget om vad attributet bestämmer." },
      { text: "Som den minimala attributuppsättning som bestämmer alla övriga attribut", explain: "Rätt. I exemplet bestämmer {EmployeeNo, ProjectNo} tillsammans allt annat." },
      { text: "Som det attribut som har flest distinkta värden i den exempeldata som finns", explain: "Distinkta värden i data är inte en regel på modellnivå." },
      { text: "Som det första attributet i relationen, eftersom det brukar vara nyckeln", explain: "Attributens ordning saknar betydelse i relationsmodellen." }
    ],
    correct: 1, source: "Kompendiet kap. 8", reviewed: false },

  { id: "dbq-24", topic: "normalisering", difficulty: 3,
    question: "Vad innebär det att en dekomposition är lossless?",
    options: [
      { text: "Inga rader går förlorade när man raderar i någon av delrelationerna", explain: "Lossless handlar om join, inte om radering." },
      { text: "Originalrelationen kan återskapas exakt genom join, utan spurious tuples", explain: "Rätt. Ger joinen rader som inte fanns i originalet är dekompositionen felaktig." },
      { text: "Alla funktionella beroenden kan kontrolleras inom en enskild delrelation", explain: "Det är dependency preservation, det andra kvalitetskravet." },
      { text: "Delrelationerna tar tillsammans mindre lagringsutrymme än originalet", explain: "Lagringsutrymme är inte kriteriet." }
    ],
    correct: 1, source: "Kompendiet kap. 8", reviewed: false },

  { id: "dbq-25", topic: "fysisk", difficulty: 1,
    question: "Vilka satser hör till DDL?",
    options: [
      { text: "SELECT, INSERT och UPDATE", explain: "Det är DML — satserna som hanterar data." },
      { text: "CREATE, ALTER och DROP", explain: "Rätt. DDL definierar strukturer; DML hanterar data." },
      { text: "PRIMARY KEY och UNIQUE", explain: "Det är constrainttyper, inte satser." },
      { text: "INT, DECIMAL och VARCHAR", explain: "Det är datatyper, inte satser." }
    ],
    correct: 1, source: "Kompendiet kap. 9", reviewed: false },

  { id: "dbq-26", topic: "fysisk", difficulty: 2,
    question: "Vad skiljer UNIQUE från PRIMARY KEY?",
    options: [
      { text: "UNIQUE gäller bara textkolumner, PRIMARY KEY bara heltalskolumner", explain: "Datatypen har inget med constrainttypen att göra." },
      { text: "UNIQUE upprätthåller referensintegritet, PRIMARY KEY gör det inte", explain: "Referensintegritet är FOREIGN KEY:s uppgift." },
      { text: "UNIQUE tillåter NULL; PRIMARY KEY är NOT NULL och det finns bara en per tabell", explain: "Rätt. Därför hamnar naturliga nycklar som UNIQUE när surrogatnyckeln tagit över." },
      { text: "UNIQUE kontrolleras bara vid INSERT, PRIMARY KEY även vid UPDATE", explain: "Båda gäller alltid, oavsett operation." }
    ],
    correct: 2, source: "Kompendiet kap. 9", reviewed: false },

  { id: "dbq-27", topic: "fysisk", difficulty: 2,
    question: "Vilken constraint ger domänbegreppet ur kapitel 2 sin tekniska motsvarighet?",
    options: [
      { text: "CHECK, som villkorar vilka värden kolumnen får innehålla", explain: "Rätt. CHECK (EmpSalary >= 0) är domänregeln uttryckt i DDL." },
      { text: "DEFAULT, som sätter ett värde när inget anges vid INSERT", explain: "DEFAULT fyller i ett värde; den begränsar inte vilka som är tillåtna." },
      { text: "UNIQUE, som hindrar att samma värde förekommer två gånger", explain: "Unikhet är en nyckelegenskap, inte en domän." },
      { text: "FOREIGN KEY, som kopplar kolumnen till en annan tabells nyckel", explain: "Referensintegritet gäller kopplingar, inte tillåtna värden." }
    ],
    correct: 0, source: "Kompendiet kap. 9", reviewed: false },

  { id: "dbq-28", topic: "fysisk", difficulty: 3,
    question: "Vad måste följa med när en surrogatnyckel blir primärnyckel?",
    options: [
      { text: "Den naturliga nyckeln tas bort, eftersom två nycklar ger redundans", explain: "Då förloras affärsregeln att till exempel anställningsnummer är unika." },
      { text: "Den naturliga nyckeln görs till främmande nyckel mot surrogatnyckeln", explain: "En kolumn i samma tabell refererar inte sin egen rad." },
      { text: "Surrogatnyckeln får ett CHECK-villkor som binder den till den naturliga", explain: "CHECK uttrycker domäner, inte kopplingen mellan två nycklar." },
      { text: "Den naturliga nyckeln behålls som UNIQUE, annars förloras affärsregeln om unikhet", explain: "Rätt. EmployeeID är surrogat primärnyckel och EmpNo naturlig nyckel med UQ-constraint." }
    ],
    correct: 3, source: "Kompendiet kap. 9", reviewed: false },

  { id: "dbq-29", topic: "fysisk", difficulty: 1,
    question: "Varför ska belopp lagras som DECIMAL(p,s) och inte som FLOAT?",
    options: [
      { text: "FLOAT tar mer lagringsutrymme än DECIMAL för samma antal siffror", explain: "Utrymmet är inte skälet." },
      { text: "DECIMAL indexeras betydligt snabbare än FLOAT i SQL Server", explain: "Indexering är inte skälet." },
      { text: "DECIMAL är exakt, medan FLOAT ger avrundningsfel i beloppen", explain: "Rätt. Pengar kräver exakta decimaler; FLOAT är en approximation." },
      { text: "FLOAT tillåter inte negativa värden, vilket belopp kan kräva", explain: "FLOAT tillåter negativa tal; det är precisionen som brister." }
    ],
    correct: 2, source: "Kompendiet kap. 9", reviewed: false },

  { id: "dbq-30", topic: "fysisk", difficulty: 2,
    question: "Varför ska constraints namnges enligt kodstandarden, som PK_Employee_EmployeeID?",
    options: [
      { text: "SQL Server vägrar att skapa constraints som saknar ett explicit angivet namn", explain: "Servern hittar på ett namn själv — men ett obegripligt." },
      { text: "Namnet avgör i vilken ordning constraints kontrolleras vid varje INSERT", explain: "Kontrollordningen styrs inte av namnen." },
      { text: "Namnet gör att constrainten indexeras automatiskt av databashanteraren", explain: "Namngivning skapar inga index." },
      { text: "Felmeddelanden blir begripliga och constrainten kan refereras i ALTER TABLE", explain: "Rätt. Praktiska skäl: förstå felet och kunna peka på constrainten senare." }
    ],
    correct: 3, source: "Kompendiet kap. 9", reviewed: false },
];
