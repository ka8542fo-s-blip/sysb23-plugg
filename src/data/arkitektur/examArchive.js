// Fliken Tenta för Verksamhetsarkitektur: de tre HT25-tentorna i tentans
// ordning, som översikt. Zachman-delarna pekar på Essä (uppgift 1) och på
// Zachman-vyns placeringsuppgifter (uppgift 2, maj 2–8). Artikelfrågorna
// (sant/falskt om Kotusev, Kappelman & Zachman, Gerber, Marth, Tamm, Gong &
// Janssen, Martínez López) står ordagrant men utan facit: artiklarna ingår
// inte i HT26-materialet, och inget facit får gissas. De räknas inte in i
// någon poäng. Tentornas egna egenheter står kvar (okt: uppgift 5 och 10 har
// samma text, position 25 heter "Uppgift 27"; dec: uppgift 3 har två
// påståenden). Texten är utläst ur tentornas PDF:er 2026-11-13.
//
// Del: { no, points, kind: "essay" | "zachman" | "statement", text,
//   essayId? | taskIds?, intro?, extra?, label?, pass? }
export const examArchive = [
  {
    "id": "ea-ht25-okt",
    "title": "Ordinarie tenta",
    "date": "2025-10-17",
    "dateLabel": "17 oktober 2025",
    "parts": [
      {
        "no": 1,
        "points": 30,
        "kind": "essay",
        "essayId": "ea-e-zachman",
        "text": "Beskriv och förklara raderna och kolumnerna i Zachmans ramverk. Beskrivs i Finkelstein kap 1 samt i flertalet av artiklarna (inklusive föreläsningsmaterial). Förutom vad raderna och kolumnerna heter och vad de har/kan ha för innehåll, skall för höga poäng även perspektiven förklaras - T.ex. vad är Planner? - Och exempel på cellinnehåll ges - listor på rad 1, konceptuella modeller på rad 2 o.s.v.",
        "pass": "Minst 15 p för godkänt"
      },
      {
        "no": 2,
        "points": 20,
        "kind": "zachman",
        "taskIds": [
          "zp-organisationsdiagram",
          "zp-java",
          "zp-natverk",
          "zp-granssnitt",
          "zp-arbetsflode",
          "zp-regler",
          "zp-processmodell",
          "zp-logistik",
          "zp-relationsscheman",
          "zp-affarshandelser"
        ],
        "text": "Placera följande modeller eller beskrivningar i lämplig cell eller celler i Zachmans ramverk. Ge en motivering/förklaring till vart och ett av dina val."
      },
      {
        "no": 3,
        "points": 2,
        "kind": "statement",
        "text": "I sin primära studie skriver Kotusev et al. (2023b) att det finns två typer av EA-artefakter: Primära och understödjande. Primära är dem som direkt bidrar till jämkning mellan verksamhet och IT genom relevanta beskrivningar. Sekundära är de som understödjer de första genom till exempel modelleringsverktyg."
      },
      {
        "no": 4,
        "points": 2,
        "kind": "statement",
        "text": "Enligt Kotusev et al. (2022) är EA-artefakter olika representationer som används i arkitekturarbete."
      },
      {
        "no": 5,
        "points": 2,
        "kind": "statement",
        "text": "Kotusev et al. (2023a) finner att EA i den akademiska litteraturen ofta endast ses som en mängd EA-artefakter och att den praktikerorienterade litteraturen nästan uteslutande fokuserar på explicit kunskap och därmed ignorerar den tysta/tacita kunskapen."
      },
      {
        "no": 6,
        "points": 2,
        "kind": "statement",
        "text": "I Kotusev et al. (2023a) är de EA-artefakter som är inriktade mot framtiden mer länkade till explicit än tyst kunskap, vilket möjliggör en kodifierad snarare än personaliserad process."
      },
      {
        "no": 7,
        "points": 2,
        "kind": "statement",
        "text": "Kappelman och Zachman (2013) skriver att Zachmans modell, d.v.s ramverket ZEF, på ett korrekt sätt ofta förstås som en metod eller modell över en process."
      },
      {
        "no": 8,
        "points": 2,
        "kind": "statement",
        "text": "Kappelman och Zachman (2013) framhäver att den stora fördelen med ZEF är dess fokus på komplexa helheter och system, snarare än ett reduktionistiskt och atomärt fokus på enskildheter i verksamheter."
      },
      {
        "no": 9,
        "points": 2,
        "kind": "statement",
        "text": "Enligt studien av Kotusev et al. (2023a) är det främst s.k. \"tyst kunskap\" (tacit knowledge) som stöds av nulägesinriktade EA-artefakter och specialiserade stödsystem för dessa."
      },
      {
        "no": 10,
        "points": 2,
        "kind": "statement",
        "text": "Kotusev et al. (2023a) finner att EA i den akademiska litteraturen ofta endast ses som en mängd EA-artefakter och att den praktikerorienterade litteraturen nästan uteslutande fokuserar på explicit kunskap och därmed ignorerar den tysta/tacita kunskapen."
      },
      {
        "no": 11,
        "points": 2,
        "kind": "statement",
        "text": "Kotusev et al. (2022) beskriver sex övergripande typer av EA-artefakter. Tre av dessa är fokuserade på verksamheten, typiskt kortfattat utformade och använder språk ämnade för personer i ledande ställning. De tre övriga är riktade mot IT och är mer omfattande och använder IT-specifikt språkbruk."
      },
      {
        "no": 12,
        "points": 2,
        "kind": "statement",
        "text": "I Kotusev et al. (2023a) är de EA-artefakter som är inriktad mot framtiden mer länkade till tyst än explicit kunskap, vilket kräver en personifierad process med aktivt engagemang av relevanta intressenter."
      },
      {
        "no": 13,
        "points": 2,
        "kind": "statement",
        "text": "Enligt Kotusev et al. (2022) är en EA-artefakt resultatet av att ha utformat något efter en arkitektur, det som Zachman kallar för instans av arkitektur."
      },
      {
        "no": 14,
        "points": 2,
        "kind": "statement",
        "text": "Enligt studien av Kotusev et al. (2023b) att endast två typer av EA-artefakter, Business Capability Model och Roadmap, fungerar som s.k. boundary objects för att överbrygga kommunikations- och samarbetsklyftan mellan olika arbetsgemenskaper i organisationer."
      },
      {
        "no": 15,
        "points": 2,
        "kind": "statement",
        "text": "Kappelman och Zachman (2013) anser att Zachmans ontologi, d.v.s ramverket ZEF, som minst är ett tankeredskap för beslutsfattare på alla nivåer, så att dessa kan försäkra sig om grundlighet och fullständighet i olika överväganden och beslutssituationer."
      },
      {
        "no": 16,
        "points": 2,
        "kind": "statement",
        "text": "Boundary objects i Kotusev et al. (2023b) är, som ordet antyder, gränsöverskridande artefakter eller materiella objekt som understödjer kommunikation och samarbete mellan skilda sociala arbetsgemenskaper."
      },
      {
        "no": 17,
        "points": 2,
        "kind": "statement",
        "text": "Enligt Kotusev et al. (2022) är EA-artefakter resultatet av beslut ledare har tagit."
      },
      {
        "no": 18,
        "points": 2,
        "kind": "statement",
        "text": "Zachman (1987) framför att olika representationer (ritningar, modeller) för olika perspektiv (rader) i hans ramverk skiljer sig åt i natur och essens, och att detaljgraden ökar ju längre ned i ramverket man kommer."
      },
      {
        "no": 19,
        "points": 2,
        "kind": "statement",
        "text": "Liksom Banaeianjahromi och Smolander (2017) kommer Gong och Janssen (2022) fram till att en av de viktigaste förklaringarna till misslyckanden med EA-initiativ är högre lednings brist på kunskap och förståelse för EA, vilket har både direkt och indirekt påverkan på andra faktorer."
      },
      {
        "no": 20,
        "points": 2,
        "kind": "statement",
        "text": "Enligt studien av Marth et al. (2020) är den huvudsakliga uppgiften för en Enterprise-arkitekt att leda arkitekturarbetet och förankra visionen om arkitekturen hos relevanta beslutsfattare och andra intressenter."
      },
      {
        "no": 21,
        "points": 2,
        "kind": "statement",
        "text": "Tamm, Seddon och Shanks (2022) beskriver EABMM och att tillgången till och kvaliteten på EA-tjänster i verksamheten som den enda organisatoriska faktorn som driver verksamhetens nytta av EA."
      },
      {
        "no": 22,
        "points": 2,
        "kind": "statement",
        "text": "Enligt studien av Martínez López et al. (2023) verkar EA:s bidrag till mjukvaruprocesser vara mer kopplat till de senare faserna i mjukvarulivscykeln."
      },
      {
        "no": 23,
        "points": 2,
        "kind": "statement",
        "text": "Enligt studien av Tamm et al. (2022) utvecklar modellen EABMM och enligt den är 'Kvaliteten på tillhandahållandet av EA-tjänster' starkast kopplad till EA-nyttan 'Kvaliteten på IS-beslutsfattande'. Den EA-nyttomekanism som är starkast kopplad till utfallet 'Organisatorisk nytta av EA' är dock 'IS-plattformens kvalitet'."
      },
      {
        "no": 24,
        "points": 2,
        "kind": "statement",
        "text": "Enligt Gerber et al. (2020) kan ZEFA/ZFEA inte ses som en teori utifrån Shirley Gregors taxonomi."
      },
      {
        "no": 25,
        "points": 2,
        "kind": "statement",
        "text": "I studien av Marth et al. (2020) framgår det att de praktiserande arkitekterna inte har en entydig definition av Enterprise Architect och att det saknas en allmänt accepterad uppfattning om rollens innebörd bland praktikerna.",
        "label": "rubriken på tentan säger Uppgift 27"
      },
      {
        "no": 26,
        "points": 2,
        "kind": "statement",
        "text": "Enligt Gerber et al. (2020) bör EA och specifikt ZEFA/ZFEA betraktas som en teori inom IS."
      },
      {
        "no": 27,
        "points": 2,
        "kind": "statement",
        "text": "Enligt Gerber et al. (2020) bygger EA på systemteori och systemtänkande, och ZEFA/ZFEA kan därför ses som en Typ II-teori utifrån Shirley Gregors taxonomi då ramverket ställer upp testbara påståenden."
      }
    ]
  },
  {
    "id": "ea-ht25-dec",
    "title": "Omtenta",
    "date": "2025-12-12",
    "dateLabel": "12 december 2025",
    "parts": [
      {
        "no": 1,
        "points": 30,
        "kind": "essay",
        "essayId": "ea-e-zachman",
        "text": "Denna fråga är obligatorisk med minst 15p för godkänt (totalt 30). Beskriv och förklara raderna och kolumnerna i Zachmans ramverk. Beskrivs i Finkelstein kap 1 samt i flertalet av artiklarna (inklusive föreläsningsmaterial). Förutom vad raderna och kolumnerna heter och vad de har/kan ha för innehåll, skall för höga poäng även perspektiven förklaras - T.ex. vad är Planner? - Och exempel på cellinnehåll ges - listor på rad 1, konceptuella modeller på rad 2 o.s.v.",
        "pass": "Minst 15 p för godkänt"
      },
      {
        "no": 2,
        "points": 20,
        "kind": "zachman",
        "taskIds": [
          "zp-uppdateringsbeslut",
          "zp-mjukvarusystem",
          "zp-natverk",
          "zp-granssnitt",
          "zp-ansvarsroller",
          "zp-regler",
          "zp-processmodell",
          "zp-ekonomisystem",
          "zp-relationsscheman",
          "zp-affarshandelser"
        ],
        "text": "Uppgiften ger 2p för rätt svar per deluppgift enligt nedan. Det går bra att besvara med två celler för varje delfråga om så motiveras. Placera följande modeller eller beskrivningar i lämplig cell eller celler i Zachmans ramverk. Ge en motivering/förklaring till vart och ett av dina val."
      },
      {
        "no": 3,
        "points": 3,
        "kind": "statement",
        "text": "I sin primära studie skriver Kotusev et al. (2023b) att det finns två typer av EA-artefakter: Primära och understödjande. Primära är dem som direkt bidrar till jämkning mellan verksamhet och IT genom relevanta beskrivningar. Sekundära är de som understödjer de första genom till exempel modelleringsverktyg.",
        "extra": [
          "Enligt Kotusev et al. (2022) är EA-artefakter olika representationer som används i arkitekturarbete."
        ],
        "intro": "Denna fråga är baserad på resonemang och slutssatser i Kappelman och Zachman (2013), Kotusev, Kurnia och Dilnutt (2022), (2023a) och (2023b). Stämmer dessa påståenden med deras diskussioner och slutsatser?"
      },
      {
        "no": 4,
        "points": 3,
        "kind": "statement",
        "text": "Enligt Kotusev et al. (2022) är EA-artefakter olika representationer som används i arkitekturarbete."
      },
      {
        "no": 5,
        "points": 3,
        "kind": "statement",
        "text": "Kotusev et al. (2023a) finner att EA i den akademiska litteraturen ofta endast ses som en mängd EA-artefakter och att den praktikerorienterade litteraturen nästan uteslutande fokuserar på explicit kunskap och därmed ignorerar den tysta/tacita kunskapen."
      },
      {
        "no": 6,
        "points": 3,
        "kind": "statement",
        "text": "I Kotusev et al. (2023a) är de EA-artefakter som är inriktade mot framtiden mer länkade till explicit än tyst kunskap, vilket möjliggör en kodifierad snarare än personaliserad process."
      },
      {
        "no": 7,
        "points": 3,
        "kind": "statement",
        "text": "Kappelman och Zachman (2013) skriver att Zachmans modell, d.v.s ramverket ZEF, på ett korrekt sätt ofta förstås som en metod eller modell över en process."
      },
      {
        "no": 8,
        "points": 3,
        "kind": "statement",
        "text": "I studien av Marth et al. (2020) framgår det att de praktiserande arkitekterna inte har en entydig definition av Enterprise Architect och att det saknas en allmänt accepterad uppfattning om rollens innebörd bland praktikerna."
      },
      {
        "no": 9,
        "points": 3,
        "kind": "statement",
        "text": "Kappelman och Zachman (2013) framhäver att den stora fördelen med ZEF är dess fokus på komplexa helheter och system, snarare än ett reduktionistiskt och atomärt fokus på enskildheter i verksamheter."
      },
      {
        "no": 10,
        "points": 3,
        "kind": "statement",
        "text": "Kotusev et al. (2022) beskriver sex övergripande typer av EA-artefekter. Tre av dessa är fokuserade på verksamhetssystem, typiskt kortfattat utformade och använder språk ämnade för personer i ledande ställning. De tre andra är riktade mot ledarskapsfrågor och är mer omfattande och använder ledarskapsorienterat språkbruk."
      },
      {
        "no": 11,
        "points": 3,
        "kind": "statement",
        "text": "Zachman (1987) framför att olika representationer (ritningar, modeller) för olika perspektiv (rader) i hans ramverk skiljer sig åt i natur och essens, och att detaljgraden ökar ju längre ned i ramverket man kommer.",
        "intro": "Kommande frågor är baserade på resonemang och slutsatser från Zachman (1987), Gerber, Le Roux, Kearney och van Der Merwe (2020), Marth, Ploder och Dilger (2020), Gong och Janssen (2022), Tamm, Seddon och Shanks (2022) och Martínez López, García, Ruiz och Vizcaíno (2023)."
      },
      {
        "no": 12,
        "points": 3,
        "kind": "statement",
        "text": "Liksom Banaeianjahromi och Smolander (2017) kommer Gong och Janssen (2022) fram till att en av de viktigaste förklaringarna till misslyckanden med EA-initiativ är högre lednings brist på kunskap och förståelse för EA, vilket har både direkt och indirekt påverkan på andra faktorer."
      },
      {
        "no": 13,
        "points": 3,
        "kind": "statement",
        "text": "Enligt studien av Marth et al. (2020) är den huvudsakliga uppgiften för en Enterprise-arkitekt att leda arkitekturarbetet och förankra visionen om arkitekturen hos relevanta beslutsfattare och andra intressenter."
      },
      {
        "no": 14,
        "points": 3,
        "kind": "statement",
        "text": "Tamm, Seddon och Shanks (2022) beskriver EABMM och att tillgången till och kvaliteten på EA-tjänster i verksamheten som den enda organisatoriska faktorn som driver verksamhetens nytta av EA."
      },
      {
        "no": 15,
        "points": 3,
        "kind": "statement",
        "text": "Enligt studien av Martínez López et al. (2023) verkar EA:s bidrag till mjukvaruprocesser vara mer kopplat till de senare faserna i mjukvarulivscykeln."
      },
      {
        "no": 16,
        "points": 3,
        "kind": "statement",
        "text": "Enligt studien av Tamm et al. (2022) utvecklar modellen EABMM och enligt den är 'Kvaliteten på tillhandahållandet av EA-tjänster' starkast kopplad till EA-nyttan 'Kvaliteten på IS-beslutsfattande'. Den EA-nyttomekanism som är starkast kopplad till utfallet 'Organisatorisk nytta av EA' är dock 'IS-plattformens kvalitet'."
      },
      {
        "no": 17,
        "points": 3,
        "kind": "statement",
        "text": "Enligt Gerber et al. (2020) kan ZEFA/ZFEA inte ses som en teori utifrån Shirley Gregors taxonomi."
      },
      {
        "no": 18,
        "points": 3,
        "kind": "statement",
        "text": "Enligt Gerber et al. (2020) bör EA och specifikt ZEFA/ZFEA betraktas som en teori inom IS."
      },
      {
        "no": 19,
        "points": 2,
        "kind": "statement",
        "text": "Enligt Gerber et al. (2020) bygger EA på systemteori och systemtänkande, och ZEFA/ZFEA kan därför ses som en Typ II-teori utifrån Shirley Gregors taxonomi då ramverket ställer upp testbara påståenden."
      }
    ]
  },
  {
    "id": "ea-ht25-maj",
    "title": "Uppsamlingstenta",
    "date": "2026-05-21",
    "dateLabel": "21 maj 2026",
    "parts": [
      {
        "no": 1,
        "points": 30,
        "kind": "essay",
        "essayId": "ea-e-zachman",
        "text": "Beskriv och redogör tydligt för Zachmans ramverk i sin helhet. (30p)"
      },
      {
        "no": 2,
        "points": 3,
        "kind": "zachman",
        "taskIds": [
          "zm-2"
        ],
        "text": "I verksamheten finns en arbetsuppgift som är kopplad till användargränssnittet för en funktion för inläggning av kundordern i orderhanteringsdelen av ett ERP. Det är en orderhanterare som använder funktionen för arbetsuppgiften. Vilken/vilka cell/celler i ramverket överrensstämmer bäst. (3p) Välj ett eller flera alternativ: R3K2, R3K6 R4K4, R2K2, R2K4 R4K4, R2K2, R3K4, R3K6 Inget av de övriga alternativen"
      },
      {
        "no": 3,
        "points": 3,
        "kind": "zachman",
        "taskIds": [
          "zm-3"
        ],
        "text": "Ordern har ordernummer och gäller produkter med: varugruppsnummer (FK), produktnummer (PK) och produktbenämning. Vilken cell/celler tillhör ordern? (3p) Välj ett eller flera alternativ: R2K1 Inget av de övriga alternativen R1K1 R4K1"
      },
      {
        "no": 4,
        "points": 3,
        "kind": "zachman",
        "taskIds": [
          "zm-4"
        ],
        "text": "Styrelsen har givit VD och områdescheferna uppdraget att utveckla en ny strategisk plan för verksamheterna i Y-stad och X-löv efter sammanslagningen med en konkurrent i V-löv. Vilken cell/celler tillhör ordern? (3p) Välj ett eller flera alternativ: R2K6, R1K4, R3K1 Inget av de övriga alternativen. R2K6, R1K4, R1K3 R1K6, R1K4"
      },
      {
        "no": 5,
        "points": 3,
        "kind": "zachman",
        "taskIds": [
          "zm-5"
        ],
        "text": "Leveransen av ordern sker från lokalt lager. Om varan bristas (färre i lager än antalet i orderraden) dellevereras ordern från lokalt lager och bristade artiklar restnoteras i ordern. Bristade artiklar beställs från centralt lager för leverans till lokalt lager. Restnoterade artiklar levereras direkt från centralt lager till kund. Vilken cell/celler tillhör ordern? (3p) Välj ett eller flera alternativ: R2K3, R2K2, R2K6 Inget av de övriga alternativen. R2K6, R1K3 R3K3, R2K2"
      },
      {
        "no": 6,
        "points": 3,
        "kind": "zachman",
        "taskIds": [
          "zm-6"
        ],
        "text": "Produktionen i Ö-stad kör tvåskift: 05:36 till 14:24 och 14:24 till 23:12. Skiftlag A jobbar 05:36 till 14:24 udda veckor och skiftlag B jobbar 05:36 till 14:24 jämna veckor. Vilken/vilka celler hör uppgiften hemma i? (3p) Välj ett eller flera alternativ: Inget av de övriga alternativen R2K5, R1K4, R1K3. R2K5, R2K4 R2K5, R1K3"
      },
      {
        "no": 7,
        "points": 3,
        "kind": "zachman",
        "taskIds": [
          "zm-7"
        ],
        "text": "I ett användningsfall (UML Use Case) för ett av systemen som används i verksamheten finns aktörerna säljare och ordermottagare. I fallet interagerar aktörerna med systemet genom dess funktioner för ’söka kund’, ’visa kund’, ’lägga upp kund’, ’lägga upp konto’ och ’lägga in order’. Vilken/vilka celler överensstämmer? (3p) Välj ett eller flera alternativ: R2K4, R3K3, R4K4 R2K4, R3K3 Inget av de övriga alternativen. R1K4, R3K2, R4K4, R3K3"
      },
      {
        "no": 8,
        "points": 2,
        "kind": "zachman",
        "taskIds": [
          "zm-8"
        ],
        "text": "Ett Gantt-schema för införandet av en ny produkt består av en mängd aktiviteter med start- och slutdatum och milstolpar med datum. Välj det alternativ för inplacering som du tycker stämmer bäst. (2p) Välj ett eller flera alternativ: Inget av de övriga alternativen. R2K5 R3K3, R3K4 R2K6"
      },
      {
        "no": 9,
        "points": 4,
        "kind": "statement",
        "text": "Enligt Kotusev et al. (2022) är EA-artefakter resultatet av beslut ledare har tagit."
      },
      {
        "no": 10,
        "points": 4,
        "kind": "statement",
        "text": "Boundary objects i Kotusev et al. (2023b) är, som ordet antyder, gränsöverskridande artefakter eller materiella objekt som understödjer kommunikation och samarbete mellan skilda sociala arbetsgemenskaper."
      },
      {
        "no": 11,
        "points": 4,
        "kind": "statement",
        "text": "Kappelman och Zachman (2013) anser att Zachmans ontologi, d.v.s ramverket ZEF, som minst är ett tankeredskap för beslutsfattare på alla nivåer, så att dessa kan försäkra sig om grundlighet och fullständighet i olika överväganden och beslutssituationer."
      },
      {
        "no": 12,
        "points": 4,
        "kind": "statement",
        "text": "Enligt studien av Kotusev et al. (2023b) att endast två typer av EA-artefakter, Business Capability Model och Roadmap, fungerar som s.k. boundary objects för att överbrygga kommunikations- och samarbetsklyftan mellan olika arbetsgemenskaper i organisationer."
      },
      {
        "no": 13,
        "points": 4,
        "kind": "statement",
        "text": "Enligt Kotusev et al. (2022) är en EA-artefakt resultatet av att ha utformat något efter en arkitektur, det som Zachman kallar för instans av arkitektur."
      },
      {
        "no": 14,
        "points": 4,
        "kind": "statement",
        "text": "I Kotusev et al. (2023a) är de EA-artefakter som är inriktad mot framtiden mer länkade till tyst än explicit kunskap, vilket kräver en personifierad process med aktivt engagemang av relevanta intressenter."
      },
      {
        "no": 15,
        "points": 4,
        "kind": "statement",
        "text": "Kotusev et al. (2022) beskriver sex övergripande typer av EA-artefakter. Tre av dessa är fokuserade på verksamheten, typiskt kortfattat utformade och använder språk ämnade för personer i ledande ställning. De tre övriga är riktade mot IT och är mer omfattande och använder IT-specifikt språkbruk."
      },
      {
        "no": 16,
        "points": 4,
        "kind": "statement",
        "text": "Kotusev et al. (2023a) finner att EA i den akademiska litteraturen ofta endast ses som en mängd EA-artefakter och att den praktikerorienterade litteraturen nästan uteslutande fokuserar på explicit kunskap och därmed ignorerar den tysta/tacita kunskapen."
      },
      {
        "no": 17,
        "points": 4,
        "kind": "statement",
        "text": "Enligt studien av Kotusev et al. (2023a) är det främst s.k. \"tyst kunskap\" (tacit knowledge) som stöds av nulägesinriktade EA-artefakter och specialiserade stödsystem för dessa."
      },
      {
        "no": 18,
        "points": 4,
        "kind": "statement",
        "text": "Kappelman och Zachman (2013) framhäver att den stora fördelen med ZEF är dess fokus på komplexa helheter och system, snarare än ett reduktionistiskt och atomärt fokus på enskildheter i verksamheter."
      },
      {
        "no": 19,
        "points": 4,
        "kind": "statement",
        "text": "Liksom Banaeianjahromi och Smolander (2017) kommer Gong och Janssen (2022) fram till att en av de viktigaste förklaringarna till misslyckanden med EA-initiativ är högre lednings brist på kunskap och förståelse för EA, vilket har både direkt och indirekt påverkan på andra faktorer."
      },
      {
        "no": 20,
        "points": 3,
        "kind": "statement",
        "text": "Tamm, Seddon och Shanks (2022) beskriver EABMM och att tillgången till och kvaliteten på EA-tjänster i verksamheten som den enda organisatoriska faktorn som driver verksamhetens nytta av EA."
      },
      {
        "no": 21,
        "points": 3,
        "kind": "statement",
        "text": "Enligt Gerber et al. (2020) bygger EA på systemteori och systemtänkande, och ZEFA/ZFEA kan därför ses som en Typ II-teori utifrån Shirley Gregors taxonomi då ramverket ställer upp testbara påståenden."
      }
    ]
  }
];

export const ARTICLE_NOTE = "Artikeln ingår inte i årets kurs, så det finns inget facit.";
