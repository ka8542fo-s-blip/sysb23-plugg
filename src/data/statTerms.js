// Förklaringar till statistiktermerna. Varje text är skriven mot hur
// siffran faktiskt räknas i lib/progress.js och lib/scoring.js — ändrar
// du beräkningen måste texten följa med.

export const statTerms = {
  svar: {
    term: "Svar totalt",
    text: "Antalet svar du lämnat — inte antalet frågor. Svarar du på samma fråga tre gånger räknas det som tre svar. Både Öva och Prov räknas in.",
  },
  traffsakerhet: {
    term: "Träffsäkerhet",
    text: "Andelen av dina svar som varit rätt, avrundat till hela procent. Räknas på alla svar, även upprepade svar på samma fråga, och både Öva och Prov ingår.",
  },
  fragorSedda: {
    term: "Frågor du sett",
    text: "Hur många av delkursens frågor du svarat på minst en gång. Varje fråga räknas en enda gång här, till skillnad från antalet svar.",
  },
  senasteProv: {
    term: "Senaste prov",
    text: "Betyget på det prov du senast lämnade in i den här delkursen. Alla dina prov listas under Statistik → Provhistorik.",
  },
  lastaKapitel: {
    term: "Lästa kapitel",
    text: "Kapitel du själv markerat som lästa med knappen längst ned i kapitlet. Ingenting markeras automatiskt av att du scrollat förbi.",
  },
  sqlLosta: {
    term: "Lösta SQL-övningar",
    text: "Övningar där du kört en fråga som gav rätt resultat. ”Med hjälp” betyder att du tryckte Visa lösning — de räknas som lösta men hålls isär, så att du ser vilka du bör återkomma till.",
  },
  fokusera: {
    term: "Fokusera här",
    text: "Ämnet där du har lägst träffsäkerhet just nu. Ett ämne måste ha minst fem svar för att komma i fråga, så att ett enstaka slarvfel inte pekar ut fel ämne.",
  },
  traffsakerhetAmne: {
    term: "Träffsäkerhet per ämne",
    text: "Andel rätt inom ämnet. Siffran efter visar antal svar och hur många frågor ämnet innehåller — ”8/4 svar” betyder alltså åtta svar på fyra frågor, eftersom frågor återkommer.",
  },
  provhistorik: {
    term: "Provhistorik",
    text: "Varje inlämnat prov med poäng av 60, procent och betyg. Poängen följer tentan: +6 för rätt svar, −1 för fel och 0 för överhoppad. Betygsgränserna går vid 50, 55, 65, 75 och 85 procent.",
  },
  tidKvar: {
    term: "Tid kvar per delkurs",
    text: "Dagar till delkursens ordinarie tenta enligt schemat, jämte hur långt du kommit i materialet. Omtentor räknas inte in här.",
  },
};
