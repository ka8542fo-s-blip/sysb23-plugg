// Bokens kapitel 15: Stallings & Brown, IT Security Controls, Plans, and Procedures (s. 831–866).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok15",
  kind: "bok",
  label: "Bokens kapitel 15",
  examArea: "Bokfrågor",
  focus: ["Security policy in an organisation"],
  title: "Säkerhetskontroller, planer och rutiner",
  readingMinutes: 11,
  lead: "Vad som händer efter riskbedömningen: vilka slags kontroller som finns, hur man väljer dem och skriver en säkerhetsplan, och hur arbetet följs upp när kontrollerna väl är på plats.",
  sources: ["Stallings & Brown kap. 15 (s. 831–866)"],
  body: `
## Kärnan

- **En security control** (också **safeguard** eller **countermeasure**) är en åtgärd som minskar risk: den förhindrar ett säkerhetsbrott, begränsar skadan eller upptäcker och rapporterar brottet.
- **Kontrollerna väljs efter riskbedömningen.** Kapitlet handlar om de senare stegen i IT security management: välja kontroller, skriva en plan, genomföra den och följa upp.
- **Två indelningar:** tre klasser (management, operational, technical) och tre funktioner (supportive, preventative, detection and recovery).
- **Urvalet är en avvägning** mellan kostnad och riskminskning. Den risk som blir kvar kallas **residual risk**, och den tar ledningen ställning till.
- **De valda kontrollerna** skrivs in i en **IT security plan**, genomförs med utbildning och följs upp genom maintenance, security compliance, change och configuration management samt incident handling.

## Var kontrollerna kommer in

Bokens definition av IT security management räknar upp processens steg (se Föreläsning 2; definitionen var svaret på en av förra årets tentafrågor). Kapitlet om IT security management och riskbedömning tar de första stegen: mål, strategier och policy, och själva riskbedömningen. Det här kapitlet tar resten:

| Steg | Vad som händer |
|---|---|
| Välja kontroller | för varje risk som ska åtgärdas väljs kontroller som skyddar kostnadseffektivt |
| Skriva planen | en IT security plan anger vad som ska göras, med vilka resurser och av vem |
| Implementera | kontrollerna införs, tillsammans med utbildning och security awareness |
| Följa upp | kontrollerna underhålls och granskas, ändringar prövas och incidenter hanteras |

Processen är cyklisk. Implementeringen är do-steget i plan-do-check-act-modellen, och uppföljningen kan leda tillbaka till tidigare steg. Om till exempel datorer smittas av virus kan riskbedömningen, valet av kontroller och sättet de införts på behöva ses över.

## Vad en security control är

Boken definierar en control som en "action, device, procedure, or other measure" som minskar risk på ett av tre sätt:

1. den eliminerar eller förhindrar ett säkerhetsbrott
2. den minskar skadan som brottet kan orsaka
3. den upptäcker och rapporterar brottet, så att det kan rättas till

Orden control, safeguard och countermeasure används som synonymer. En del kontroller skyddar mot flera risker samtidigt och blir därför särskilt kostnadseffektiva.

Listor över kontroller finns i standarder som **ISO 27002**, som räknas som den viktigaste listan, och **NIST SP 800-53**.

Boken delar in kontrollerna på två sätt samtidigt: efter klass och efter funktion.

## Tre klasser

| Klass | Handlar om | Exempel på kontrollfamiljer i NIST SP 800-53 |
|---|---|---|
| **Management controls** | säkerhetspolicyer, planering, riktlinjer och standarder som styr valet av operativa och tekniska kontroller; frågor som ledningen måste ta hand om | risk assessment, planning, program management, supply chain risk management |
| **Operational controls** | att policyer och standarder genomförs och används rätt, att driften sköts konsekvent och att brister rättas; rutiner som främst utförs av **människor**, inte av system | awareness and training, configuration management, contingency planning, incident response, maintenance, personnel security, physical and environmental protection |
| **Technical controls** | rätt användning av säkerhetsfunktionerna i **hårdvara och mjukvara** | access control, identification and authentication, audit and accountability, system and communications protection |

Ett sätt att hålla isär dem:

- **Management** styr vad som ska skyddas och hur kontroller väljs, till exempel genom säkerhetspolicyn.
- **Operational** är det personalen gör, till exempel utbildning och incidenthantering.
- **Technical** är det systemen gör, till exempel åtkomstkontroll och loggning.

En kontroll kan ha drag av flera klasser. Lägg märke till att physical and environmental protection räknas som operational i NIST:s lista, medan kryptering hör till system and communications protection, alltså de tekniska kontrollerna. Att kryptering inte är en fysisk kontroll var svaret på en av förra årets tentafrågor (se Föreläsning 2).

## Tre funktioner

Varje klass kan innehålla kontroller med tre olika funktioner:

| Funktion | Vad den gör |
|---|---|
| **Supportive controls** | genomgripande, generella tekniska grundfunktioner som hänger ihop med och används av många andra kontroller |
| **Preventative controls** | hindrar att säkerhetsbrott uppstår, genom att stoppa försök att bryta mot policyn eller utnyttja en sårbarhet |
| **Detection and recovery controls** | reagerar på ett brott: varnar för brott eller försök till brott och ger sätt att återställa de resurser som gått förlorade |

- Det är tre funktioner, inte fyra: detection och recovery är en gemensam kategori.
- Boken har ingen deterrence-kategori, till skillnad från countermeasure matrix i Föreläsning 2 (deterrence, prevention, detection, remedies).
- Klass och funktion är olika saker. En teknisk kontroll kan vara preventative, och en operational kontroll kan vara detection and recovery.

## Att välja kontroller och residual risk

Riskbedömningen ger för varje risk som ska åtgärdas en lista med rekommenderade kontroller (se kapitlet om IT security management och riskbedömning). De ska passa organisationens system och policyer, och lagkrav kan styra valet. Varje kontroll bedöms på två sätt:

| Bedömning | Frågan |
|---|---|
| **Feasibility** | Går den att införa? Passar den tekniskt med befintliga system, hur påverkar den driften, och kommer användarna att acceptera den? |
| **Effectiveness** | Vad kostar den i förhållande till hur mycket den sänker risken? |

En ny eller förbättrad kontroll sänker risken på tre sätt:

- lägre **likelihood** genom färre sårbarheter i systemet
- lägre **likelihood** genom att hotkällans förmåga och motivation minskar
- lägre **consequence** genom att skadan blir mindre om hotet ändå inträffar

Resurserna räcker sällan till allt. Ledningen gör därför en **cost-benefit analysis**, kvalitativ eller kvantitativ, som ska visa att kostnaden motiveras av riskminskningen. Den väger in vad det innebär att införa kontrollen, vad det innebär att låta bli och vad den kostar. Fyra tumregler styr urvalet:

| Om kontrollen ... | ... gör så här |
|---|---|
| sänker risken mer än som behövs | välj ett billigare alternativ |
| kostar mer än riskminskningen är värd | välj ett annat alternativ |
| inte sänker risken tillräckligt | använd fler eller andra kontroller |
| sänker risken tillräckligt och är mest kostnadseffektiv | använd den |

**Residual risk** är den risk som finns kvar när de valda kontrollerna är på plats. Målet är en acceptabel risknivå, inte noll risk. Vad en kontroll kostar är lätt att räkna ut, men vad det kostar att avstå är oklart. Därför är valet till slut ett affärsbeslut, där ledningen också tar ställning till den kvarvarande risken.

## Plan och implementering

En **IT security plan** är ett dokument som anger vad som ska göras, vilka resurser som behövs och vem som ansvarar. Målet är att rätta bristerna i organisationens riskprofil i tid. Enligt NIST SP 800-30 ska planen innehålla:

- riskerna (kombinationer av tillgång, hot och sårbarhet)
- rekommenderade kontroller från riskbedömningen
- prioritet för varje risk
- valda kontroller, utifrån cost-benefit-analysen
- resurser som behövs
- ansvarig personal
- start- och slutdatum
- krav på underhåll och övriga kommentarer

Uppgifterna sammanfattas i en **implementation plan**, en tabell per risk. I bokens exempel är risken en hackerattack mot internetroutern. De valda kontrollerna är varken dyra eller svåra att införa, till exempel att stänga av extern telnet-åtkomst och kräva starka administratörslösenord, och personalen får utbildning i de nya rutinerna.

Sedan genomför de ansvariga planen: de ändrar konfigurationer, uppgraderar, installerar nya system och skriver nya rutiner. Även tekniska kontroller behöver rutiner för att användas rätt.

Organisationens **security officer** övervakar att

- kostnader och resurser håller sig inom ramarna
- kontrollerna införs som planen säger, så att den tänkta riskminskningen nås
- kontrollerna sköts och administreras som de ska

När allt är klart godkänner ledningen systemet för drift, informellt eller, särskilt i offentlig verksamhet, genom en formell **accreditation** där ett externt organ granskar systemet.

**Security awareness and training** är en nödvändig del av implementeringen: allmän säkerhetsmedvetenhet för all personal och särskild utbildning för dem som arbetar med vissa system och kontroller.

## Uppföljning

Processen slutar inte när kontrollerna är införda. Utan övervakning ökar risken för säkerhetsbrott kraftigt. Ändå är uppföljningen ofta det steg som får minst uppmärksamhet. Den har fyra delar:

| Del | Vad den gör |
|---|---|
| **Maintenance** | kontrollerna granskas regelbundet så att de fungerar som tänkt, uppgraderas vid nya krav och skyddas mot effekter av systemändringar; nya hot och sårbarheter bevakas. Logganalys ger en normalbild att jämföra med vid incidenter. |
| **Security compliance** | en **audit** som kontrollerar att säkerhetsplanen följs: att policyer och planer finns, att lämpliga kontroller valts och att de underhålls och används rätt. Görs internt eller externt, ofta med checklistor. |
| **Change and configuration management** | prövar ändringar i systemen och håller ordning på deras konfiguration (se nästa avsnitt) |
| **Incident handling** | rutinerna för att svara på en säkerhetsincident |

Målet med maintenance är att organisationens riskexponering ligger kvar där den valdes. Någon måste ha ansvaret, och oftast samordnar organisationens security officer arbetet.

Incident handling tas upp i Föreläsning 2 som tredje delen av säkerhetspolicyn. Där är **Detection and Analysis** första steget, vilket var svaret på en av förra årets tentafrågor.

## Change management och configuration management

| | **Change management** | **Configuration management** |
|---|---|---|
| Frågan | vad händer om vi gör den här ändringen? | hur ser varje system ut, och vad har ändrats? |
| Gör | prövar föreslagna ändringar, innan de genomförs, för deras följder för både säkerhet och drift | håller register över varje systems konfiguration, med versioner av hårdvara och mjukvara, och över ändringarna |
| Används till | att godkänna, testa och dokumentera ändringar | att återställa system efter ett fel och se vilka patchar och uppgraderingar som gäller ett visst system |

Båda är allmänna systemadministrationsprocesser som påverkar säkerheten. De överlappar därför IT security management och måste samspela med den.

Ändringar kan bero på till exempel användares önskemål, nya hot eller patchar från leverantörer. Två svåra lägen:

- **Patchar:** att testa en patch först tar tid och lämnar sårbarheten öppen under tiden. Att installera direkt ger snabbare skydd men kan få andra delar av systemet att sluta fungera. Ledningen måste avgöra om availability eller security går först.
- **Ändringar som sänker säkerheten:** ibland kräver verksamheten en ändring som gör systemet mindre säkert. Då ska skälen, följderna för säkerheten och ledningens godkännande dokumenteras.

I en formell process dokumenteras och testas varje ändring innan den genomförs, och berörd dokumentation uppdateras.
`,
};

