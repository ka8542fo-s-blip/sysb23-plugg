// Bokens kapitel 10: Stallings & Brown, Buffer Overflow (s. 542–597).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 24 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok10",
  kind: "bok",
  label: "Bokens kapitel 10",
  examArea: "Bokfrågor",
  focus: ["Introduction to Buffer Overflow"],
  title: "Buffer overflow: orsaker, attacker och försvar",
  readingMinutes: 11,
  lead: "Vad som händer när ett program skriver mer data i en buffer än den rymmer, varför felet är så vanligt i språk som C, vad en angripare kan uppnå med det och hur kompilatorn och operativsystemet skyddar mot det.",
  sources: ["Stallings & Brown kap. 10 (s. 542–597)", "Stallings & Brown kap. 11 (s. 608–616)"],
  body: `
## Kärnan

- En **buffer overflow** uppstår när ett program skriver mer data i ett minnesområde, en **buffer**, än det finns plats för. Det som ligger bredvid i minnet skrivs då över.
- Felet uppstår i språk som **C**, som inte kontrollerar gränserna, särskilt när programmeraren använder osäkra funktioner eller utgår från att indata aldrig blir större än bufferten.
- En angripare kan krascha programmet, ändra dess data eller köra egen kod, **shellcode**, med programmets behörigheter.
- I en klassisk **stack buffer overflow** skrivs funktionens returadress över, så att programmet hoppar dit angriparen vill.
- Försvaren delas i två grupper: **compile-time defenses**, som härdar nya program, och **run-time defenses**, som skyddar befintliga program medan de körs.
- Buffer overflow är ingen av de vanliga webbsårbarheterna. Det var svaret på en av förra årets tentafrågor.

## Vad en buffer overflow är

En **buffer** är ett minnesområde med fast storlek där ett program lagrar data, till exempel en textrad som användaren skrivit. Boken använder NIST:s definition av **buffer overrun**, ett annat namn för samma sak: ett tillstånd där "more input can be placed into a buffer … than the capacity allocated", så att annan information skrivs över.

Det som skrivs över kan vara:

- andra variabler som programmet använder
- data som styr programflödet, till exempel **returadresser**: var programmet ska fortsätta när en funktion är klar

Bokens första exempel visar hur lite som krävs. Två textvariabler med plats för åtta tecken var ligger bredvid varandra i minnet. Programmet läser in användarens text i den ena och jämför den med ett förväntat värde i den andra. Är texten för lång rinner den över i grannvariabeln, och med rätt avvägd indata blir de två lika. Om det förväntade värdet hade varit ett lösenord skulle angriparen ha kommit in utan att kunna det.

För att utnyttja en buffer overflow behöver angriparen två saker:

1. **En sårbarhet som går att utlösa med indata utifrån**, som angriparen styr. Den hittas genom att läsa källkoden, köra programmet med för lång indata eller med automatiska verktyg (fuzzing).
2. **Kunskap om hur bufferten ligger i minnet**, och därmed vad som går att skriva över.

## Varför den uppstår

Det beror på hur språket hanterar minnet:

| Språk | Exempel | Gränskontroll |
|---|---|---|
| Maskinnära | assembler | ingen; minnet är bara byte, och programmeraren ansvarar för allt |
| Mellannivå | C och dess efterföljare | ingen automatisk; programmet kan läsa och skriva minnet direkt |
| Starkt typade högnivåspråk | Java, Ada, Python | inbyggd; språket släpper inte in mer data i en buffer än det finns plats för |

C skapades i början av 1970-talet och användes tidigt för att skriva UNIX. Konstruktörerna prioriterade snabbhet och litet minnesbehov framför typsäkerhet och räknade med att programmerarna skulle vara noggranna. Tre saker gör felet vanligt:

- **Osäkra funktioner.** Flera vanliga funktioner i C:s standardbibliotek för att läsa in och hantera text, som gets, strcpy och sprintf, kontrollerar inte buffertens storlek.
- **Programmerarens antaganden.** Programmeraren tror att indata blir högst några rader, avsätter kanske 1 024 byte och kontrollerar aldrig att det stämmer. Testerna fångar sällan felet, eftersom testdata liknar det användarna förväntas skriva.
- **Gammal kod.** UNIX, Linux och Windows innehåller mycket äldre kod med de osäkra funktionerna, och många system patchas inte.

Felet kan uppstå överallt där data utifrån kopieras eller slås ihop i en buffer, också i bibliotek som programmet använder. Det har utnyttjats sedan Morris-masken 1988 och är fortfarande en av de vanligaste attackerna.

## Inte en webbsårbarhet

En av förra årets tentafrågor frågade vilken av cross-site scripting, broken access control, SQL injection och buffer overflow som *inte* är en vanlig sårbarhet i webbapplikationer. Svaret var buffer overflow.

| | Buffer overflow | De vanliga webbsårbarheterna |
|---|---|---|
| Var felet sitter | i programkod som hanterar minnet direkt, skriven i språk utan gränskontroll | i webbapplikationens logik och dess hantering av indata |
| Vad som går fel | indata är större än bufferten och skriver över minnet | behörigheten kontrolleras inte (broken access control), eller indata tolkas som kod (SQL injection, XSS) |

Boken skiljer på samma sätt mellan två slags problem med indata: **storleken**, som leder till buffer overflow, och **tolkningen**, som leder till injection-attacker som SQL injection och XSS. Högnivåspråk som Java och Python, som också används för webbapplikationer, kontrollerar gränserna själva. De tre webbsårbarheterna finns i gästföreläsningen, och SQL injection också i kapitlet Databas- och datacentersäkerhet.

## Vad angriparen kan uppnå

| Följd | Vad som händer | Hotar |
|---|---|---|
| **Krasch** | returadressen skrivs över med skräp, och programmet hoppar till en ogiltig adress och avbryts | availability: tjänsten slutar fungera, en form av denial of service |
| **Ändrade data** | variabler som programmet använder skrivs över, som i lösenordsexemplet | integrity |
| **Egen kod körs** | programmet hoppar till kod som angriparen valt, ofta shellcode i själva bufferten | allt: angriparen tar kontroll över programmet |

**Behörigheterna avgör hur illa det blir.** Angriparens kod körs med samma behörigheter som det angripna programmet. I bokens exempel har angriparen ett vanligt konto och utnyttjar en buffer overflow i ett betrott systemprogram som körs med root-behörighet. Angriparen får då ett shell som root och kan läsa shadow password file, som annars bara root kommer åt. Det är privilege escalation (se gästföreläsningen).

Målet kan vara ett betrott program på samma dator, en nätverkstjänst som Morris-masken angrep, eller kod som visar bilder och dokument som kommer med e-post eller från en webbsida. Efter en lyckad attack kraschar programmet oftast ändå, så tjänsten går förlorad.

## Var i minnet det sker

När ett program körs får processen ett eget virtuellt **address space**. Bufferten kan ligga på tre ställen:

| Område | Vad som ligger där | Attacken |
|---|---|---|
| **Stack** | funktionernas lokala variabler och returadresser | stack buffer overflow |
| **Heap** | minne som programmet begär medan det körs, till exempel för listor | heap overflow |
| **Global data** | globala och statiska variabler, laddade från programfilen | global data area overflow |

## Stack overflow och shellcode

Varje gång en funktion anropas får den en **stack frame** på stacken. Där sparas returadressen, en pekare till den anropande funktionens stack frame och, under dem, funktionens lokala variabler. En lokal buffer som rinner över kan därför nå returadressen. Det är kärnan i en **stack buffer overflow**, som också kallas **stack smashing**:

1. **Skräp i returadressen:** programmet hoppar till en ogiltig adress och kraschar.
2. **En vald adress i returadressen:** när funktionen är klar fortsätter programmet där angriparen vill.
3. **Shellcode i bufferten:** angriparen fyller bufferten med egen maskinkod och pekar returadressen på den.

**Shellcode** är angriparens maskinkod. Namnet kommer av att den traditionellt startar ett **shell**, en kommandotolk, med det angripna programmets behörigheter. Den är bunden till en viss processor och oftast ett visst operativsystem, och verktyg som Metasploit gör den lätt att ta fram.

**NOP sled.** Angriparen vet sällan exakt var bufferten hamnar i minnet. Därför fylls början av bufferten med instruktioner som inte gör något (NOP), och shellcoden läggs efter dem. Returadressen pekas någonstans mitt i raden. Var programmet än landar glider det igenom NOP-instruktionerna fram till shellcoden, så adressen behöver bara vara ungefär rätt.

## Försvaren

| | **Compile-time defenses** | **Run-time defenses** |
|---|---|---|
| Mål | härda nya program så att de står emot attacker | upptäcka och avbryta attacker i befintliga program |
| Hur | språk, kodning, bibliotek och extra kontrollkod när programmet kompileras | ändrad hantering av processens minne, levererad som uppdateringar av operativsystemet |
| Nackdel | programmen måste oftast skrivas om eller kompileras om | ger bara ett visst skydd |

**Compile-time:**

- **Säkert språk:** ett starkt typat högnivåspråk lägger in gränskontrollerna automatiskt. Det kostar lite prestanda och ger sämre åtkomst till hårdvaran, så till exempel drivrutiner skrivs fortfarande ofta i C.
- **Säker kodning:** all kod som skriver i en buffer kontrollerar först att det finns plats.
- **Språkutvidgningar och säkra bibliotek:** kompilatorn lägger in gränskontroller i C-koden, eller så ersätts de osäkra funktionerna med säkrare.
- **Stack protection:** kompilatorn lägger in kontrollkod i varje funktion. Stackguard lägger ett slumpvalt **canary**-värde mellan de lokala variablerna och returadressen och kontrollerar det innan funktionen återvänder. Har värdet ändrats avbryts programmet. Värdet måste vara oförutsägbart, annars skriver angriparen bara in rätt värde. Namnet kommer från kanariefåglarna som varnade gruvarbetare för giftig luft.

**Run-time:**

- **Executable address space protection:** processorns minneshantering markerar stacken och heapen som **nonexecutable** (no-execute), så shellcode som kopierats dit kan inte köras. Boken räknar det som en av de bästa metoderna för befintliga program.
- **Address space randomization** (ofta förkortat ASLR): stacken läggs på en slumpvis vald adress för varje process. Angriparen kan då inte förutsäga var bufferten ligger, och variationen är större än en NOP sled kan täcka. Samma idé används för heapen och för var standardbiblioteken laddas. Försvaret kan kringgås om angriparen får försöka väldigt många gånger.
- **Guard pages:** luckor mellan områdena i processens adressrum markeras som otillåtna adresser, och den som försöker nå dem avbryts. Det stoppar främst försök att skriva över ett intilliggande område, till exempel från global data.

**Inget försvar täcker allt.** En överskrivning av en grannvariabel, som i lösenordsexemplet, rör varken returadressen eller körbar kod. Den går bara att förhindra genom att programmet skrivs rätt från början.

## Andra former

- **Replacement stack frame:** angriparen skriver över den sparade pekaren till förra stack frame i stället för returadressen och pekar den på en falsk stack frame i bufferten, vilket kan fungera även när överskrivningen bara räcker en byte (**off-by-one**).
- **Return to system call:** returadressen pekas på befintlig kod, till exempel en biblioteksfunktion som kör ett kommando, så att nonexecutable stack inte hjälper, men stack protection och randomisering gör det.
- **Heap overflow:** bufferten ligger på heapen, där det inte finns några returadresser, så angriparen skriver i stället om en funktionspekare intill bufferten.
- **Global data area overflow:** samma idé för en buffer bland programmets globala variabler.
`,
};

