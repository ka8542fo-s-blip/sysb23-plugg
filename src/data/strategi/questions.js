// Designregler för frågor i denna fil:
// 1. Alla fyra alternativ jämnlånga — längsta högst 25 % längre än kortaste.
// 2. Inga skämtdistraktorer; varje fel alternativ ska vara rimligt att tro på.
// 3. Distraktormönster: fel upphovsman, fel omfattning, eller sant men svarar inte på frågan.
// 4. Rätt svar får inte vara det enda nyanserade alternativet.
// 5. Rätt svars position fördelas jämnt över 0–3.
// 6. Inga "alla ovanstående"-alternativ.
// 7. explain för varje alternativ, jämnlånga.

export const questions = [
  { id: "str-q01", topic: "grunder", difficulty: 1,
    question: "Hur definieras ekonomistyrning enligt den definition kursen utgår från?",
    options: [
      { text: "Systematisk rapportering av verksamhetens resultat till ägare, långivare och stat.", explain: "Detta beskriver den externa redovisningens uppgift, inte styrningen av verksamheten." },
      { text: "Planering och uppföljning av verksamhetens finansiella resultat och lönsamhet.", explain: "För snävt: definitionen omfattar ekonomiska mål som också kan vara icke-finansiella." },
      { text: "Avsiktlig påverkan på en verksamhet och dess befattningshavare mot vissa ekonomiska mål.", explain: "Rätt. Definitionen rymmer avsiktligheten, både verksamhet och människor, samt ekonomiska mål i vid mening." },
      { text: "Fördelning av knappa resurser mellan verksamhetens olika delar och funktioner.", explain: "Resurshushållning är ekonomiämnets grund, men beskriver inte styrningens definition." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q02", topic: "grunder", difficulty: 1,
    question: "Vilken uppdelning används för ekonomistyrningens styrmedel?",
    options: [
      { text: "Formella styrmedel, organisationsstruktur och mindre formaliserad styrning.", explain: "Rätt. De tre kategorierna rymmer tekniker, struktur respektive kultur och lärande." },
      { text: "Finansiella styrmedel, icke-finansiella styrmedel och strategiska styrmedel.", explain: "Måtten kan delas så, men det är inte kursens indelning av styrmedel." },
      { text: "Budgetering, produktkalkylering och intern prestationsmätning.", explain: "Tre exempel inom en enda kategori, nämligen de formella styrmedlen." },
      { text: "Planering, genomförande och uppföljning av verksamhetens verksamhetsplaner.", explain: "Detta är styrprocessens faser snarare än de medel som används i den." }
    ],
    correct: 0, source: "AJK kap 1 & 3", reviewed: true },

  { id: "str-q03", topic: "grunder", difficulty: 2,
    question: "Vad utmärker det horisontella perspektivet på företaget?",
    options: [
      { text: "Företaget ses som en hierarki där ägarnas krav bryts ned nedåt i organisationen.", explain: "Detta är det vertikala perspektivet, med ansvarsfördelning uppifrån och ned." },
      { text: "Företaget ses som processer och aktiviteter som tillsammans skapar värde för kunden.", explain: "Rätt. Värdekedjeperspektivet utgår från kunden och kräver samordning mellan leden." },
      { text: "Företaget ses som en förädlingsenhet med ett fysiskt och ett finansiellt flöde.", explain: "Detta är förädlingsmodellen, som hör till det vertikala synsättets äldre form." },
      { text: "Företaget ses som ett öppet system i jämvikt med sina viktigaste intressenter.", explain: "Detta är intressentmodellens utgångspunkt och rör målbildning, inte styrperspektiv." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q04", topic: "grunder", difficulty: 2,
    question: "Vad kännetecknar strategisk ekonomistyrning jämfört med traditionell ekonomistyrning?",
    options: [
      { text: "Kalkyler och budgetar överges till förmån för kvalitativa bedömningar av strategin.", explain: "Inriktningen kompletterar med nya metoder i stället för att överge de befintliga." },
      { text: "Ansvaret för styrningen flyttas från ekonomifunktionen till företagets ledningsgrupp.", explain: "Ansvarsfrågan är inte det som skiljer inriktningarna; det externa fokuset är det." },
      { text: "Uppföljningen sker oftare och med mer detaljerade mått per organisatorisk enhet.", explain: "Ökad mätfrekvens är ingen del av vad som definierar strategisk ekonomistyrning." },
      { text: "Det interna fokuset kompletteras med externt fokus på konkurrenter och kunder.", explain: "Rätt. Konkurrenters kostnader och kunders betalningsvilja analyseras, och styrningen anpassas till strategin." }
    ],
    correct: 3, source: "AJK kap 1", reviewed: true },

  { id: "str-q05", topic: "vision", difficulty: 1,
    question: "Vad skiljer en vision från en affärsidé?",
    options: [
      { text: "Visionen anger önskad framtida riktning, affärsidén vad företaget gör och tjänar pengar på.", explain: "Rätt. Visionen är ett önskvärt framtida tillstånd, affärsidén beskriver verksamheten och intäkterna." },
      { text: "Visionen anger vad företaget gör och tjänar pengar på, affärsidén den framtida riktningen.", explain: "Begreppen är omkastade: det är visionen som pekar framåt mot ett önskat tillstånd." },
      { text: "Visionen är avsedd för externa intressenter, affärsidén används i den interna styrningen.", explain: "Båda används både internt och externt; skillnaden ligger i innehållet, inte i mottagaren." },
      { text: "Visionen gäller på kort sikt och konkretiseras, affärsidén gäller på lång sikt och abstraheras.", explain: "Tidshorisonten är omvänd, och visionen är den mindre konkreta av de två." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q06", topic: "vision", difficulty: 2,
    question: "Vilka tre funktioner tillskrivs visionen i kurslitteraturen?",
    options: [
      { text: "Prissättande, positionerande samt differentierande mot konkurrenternas erbjudanden.", explain: "Detta är marknadsföringsbegrepp och hör inte till visionens beskrivna funktioner." },
      { text: "Planerande, samordnande samt kontrollerande av verksamhetens löpande arbete.", explain: "Detta beskriver styrprocessens funktioner snarare än visionens roll." },
      { text: "Legitimerande, ambition och fokus, samt identifikation och motivation.", explain: "Rätt. Visionen ger samhälleligt berättigande, ramar för affärsidén, och engagemang internt." },
      { text: "Vägledande, målsättande samt utvärderande av de anställdas individuella prestationer.", explain: "Individuell prestationsbedömning tillhör belöningssystemen, inte visionen." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q07", topic: "vision", difficulty: 1,
    question: "Vad är strategins uppgift i kedjan från vision till ekonomistyrning?",
    options: [
      { text: "Att beskriva det önskvärda framtida tillstånd som verksamheten ska utvecklas mot.", explain: "Detta är visionens uppgift, som ligger före strategin i kedjan." },
      { text: "Att bryta ned huvudmålen i delmål med tidshorisont, ansvarig enhet och handlingsplaner.", explain: "Detta är verksamhetsplaneringen, som följer efter att strategin är formulerad." },
      { text: "Att fastställa vilka ekonomiska mål varje befattningshavare ska hållas ansvarig för.", explain: "Ansvarsfördelningen sker i styrningen, med strategin som given utgångspunkt." },
      { text: "Att klargöra hur affärsidén ska uppnås, alltså hur företaget avser att arbeta.", explain: "Rätt. Strategin är planen för att förverkliga affärsidén, med konkurrensfördelar och resurser." }
    ],
    correct: 3, source: "AJK kap 1", reviewed: true },

  { id: "str-q08", topic: "vision", difficulty: 2,
    question: "I vilken ordning följer begreppen på varandra, från mest övergripande till mest konkret?",
    options: [
      { text: "Affärsidé, vision, strategi, ekonomistyrning, verksamhetsplanering.", explain: "Visionen kommer före affärsidén, och styrningen står sist i kedjan." },
      { text: "Vision, affärsidé, strategi, verksamhetsplanering, ekonomistyrning.", explain: "Rätt. Visionen ramar in affärsidén, strategin anger vägen, planeringen bryter ned målen." },
      { text: "Vision, strategi, affärsidé, ekonomistyrning, verksamhetsplanering.", explain: "Strategin anger hur affärsidén uppnås och kan därför inte föregå den." },
      { text: "Strategi, vision, affärsidé, verksamhetsplanering, ekonomistyrning.", explain: "Kedjan börjar i visionen; strategin är ett senare och mer konkret led." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q09", topic: "mal", difficulty: 1,
    question: "Vilken invändning riktas mot vinstmaximering som företagets enda mål?",
    options: [
      { text: "Företag saknar den fullständiga information om framtiden som maximering förutsätter.", explain: "Rätt. Beslut fattas under osäkerhet, och flera mål kan gälla beroende på sammanhang." },
      { text: "Företag saknar ekonomiska mål och styrs i praktiken av sina anställdas preferenser.", explain: "Överdrivet: målen finns, men de är fler och mer situationsberoende än modellen antar." },
      { text: "Företag kan inte beräkna sin vinst förrän räkenskapsåret är avslutat och reviderat.", explain: "Ett praktiskt förhållande, men inte den principiella invändningen mot modellen." },
      { text: "Företag styrs av marknadens prisbildning snarare än av sina egna målsättningar.", explain: "Detta är snarare ett antagande inom den neoklassiska teorin än en kritik av den." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q10", topic: "mal", difficulty: 2,
    question: "Vad innebär satisfieringsmodellen?",
    options: [
      { text: "Företagsledningen maximerar sin egen nytta i form av lön, makt, status och prestige.", explain: "Detta är Williamsons företagsledarmodell, inte Simons satisfieringsmodell." },
      { text: "Företaget maximerar försäljningen under villkoret att vinsten är godtagbar för ägarna.", explain: "Detta är Baumols modell, där tillväxt antas ge ledningen fördelar." },
      { text: "Företaget strävar efter en tillfredsställande vinst i förhållande till en anspråksnivå.", explain: "Rätt. Begränsad rationalitet gör maximering omöjlig, så man nöjer sig med ett minimikrav." },
      { text: "Företagets mål utgör en kompromiss mellan de olika intressentgruppernas krav.", explain: "Detta är intressentmodellen, som liksom Simons bygger på en tillfredsställande vinst." }
    ],
    correct: 2, source: "AJK kap 1", reviewed: true },

  { id: "str-q11", topic: "mal", difficulty: 2,
    question: "Vad är utgångspunkten i intressentmodellen?",
    options: [
      { text: "Företaget söker jämvikt genom balans mellan intressenternas bidrag och belöningar.", explain: "Rätt. Modellen bygger på det öppna systemsynsättet och en kompromiss mellan kraven." },
      { text: "Företaget söker maximera nuvärdet av framtida nettokassaflöden för sina ägare.", explain: "Detta är de kassaflödesbaserade modellernas aktieägarperspektiv." },
      { text: "Företaget söker uppfylla samtliga intressentgruppers krav vid varje given tidpunkt.", explain: "Modellen medger att kraven kan stå i konflikt och tillgodoses seriekopplat över tid." },
      { text: "Företaget söker minimera sitt beroende av externa intressenter och deras resurser.", explain: "Beroendet är tvärtom modellens förutsättning, och hanteras genom utbyte." }
    ],
    correct: 0, source: "AJK kap 1", reviewed: true },

  { id: "str-q12", topic: "mal", difficulty: 2,
    question: "Vad är målet enligt de kassaflödesbaserade målmodellerna?",
    options: [
      { text: "Att maximera det redovisade rörelseresultatet under den innevarande perioden.", explain: "Redovisat resultat avviker från betalningsströmmar genom periodiseringar." },
      { text: "Att maximera nuvärdet av företagets samtliga framtida nettokassaflöden.", explain: "Rätt. In- minus utbetalningar diskonteras med en kalkylränta, ur ett aktieägarperspektiv." },
      { text: "Att upprätthålla en likviditet som täcker verksamhetens löpande betalningar.", explain: "Likviditet är ofta ett delmål eller en restriktion, inte modellens huvudmål." },
      { text: "Att minimera kapitalbindningen i lager, kundfordringar och anläggningstillgångar.", explain: "Kapitalbindning påverkar kassaflödet men är inte det mål som ska maximeras." }
    ],
    correct: 1, source: "AJK kap 1", reviewed: true },

  { id: "str-q13", topic: "mal", difficulty: 3,
    question: "Vad antar Baumols modell om företagets beteende?",
    options: [
      { text: "Företaget nöjer sig med en vinst som ligger i nivå med tidigare perioders utfall.", explain: "Detta är närmare Simons anspråksnivå än Baumols försäljningsfokus." },
      { text: "Företaget fördelar resurser så att varje divisions räntabilitetskrav uppfylls.", explain: "Detta rör intern ansvarsfördelning, inte de klassiska målmodellerna." },
      { text: "Företaget maximerar ledningens förmåner genom administration och prioriterade investeringar.", explain: "Detta är Williamsons modell om ledningens egen nyttomaximering." },
      { text: "Företaget maximerar försäljningen vid en för ägarna tillfredsställande vinstnivå.", explain: "Rätt. Tillväxt antas ge ledningen högre lön, större inflytande och högre status." }
    ],
    correct: 3, source: "AJK kap 1", reviewed: true },

  { id: "str-q14", topic: "effektivitet", difficulty: 1,
    question: "Hur definieras effektivitet i kurslitteraturen?",
    options: [
      { text: "Som graden av måluppfyllelse, uttryckt som värdet av utflödet i relation till inflödet.", explain: "Rätt. Effektiviteten mäts mot ett mål, vilket gör att målnivån påverkar utfallet." },
      { text: "Som kvantiteten utflöde i relation till kvantiteten inflöde i verksamhetens processer.", explain: "Detta är produktivitet, alltså samma kvot men uttryckt i fysiska termer." },
      { text: "Som periodens resultat i relation till det kapital som verksamheten binder.", explain: "Detta är lönsamhet, ett vanligt men inte enda mått på effektivitet." },
      { text: "Som skillnaden mellan periodens intäkter och de kostnader som förbrukats.", explain: "Detta är resultatet, ett absolut tal utan relation till någon målnivå." }
    ],
    correct: 0, source: "AJK kap 2", reviewed: true },

  { id: "str-q15", topic: "effektivitet", difficulty: 1,
    question: "Vad kännetecknar hög inre effektivitet?",
    options: [
      { text: "Starkt varumärke, hög kundnöjdhet och växande andelar på företagets marknader.", explain: "Samtliga rör relationen till omvärlden och hör därför till den yttre effektiviteten." },
      { text: "Hög produktivitet, kostnadseffektivitet och väl utvecklade rutiner och system.", explain: "Rätt. Inre effektivitet är resurshushållning internt, alltså att göra saker rätt." },
      { text: "Hög lönsamhet mätt som räntabilitet på det kapital verksamheten sysselsätter.", explain: "Lönsamhet är ett samlat effektivitetsmått och inte specifikt den inre dimensionen." },
      { text: "Snabb tillväxt genom etablering på nya geografiska marknader och segment.", explain: "Tillväxt är ett uttryck för yttre effektivitet, alltså att göra rätt saker." }
    ],
    correct: 1, source: "AJK kap 2", reviewed: true },

  { id: "str-q16", topic: "effektivitet", difficulty: 2,
    question: "Ett företag har mycket hög produktivitet i produktionen men tappar marknadsandelar år efter år. Vad talar det för?",
    options: [
      { text: "Att den inre effektiviteten är låg, eftersom resurserna inte utnyttjas på ett ändamålsenligt sätt.", explain: "Hög produktivitet talar tvärtom för att den inre effektiviteten är god." },
      { text: "Att den totala effektiviteten är hög, eftersom produktiviteten är den avgörande faktorn.", explain: "Total effektivitet kräver att både den inre och den yttre dimensionen är hög." },
      { text: "Att lönsamheten är hög, eftersom kostnadseffektivitet driver räntabiliteten uppåt.", explain: "Fallande marknadsandelar hotar snarare den framtida lönsamheten." },
      { text: "Att den yttre effektiviteten är låg, eftersom erbjudandet inte skapar tillräckligt kundvärde.", explain: "Rätt. Företaget gör saker rätt men inte rätt saker sett ur kundens perspektiv." }
    ],
    correct: 3, source: "AJK kap 2", reviewed: true },

  { id: "str-q17", topic: "effektivitet", difficulty: 2,
    question: "Varför betraktas lönsamhet som ett bättre mått än resultat?",
    options: [
      { text: "Lönsamheten relaterar utfallet till det kapital som verksamheten har tagit i anspråk.", explain: "Rätt. Som relationstal gör lönsamheten företag av olika storlek jämförbara." },
      { text: "Lönsamheten är mindre känslig för periodiseringar och därför lättare att beräkna.", explain: "Båda måtten bygger på periodiserade intäkter och kostnader från redovisningen." },
      { text: "Lönsamheten omfattar även icke-finansiella dimensioner som kvalitet och kundnöjdhet.", explain: "Lönsamhet är ett rent finansiellt mått; de andra dimensionerna mäts separat." },
      { text: "Lönsamheten kan beräknas i tjänsteföretag, medan resultatmått passar tillverkning.", explain: "Båda måtten kan beräknas i alla branscher, så påståendet håller inte." }
    ],
    correct: 0, source: "AJK kap 2", reviewed: true },

  { id: "str-q18", topic: "effektivitet", difficulty: 3,
    question: "Vilket begreppspar knyts till de tillfällen då likvida medel faktiskt överförs?",
    options: [
      { text: "Intäkt och kostnad, eftersom de uttrycker periodens prestationer och förbrukning.", explain: "Dessa är periodiserade och saknar därför koppling till betalningstillfället." },
      { text: "Inkomst och utgift, eftersom de knyts till fakturans datering vid köp och försäljning.", explain: "Dessa avser affärstransaktionen med extern part, inte betalningen av den." },
      { text: "Inbetalning och utbetalning, eftersom de avser själva betalningstransaktionerna.", explain: "Rätt. Betalning kan ske både i efterskott vid kredit och i förskott vid abonnemang." },
      { text: "Tillgång och skuld, eftersom de visar företagets fordringar och åtaganden i pengar.", explain: "Detta är balansräkningens poster och alltså inte ett flödesbegreppspar." }
    ],
    correct: 2, source: "AJK kap 2", reviewed: true },

  { id: "str-q19", topic: "organisation", difficulty: 1,
    question: "Vad kännetecknar en funktionsorganisation?",
    options: [
      { text: "Verksamheten delas in efter produktområden eller efter geografiska marknader.", explain: "Detta beskriver divisionsorganisationen, som är vanlig i stora företag." },
      { text: "Verksamheten delas in efter funktioner som marknadsföring, produktion och ekonomi.", explain: "Rätt. Indelningen samlar specialistkompetens inom varje funktionsområde." },
      { text: "Verksamheten delas in efter processer som löper horisontellt fram till kunden.", explain: "Detta är den processorienterade formen, som bygger på värdekedjeperspektivet." },
      { text: "Verksamheten delas in i tillfälliga enheter som upplöses när uppdraget är slutfört.", explain: "Detta beskriver projektorganisationen snarare än en funktionsindelning." }
    ],
    correct: 1, source: "AJK kap 3 / föreläsning", reviewed: true },

  { id: "str-q20", topic: "organisation", difficulty: 2,
    question: "Vilket skäl anges för att stora företag ofta har inslag av divisionsorganisation?",
    options: [
      { text: "Den samlar specialistkompetensen och minskar behovet av samordning mellan enheter.", explain: "Detta är snarare funktionsorganisationens fördel och divisionsformens svaghet." },
      { text: "Den gör det möjligt att styra hela verksamheten mot ett enda gemensamt räntabilitetskrav.", explain: "Divisioner får tvärtom egna resultat- eller lönsamhetskrav per enhet." },
      { text: "Den underlättar lansering av nya produktområden och inträde på nya geografiska marknader.", explain: "Rätt. Formen gör diversifiering hanterbar genom självständiga enheter med eget ansvar." },
      { text: "Den minskar behovet av formella styrmedel eftersom enheterna styr sig själva.", explain: "Behovet av ansvarsfördelning och prestationsmätning ökar snarare med formen." }
    ],
    correct: 2, source: "AJK kap 3 / föreläsning", reviewed: true },

  { id: "str-q21", topic: "organisation", difficulty: 2,
    question: "Vilka principer ska styra fördelningen av ekonomiskt ansvar?",
    options: [
      { text: "Försiktighetsprincipen och matchningsprincipen vid värdering av poster.", explain: "Dessa är redovisningsprinciper och rör inte ansvarsfördelningen i styrningen." },
      { text: "Påverkbarhetsprincipen och befogenhetsprincipen vid utformning av ansvar.", explain: "Rätt. Man ska kunna påverka det man ansvarar för och ha befogenhet att göra det." },
      { text: "Väsentlighetsprincipen och kontinuitetsprincipen vid uppföljning av avvikelser.", explain: "Även dessa hör till redovisningen snarare än till ansvarsfördelningen." },
      { text: "Kostnads- och nyttokriteriet samt påverkbarhetsprincipen vid val av styrmedel.", explain: "Kostnads- och nyttokriteriet gäller metodval, inte fördelningen av ansvar." }
    ],
    correct: 1, source: "AJK kap 3", reviewed: true },

  { id: "str-q22", topic: "organisation", difficulty: 3,
    question: "En enhet påverkar sina intäkter och kostnader men har ingen befogenhet över kapitalposter. Vilket ansvar är lämpligast?",
    options: [
      { text: "Lönsamhetsansvar, eftersom enheten påverkar både intäktssidan och kostnadssidan.", explain: "Lönsamhetsansvar förutsätter att enheten även kan påverka det bundna kapitalet." },
      { text: "Kostnadsansvar, eftersom det är den ansvarsform som kräver minst befogenheter.", explain: "För snävt: enheten påverkar även intäkterna och bör hållas ansvarig för dem." },
      { text: "Bidragsansvar, eftersom täckningsbidraget speglar enhetens egna beslut bäst.", explain: "Bidragsansvar används främst där ansvaret är begränsat till försäljningen." },
      { text: "Resultatansvar, eftersom det omfattar intäkter minus kostnader men inte kapitalet.", explain: "Rätt. Utan kapitalpåverkan vore ett räntabilitetskrav oförenligt med påverkbarhetsprincipen." }
    ],
    correct: 3, source: "AJK kap 3", reviewed: true },

  { id: "str-q23", topic: "strategiutveckling", difficulty: 1,
    question: "Varför kan en strategi enligt Mintzberg inte alltid planeras fullt ut i förväg?",
    options: [
      { text: "Eftersom omvärlden ofta är osäker och föränderlig växer delar av strategin fram längs vägen.", explain: "Rätt. Realiserad strategi är summan av avsiktlig och framväxande strategi." },
      { text: "Eftersom planeringen kräver resurser som få företag kan avsätta i tillräcklig omfattning.", explain: "Kostnaden för planering är inte det argument Mintzberg för fram." },
      { text: "Eftersom ledningen sällan har mandat att fatta beslut om verksamhetens långsiktiga inriktning.", explain: "Mandatfrågan är inte det som gör förhandsplanering otillräcklig enligt Mintzberg." },
      { text: "Eftersom strategiskt arbete bör ersättas av löpande anpassning till marknadens signaler.", explain: "Emergent strategi kompletterar planeringen och gör den inte överflödig." }
    ],
    correct: 0, source: "Mintzberg / föreläsning", reviewed: true },

  { id: "str-q24", topic: "strategiutveckling", difficulty: 2,
    question: "I vilken ordning har strategiämnets dominerande fokus utvecklats enligt Herrmann?",
    options: [
      { text: "Resurser och kärnkompetenser, därefter omvärld och positionering, därefter kunskap.", explain: "Det resursbaserade synsättet växte fram efter positioneringsskolans genombrott." },
      { text: "Kunskap och lärande, därefter resurser och kärnkompetenser, därefter omvärlden.", explain: "Ordningen är omvänd: kunskapsfokuset är fältets nuvarande era." },
      { text: "Omvärld och positionering, därefter resurser och kärnkompetenser, därefter kunskap.", explain: "Rätt. Porters branschanalys blev dominant design, sedan kom RBV, nu lärande och innovation." },
      { text: "Omvärld och positionering, därefter kunskap och lärande, därefter resurserna.", explain: "Resursperspektivet kom före kunskapsperspektivet i utvecklingslinjen." }
    ],
    correct: 2, source: "Herrmann (2005)", reviewed: true },

  { id: "str-q25", topic: "strategiutveckling", difficulty: 2,
    question: "Vad avses med en lärande organisation?",
    options: [
      { text: "En organisation som systematiskt vidareutbildar sin personal genom kurser och seminarier.", explain: "Formell utbildning kan bidra, men erfarenhetsbaserat lärande står i centrum." },
      { text: "En organisation där erfarenheter sprids och omsätts i ständig förnyelse och förbättring.", explain: "Rätt. Individers lärande blir organisatoriskt när kunskapen sprids och tillämpas." },
      { text: "En organisation som anpassar sin struktur efter omgivningens krav och förutsättningar.", explain: "Detta är contingencyteorins tes om strukturell anpassning, inte lärandebegreppet." },
      { text: "En organisation som fattar beslut nära verksamheten genom långtgående delegering.", explain: "Detta beskriver medarbetarskap, som är en förutsättning men inte definitionen." }
    ],
    correct: 1, source: "AJK kap 3 / Herrmann (2005)", reviewed: true },

  { id: "str-q26", topic: "strategiutveckling", difficulty: 3,
    question: "Vad skiljer dubbelkretslärande från enkelkretslärande?",
    options: [
      { text: "Dubbelkretslärande sker i grupp medan enkelkretslärande sker hos den enskilda individen.", explain: "Antalet inblandade är inte det som skiljer begreppen åt." },
      { text: "Dubbelkretslärande bygger på dokumenterade rutiner medan enkelkretslärande sker informellt.", explain: "Graden av formalisering är inte den skillnad begreppen avser." },
      { text: "Dubbelkretslärande ifrågasätter även orsaken bakom problemet, inte bara problemet självt.", explain: "Rätt. Enkelkrets botar symptomen, dubbelkrets tar sig även an sjukdomen." },
      { text: "Dubbelkretslärande utgår från omvärldsbevakning medan enkelkretslärande utgår från erfarenhet.", explain: "Båda formerna bygger på egen erfarenhet av det inträffade." }
    ],
    correct: 2, source: "AJK kap 3", reviewed: true },

  { id: "str-q27", topic: "porter", difficulty: 1,
    question: "Vilket av följande ingår INTE bland Porters fem krafter?",
    options: [
      { text: "Kundernas förhandlingsstyrka i relation till företagen i branschen.", explain: "Detta är en av de fem krafterna och påverkar branschens lönsamhetspotential." },
      { text: "Lagar och regleringar som påverkar villkoren för branschens aktörer.", explain: "Rätt. Reglering ingår inte som egen kraft utan fångas i bredare analyser som PESTEL." },
      { text: "Hotet från substitutprodukter som kan tillgodose samma kundbehov.", explain: "Detta är en av de fem krafterna i modellen." },
      { text: "Hotet från nya aktörer som överväger att etablera sig i branschen.", explain: "Detta är en av de fem krafterna och beror bland annat på inträdesbarriärer." }
    ],
    correct: 1, source: "Porter / föreläsning", reviewed: true },

  { id: "str-q28", topic: "porter", difficulty: 1,
    question: "I vilken situation är en femkraftsanalys mest användbar?",
    options: [
      { text: "När företaget vill kartlägga sina interna styrkor och svårimiterade resurser.", explain: "Detta är det resursbaserade synsättets uppgift, inte femkraftsmodellens." },
      { text: "När företaget vill utvärdera utfallet av en genomförd marknadsföringssatsning.", explain: "För operativt: modellen arbetar på branschnivå, inte kampanjnivå." },
      { text: "När företaget vill bedöma attraktiviteten i en bransch inför ett inträde.", explain: "Rätt. Modellen bedömer branschens lönsamhetspotential och konkurrensintensitet." },
      { text: "När företaget vill fördela ansvar och befogenheter mellan sina affärsenheter.", explain: "Ansvarsfördelning hör till organisationsstrukturen som styrmedel." }
    ],
    correct: 2, source: "Porter / föreläsning", reviewed: true },

  { id: "str-q29", topic: "porter", difficulty: 2,
    question: "Vilka är Porters generiska strategier?",
    options: [
      { text: "Kostnadsledarskap, differentiering samt fokus på ett avgränsat segment.", explain: "Rätt. Konkurrensfördel nås genom lägst kostnad, unikt erbjudande eller smal inriktning." },
      { text: "Marknadspenetration, produktutveckling samt diversifiering till nya områden.", explain: "Detta är Ansoffs tillväxtstrategier, som svarar på en annan fråga än Porters." },
      { text: "Kostnadsledarskap, tillväxt genom förvärv samt vertikal integration bakåt.", explain: "Blandar en generisk strategi med två tillväxt- och strukturbeslut." },
      { text: "Differentiering, samarbete i allianser samt koncentration av produktportföljen.", explain: "Endast differentiering hör till de generiska strategierna i modellen." }
    ],
    correct: 0, source: "Porter / Herrmann (2005)", reviewed: true },

  { id: "str-q30", topic: "rbv", difficulty: 1,
    question: "Vilka egenskaper måste resurser ha för att ge uthållig konkurrensfördel enligt det resursbaserade synsättet?",
    options: [
      { text: "De ska vara värdefulla, sällsynta och svåra för konkurrenterna att imitera.", explain: "Rätt. Dessutom måste företaget vara organiserat så att resurserna kan utnyttjas." },
      { text: "De ska vara materiella, mätbara och möjliga att värdera i balansräkningen.", explain: "Många svårimiterade resurser är immateriella och saknas i balansräkningen." },
      { text: "De ska vara standardiserade, dokumenterade och möjliga att skala upp snabbt.", explain: "Sådana resurser kan konkurrenterna också skaffa, och då uppstår ingen fördel." },
      { text: "De ska vara billiga att anskaffa, flexibla i användning och enkla att avyttra.", explain: "Låg anskaffningskostnad talar snarast för att resursen är allmänt tillgänglig." }
    ],
    correct: 0, source: "Barney / Herrmann (2005)", reviewed: true },

  { id: "str-q31", topic: "rbv", difficulty: 2,
    question: "Varför blir generativ AI enligt Barney sannolikt inte en källa till uthållig konkurrensfördel?",
    options: [
      { text: "Tekniken är ännu alltför omogen för att kunna tillämpas på verkliga affärsproblem i drift.", explain: "Barney visar tvärtom med flera exempel att den skapar betydande värde redan nu." },
      { text: "Tekniken blir tillgänglig för alla konkurrenter, så vinsterna konkurreras snabbt bort.", explain: "Rätt. Liknande algoritmer på liknande data ger liknande resultat hos alla aktörer." },
      { text: "Tekniken kräver investeringar som endast de största företagen har råd att bära.", explain: "Tillgängligheten är snarare hög, vilket är själva grunden för problemet." },
      { text: "Tekniken förutsätter kompetens som är svår att rekrytera på dagens arbetsmarknad.", explain: "Kompetensbrist är ett praktiskt hinder men inte Barneys strategiska argument." }
    ],
    correct: 1, source: "Barney (2024)", reviewed: true },

  { id: "str-q32", topic: "rbv", difficulty: 2,
    question: "Hur kan företag enligt Barney ändå bygga hållbar fördel med hjälp av AI?",
    options: [
      { text: "Genom att vara först i branschen med att införa tekniken i sina beslutsprocesser.", explain: "Sådana försprång blir kortlivade eftersom tekniken lär av pionjärens egna drag." },
      { text: "Genom att utveckla en egen språkmodell anpassad till den egna branschens data.", explain: "Konkurrenterna kan utveckla, samköpa eller beställa motsvarande modell." },
      { text: "Genom att bygga upp ett dataset som är större än konkurrenternas motsvarande data.", explain: "Nyttan av mer data avtar när mönstren redan framträder i ett mindre urval." },
      { text: "Genom att tillämpa tekniken på resurser som redan är värdefulla och svårimiterade.", explain: "Rätt. Insikterna blir då användbara främst för den som äger tillgångarna, som i Amazons fall." }
    ],
    correct: 3, source: "Barney (2024)", reviewed: true },

  { id: "str-q33", topic: "rbv", difficulty: 3,
    question: "Varför ger egen, proprietär data sällan uthållig AI-fördel enligt Barney?",
    options: [
      { text: "Konkurrenterna har ofta funktionellt likvärdig data med mycket likartade mönster.", explain: "Rätt. Dessutom kan strategin härledas ur synliga resultat och dataset läcker i praktiken." },
      { text: "Egen data är i regel av lägre kvalitet än de dataset leverantörerna tillhandahåller.", explain: "Kvalitetsfrågan är inte det argument Barney bygger sitt resonemang på." },
      { text: "Dataskyddsregleringen begränsar möjligheten att träna modeller på egen kunddata.", explain: "Reglering finns, men artikelns invändningar är strategiska snarare än juridiska." },
      { text: "Egen data blir snabbt inaktuell och måste därför byggas upp på nytt fortlöpande.", explain: "Aktualitet är en praktisk fråga och inte skälet till att fördelen uteblir." }
    ],
    correct: 0, source: "Barney (2024)", reviewed: true },

  { id: "str-q34", topic: "rbv", difficulty: 3,
    question: "Vad menar Barney med att pionjärfördelar med generativ AI blir kortlivade?",
    options: [
      { text: "Tekniken utvecklas så snabbt att tidiga tillämpningar blir tekniskt föråldrade.", explain: "Att tekniken utvecklas är förutsättningen, men inte själva mekanismen han beskriver." },
      { text: "Tidiga användare får bära utvecklingskostnader som senare aktörer slipper helt.", explain: "Kostnadsfördelningen är inte argumentet; det handlar om informationens spridning." },
      { text: "Pionjärens strategiska val absorberas i den data som konkurrenternas AI analyserar.", explain: "Rätt. Sena aktörer drar nytta av både egna och pionjärens tidigare ansträngningar." },
      { text: "Marknaden hinner mättas innan pionjären kan omsätta sitt försprång i intäkter.", explain: "Marknadsmättnad är inte den mekanism Barney pekar ut i sitt resonemang." }
    ],
    correct: 2, source: "Barney (2024)", reviewed: true },

  { id: "str-q35", topic: "bsc", difficulty: 1,
    question: "Vilket problem med finansiella mått är utgångspunkten för Kaplan och Norton?",
    options: [
      { text: "De är svåra att jämföra mellan affärsenheter med olika verksamhetsinriktning.", explain: "Jämförbarhet är en praktisk fråga, inte artikelns principiella invändning." },
      { text: "De är historiska och visar vad som hänt utan att ange hur prestationen kan förbättras.", explain: "Rätt. Därför behövs kompletterande mått som pekar framåt mot kommande perioder." },
      { text: "De påverkas av redovisningsval och kan därför manipuleras av företagets ledning.", explain: "Sant i sig, men det är inte det argument styrkortet byggs på." },
      { text: "De uppdateras för sällan för att kunna användas i den löpande verksamhetsstyrningen.", explain: "Rapporteringsfrekvensen är inte kärnan i artikelns kritik." }
    ],
    correct: 1, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q36", topic: "bsc", difficulty: 1,
    question: "Vilka fyra perspektiv ingår i det balanserade styrkortet?",
    options: [
      { text: "Ekonomi, marknad, teknik samt regelefterlevnad och hållbarhet.", explain: "Detta liknar en omvärldsanalys och är inte styrkortets indelning." },
      { text: "People, planet och profit, kompletterat med ett perspektiv för styrning.", explain: "Detta blandar samman styrkortet med Triple Bottom Line-ramverket." },
      { text: "Ägare, kunder, medarbetare samt leverantörer och samhälle i stort.", explain: "Detta är snarare en uppräkning av intressenter än styrkortets perspektiv." },
      { text: "Finansiellt, kund, interna processer samt innovation och lärande.", explain: "Rätt. Tillsammans balanserar de externa och interna mått och kopplar dem till strategin." }
    ],
    correct: 3, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q37", topic: "bsc", difficulty: 2,
    question: "Vad är kärnskillnaden mellan styrkortet och traditionell finansiellt inriktad styrning?",
    options: [
      { text: "Styrkortet integrerar finansiella och icke-finansiella mått till en samlad bild.", explain: "Rätt. Balansen mellan utfallsmått och drivande mått kopplar styrningen till strategin." },
      { text: "Styrkortet ersätter finansiella mått med bedömningar av kvalitet och kundnöjdhet.", explain: "Det finansiella perspektivet finns kvar som ett av styrkortets fyra." },
      { text: "Styrkortet inriktas på företagets miljöarbete och sociala ansvarstagande.", explain: "Detta är TBL- och ESG-ramverkens område snarare än styrkortets." },
      { text: "Styrkortet skyddar företagets resurser från att imiteras av konkurrenterna.", explain: "Imitationsskydd är det resursbaserade synsättets fråga, inte styrkortets." }
    ],
    correct: 0, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q38", topic: "bsc", difficulty: 3,
    question: "Vad innebär styrkortets transparenstest?",
    options: [
      { text: "Att samtliga mått ska redovisas öppet för anställda, investerare och kunder.", explain: "Kommunikation är en av styrkortets nyttor men inte innebörden av testet." },
      { text: "Att en utomstående ska kunna utläsa affärsenhetens konkurrensstrategi ur måtten.", explain: "Rätt. Av de femton till tjugo måtten ska strategin gå att läsa av utifrån." },
      { text: "Att varje mått ska kunna spåras till en verifierbar källa i redovisningssystemet.", explain: "Spårbarhet är en kvalitetsfråga men inte det test artikeln beskriver." },
      { text: "Att måtten ska kunna jämföras med motsvarande mått hos branschens konkurrenter.", explain: "Detta är benchmarking, som är ett annat och separat styrmedel." }
    ],
    correct: 1, source: "Kaplan & Norton (1993)", reviewed: true },

  { id: "str-q39", topic: "matt", difficulty: 2,
    question: "Vilket är det vanligaste misstaget företag gör med icke-finansiella mått enligt Ittner och Larcker?",
    options: [
      { text: "De samlar in data manuellt och belastar därmed organisationen mer än nödvändigt.", explain: "Insamlingens form är inte något av de fyra misstag studien identifierar." },
      { text: "De redovisar måtten externt och avslöjar därmed strategiskt känslig information.", explain: "Extern rapportering ingår inte bland de misstag artikeln pekar ut." },
      { text: "De väljer mått utan att ha en kausalmodell som kopplar dem till finansiella utfall.", explain: "Rätt. Utan orsak-verkan-kedja går det inte att välja de få rätta måtten bland hundratals." },
      { text: "De uppdaterar måtten för sällan för att hinna reagera på negativa trender.", explain: "Mätfrekvensen är inte det första eller vanligaste av misstagen." }
    ],
    correct: 2, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q40", topic: "matt", difficulty: 2,
    question: "Ett företag satte målet 100 procent kundnöjdhet trots att helt nöjda kunder inte spenderade mer än de som var 80 procent nöjda. Vilket misstag illustrerar det?",
    options: [
      { text: "Att inte validera de antaganden som kausalmodellen bygger på empiriskt.", explain: "Sambandet var här känt; felet låg i vilken målnivå man valde utifrån det." },
      { text: "Att sätta prestationsmål på nivåer som kostar mer än de kan ge tillbaka.", explain: "Rätt. Marginalnyttan av de sista procenten var noll, vilket gör målet olönsamt." },
      { text: "Att mäta med instrument som är för ogiltiga eller opålitliga för sitt syfte.", explain: "Mätinstrumentet var inte problemet i just detta exempel." },
      { text: "Att koppla belöningar till mått som de ansvariga inte själva kan påverka.", explain: "Påverkbarhet är en styrningsprincip men inte ett av de fyra misstagen." }
    ],
    correct: 1, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q41", topic: "matt", difficulty: 3,
    question: "Vad fann Ittner och Larcker om företag som byggde och validerade kausalmodeller?",
    options: [
      { text: "De uppvisade signifikant högre avkastning på tillgångar och eget kapital.", explain: "Rätt. Fyndet gällde över en femårsperiod jämfört med företag utan sådana modeller." },
      { text: "De använde färre mått men uppdaterade dem betydligt oftare än övriga företag.", explain: "Antal och frekvens var inte det studien mätte som utfall." },
      { text: "De övergav med tiden sina icke-finansiella mått till förmån för finansiella.", explain: "Tvärtom fick de ut det värde som måtten kan ge när de används rätt." },
      { text: "De rapporterade högre medarbetarnöjdhet men ingen skillnad i finansiellt utfall.", explain: "Skillnaden i finansiellt utfall var just studiens huvudresultat." }
    ],
    correct: 0, source: "Ittner & Larcker (2003)", reviewed: true },

  { id: "str-q42", topic: "tbl", difficulty: 1,
    question: "Vilken av Triple Bottom Lines dimensioner rör socialt ansvar och välbefinnande?",
    options: [
      { text: "Planet, som omfattar organisationens påverkan på den omgivande miljön.", explain: "Planet är miljödimensionen i ramverket, inte den sociala." },
      { text: "Purpose, som omfattar organisationens övergripande syfte och samhällsroll.", explain: "Purpose ingår inte i ramverket och är en återkommande distraktor." },
      { text: "People, som omfattar anställda, kunder och samhället runt organisationen.", explain: "Rätt. People är den sociala dimensionen av de tre i Elkingtons ramverk." },
      { text: "Prosperity, som omfattar det ekonomiska värde organisationen skapar.", explain: "Prosperity eller profit är den ekonomiska dimensionen." }
    ],
    correct: 2, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q43", topic: "tbl", difficulty: 1,
    question: "Vad är syftet med Triple Bottom Line som ramverk?",
    options: [
      { text: "Att balansera resultatet inom socialt ansvar, miljö och ekonomisk framgång.", explain: "Rätt. Tre resultatdimensioner gör hållbarhet mätbar och synliggör målkonflikter." },
      { text: "Att minimera de kostnader som miljökrav och socialt ansvar medför för företaget.", explain: "Ramverket handlar om att skapa resultat i tre dimensioner, inte att minimera kostnader." },
      { text: "Att prioritera ekonomisk avkastning när de tre dimensionerna står i konflikt.", explain: "Ramverket ger ingen sådan rangordning utan kräver avvägningar i varje fall." },
      { text: "Att ersätta finansiell rapportering med redovisning av miljö och socialt ansvar.", explain: "Den ekonomiska dimensionen finns kvar som en av de tre i ramverket." }
    ],
    correct: 0, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q44", topic: "tbl", difficulty: 2,
    question: "Vilken av följande åtgärder hör hemma under S i ESG-ramverket?",
    options: [
      { text: "Införa en plan för att minska koldioxidutsläppen från företagets transporter.", explain: "Utsläppsminskning är en miljöåtgärd och hör därmed under E." },
      { text: "Utvärdera styrelsens sammansättning och hur väl den fullgör sitt uppdrag.", explain: "Styrelsefrågor rör bolagsstyrning och hör därmed under G." },
      { text: "Se över ersättningsstrukturen för företagets ledande befattningshavare.", explain: "Ersättning till ledningen är också en bolagsstyrningsfråga under G." },
      { text: "Införa en policy för lika löner mellan könen och utbildning av anställda.", explain: "Rätt. Jämställdhet, arbetsvillkor och kompetensutveckling är sociala frågor under S." }
    ],
    correct: 3, source: "ESG / tentatema HT24", reviewed: true },

  { id: "str-q45", topic: "tbl", difficulty: 2,
    question: "Hur definieras hållbar utveckling i Brundtlandrapporten?",
    options: [
      { text: "Utveckling som håller resursförbrukningen inom planetens ekologiska gränser.", explain: "Nära i anda, men definitionen är formulerad utifrån behov över generationer." },
      { text: "Utveckling som möter dagens behov utan att äventyra kommande generationers.", explain: "Rätt. Definitionen betonar globalt ansvar, social rättvisa och långsiktighet." },
      { text: "Utveckling som balanserar ekonomiska, sociala och miljömässiga målsättningar.", explain: "Detta är Triple Bottom Lines innehåll snarare än rapportens definition." },
      { text: "Utveckling som fördelar tillväxtens vinster rättvist mellan världens länder.", explain: "Social rättvisa ingår i rapporten men utgör inte definitionens kärna." }
    ],
    correct: 1, source: "Rogers & Hudson (2011)", reviewed: true },

  { id: "str-q46", topic: "it", difficulty: 1,
    question: "Vilka fyra domäner ska vara i samklang enligt Strategic Alignment Model?",
    options: [
      { text: "Affärsstrategi, IT-strategi, organisationsinfrastruktur och IT-infrastruktur.", explain: "Rätt. Modellen arbetar med strategisk passform och funktionell integration." },
      { text: "Affärsstrategi, IT-strategi, riskhantering och regelefterlevnad i verksamheten.", explain: "Risk och regelefterlevnad ingår inte som domäner i modellen." },
      { text: "Affärsstrategi, marknadsföring, IT-infrastruktur och personalens kompetens.", explain: "Marknadsföring och kompetens är inte modellens fyra domäner." },
      { text: "IT-strategi, IT-infrastruktur, leveranskedja och ekonomistyrningens processer.", explain: "Verksamhetssidan representeras av affärsstrategi och organisationsinfrastruktur." }
    ],
    correct: 0, source: "Henderson & Venkatraman / föreläsning", reviewed: true },

  { id: "str-q47", topic: "it", difficulty: 2,
    question: "Vad framhålls som lösningen på produktivitetsparadoxen?",
    options: [
      { text: "Att öka takten i teknikinvesteringarna så att eftersläpningen hämtas in.", explain: "Mer teknik utan förändrade arbetssätt är just det som gör att paradoxen består." },
      { text: "Att avvakta med investeringar till dess tekniken har hunnit mogna tillräckligt.", explain: "Att avstå löser inte paradoxen, som handlar om hur tekniken används." },
      { text: "Att omorganisera arbetsflöden och processer så att tekniken faktiskt utnyttjas.", explain: "Rätt. Vinsterna realiseras först med komplementära organisatoriska förändringar." },
      { text: "Att mäta produktiviteten med mått som fångar kvalitet och kundvärde bättre.", explain: "Bättre mätning kan synliggöra effekter men skapar inte produktivitetsvinsterna." }
    ],
    correct: 2, source: "Föreläsning / tentatema HT24", reviewed: true },

  { id: "str-q48", topic: "it", difficulty: 2,
    question: "Varför ger IT-investeringar i sig sällan långsiktig konkurrensfördel?",
    options: [
      { text: "IT-system har kort teknisk livslängd och måste bytas med några års mellanrum.", explain: "Livslängden varierar och är inte det principiella skälet i resonemanget." },
      { text: "IT-investeringar kräver kompetens som få organisationer lyckas bygga upp internt.", explain: "Kompetens är en del av svaret, men inte förklaringen till att tekniken ensam inte räcker." },
      { text: "IT-avdelningen har sällan tillräcklig insyn i verksamhetens strategiska prioriteringar.", explain: "Bristande insyn är ett alignmentproblem snarare än förklaringen till uteblivet försprång." },
      { text: "Tekniken kan köpas och kopieras, medan kombinationen med processer inte kan.", explain: "Rätt. Fördelen ligger i komplementära, svårimiterade organisatoriska resurser." }
    ],
    correct: 3, source: "Henderson & Venkatraman / Barney (2024)", reviewed: true },

  { id: "str-q49", topic: "it", difficulty: 3,
    question: "Varför beskrivs strategic alignment som en kontinuerlig process?",
    options: [
      { text: "Eftersom både strategi, teknik och omvärld förändras och samspelet måste underhållas.", explain: "Rätt. Ett läge som var i samklang i fjol kan vara i otakt redan nästa år." },
      { text: "Eftersom modellens fyra domäner måste utvärderas i en fastställd årlig ordning.", explain: "Modellen föreskriver ingen sådan periodicitet eller ordningsföljd." },
      { text: "Eftersom IT-infrastrukturen kräver löpande underhåll för att förbli funktionsduglig.", explain: "Tekniskt underhåll är något annat än strategisk anpassning mellan domänerna." },
      { text: "Eftersom verksamhetens och IT-funktionens företrädare behöver mötas regelbundet.", explain: "Möten är ett medel; det är förändringstakten som gör processen kontinuerlig." }
    ],
    correct: 0, source: "Henderson & Venkatraman / föreläsning", reviewed: true },

  { id: "str-q50", topic: "mal", difficulty: 1,
    question: "Hur betraktas företaget i den neoklassiska teorin?",
    options: [
      { text: "Som ett öppet system med intressenter", explain: "Det är intressentmodellens bild, inte den neoklassiska." },
      { text: "Som en svart låda som omvandlar resurser", explain: "Rätt. Inflöde omvandlas till utflöde; hur det sker bortses från." },
      { text: "Som en koalition av olika intressegrupper", explain: "Det är beteendeteoriernas bild av företaget." },
      { text: "Som en samling perfekt rationella individer", explain: "Individerna bortses från helt i den neoklassiska modellen." }
    ],
    correct: 1, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q51", topic: "mal", difficulty: 1,
    question: "Vad är företagets mål enligt neoklassisk teori?",
    options: [
      { text: "Att maximera företagets vinst", explain: "Rätt. Vinsten är det enda målet och enda måttet på effektivitet." },
      { text: "Att optimera sina kassaflöden", explain: "Det är de kassaflödesbaserade modellernas mål." },
      { text: "Att nå en godtagbar vinstnivå", explain: "Det är satisfieringsmodellens mål." },
      { text: "Att balansera intressenters krav", explain: "Det är intressentmodellens mål." }
    ],
    correct: 0, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q52", topic: "mal", difficulty: 1,
    question: "Vilken teori säger att företag söker en tillfredsställande snarare än maximal vinst?",
    options: [
      { text: "Den neoklassiska teorin", explain: "Den antar tvärtom vinstmaximering." },
      { text: "Kassaflödesbaserad modell", explain: "Den maximerar nuvärdet av framtida kassaflöden." },
      { text: "Transaktionskostnadsteorin", explain: "Den förklarar företagets gränser, inte dess vinstmål." },
      { text: "Satisfieringsmodellen", explain: "Rätt. Simon: begränsad rationalitet ger en anspråksnivå i stället för maximum." }
    ],
    correct: 3, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q53", topic: "mal", difficulty: 1,
    question: "Vad är företagets huvudsakliga mål enligt intressentmodellen?",
    options: [
      { text: "Att minimera verksamhetens kostnader", explain: "Kostnadsminimering är inte modellens mål." },
      { text: "Att maximera försäljningsvolymen", explain: "Det är Baumols modell." },
      { text: "Att balansera intressenters krav", explain: "Rätt. Målet är en kompromiss som ger långsiktig stabilitet." },
      { text: "Att maximera ägarnas avkastning", explain: "Ägarna är en av flera intressenter, inte den enda." }
    ],
    correct: 2, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q54", topic: "it", difficulty: 1,
    question: "Vilken är en möjlig förklaring till produktivitetsparadoxen?",
    options: [
      { text: "Ny teknik ger alltid omedelbar effektivitetsvinst", explain: "Om det stämde skulle paradoxen inte finnas." },
      { text: "Anpassning av processer och organisation tar tid", explain: "Rätt. Vinsten kommer först när arbetssätten ändras." },
      { text: "Ny teknik påverkar bara små och medelstora företag", explain: "Paradoxen observerades i hela ekonomin." },
      { text: "Innovationer höjer lönsamheten helt automatiskt", explain: "Automatik är precis vad paradoxen motsäger." }
    ],
    correct: 1, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q55", topic: "mal", difficulty: 1,
    question: "Vad innebär den neoklassiska teorin om vinstmaximering?",
    options: [
      { text: "Företag strävar efter att maximera försäljningen", explain: "Försäljningsmaximering är Baumols modell." },
      { text: "Företag strävar efter att optimera kundnöjdhet", explain: "Kundnöjdhet är ett icke-finansiellt mål, inte modellens." },
      { text: "Företag strävar efter att minimera sina kostnader", explain: "Kostnader är ena sidan; målet är vinsten som helhet." },
      { text: "Företag strävar efter att maximera sin vinst", explain: "Rätt. Intäkt minus kostnad ska bli så stor som möjligt." }
    ],
    correct: 3, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q56", topic: "mal", difficulty: 1,
    question: "Vad fokuserar intressentmodellen på?",
    options: [
      { text: "Ett stabilt kassaflöde över tid", explain: "Kassaflödet hör till en annan modell." },
      { text: "Att begränsa ledningens inflytande", explain: "Ledningen är en intressent bland flera, inget som ska begränsas." },
      { text: "Att maximera ägarnas avkastning", explain: "Ägarna är bara en av intressenterna." },
      { text: "Balans mellan intressenternas krav", explain: "Rätt. Balansen ger företaget långsiktig stabilitet." }
    ],
    correct: 3, source: "Weaver, fö 1 / quiz F1", reviewed: true },

  { id: "str-q57", topic: "digital", difficulty: 2,
    question: "Vad kännetecknade de tidiga enterprise-systemen på 1960-talet?",
    options: [
      { text: "Standardsystem köpta färdiga från leverantörer och anpassade till verksamheten.", explain: "COTS-systemens genomslag kom först på 90-talet efter Clinger Cohen." },
      { text: "Egenutvecklade applikationer som hanterade en process i taget, var för sig.", explain: "Rätt. Lön, redovisning, lager — varje system för sig, hos storföretag och myndigheter." },
      { text: "Integrerade affärssystem som band samman företagets alla huvudprocesser.", explain: "Integrerade ERP-system är en 90-talslösning på det tidigare kaoset." },
      { text: "Persondatorbaserade lösningar som spreds snabbt till små och medelstora företag.", explain: "PC:n kom på 80-talet; de tidiga systemen körde på stordatorer." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q58", topic: "digital", difficulty: 2,
    question: "Vilken orsak anger föreläsningen till 80- och 90-talets 'enterprise application spaghetti'?",
    options: [
      { text: "Att företagen leddes av en generation som inte såg IT som en strategisk fråga.", explain: "Rätt. IT hamnade i en silo utan koppling till kärnaffären." },
      { text: "Att lagstiftningen krävde separata system för olika typer av affärsdata.", explain: "Reglering var inte drivkraften bakom systemkaoset." },
      { text: "Att stordatorernas kapacitet inte räckte för integrerade lösningar.", explain: "Problemet var organisatoriskt, inte tekniskt." },
      { text: "Att leverantörerna medvetet byggde system som inte kunde kommunicera.", explain: "Inlåsning fanns, men föreläsningen pekar på företagens egna satsningar." }
    ],
    correct: 0, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q59", topic: "digital", difficulty: 2,
    question: "Vem formulerade 1987 att datoråldern syns överallt utom i produktivitetsstatistiken?",
    options: [
      { text: "Michael Porter, i samband med analysen av branschers konkurrenskrafter.", explain: "Porter arbetade med positionering, inte med produktivitetsstatistik." },
      { text: "Alfred Chandler, i argumentet om att struktur följer strategi.", explain: "Chandlers bidrag rör organisationens struktur, inte IT-produktivitet." },
      { text: "Robert Solow, som sammanfattade produktivitetsparadoxen i en mening.", explain: "Rätt. Citatet är föreläsningens illustration av paradoxen." },
      { text: "Henderson och Venkatraman, i modellen om strategic alignment.", explain: "Deras bidrag kom 1993 och handlade om lösningen, inte problemet." }
    ],
    correct: 2, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q60", topic: "digital", difficulty: 2,
    question: "Vilka tre idéer pekar föreläsningen ut som lösningen på produktivitetsparadoxen?",
    options: [
      { text: "Outsourcing, standardisering och centraliserad IT-avdelning.", explain: "Outsourcing var en av metoderna, men inte en av de tre bärande idéerna." },
      { text: "Kärnkompetens, strategic alignment och IT governance.", explain: "Rätt. IT kopplades till affärsstrategin genom dessa tre." },
      { text: "Moores lag, persondatorn och internet som infrastruktur.", explain: "Det är teknikens utveckling, som snarare skapade paradoxen." },
      { text: "Balanserat styrkort, benchmarking och målkostnadskalkyl.", explain: "Detta är styrmetoder ur AJK, inte föreläsningens svar." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q61", topic: "digital", difficulty: 2,
    question: "Vad innebar Clinger Cohen Act 1996 enligt föreläsningen?",
    options: [
      { text: "Att amerikanska myndigheter förbjöds använda standardsystem från privata leverantörer.", explain: "Tvärtom: COTS-system fick stort genomslag." },
      { text: "Att CIO-rollen legitimerades och Enterprise Architecture etablerades som disciplin.", explain: "Rätt. Dessutom IT governance, COTS och strategic alignment som centralt koncept." },
      { text: "Att EU och USA enades om gemensamma regler för dataskydd i offentlig sektor.", explain: "Lagen var amerikansk och rörde IT-styrning, inte dataskydd." },
      { text: "Att IT-avdelningar skulle rapportera till ekonomichefen i stället för till vd.", explain: "Poängen var det motsatta: IT lyftes till strategisk ledningsnivå." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q62", topic: "digital", difficulty: 3,
    question: "Vilka fyra delar ingår i 'the AI factory' enligt Iansiti och Lakhani?",
    options: [
      { text: "Data pipeline, algorithm development, experimentation platform, IT infrastructure.", explain: "Rätt. Tillsammans gör de beslutsfattande till en industriell process." },
      { text: "Data defense, data offense, single source of truth, multiple versions of the truth.", explain: "Det är begrepp ur datastrategin och den AI-anpassade organisationen." },
      { text: "Affärsstrategi, IT-strategi, organisationsinfrastruktur, IT-infrastruktur.", explain: "Det är Strategic Alignment Models fyra domäner." },
      { text: "Datainsamling, regelefterlevnad, modellträning, kundgränssnitt och support.", explain: "Regelefterlevnad och kundgränssnitt ingår inte i modellen." }
    ],
    correct: 0, source: "Weaver, fö 1 / Iansiti & Lakhani", reviewed: true },

  { id: "str-q63", topic: "digital", difficulty: 2,
    question: "Vad hör till data defense i DalleMule och Davenports datastrategi?",
    options: [
      { text: "Data mining, BI och maskininlärning för att maximera avkastningen på data.", explain: "Det är data offense — att maximera datans ROI." },
      { text: "Datainsamlingsstrategier och integration av externa datakällor i analysen.", explain: "Datainsamling hör till offense-sidan." },
      { text: "Multiple versions of the truth anpassade för olika delar av verksamheten.", explain: "MVoT är offense; defense bygger på single source of truth." },
      { text: "Regelefterlevnad, intrångsskydd och dataintegritet via en gemensam sanning.", explain: "Rätt. Defense minimerar datarisk; SSoT är dess grund." }
    ],
    correct: 3, source: "Weaver, fö 1 / DalleMule & Davenport", reviewed: true },

  { id: "str-q64", topic: "digital", difficulty: 3,
    question: "Vilken sektor ligger enligt föreläsningen i high-stakes-änden av datastrategins riskspektrum?",
    options: [
      { text: "Detaljhandel och onlinetjänster, där kunddata utgör kärnan i hela affären.", explain: "Detaljhandel ligger i low-stakes-änden där offense väger tyngre." },
      { text: "Sjukvård, rättsväsende och socialtjänst, där felaktig data får allvarliga följder.", explain: "Rätt. Här dominerar data defense." },
      { text: "Media och underhållning, där personuppgifter används för rekommendationer.", explain: "Media räknas till low stakes tillsammans med detaljhandel." },
      { text: "Tillverkningsindustrin, där produktionsdata styr automatiserade processer.", explain: "Tillverkning nämns inte som high-stakes-exempel i föreläsningen." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q65", topic: "mal", difficulty: 3,
    question: "Vad förklarar transaktionskostnadsteorin?",
    options: [
      { text: "Varför företag existerar och var gränsen mellan företag och marknad dras.", explain: "Rätt. Marknadens transaktionskostnader gör intern samordning effektivare — till en gräns." },
      { text: "Varför företagsledningen maximerar sin egen nytta snarare än vinsten.", explain: "Det är företagsledarmodellernas fråga." },
      { text: "Varför företag söker en tillfredsställande i stället för maximal vinst.", explain: "Det är satisfieringsmodellen." },
      { text: "Varför marknaden självreglerar när individer följer sitt egenintresse.", explain: "Det är den neoklassiska osynliga handen." }
    ],
    correct: 0, source: "Weaver, fö 1", reviewed: true },

  { id: "str-q66", topic: "digital", difficulty: 3,
    question: "Vad menar föreläsningen med att komplexiteten i IT-landskapet är kumulativ?",
    options: [
      { text: "Att kostnaden för IT-projekt ökar exponentiellt med antalet inblandade leverantörer.", explain: "Kostnadsutveckling är inte det som avses med kumulativ." },
      { text: "Att varje ny teknikepok lägger ett lager ovanpå de tidigare, som ligger kvar.", explain: "Rätt. Spagetti, ERP, SOA, moln, AI — inget försvinner, allt ska integreras." },
      { text: "Att allt fler användare gör systemen svårare att administrera och säkra.", explain: "Användarantal är inte föreläsningens poäng." },
      { text: "Att äldre system måste ersättas helt innan nya kan införas i verksamheten.", explain: "Tvärtom: legacysystemen blir kvar och skapar komplexiteten." }
    ],
    correct: 1, source: "Weaver, fö 1", reviewed: true }
];