export const topic = {
  id: "bok15-kontroller",
  name: "Säkerhetskontroller, planer och rutiner",
  chapter: "bok15",
  examWeight: "hög",
  summary: "En security control minskar risk genom att förhindra ett säkerhetsbrott, begränsa skadan eller upptäcka det. Kontrollerna delas in i tre klasser (management, operational, technical) och tre funktioner (supportive, preventative, detection and recovery). De väljs genom en avvägning mellan kostnad och riskminskning, skrivs in i en IT security plan, införs med utbildning och följs upp med maintenance, security compliance, change och configuration management och incident handling.",
  keyPoints: [
    "Security control: åtgärd som minskar risk genom att förhindra ett brott, begränsa skadan eller upptäcka och rapportera det; kallas också safeguard eller countermeasure.",
    "Management controls: policyer, planering, riktlinjer och standarder som styr valet av andra kontroller.",
    "Operational controls: rutiner som främst utförs av människor, till exempel utbildning och incidenthantering.",
    "Technical controls: säkerhetsfunktioner i hårdvara och mjukvara, till exempel åtkomstkontroll och loggning.",
    "Funktionerna: supportive (grund som andra kontroller bygger på), preventative (hindrar brott) och detection and recovery (varnar och återställer).",
    "Residual risk: risken som finns kvar efter de valda kontrollerna; ledningen väljer en acceptabel nivå efter en cost-benefit analysis.",
    "IT security plan: vad som ska göras, med vilka resurser, av vem och när, per risk.",
    "Uppföljningen: maintenance, security compliance, change och configuration management samt incident handling.",
    "Change mot configuration management: prövar en ändring innan den görs, respektive registrerar hur varje system ser ut och vad som ändrats.",
  ],
  pitfalls: [
    "Klass och funktion är två olika indelningar: management, operational och technical är klasser; supportive, preventative och detection and recovery är funktioner.",
    "Bokens funktioner är tre och saknar deterrence; countermeasure matrix i Föreläsning 2 har fyra rader (deterrence, prevention, detection, remedies).",
    "Operational controls utförs av människor, technical controls av hårdvara och mjukvara. Physical and environmental protection räknas som operational i NIST:s lista.",
    "Change management prövar en ändring innan den görs; configuration management registrerar hur systemen ser ut och vad som ändrats.",
    "Security compliance är en granskning av att säkerhetsplanen följs; maintenance håller kontrollerna fungerande.",
  ],
};