export const topic = {
  id: "bok10-buffer",
  name: "Buffer overflow: orsaker, attacker och försvar",
  chapter: "bok10",
  examWeight: "hög",
  summary: "En buffer overflow uppstår när ett program skriver mer data i en buffer än den rymmer, så att intilliggande minne skrivs över. Felet hör till språk som C, som saknar gränskontroll, och förvärras av osäkra funktioner och programmerare som litar på att indata är kort. Angriparen kan krascha programmet, ändra data eller skriva över returadressen och köra egen shellcode med programmets behörigheter. Försvaren är compile-time (säkert språk, säker kodning, säkra bibliotek, stack protection) eller run-time (nonexecutable minne, address space randomization, guard pages). Buffer overflow är ett minnesfel, inte en av de vanliga webbsårbarheterna.",
  keyPoints: [
    "Buffer overflow: mer data skrivs i en buffer än den rymmer, och intilliggande minne skrivs över.",
    "Orsaken: språk som C utan gränskontroll, osäkra funktioner som gets och programmerare som tror att indata är kort.",
    "Följderna: krasch (availability), ändrade data (integrity) eller angriparens egen kod med programmets behörigheter.",
    "Stack buffer overflow: returadressen i funktionens stack frame skrivs över, så att programmet hoppar dit angriparen vill.",
    "Shellcode: angriparens maskinkod, som traditionellt startar ett shell med det angripna programmets behörigheter.",
    "NOP sled: instruktioner som inte gör något före shellcoden, så att en ungefärlig adress räcker.",
    "Compile-time defenses: säkert språk, säker kodning, säkra bibliotek och stack protection med canary.",
    "Run-time defenses: nonexecutable stack och heap, address space randomization och guard pages.",
    "Ingen webbsårbarhet: ett minnesfel i språk utan gränskontroll, inte ett fel i webbapplikationens logik som SQL injection och XSS.",
  ],
  pitfalls: [
    "Buffer overflow är ett minnesfel i program skrivna i språk utan gränskontroll, inte en webbsårbarhet som SQL injection, XSS eller broken access control.",
    "Kraschen är bara den enklaste följden; den farliga är att angriparens kod körs med programmets behörigheter, kanske som root.",
    "Stack protection med canary är ett compile-time-försvar; nonexecutable stack, address space randomization och guard pages är run-time-försvar.",
    "NOP sled är angriparens teknik för att slippa veta den exakta adressen, inte ett försvar; address space randomization gör variationen för stor för den.",
    "Return to system call kör befintlig kod och klarar sig därför förbi nonexecutable stack; en heap overflow skriver över en funktionspekare, inte en returadress.",
  ],
};

