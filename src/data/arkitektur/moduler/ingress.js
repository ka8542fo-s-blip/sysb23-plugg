// Fliken Moduler, modulens början (Kaspers designbeslut 2026-11-22): varje
// modul inleds med en mening ur lärarens egen text, och modullistan är
// grupperad under lärarens tre föreläsningar. Inget här är ny text: varje
// mening står ordagrant i blocket `block` (både sv och en), och
// föreläsningarnas namn står i lärarens inledning (moduler.test.mjs vaktar
// båda).
//
// Ingressen är första meningen i modulens kärnbudskap. Bara modul 1 och 5
// har ett avsnitt med det namnet; de andra tar den mening ur motsvarande
// avsnitt (Kärnförklaring, Kärndefinition, Viktig poäng, Governance …) som
// bäst sammanfattar modulen, och modul 11 och 12 ur sin inledande text.
//
// Sedan 23 nov är de svenska textblocken en omskrivning av lärarens text
// (se tackning.js), så `sv` här följer den omskrivna meningen medan `en`
// är lärarens original ordagrant.
export const INGRESS = {
  kap1: {
    block: "m1-t3",
    sv: "En enterprise är vilken samling som helst av organisationer, organisatoriska enheter eller capabilities som har en gemensam uppsättning mål.",
    en: "An enterprise is any collection of organizations, organizational units, or capabilities that has a common set of goals.",
  },
  kap2: {
    block: "m2-t3",
    sv: "Arkitektur är inte bara en samling komponenter.",
    en: "Architecture is not simply a collection of components.",
  },
  kap3: {
    block: "m3-t2",
    sv: "Enterprise Architecture är praktiken att förstå, utforma, kommunicera och styra den grundläggande strukturen och utvecklingen hos en enterprise för att nå dess mål.",
    en: "Enterprise Architecture is the practice of understanding, designing, communicating and governing the fundamental structure and evolution of an enterprise to achieve its objectives.",
  },
  kap4: {
    block: "m4-t3",
    sv: 'Zachman säger inte: "Gör det här, sedan det här, sedan det här." Ramverket säger i stället: "Här är olika dimensioner och perspektiv genom vilka enterprisen kan beskrivas."',
    en: 'Zachman doesn\'t say: "Do this, then this, then this." Instead: "Here are different dimensions and perspectives through which the enterprise can be described."',
  },
  kap5: {
    block: "m5-t3",
    sv: "TOGAF-standarden ger en samlad vägledning och ett tillvägagångssätt för Enterprise Architecture.",
    en: "The TOGAF Standard provides a body of guidance and an approach for Enterprise Architecture.",
  },
  kap6: {
    block: "m6-t3",
    sv: "Dessa domäner är inte oberoende silor. De intressanta arkitektoniska frågorna gäller deras relationer.",
    en: "These domains are not independent silos. The interesting architectural questions concern their relationships.",
  },
  kap7: {
    block: "m7-t3",
    sv: "Capabilities är särskilt användbara eftersom de kan förbli relativt stabila även när organisationsstrukturer och processer förändras.",
    en: "Capabilities are particularly useful because they can remain relatively stable even when organizational structures and processes change.",
  },
  kap8: {
    block: "m8-t3",
    sv: "Governance svarar på: Vem har befogenhet att fatta vilka beslut, under vilka begränsningar?",
    en: "Governance answers: Who has the authority to make which decisions, under what constraints?",
  },
  kap9: {
    block: "m9-t2",
    sv: "Arkitekturen bör ge tillräcklig riktning utan att försöka förutse varje detalj år i förväg.",
    en: "Architecture should provide sufficient direction without attempting to predict every detail year in advance.",
  },
  kap10: {
    block: "m10-t2",
    sv: "Teknik ensam utgör inte transformation.",
    en: "Technology alone does not constitute transformation.",
  },
  kap11: {
    block: "m11-t1",
    sv: "VD:n säger: \"Vi behöver bli en digital bank inom två år.\"",
    en: "The CEO states: \"We need to become a digital bank within two years.\"",
  },
  kap12: {
    block: "m12-t1",
    sv: "Den här modulen är medvetet annorlunda. Den ber studenterna att integrera begrepp från de tidigare elva modulerna.",
    en: "This module is deliberately different. It asks students to integrate concepts from the previous eleven modules.",
  },
};

// Lärarens tre föreläsningar, med namnen som de står i inledningen.
export const FORELASNINGAR = [
  {
    nummer: 1,
    title: { sv: "Grunderna i Enterprise Architecture", en: "Foundations of Enterprise Architecture" },
    moduler: ["kap1", "kap2", "kap3", "kap4"],
  },
  {
    nummer: 2,
    title: { sv: "Arkitekturutveckling med TOGAF", en: "Architecture Development with TOGAF" },
    moduler: ["kap5", "kap6", "kap7", "kap8"],
  },
  {
    nummer: 3,
    title: { sv: "Enterprise Agility och digital transformation", en: "Enterprise Agility and Digital Transformation" },
    moduler: ["kap9", "kap10", "kap11", "kap12"],
  },
];

// Läraren ber studenterna börja i modul 12; inledningens hopfällda kort
// visar hans egna meningar om det.
export const BORJA_HAR = "kap12";
export const INLEDNING_UTDRAG = {
  sv: "Börja alltså med att analysera det som sägs inom föreläsning 3 modul 3 (i kapitel 12). Börja sedan med föreläsning 1, modul 1–4 (enligt nedan), och så vidare.",
  en: "So, start by analyze what is said within lecture 3 Modul 3 (in chapter 12). Then start with lecture 1 modules 1-4 (as seen below) and so on.",
};