export const glossary = [
  { term: "Security control (safeguard, countermeasure)", definition: "En åtgärd, anordning, rutin eller annan insats som minskar risk genom att förhindra ett säkerhetsbrott, begränsa skadan eller upptäcka och rapportera det.", chapter: "bok15" },
  { term: "Management control", definition: "Kontroller som gäller säkerhetspolicyer, planering, riktlinjer och standarder och styr valet av operativa och tekniska kontroller, till exempel riskbedömning och planering.", chapter: "bok15" },
  { term: "Operational control", definition: "Kontroller som ser till att policyer och standarder genomförs och används rätt, och som främst utförs av människor, till exempel utbildning, incidenthantering och fysiskt skydd.", chapter: "bok15" },
  { term: "Technical control", definition: "Kontroller som bygger på rätt användning av säkerhetsfunktionerna i hårdvara och mjukvara, till exempel åtkomstkontroll, autentisering och loggning.", chapter: "bok15" },
  { term: "Supportive control", definition: "Genomgripande, generella tekniska grundfunktioner som många andra kontroller bygger på och använder.", chapter: "bok15" },
  { term: "Preventative control", definition: "Kontroll som hindrar att säkerhetsbrott uppstår, genom att stoppa försök att bryta mot policyn eller utnyttja en sårbarhet.", chapter: "bok15" },
  { term: "Detection and recovery control", definition: "Kontroll som reagerar på ett säkerhetsbrott: varnar för brott eller försök till brott och ger sätt att återställa förlorade resurser.", chapter: "bok15" },
  { term: "IT security plan", definition: "Dokument som anger vad som ska göras för att rätta brister i riskprofilen, vilka resurser som behövs, vem som ansvarar och när det ska ske.", chapter: "bok15" },
  { term: "Implementation plan", definition: "Tabell som sammanfattar säkerhetsplanen per risk: risknivå, rekommenderade och valda kontroller, prioritet, resurser, ansvariga och datum.", chapter: "bok15" },
  { term: "Security compliance", definition: "En granskning (audit) av att organisationen följer sin säkerhetsplan: att policyer och planer finns och att lämpliga kontroller valts, underhålls och används rätt.", chapter: "bok15" },
  { term: "Change management", definition: "Processen som prövar föreslagna ändringar i systemen, innan de genomförs, för deras följder för säkerhet och drift.", chapter: "bok15" },
  { term: "Configuration management", definition: "Processen som håller reda på varje systems konfiguration, med versioner av hårdvara och mjukvara, och på ändringarna i den. Behövs för att återställa system och veta vilka patchar som gäller.", chapter: "bok15" },
];