export const glossary = [
  { term: "Buffer", definition: "Ett minnesområde med fast storlek där ett program lagrar data, till exempel en inläst textrad. Kan ligga på stacken, på heapen eller bland programmets globala data.", chapter: "bok10" },
  { term: "Buffer overflow", definition: "Att mer data skrivs i en buffer än den rymmer, så att intilliggande minne skrivs över. Kallas också buffer overrun. Kan krascha programmet, ändra data eller låta en angripare köra egen kod.", chapter: "bok10" },
  { term: "Stack buffer overflow", definition: "Buffer overflow i en lokal variabel på stacken, där returadressen kan skrivas över så att programmet hoppar till angriparens kod. Kallas också stack smashing.", chapter: "bok10" },
  { term: "Stack frame", definition: "Utrymmet på stacken som en funktion får vid varje anrop, med returadress, en pekare till anroparens stack frame och funktionens lokala variabler.", chapter: "bok10" },
  { term: "Shellcode", definition: "Maskinkod som angriparen för in, ofta i den överskrivna bufferten. Startar traditionellt ett shell (en kommandotolk) med det angripna programmets behörigheter.", chapter: "bok10" },
  { term: "NOP sled", definition: "En rad instruktioner som inte gör något, placerad före shellcoden. Gör att angriparen bara behöver gissa buffertens adress ungefärligt.", chapter: "bok10" },
  { term: "Address space", definition: "Det virtuella minne en process får när programmet körs, med programkod och global data längst ner, heapen som växer uppåt och stacken som växer nedåt.", chapter: "bok10" },
  { term: "Heap overflow", definition: "Buffer overflow i minne som programmet begärt under körningen (heapen). Där finns inga returadresser, men en funktionspekare intill bufferten kan skrivas om.", chapter: "bok10" },
  { term: "Return to system call", definition: "Variant där returadressen pekas på befintlig kod, till exempel en biblioteksfunktion som kör kommandon, i stället för på shellcode. Klarar sig därför förbi nonexecutable stack.", chapter: "bok10" },
  { term: "Canary", definition: "Slumpvalt värde som stack protection, till exempel Stackguard, lägger mellan de lokala variablerna och returadressen. Har det ändrats när funktionen ska återvända avbryts programmet.", chapter: "bok10" },
  { term: "Nonexecutable memory", definition: "Run-time-försvar där minneshanteringen markerar stacken och heapen så att kod där inte får köras (no-execute). Stoppar shellcode som kopierats in i en buffer.", chapter: "bok10" },
  { term: "Address space randomization", definition: "Run-time-försvar som lägger stacken, heapen och biblioteken på slumpvisa adresser, så att angriparen inte kan förutsäga var bufferten ligger. Förkortas ofta ASLR.", chapter: "bok10" },
  { term: "Guard page", definition: "Område med otillåtna adresser mellan delarna av processens adressrum. Ett försök att nå det avbryter processen, vilket stoppar överskrivningar av intilliggande områden.", chapter: "bok10" },
];

