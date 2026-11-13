// Säkerhet i informationssystem: kursens två inlämningsuppgifter, samlade
// ur uppgiftsbeskrivningarna i Canvas (13 nov 2026). Bara kraven — själva
// underlaget (rapporten och videorna i Hugging Face-uppgiften) är länkat i
// Canvas och finns inte här. Fältuppgiftens deadline står inte i
// beskrivningen: "Se Canvas" tills den är känd.
//
// Form: { id, title (uppgiftens namn i Canvas), kind, deadline (text eller
// null), available, sections: [{ heading, points }], grading? }

export const assignments = [
  {
    id: "hugging-face",
    title: "The Hugging Face Ethical Reflection",
    kind: "Individuell rapport",
    deadline: "16 dec 2026 kl. 23:59",
    available: "Öppen 7 nov – 16 dec 2026 kl. 23:59, med obegränsat antal inlämningsförsök.",
    sections: [
      {
        heading: "Uppgiften",
        points: [
          "Resonera om vad OpenAI är skyldigt Hugging Face och samhället efter incidenten där en autonom agent tog sig ut ur sin testmiljö och var inne i Hugging Faces system i cirka 4,5 dagar.",
          "Avsluta med två konkreta rekommendationer för hur cybersäkerhet ska ses parallellt med teknisk innovation.",
        ],
      },
      {
        heading: "Omfång och struktur",
        points: [
          "1 500 ord exklusive referenser.",
          "Tre delar: Introduction to the Incident, Critical Reflection, Conclusion.",
        ],
      },
      {
        heading: "Källor",
        points: [
          "Minst 5 trovärdiga källor, varav Hugging Faces eller OpenAI:s egna uttalanden om incidenten.",
          "Referenser enligt APA 7.",
          "Redovisa din AI-användning enligt kursens policy.",
        ],
      },
      {
        heading: "Underlag",
        points: ["Rapporten och två videor om incidenten är länkade i Canvas."],
      },
    ],
  },
  {
    id: "field",
    title: "Field-Based Information Security Strategy",
    kind: "Rapport",
    deadline: null,
    available: null,
    sections: [
      {
        heading: "Scenariot",
        points: [
          "Du är nyanställd CISO på valfritt företag (till exempel IKEA, ICA eller ett lokalt logistikföretag) som byter till ett modernt integrerat IT-system.",
        ],
      },
      {
        heading: "Del 1: Risk",
        points: [
          "Underlag: minst en intervju, observation eller fördjupad analys av sekundärkällor.",
          "Identifiera tre stora risker och prioritera dem med ett erkänt ramverk (ISO 27005 eller NIST SP 800-30).",
          "Föreslå åtgärder. Avsluta med kritisk reflektion.",
        ],
      },
      {
        heading: "Del 2: Dataskydd",
        points: [
          "Granska ett verkligt företags integritetspolicy, GDPR-redogörelse eller AI-etiska riktlinjer.",
          "Föreslå ett kompletterande angreppssätt för CIA för kund- och leverantörsdata, med konkreta kontroller (till exempel kryptering och åtkomstkontroll).",
          "Koppla till GDPR och AI-förordningen och till europeiska värden: transparens, rättvisa och mänsklig värdighet. Avsluta med kritisk reflektion.",
        ],
      },
      {
        heading: "Del 3: Medvetenhet",
        points: [
          "Gör en minienkät eller informella intervjuer med anställda (eller studenter som spelar anställda).",
          "Utforma ett program för säkerhetsmedvetenhet anpassat efter företagets kultur: format (workshops, simuleringar, e-learning) och ämnen (till exempel phishing, svaga lösenord och AI-risker).",
          "Avsluta med kritisk reflektion.",
        ],
      },
      {
        heading: "Omfång och form",
        points: [
          "2 000–2 200 ord exklusive bilder, tabeller och referenser. Lämnas in som PDF.",
          "Mallen: en fältarbetsöversikt (namn, kurskod, datum, plats, typ av fältarbete, organisation eller person), kort om företaget, sedan del 1–3.",
        ],
      },
      {
        heading: "Källor",
        points: ["Minst 2 fältbaserade källor och minst 3 akademiska och regulatoriska referenser."],
      },
    ],
    grading: {
      heading: "Bedömning",
      points: [
        "Strategins kvalitet och genomförbarhet: 40 %",
        "Användning av ramverk och standarder: 30 %",
        "Medvetenhetsprogrammet: 30 %",
      ],
      note: "Metoden bedöms inte.",
    },
  },
];