export const questions = [
  { id: "sak-bok15-01", topic: "bok15-kontroller", difficulty: 1,
    question: "How does the book define a security control (safeguard)?",
    options: [
      { text: "A measure reducing risk by preventing, limiting or reporting a breach", explain: "En control är en åtgärd, anordning eller rutin som förhindrar ett brott, minskar skadan eller upptäcker och rapporterar det." },
      { text: "A document stating what will be done, with which resources and by whom", explain: "Det är en IT security plan, som beskriver hur de valda kontrollerna ska införas." },
      { text: "An audit that checks whether the organization follows its security plan", explain: "Det är security compliance, en del av uppföljningen." },
      { text: "The level of risk that remains once the chosen measures are in place", explain: "Det är residual risk, den risk som finns kvar efter kontrollerna." },
    ],
    correct: 0, source: "Bokens kapitel 15 (vad en control är)", reviewed: false },

  { id: "sak-bok15-02", topic: "bok15-kontroller", difficulty: 2,
    question: "What characterizes operational controls?",
    options: [
      { text: "Security functions built into the hardware and software in use", explain: "Det är technical controls, som bygger på säkerhetsfunktioner i systemen." },
      { text: "Policies and standards that guide the choice of other controls", explain: "Det är management controls, som styr valet av operativa och tekniska kontroller." },
      { text: "Generic capabilities that many other controls are built upon", explain: "Det är supportive controls, en funktion och inte en klass." },
      { text: "Procedures carried out mainly by people rather than by systems", explain: "Operational controls ser till att policyer genomförs och används rätt, och utförs främst av människor." },
    ],
    correct: 3, source: "Bokens kapitel 15 (operational controls)", reviewed: false },

  { id: "sak-bok15-03", topic: "bok15-kontroller", difficulty: 1,
    question: "Access control, identification and authentication, and audit and accountability are control families in which class?",
    options: [
      { text: "Management controls", explain: "Management controls omfattar till exempel risk assessment, planning och program management." },
      { text: "Operational controls", explain: "Operational controls omfattar till exempel awareness and training, incident response och physical and environmental protection." },
      { text: "Technical controls", explain: "Alla tre bygger på säkerhetsfunktioner i hårdvara och mjukvara och räknas som tekniska kontroller i NIST SP 800-53." },
      { text: "Preventative controls", explain: "Preventative är en funktion som finns inom alla tre klasserna, inte en klass i sig." },
    ],
    correct: 2, source: "Bokens kapitel 15 (technical controls)", reviewed: false },

  { id: "sak-bok15-04", topic: "bok15-kontroller", difficulty: 2,
    question: "In the book's categories, what is a supportive control?",
    options: [
      { text: "A control that blocks attempts to exploit a vulnerability", explain: "Det är en preventative control, som hindrar att brottet uppstår." },
      { text: "A generic capability that many other controls rely upon", explain: "Supportive controls är genomgripande grundfunktioner som hänger ihop med och används av många andra kontroller." },
      { text: "A control that warns of a breach and restores lost resources", explain: "Det är en detection and recovery control." },
      { text: "A policy or standard that steers the choice of other controls", explain: "Det beskriver management controls, en klass och inte en funktion." },
    ],
    correct: 1, source: "Bokens kapitel 15 (kontrollernas funktioner)", reviewed: false },

  { id: "sak-bok15-05", topic: "bok15-kontroller", difficulty: 2,
    question: "In the selection of controls, what is meant by residual risk?",
    options: [
      { text: "The risk level measured before any new controls are chosen", explain: "Det är utgångsläget från riskbedömningen. Residual risk är det som återstår efter kontrollerna." },
      { text: "The risk that is shared with a third party such as an insurer", explain: "Det är risk transfer, ett annat sätt att behandla en risk än att införa kontroller." },
      { text: "The risk remaining after the selected controls are in place", explain: "Ledningen väljer de kontroller som ger en acceptabel risknivå och tar ställning till den risk som blir kvar." },
      { text: "The share of risk that a control removes when fully in place", explain: "Det är riskminskningen, som vägs mot kostnaden i cost-benefit-analysen." },
    ],
    correct: 2, source: "Bokens kapitel 15 (residual risk)", reviewed: false },

  { id: "sak-bok15-06", topic: "bok15-kontroller", difficulty: 1,
    question: "According to the book, what does an IT security plan document?",
    options: [
      { text: "What will be done, the resources needed and who is responsible", explain: "Planen tar också upp risker, prioritet, valda kontroller, datum och krav på underhåll." },
      { text: "The hardware and software versions installed on each system", explain: "Det är configuration management, en del av uppföljningen." },
      { text: "Whether the organization's controls follow its security plan", explain: "Det kontrolleras i security compliance, en granskning i efterhand." },
      { text: "How incidents are detected, analysed, contained and recovered from", explain: "Det är stegen i incident response (se Föreläsning 2), inte innehållet i en IT security plan." },
    ],
    correct: 0, source: "Bokens kapitel 15 (IT security plan)", reviewed: false },

  { id: "sak-bok15-07", topic: "bok15-kontroller", difficulty: 2,
    question: "What is configuration management concerned with?",
    options: [
      { text: "Reviewing proposed changes for their effect on systems", explain: "Det är change management, som prövar en ändring innan den genomförs." },
      { text: "Tracking each system's configuration and the changes to it", explain: "Configuration management registrerar versioner av hårdvara och mjukvara, så att system kan återställas och rätt patchar hittas." },
      { text: "Auditing whether the organization follows its security plan", explain: "Det är security compliance." },
      { text: "Checking periodically that controls still work as intended", explain: "Det är maintenance av kontrollerna." },
    ],
    correct: 1, source: "Bokens kapitel 15 (change och configuration management)", reviewed: false },

  { id: "sak-bok15-08", topic: "bok15-kontroller", difficulty: 3,
    question: "If patches are applied without testing them first, what must management weigh, according to the book?",
    options: [
      { text: "Whether confidentiality or integrity has the higher priority", explain: "Frågan gäller inte de två. Otestade patchar kan få annat att sluta fungera, medan testning lämnar sårbarheten öppen längre." },
      { text: "Whether to accept the risk or to transfer it to an insurer", explain: "Risk acceptance och risk transfer är sätt att behandla en risk (se kapitlet om IT security management och riskbedömning), inte patchfrågan." },
      { text: "Whether to use technical or operational controls instead", explain: "Valet av klass är inte frågan; en patch är en ändring som change management prövar." },
      { text: "Whether availability or security has the higher priority", explain: "Direkt installation ger snabbare skydd men kan orsaka fel och förlorad funktion, så ledningen avgör vad som går först." },
    ],
    correct: 3, source: "Bokens kapitel 15 (change management och patchar)", reviewed: false },
  { id: "sak-bok15-09", topic: "bok15-kontroller", difficulty: 1,
    question: "Security policies, planning, guidelines and standards that steer the choice of other controls belong to which class of control?",
    options: [
      { text: "Management controls", explain: "Management controls är de frågor ledningen måste ta hand om, som säkerhetspolicyn, och de styr valet av operativa och tekniska kontroller." },
      { text: "Operational controls", explain: "Operational controls är rutiner som främst utförs av människor, som utbildning och incidenthantering." },
      { text: "Technical controls", explain: "Technical controls bygger på säkerhetsfunktioner i hårdvara och mjukvara, som åtkomstkontroll och loggning." },
      { text: "Supportive controls", explain: "Supportive är en funktion, inte en klass: grundläggande tekniska funktioner som andra kontroller bygger på." },
    ],
    correct: 0, source: "Bokens kapitel 15 (management controls)", reviewed: false },
];