export const questions = [
  { id: "sak-bok10-v22", topic: "bok10-buffer", difficulty: 2, ...variant("sak-22", "buffer overflow är ingen webbsårbarhet"),
    question: "Why is a buffer overflow not counted with SQL injection and XSS among the common web application vulnerabilities?",
    options: [
      { text: "It can only crash a program and never lets attackers run code", explain: "Kraschen är bara den enklaste följden. Angriparen kan också skriva över returadressen och köra egen kod, shellcode, med programmets behörigheter." },
      { text: "It is a memory error in code written in languages such as C", explain: "Felet uppstår i språk utan gränskontroll. SQL injection och XSS sitter i webbapplikationens hantering av indata, och högnivåspråk som Java och Python kontrollerar gränserna själva." },
      { text: "It is about how input is interpreted rather than its size", explain: "Tvärtom: tolkningen av indata ligger bakom SQL injection och XSS, medan en buffer overflow beror på att indata är större än bufferten." },
      { text: "It has been impossible since compilers began adding canaries", explain: "Försvar som canaries gör attacken svårare, men mycket gammal kod finns kvar och vissa överskrivningar stoppas inte av något försvar. Buffer overflow är fortfarande en av de vanligaste attackerna." },
    ],
    correct: 1, reviewed: false },

  { id: "sak-bok10-01", topic: "bok10-buffer", difficulty: 1,
    question: "According to the book, what is a buffer overflow?",
    options: [
      { text: "More data is put into a buffer than it holds, overwriting nearby memory", explain: "Det som ligger intill bufferten skrivs över: andra variabler eller data som styr programflödet, som returadresser." },
      { text: "A server receives more requests than it can handle and stops responding", explain: "Det är en flooding attack, en form av denial of service. En buffer overflow kan visserligen krascha ett program, men felet ligger i hur programmet skriver i minnet." },
      { text: "Input containing SQL code changes the meaning of a database query", explain: "Det är SQL injection, ett fel i hur indata tolkas, inte i hur mycket som får plats i en buffer." },
      { text: "A program keeps requesting memory until no free memory is left", explain: "Då tar minnet slut, men inget skrivs utanför en buffer. En buffer overflow kan ske hur mycket ledigt minne det än finns." },
    ],
    correct: 0, source: "Bokens kapitel 10 (vad en buffer overflow är)", reviewed: false },

  { id: "sak-bok10-02", topic: "bok10-buffer", difficulty: 1,
    question: "Which situation is a typical root cause of a buffer overflow?",
    options: [
      { text: "A Java program receives far more input than its developer expected", explain: "Java är ett starkt typat högnivåspråk som kontrollerar gränserna själv och inte släpper in mer data i en buffer än det finns plats för." },
      { text: "A web form passes unchecked input straight into a database query", explain: "Det är grunden till SQL injection, ett fel i hur indata tolkas, inte i hur mycket som får plats." },
      { text: "A server keeps half-open TCP connections until its table is full", explain: "Det är SYN spoofing, en denial-of-service-attack mot systemresurser (se kapitlet Denial-of-service-attacker)." },
      { text: "A C program copies input into a buffer without checking its length", explain: "C kontrollerar inte gränserna, och osäkra funktioner som gets kopierar allt som kommer. Programmeraren har utgått från att indata är kort." },
    ],
    correct: 3, source: "Bokens kapitel 10 (varför felet uppstår)", reviewed: false },

  { id: "sak-bok10-03", topic: "bok10-buffer", difficulty: 2,
    question: "A program that runs with root privileges has a stack buffer overflow. A user with an ordinary account exploits it with shellcode. What can the user do?",
    options: [
      { text: "Only crash the program, since its stack frame gets destroyed", explain: "Kraschen är den enklaste följden. Med shellcode hinner programmet köra angriparens kod först, och kraschar i regel efteråt." },
      { text: "Run code, but only with the rights of the user's own account", explain: "Koden körs i det angripna programmets process och får dess behörigheter, inte angriparens egna." },
      { text: "Run commands of their own choice with the program's root rights", explain: "Shellcoden får samma behörigheter som det angripna programmet, här root. Det är privilege escalation: från ett vanligt konto till full kontroll." },
      { text: "Read the program's variables, but never change data or run code", explain: "En buffer overflow skriver över minne. Den kan ändra data och, om returadressen skrivs över, köra angriparens kod." },
    ],
    correct: 2, source: "Bokens kapitel 10 (vad angriparen kan uppnå)", reviewed: false },

  { id: "sak-bok10-04", topic: "bok10-buffer", difficulty: 2,
    question: "In a classic stack buffer overflow, what does the attacker overwrite to make the program jump to the attacker's own code?",
    options: [
      { text: "A function pointer stored next to a buffer on the heap", explain: "Det är en heap overflow. På heapen finns inga returadresser, så angriparen skriver om en funktionspekare i stället." },
      { text: "The return address saved in the function's stack frame", explain: "När funktionen är klar hoppar programmet till returadressen, som nu pekar dit angriparen vill, till exempel på shellcode i bufferten." },
      { text: "A password held in a neighbouring local variable", explain: "Det är bokens första exempel: angriparen ändrar data och tar sig förbi en kontroll, men styr inte var programmet fortsätter." },
      { text: "The program code loaded at the bottom of the address space", explain: "Programkoden skrivs inte över. Det är stacken, med lokala variabler och returadresser, som angrips." },
    ],
    correct: 1, source: "Bokens kapitel 10 (stack buffer overflow)", reviewed: false },

  { id: "sak-bok10-05", topic: "bok10-buffer", difficulty: 2,
    question: "What is a NOP sled used for in a stack overflow attack?",
    options: [
      { text: "To detect at function exit whether the stack frame was changed", explain: "Det gör en canary i stack protection, ett compile-time-försvar." },
      { text: "To run an existing library function instead of injected code", explain: "Det är return to system call, som pekar returadressen på befintlig kod i stället för på shellcode." },
      { text: "To mark the stack so that no code placed there can be run", explain: "Det är nonexecutable stack, ett run-time-försvar mot just shellcode på stacken." },
      { text: "To let a rough guess of the buffer's address be good enough", explain: "Instruktionerna gör ingenting, så programmet glider fram till shellcoden var i raden det än landar." },
    ],
    correct: 3, source: "Bokens kapitel 10 (shellcode och NOP sled)", reviewed: false },

  { id: "sak-bok10-06", topic: "bok10-buffer", difficulty: 2,
    question: "Which of these defenses against buffer overflows is a compile-time defense?",
    options: [
      { text: "Stack protection using canaries", explain: "Kompilatorn lägger in kod som sätter canary-värdet när funktionen startar och kontrollerar det innan den återvänder. Programmen måste kompileras om." },
      { text: "Address space randomization", explain: "Ett run-time-försvar: operativsystemet lägger stacken, heapen och biblioteken på slumpvisa adresser." },
      { text: "A nonexecutable stack and heap", explain: "Ett run-time-försvar: processorns minneshantering hindrar att kod körs på stacken och heapen." },
      { text: "Guard pages between memory regions", explain: "Ett run-time-försvar: luckor med otillåtna adresser mellan delarna av processens adressrum." },
    ],
    correct: 0, source: "Bokens kapitel 10 (compile-time och run-time defenses)", reviewed: false },

  { id: "sak-bok10-07", topic: "bok10-buffer", difficulty: 2,
    question: "Why does address space randomization make the classic stack overflow attack fail?",
    options: [
      { text: "Code copied onto the stack is no longer allowed to run", explain: "Det är nonexecutable stack, ett annat run-time-försvar." },
      { text: "Function exit code notices that the return address changed", explain: "Det är stack protection, till exempel med en canary, ett compile-time-försvar." },
      { text: "The attacker cannot predict the target buffer's address", explain: "Stacken flyttas slumpvis för varje process, mer än en NOP sled kan täcka. Försvaret kan kringgås med mycket många försök." },
      { text: "The compiler adds a bounds check to every buffer reference", explain: "Det är en språkutvidgning i kompilatorn, alltså ett compile-time-försvar." },
    ],
    correct: 2, source: "Bokens kapitel 10 (address space randomization)", reviewed: false },

  { id: "sak-bok10-08", topic: "bok10-buffer", difficulty: 3,
    question: "Which attack variant points the return address at existing library code, so that a nonexecutable stack does not stop it?",
    options: [
      { text: "Return to system call", explain: "Angriparen behöver ingen egen kod på stacken, så nonexecutable stack hjälper inte. Stack protection och randomisering av stacken och biblioteken försvårar den." },
      { text: "Heap buffer overflow", explain: "En heap overflow skriver om en funktionspekare intill en buffer på heapen, oftast så att den pekar på shellcode." },
      { text: "Replacement stack frame", explain: "Här skrivs den sparade pekaren till förra stack frame över och pekas på en falsk stack frame i bufferten." },
      { text: "Global data area overflow", explain: "Det är en overflow i en buffer bland programmets globala variabler, där en funktionspekare skrivs om." },
    ],
    correct: 0, source: "Bokens kapitel 10 (andra former av overflow)", reviewed: false },
];