export const notes = `Byggt på kap. 15 i del2-filen, s. 831–866 (rad 9076–9993): inledningen, 15.1 (var kontrollerna kommer in, NIST SP 800-39), 15.2 (definitionen av control, de tre klasserna, de tre funktionerna, standarderna, Table 15.1 med klasserna per kontrollfamilj, baseline-anpassningar, feasibility/effectiveness, tre sätt att sänka risken, cost-benefit, de fyra tumreglerna, residual risk), 15.3 (planens innehåll enligt NIST SP 800-30, Table 15.4 routerexemplet), 15.4 (implementering, security officers tre kontroller, accreditation, awareness and training), 15.5 (uppföljningens fyra delar, maintenance, security compliance, change och configuration management, incident handling). Key Terms och Review Questions 15.1–15.10 styrde urvalet. Kap. 14 (s. 790–792, 818–819) lästes för definitionen av IT security management, plan-do-check-act och riskbehandlingens alternativ, som det här kapitlet hänvisar till men inte upprepar.

Osäkert:
- Funktionerna: boken skriver "preventative" (inte preventive) och har tre funktioner, där detection and recovery är en enda kategori. Uppdraget nämnde fyra som möjlighet; boken har tre.
- Figure 15.1 (processen), 15.2 (exempel på tekniska kontroller per funktion) och 15.3 (residual risk) finns inte i textfilen. Därför har kapitlet inga exempel på supportive controls; figuren 15.2 har dem, men jag kunde inte kontrollera innehållet. Lägg gärna till exempel om figuren går att se.
- "Do-steget i plan-do-check-act": kap. 15 säger "the do stage of the cyclic implementation model discussed in Chapter 14", och kap. 14 har Figure 14.2 "The Plan-Do-Check-Act Process Model"; själva steglistan har fallit bort i textfilen.
- Kopplingen kryptering → system and communications protection (teknisk) bygger på Table 15.3 (Cryptographic Protection under den familjen) och Table 15.1 (familjen är Technical). Physical and Environmental Protection är Operational i Table 15.1.
- Incident handling: boken säger bara att rutinerna för att svara på incidenter är uppföljningens sista del och hänvisar till kapitlet om human factors. Därför hänvisar kapitlet till Föreläsning 2 för stegen. Utkastet bok17.js ("Personalsäkerhet: medvetenhet, utbildning och incidenter") tar upp både awareness and training och incident response; publiceras de tillsammans kan en hänvisning dit läggas till i avsnitten Plan och implementering och Uppföljning. Hänvisningarna till "kapitlet om IT security management och riskbedömning" stämmer med titeln i utkastet bok14.js, som också tar upp plan-do-check-act och risk acceptance/transfer.
- "Control" är key term också i kap. 14, som skrivs parallellt. Ordlistan har därför "Security control (safeguard, countermeasure)" för att inte krocka; slå ihop om kap. 14 också definierar control.
- Residual risk är inte key term i kap. 15 (eller 14) och står därför inte i ordlistan, bara i body, keyPoints och en fråga. Lägg till den i ordlistan om ni vill.

Medvetet utelämnat: NIST SP 800-39 som namn, ISO 13335 och FIPS 200, Table 15.2 (ISO 27002:s fjorton kategorier), Table 15.3 (den detaljerade NIST-listan), NIST SP 800-18:s sex anpassningar av baseline i detalj (bara teknik och publika system nämns), datum och personnamn i Table 15.4, trusted computing och certifiering vid accreditation, säkerhetsrevisionens koppling till kapitlet om auditing, fallstudien Silver Star Mines (SCADA, dokumentpolicy, reservmejl) och kapitlets Problems.

Frågor: 8 st, inga varianter (inga av förra årets tentafrågor gäller kapitlets egna begrepp; Detection and Analysis, kryptering som icke-fysisk kontroll och definitionen av IT security management nämns med hänvisning till Föreläsning 2). Två frågor om klasserna (operational, technical), en om funktionerna (supportive), en om residual risk, en om IT security plan, en om configuration mot change management och en om patchdilemmat i change management. Rätt position 2/2/2/2.`;