export const notes = `Byggt på kap. 10 i del2-filen, PDF-sidorna 542–597 (markeringarna "Page N of 1641"): s. 542–544 (inledningen, lärandemålen, Table 10.1 och "Out-of-bounds Write" överst i CWE Top 25), s. 545–550 (Buffer Overflow Basics: NISTIR 7298-definitionen av buffer overrun, följderna, exemplet med två intilliggande variabler, angriparens två förutsättningar, fuzzing, språkhistoriken med assembler, Java/Ada/Python och C, osäkra biblioteksfunktioner och gammal kod), s. 551–563 (Stack Buffer Overflows: stack frame, stack smashing, Morris-masken, krasch som denial of service, returadressen, shellcode i bufferten, Table 10.2 med gets/sprintf/strcat/strcpy/vsprintf, overflow vid kopiering och sammanslagning och i bibliotek, att programmet kraschar efteråt), s. 564–573 (Shellcode: definitionen, processor- och OS-bundenhet, Metasploit, NOP sled, setuid root-exemplet med shadow password file, de tre måltyperna), s. 574–582 (10.2: de två grupperna och alla försvar), s. 583–593 (10.3: replacement stack frame, off-by-one, return to system call, heap overflow, global data area overflow, försvaren mot dem), s. 594–597 (Key Terms, Review Questions 10.1–10.16, Problems). Ur kap. 11: s. 608 (Input Size and Buffer Overflow: programmerarens antagande om indatats storlek, 512 eller 1 024 byte, att testerna inte fångar felet) och s. 609–616 (Interpretation of Program Input med injection attacks, SQL injection och XSS), bara för skillnaden storlek/tolkning i avsnittet om webbsårbarheterna.

Avsnittsnamnet: läraren pekade ut "Introduction to Buffer Overflow" (avsnitt 10.1). I 5:e upplagan heter 10.1 "Stack Overflows" och har underavsnitten Buffer Overflow Basics, Stack Buffer Overflows och Shellcode; något avsnitt med lärarens namn finns inte. Jag har tolkat fokus som kapitlets inledning plus hela 10.1, med tyngden på Buffer Overflow Basics (definition, orsaker, följder), och försvaren i 10.2. Lärarens bilder kan bygga på en annan upplaga.

Osäkert eller att granska:
- "ASLR" står inte i boken, som bara skriver "Address Space Randomization". Förkortningen står med ("ofta förkortat ASLR") eftersom uppdraget och troligen läraren använder den; stryk om den inte ska vara med.
- Att webbspråken kontrollerar gränserna själva: boken säger att moderna högnivåspråk som Java, ADA och Python inte drabbas av buffer overflow (s. 549, 575) och att Perl, PHP och Python ofta används för webbskript (kap. 11, s. 610). Body säger därför "Högnivåspråk som Java och Python, som också används för webbapplikationer, kontrollerar gränserna själva". Boken påpekar också att sådana program ändå kan bli sårbara via systembibliotek eller körmiljöer skrivna i C (s. 575); det är utelämnat i body.
- Broken access control nämns inte i kap. 10–11. Beskrivningen "behörigheten kontrolleras inte" bygger på gästföreläsningen och kapitlet om access control.
- Kolumnen "Hotar" i följdtabellen är min koppling till CIA. Boken säger att kraschen är "some form of denial-of-service attack", att data som programmet använder kan förstöras och att angriparen kan köra godtycklig kod "with the privileges of the attacked process"; "allt" för egen kod är min slutsats (bokens exempel läser shadow password file).
- Canary-platsen är förenklad: boken säger att värdet skrivs under den sparade frame pointer, före de lokala variablerna; body säger "mellan de lokala variablerna och returadressen". Namnets ursprung (kanariefåglar i gruvor) står i bokens fotnot 52, i noterna i del3-filen.
- Guard pages "främst ... från global data" återger bokens "typically of global data".
- Säkra bibliotek: boken räknar Libsafe till compile-time defenses trots att det skyddar befintliga program utan omkompilering. Därför står säkra bibliotek inte som alternativ i fråga 06.
- "Inget försvar täcker allt" bygger på slutet av 10.3 (exemplet med grannvariabeln "simply cannot be blocked except by coding to prevent them").

Medvetet utelämnat: all kod och alla adresser (Figures 10.1, 10.5, 10.7, 10.8, 10.10–10.12, attacksträngarna), funktionsanropets elva steg, frame pointer i detalj, little-endian, x86-instruktioner och register (Tables 10.3–10.4), shellcodens begränsningar (position independent, inga NULL-byte) och JMP/CALL-tricket, historiken i Table 10.1 utom Morris-masken (NCSA httpd, Aleph One, Code Red, Slammer, Sasser), listan över vad shellcode kan göra (remote och reverse shell, rensa brandväggsregler, bryta sig ur chroot), OpenBSD:s och Microsofts kodgranskning, strlcpy, Libsafe, Stackshield och RAD, Microsofts /GS, historiken bakom no-execute (SPARC, x86 2004, Windows XP SP2), undantaget för just-in-time-kompilatorer, guard pages mellan stack frames, de detaljerade försvaren mot heap- och global data-attacker, format string och integer overflow, Problems 10.1–10.14. Key Terms som bara står i löptexten eller saknas: shell, off-by-one och heap (löptext), memory management, library function och position independent (utelämnade).

Ordlistan: 13 termer, kontrollerade mot ordlistan i reading.js 24 nov 2026 (inga dubbletter, skiftlägesokänsligt). Buffer overrun ingår i Buffer overflow, stack smashing i Stack buffer overflow, no-execute i Nonexecutable memory. Canary, Return to system call och Address space randomization är inga Key Terms men bär Review Questions 10.12–10.14.

Frågor: 9 st, varav varianten sak-bok10-v22 (av sak-22). Originalet frågar vilken av fyra som inte är en webbsårbarhet, och gästföreläsningens variant vilken som är en (XSS, med virus som distraktorer). Den här frågar varför buffer overflow inte räknas dit; inget alternativ är ordagrant detsamma som i originalet, och distraktorerna bygger på förväxlingarna "bara krasch", "tolkning i stället för storlek" och "omöjlig sedan canaries". Frågorna 01–05 gäller 10.1, 06–07 försvaren och 08 de andra formerna. Rätt position 3/2/2/2; längdspridning högst 1,26; snittkvot rätt/distraktor 1,005; rätt svar aldrig ensamt längst. Body 1 543 ord, readingMinutes 11.

Hänvisningar: gästföreläsningen (de tre webbsårbarheterna, privilege escalation), Databas- och datacentersäkerhet (SQL injection), Denial-of-service-attacker (SYN spoofing, i en förklaring). Kapitlet om firewalls och intrusion prevention nämner att HIPS kan fånga buffer overflow; ingen hänvisning dit är gjord.`;
