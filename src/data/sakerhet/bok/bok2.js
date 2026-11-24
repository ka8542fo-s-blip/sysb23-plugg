// Bokens kapitel 2: Stallings & Brown, Cryptographic Tools (s. 81–130).
// Kapitel, ämne, ordlista och frågor; samlas av reading.js, topics.js och
// questions.js via bok/index.js. Skrivet med egna ord på tentans nivå,
// granskat mot boken 22 nov 2026 (ogranskat av Kasper). `notes` är
// källanteckningarna och visas inte.

const variant = (id, what) => ({ variantOf: id, source: `Variant av en tentafråga från förra året (${what})` });

export const chapter = {
  id: "bok2",
  kind: "bok",
  label: "Bokens kapitel 2",
  examArea: "Bokfrågor",
  focus: ["Public key in Cryptography / Encryption"],
  title: "Kryptografiska verktyg: symmetriskt, asymmetriskt och hashfunktioner",
  readingMinutes: 11,
  lead: "Vilka nycklar som används till vad: en delad hemlig nyckel i symmetrisk kryptering, ett nyckelpar i public-key-kryptering, och hur MAC, hashfunktioner, digitala signaturer och certifikat visar att data är äkta.",
  sources: ["Stallings & Brown kap. 2 (s. 81–130)", "Stallings & Brown kap. 21 (s. 1137–1138, man-in-the-middle)"],
  body: `
## Kärnan

- **Symmetric encryption** använder samma hemliga nyckel för att kryptera och dekryptera. Sändare och mottagare måste båda ha den, och ingen annan får känna till den.
- **Public-key encryption** (asymmetrisk kryptering) använder ett nyckelpar. Den **public key** får alla känna till och används för att kryptera till ägaren. Den **private key** känner bara ägaren.
- **Message authentication** visar att ett meddelande inte har ändrats och kommer från rätt avsändare. Verktygen är **message authentication code (MAC)**, **hash function** och **digital signature**.
- En digital signatur skapas med avsändarens privata nyckel och kontrolleras med avsändarens publika nyckel.
- Ett **public-key certificate** från en betrodd **certificate authority (CA)** intygar vem en publik nyckel tillhör.

## Symmetrisk kryptering

Symmetric encryption, också kallad conventional eller single-key encryption, är fortfarande den mest använda formen av kryptering. Den har fem beståndsdelar:

| Beståndsdel | Vad den är |
|---|---|
| **Plaintext** | det ursprungliga meddelandet eller de data som matas in |
| **Encryption algorithm** | ersätter och omvandlar klartexten |
| **Secret key** | styr exakt vad algoritmen gör; två olika nycklar ger två olika resultat |
| **Ciphertext** | det oläsliga resultatet, som beror på både klartexten och nyckeln |
| **Decryption algorithm** | i stort sett krypteringen baklänges: tar ciphertext och nyckel och ger tillbaka klartexten |

Två krav måste vara uppfyllda för säker användning:

1. **En stark algoritm.** Den som känner algoritmen och har krypterade texter, även med tillhörande klartext, ska ändå inte kunna dekryptera eller räkna ut nyckeln.
2. **Säker hantering av nyckeln.** Sändare och mottagare ska ha fått nyckeln på ett säkert sätt och hålla den hemlig. Den som har nyckeln och känner algoritmen kan läsa all trafik.

Algoritmen behöver alltså inte vara hemlig, men nyckeln måste vara det. Två personer klarar sig med en enda nyckel, som båda har. Att nyckeln delas mellan sändare och mottagare var svaret på en av förra årets tentafrågor.

Det finns två sätt att angripa:

| Angrepp | Hur det går till |
|---|---|
| **Cryptanalysis** | utnyttjar algoritmens egenskaper, kanske med kunskap om klartexten eller några par av klartext och ciphertext, för att få fram klartext eller nyckel |
| **Brute-force attack** | provar alla möjliga nycklar tills resultatet blir begriplig klartext; i genomsnitt måste hälften av nycklarna prövas |

Hittar angriparen nyckeln går alla meddelanden med den nyckeln att läsa, gamla som nya. Mot brute force hjälper en lång nyckel: DES:s nyckel är för kort i dag, medan nycklar på 128 bitar eller mer i praktiken inte går att knäcka med enbart brute force.

## Block cipher och stream cipher

| | **Block cipher** | **Stream cipher** |
|---|---|---|
| Bearbetar | ett block av fast storlek i taget, och ger ett lika stort block ut | en ström av data, ett element i taget, oftast en byte |
| Fördel | nycklar kan återanvändas | oftast snabbare och kräver mindre kod |
| Passar för | filöverföring, e-post och databaser | dataströmmar, till exempel en kommunikationskanal eller en webblänk |

- De viktigaste symmetriska algoritmerna är block ciphers: **DES** (nyckeln är för kort), **triple DES** (DES tre gånger, säker men långsam) och **AES**, som togs fram som ersättare.
- En stream cipher blandar klartexten med en **keystream**, en till synes slumpmässig ström som skapas ur nyckeln.

## Message authentication: MAC och hashfunktioner

Kryptering skyddar mot passiva attacker, alltså avlyssning. Mot aktiva attacker, där någon förfalskar data eller transaktioner, behövs **message authentication**. Den kontrollerar att innehållet inte har ändrats och att avsändaren är äkta, ibland också att meddelandet inte har fördröjts och spelats upp igen (replay).

**Message authentication code (MAC).** Sändaren räknar fram ett litet datablock ur meddelandet och en hemlig nyckel som bara sändaren och mottagaren delar. Mottagaren räknar om med samma nyckel och jämför. Stämmer koderna har meddelandet inte ändrats, och det kommer från avsändaren, eftersom ingen annan har nyckeln. MAC betyder här alltså inte mandatory access control från kapitlet om access control.

**Hash function.** En hashfunktion gör om ett meddelande av valfri storlek till ett **message digest** av fast längd, ett slags fingeravtryck. Till skillnad från en MAC tar den ingen hemlig nyckel. Hashvärdet skyddas i stället med kryptering eller med en delad hemlig nyckel som hashas tillsammans med meddelandet (**keyed hash MAC**, till exempel HMAC).

## Hashfunktionens egenskaper

En hashfunktion ska fungera på data av alla storlekar, ge ett resultat av fast längd och vara lätt att räkna ut. För säkerheten krävs dessutom tre egenskaper:

| Egenskap | Kallas också | Det ska vara praktiskt omöjligt att … |
|---|---|---|
| **Preimage resistant** | **one-way** | utifrån en hashkod hitta ett meddelande som ger den |
| **Second preimage resistant** | **weak collision resistant** | till ett givet meddelande hitta ett annat med samma hashkod |
| **Collision resistant** | **strong collision resistant** | hitta något par av olika meddelanden med samma hashkod |

- I weak är det ena meddelandet redan givet; i strong får angriparen välja båda fritt.
- Hashfunktioner används också för att lagra lösenord som hashvärden (se kapitlet om user authentication) och för att upptäcka intrång: spara hashvärdet för varje fil och jämför senare.
- Den mest använda familjen är **SHA** (Secure Hash Algorithm).

## Public-key-kryptering

**Public-key encryption**, eller asymmetric encryption, föreslogs av Diffie och Hellman 1976. Den använder två olika men sammanhörande nycklar: det som krypteras med den ena dekrypteras med den andra.

Beståndsdelarna är sex: plaintext, encryption algorithm, public key, private key, ciphertext och decryption algorithm. Skillnaden mot symmetrisk kryptering är att nyckeln har blivit ett par.

1. Varje användare skapar ett eget nyckelpar och lägger den publika nyckeln i ett offentligt register. Den privata behåller ägaren.
2. Bob vill skicka något som bara Alice ska kunna läsa. Han krypterar med **Alices publika nyckel**.
3. Alice dekrypterar med sin privata nyckel. Ingen annan kan, eftersom bara Alice har den.

De privata nycklarna skapas lokalt och behöver aldrig skickas till någon. Att den publika nyckeln är känd av alla och används för att kryptera till mottagaren var svaret på en av förra årets tentafrågor.

Paret fungerar också åt andra hållet. Krypterar någon med sin egen privata nyckel kan alla med den publika nyckeln dekryptera. Det ger ingen sekretess, men visar vem som har krypterat.

**Private key och secret key** är inte samma sak. Båda hålls hemliga, men en secret key är den nyckel två parter delar i symmetrisk kryptering, medan en private key är den halva av ett nyckelpar som bara ägaren känner.

Boken rättar tre missuppfattningar: public-key-kryptering är inte i sig säkrare, den har inte gjort symmetrisk kryptering överflödig (den kräver mycket mer beräkningar) och den gör inte nyckeldistributionen enkel.

Boken delar in användningen i tre:

| Användning | Vad den gör | Algoritmer |
|---|---|---|
| **Digital signature** | avsändaren signerar med sin privata nyckel | RSA, DSS |
| **Symmetric key distribution** | två parter kommer överens om en gemensam hemlig nyckel | RSA, Diffie–Hellman |
| **Encryption of secret keys** | en hemlig nyckel krypteras med mottagarens publika nyckel | RSA |

RSA är den mest använda och klarar alla tre. **Diffie–Hellman key exchange** klarar bara nyckelutbytet och DSS bara signaturer. Kort sagt används nyckelparet till sekretess, signaturer och nyckelutbyte.

## Digital signatur

Enligt NIST:s definition ger en digital signatur tre saker: att man kan kontrollera var data kommer ifrån (origin authentication), att de inte har ändrats (data integrity) och att den som signerat inte kan förneka det (non-repudiation).

1. Bob räknar fram ett hashvärde av meddelandet, till exempel med SHA.
2. Hashvärdet och Bobs **privata nyckel** ger signaturen, som skickas med meddelandet.
3. Alice räknar fram hashvärdet själv och kontrollerar signaturen med Bobs **publika nyckel**.

Ingen annan har Bobs privata nyckel, så ingen annan kan ha gjort en signatur som stämmer med hans publika nyckel.

En digital signatur ger **ingen confidentiality**. Meddelandet skyddas mot ändringar men inte mot avlyssning.

| Syfte | Avsändaren använder | Mottagaren använder |
|---|---|---|
| Sekretess med nyckelpar | mottagarens publika nyckel | sin egen privata nyckel |
| Digital signatur | sin egen privata nyckel | avsändarens publika nyckel |
| Symmetrisk kryptering och MAC | den delade hemliga nyckeln | samma delade hemliga nyckel |

## Certifikat, nyckelutbyte och digital envelope

**Problemet:** vem som helst kan påstå att en publik nyckel är Bobs. Tills Bob upptäcker förfalskningen kan förfalskaren läsa allt som krypteras till Bob och använda den falska nyckeln för att utge sig för honom.

**Lösningen** är ett public-key certificate: den publika nyckeln och ägarens användar-id, uppgifter om utfärdaren och hur länge certifikatet gäller, allt signerat av en betrodd tredje part. Oftast är det en certificate authority (CA), till exempel en myndighet eller en bank. CA:n signerar med sin privata nyckel, och den som vill använda nyckeln kontrollerar signaturen med CA:ns publika nyckel. Standardformatet heter **X.509** och används bland annat i TLS.

**Nyckelutbyte.** Symmetrisk kryptering kräver en delad hemlig nyckel för varje par av parter. Diffie–Hellman key exchange låter två parter komma överens om en sådan nyckel, men i sin enklaste form autentiserar den inte parterna.

Därför är det sårbart för en **man-in-the-middle attack**, som boken förklarar i ett senare kapitel om public-key-kryptografi. Angriparen fångar upp utbytet och gör upp en nyckel med var och en av parterna. Båda tror att de pratar direkt med varandra, men angriparen kan läsa, och om hen vill ändra, allt de skickar. Skyddet är digitala signaturer och certifikat. Att angriparen fångar upp kommunikationen mellan två parter var svaret på en av förra årets tentafrågor.

En **digital envelope** skyddar ett meddelande utan att parterna först måste dela en nyckel:

1. Bob skapar en slumpmässig symmetrisk engångsnyckel och krypterar meddelandet med den.
2. Han krypterar engångsnyckeln med Alices publika nyckel.
3. Han skickar båda till Alice.

Bara Alice kan få fram engångsnyckeln och därmed läsa meddelandet. Har Bob hämtat Alices publika nyckel ur hennes certifikat vet han att den är äkta. Boken liknar det vid ett förseglat kuvert med ett osignerat brev.

## Kryptering av lagrade data

Data som skickas över nät krypteras ofta, men lagrade data (**data at rest**) skyddas ofta bara av inloggning och operativsystemets access control. Säkerhetskopior skickas iväg och arkiveras, bärbara datorer försvinner och raderade data kan gå att återskapa. Därför bör data at rest krypteras, tillsammans med en bra hantering av nycklarna. Boken nämner bland annat krypteringsprogram som PGP och kryptering av hela disken, som BitLocker och FileVault.

Föreläsning 2 tar upp samma sak i säkerhetspolicyns del om data encryption: känsliga data skyddas at rest och in transit, med hardware security modules (HSM) för nycklarna. I data center-modellen ligger kryptering och HSM i datalagret.
`,
};

export const topic = {
  id: "bok2-krypto",
  name: "Kryptografiska verktyg: symmetriskt, asymmetriskt och hashfunktioner",
  chapter: "bok2",
  examWeight: "hög",
  summary: "Symmetrisk kryptering använder en hemlig nyckel som sändare och mottagare delar. Public-key-kryptering använder ett nyckelpar: den publika nyckeln krypterar till ägaren och kontrollerar ägarens signaturer, den privata dekrypterar och signerar. MAC, hashfunktioner och digitala signaturer visar att data är oförändrade och äkta, och ett certifikat från en CA intygar vem en publik nyckel tillhör.",
  keyPoints: [
    "Symmetric encryption: en hemlig nyckel som sändare och mottagare delar; kräver en stark algoritm och säker nyckelhantering.",
    "Cryptanalysis och brute force: utnyttja algoritmens egenskaper respektive pröva alla nycklar.",
    "Block cipher och stream cipher: fasta block (DES, AES) respektive en ström, oftast en byte i taget.",
    "Message authentication code (MAC): kod ur meddelandet och en delad hemlig nyckel; visar att meddelandet är oförändrat och äkta.",
    "Hash function: fingeravtryck av fast längd utan nyckel; ska vara one-way, weak och strong collision resistant.",
    "Public-key encryption: den publika nyckeln krypterar till ägaren, den privata har bara ägaren.",
    "Digital signature: skapas med avsändarens privata nyckel, kontrolleras med den publika; ger ingen confidentiality.",
    "Public-key certificate: en CA signerar en publik nyckel ihop med ägarens id.",
    "Digital envelope: meddelandet krypteras med en engångsnyckel, som krypteras med mottagarens publika nyckel.",
  ],
  pitfalls: [
    "Vid sekretess krypterar man med mottagarens publika nyckel; vid signatur signerar avsändaren med sin privata och mottagaren kontrollerar med den publika.",
    "Secret key är den delade nyckeln i symmetrisk kryptering; private key är den hemliga halvan av ett nyckelpar.",
    "MAC är här message authentication code, inte mandatory access control.",
    "Weak collision resistance utgår från ett givet meddelande; strong collision resistance gäller vilket par som helst.",
    "En digital signatur ger integritet och visar avsändaren, men skyddar inte mot avlyssning.",
  ],
};

export const glossary = [
  { term: "Symmetric encryption", definition: "Kryptering där sändare och mottagare använder samma hemliga nyckel för att kryptera och dekryptera. Kallas också conventional eller single-key encryption.", chapter: "bok2" },
  { term: "Secret key", definition: "Nyckeln i symmetrisk kryptering, som sändare och mottagare delar och håller hemlig för alla andra.", chapter: "bok2" },
  { term: "Cryptanalysis", definition: "Angrepp som utnyttjar hur en krypteringsalgoritm fungerar, ofta med viss kunskap om klartexten, för att få fram klartext eller nyckel.", chapter: "bok2" },
  { term: "Brute-force attack", definition: "Angrepp som provar alla möjliga nycklar tills resultatet blir begriplig klartext. En längre nyckel gör det svårare.", chapter: "bok2" },
  { term: "Advanced Encryption Standard (AES)", definition: "Symmetrisk block cipher som NIST tog fram som ersättare för DES och triple DES. Finns i dag i många kommersiella produkter.", chapter: "bok2" },
  { term: "Message authentication code (MAC)", definition: "Ett litet datablock som räknas fram ur meddelandet och en delad hemlig nyckel. Visar mottagaren att meddelandet inte har ändrats och kommer från avsändaren.", chapter: "bok2" },
  { term: "Hash function", definition: "Funktion som gör om data av valfri storlek till ett hashvärde (message digest) av fast längd, ett slags fingeravtryck. Tar ingen hemlig nyckel.", chapter: "bok2" },
  { term: "Preimage resistant", definition: "Egenskap hos en hashfunktion: det går inte att utifrån en hashkod hitta ett meddelande som ger den. Kallas också one-way.", chapter: "bok2" },
  { term: "Second preimage resistant", definition: "Egenskap hos en hashfunktion: det går inte att till ett givet meddelande hitta ett annat med samma hashkod. Kallas också weak collision resistant.", chapter: "bok2" },
  { term: "Collision resistant", definition: "Egenskap hos en hashfunktion: det går inte att hitta något par av olika meddelanden med samma hashkod. Kallas också strong collision resistant.", chapter: "bok2" },
  { term: "Public-key encryption", definition: "Asymmetrisk kryptering med ett nyckelpar, där det som krypteras med den ena nyckeln dekrypteras med den andra.", chapter: "bok2" },
  { term: "Public key", definition: "Den halva av ett nyckelpar som alla får känna till. Används för att kryptera till ägaren och för att kontrollera ägarens signaturer.", chapter: "bok2" },
  { term: "Private key", definition: "Den halva av ett nyckelpar som bara ägaren känner. Används för att dekryptera och för att signera.", chapter: "bok2" },
  { term: "Digital signature", definition: "Ett bitmönster som avsändaren skapar ur data med sin privata nyckel och som alla kan kontrollera med den publika. Ger ursprung, integritet och non-repudiation, men inte confidentiality.", chapter: "bok2" },
  { term: "Public-key certificate", definition: "En publik nyckel och ägarens id, signerade av en betrodd tredje part, oftast en certificate authority (CA).", chapter: "bok2" },
  { term: "Man-in-the-middle attack", definition: "En angripare ställer sig mellan två parter, till exempel i ett nyckelutbyte som inte autentiserar dem, och kan läsa och ändra det de skickar medan båda tror att de kommunicerar direkt. Skyddet är digitala signaturer och certifikat.", chapter: "bok2" },
];

export const questions = [
  { id: "sak-bok2-v16", topic: "bok2-krypto", difficulty: 1, ...variant("sak-16", "publik nyckel krypterar till mottagaren"),
    question: "In public-key encryption, Bob wants to send Alice a message that only Alice can read. Which key does Bob encrypt it with?",
    options: [
      { text: "Alice's public key, which anyone may know", explain: "Den publika nyckeln får alla känna till och används för att kryptera till ägaren. Bara Alice kan sedan dekryptera, med sin privata nyckel." },
      { text: "Alice's private key, which only Alice has", explain: "Den har bara Alice, så Bob kan inte använda den. Alice använder den för att dekryptera." },
      { text: "Bob's private key, which only Bob has", explain: "Krypterar Bob med sin privata nyckel kan alla med hans publika nyckel läsa meddelandet. Det visar vem som skickat, men ger ingen sekretess." },
      { text: "A secret key that Bob and Alice share", explain: "En delad hemlig nyckel hör till symmetrisk kryptering. I public-key-kryptering behöver de inte dela någon nyckel." },
    ],
    correct: 0, reviewed: false },

  { id: "sak-bok2-v17", topic: "bok2-krypto", difficulty: 1, ...variant("sak-17", "symmetrisk nyckel delas av sändare och mottagare"),
    question: "Two people want to communicate using a symmetric cipher. Which key arrangement do they need?",
    options: [
      { text: "A key pair each, one public and one private", explain: "Det är public-key-kryptering, där varje användare har ett eget nyckelpar." },
      { text: "One public key that anyone can use to encrypt", explain: "En publik nyckel som alla får använda hör till public-key-kryptering, inte till symmetrisk." },
      { text: "One key kept by the sender and never shared", explain: "Då kan mottagaren inte dekryptera, eftersom samma nyckel behövs åt båda hållen." },
      { text: "One secret key held by sender and receiver", explain: "Symmetrisk kryptering använder samma nyckel för att kryptera och dekryptera, så båda måste ha den och hålla den hemlig för alla andra." },
    ],
    correct: 3, reviewed: false },

  { id: "sak-bok2-01", topic: "bok2-krypto", difficulty: 2,
    question: "Which attack on symmetric encryption exploits the characteristics of the algorithm, perhaps using some known plaintext–ciphertext pairs?",
    options: [
      { text: "Brute-force attack", explain: "En brute-force attack provar alla nycklar en efter en och utnyttjar inga egenskaper hos algoritmen." },
      { text: "Cryptanalysis", explain: "Cryptanalysis utnyttjar hur algoritmen fungerar, gärna med viss kunskap om klartexten, för att få fram en klartext eller nyckeln." },
      { text: "Replay attack", explain: "En replay skickar ett gammalt meddelande igen. Mot det skyddar message authentication, inte kryptering." },
      { text: "Eavesdropping", explain: "Avlyssning är en passiv attack, alltså det som kryptering skyddar mot, inte ett sätt att knäcka krypteringen." },
    ],
    correct: 1, source: "Bokens kapitel 2 (cryptanalysis och brute force)", reviewed: false },

  { id: "sak-bok2-02", topic: "bok2-krypto", difficulty: 2,
    question: "A message authentication code (MAC) is calculated from the message and what else?",
    options: [
      { text: "The receiver's public key", explain: "Med mottagarens publika nyckel krypterar man för sekretess. Den används inte för en MAC." },
      { text: "The sender's private key", explain: "Avsändarens privata nyckel används för en digital signatur, inte för en MAC." },
      { text: "A secret key that both share", explain: "Sändaren och mottagaren räknar fram koden med samma delade nyckel. Ingen annan har nyckeln, så ingen annan kan göra en kod som stämmer." },
      { text: "No key, just the message itself", explain: "Det beskriver en hashfunktion, som inte tar någon nyckel. Just det skiljer den från en MAC." },
    ],
    correct: 2, source: "Bokens kapitel 2 (message authentication code)", reviewed: false },

  { id: "sak-bok2-03", topic: "bok2-krypto", difficulty: 3,
    question: "A hash function makes it infeasible to find any pair of different messages with the same hash value. What is this property called?",
    options: [
      { text: "One-way, or preimage resistant", explain: "One-way betyder att man inte kan gå från en hashkod tillbaka till ett meddelande som ger den." },
      { text: "Weak collision resistant", explain: "Weak collision resistance (second preimage resistance) utgår från ett givet meddelande: det ska inte gå att hitta ett annat med samma hashkod." },
      { text: "Strong collision resistant", explain: "Strong collision resistance, eller bara collision resistance, gäller vilket par som helst. Angriparen får välja båda meddelandena fritt." },
      { text: "Producing fixed-length output", explain: "Fast längd är ett av de praktiska kraven på en hashfunktion, inte en egenskap som hindrar kollisioner." },
    ],
    correct: 2, source: "Bokens kapitel 2 (hashfunktionens egenskaper)", reviewed: false },

  { id: "sak-bok2-04", topic: "bok2-krypto", difficulty: 2,
    question: "How is a digital signature created and checked?",
    options: [
      { text: "Signed with the sender's private key, checked with the sender's public key", explain: "Bara avsändaren har sin privata nyckel, så bara hen kan signera. Alla som har den publika nyckeln kan kontrollera signaturen." },
      { text: "Signed with the sender's public key, checked with the sender's private key", explain: "Tvärtom. Den publika nyckeln känner alla, så en signatur gjord med den skulle inte visa vem som signerat." },
      { text: "Signed with the receiver's public key, checked with the receiver's private key", explain: "Mottagarens nycklar används när man krypterar för sekretess, inte när man signerar." },
      { text: "Signed and checked with one secret key that both parties share", explain: "En delad hemlig nyckel används i en MAC, inte i en digital signatur." },
    ],
    correct: 0, source: "Bokens kapitel 2 (digital signatur)", reviewed: false },

  { id: "sak-bok2-05", topic: "bok2-krypto", difficulty: 2,
    question: "What does a public-key certificate from a certificate authority (CA) do?",
    options: [
      { text: "Encrypts a one-time key with the receiver's public key", explain: "Det är en digital envelope, där engångsnyckeln skyddar själva meddelandet." },
      { text: "Lets two parties agree on a shared secret key", explain: "Det gör Diffie–Hellman key exchange." },
      { text: "Stores a file's hash value so that changes show up", explain: "Så kan en hashfunktion användas för att upptäcka intrång, inte för att intyga vem en nyckel tillhör." },
      { text: "Binds a public key to its owner, signed by the CA", explain: "Certifikatet innehåller den publika nyckeln och ägarens id, signerade av CA:n. Alla kan kontrollera signaturen med CA:ns publika nyckel." },
    ],
    correct: 3, source: "Bokens kapitel 2 (public-key certificate)", reviewed: false },

  { id: "sak-bok2-06", topic: "bok2-krypto", difficulty: 3,
    question: "Bob and Alice share no secret key. How does a digital envelope let Bob send Alice a confidential message?",
    options: [
      { text: "The whole message is encrypted with Bob's own private key", explain: "Då kan alla som har Bobs publika nyckel läsa meddelandet, så det ger ingen sekretess." },
      { text: "A one-time key encrypts it, and Alice's public key encrypts the key", explain: "Meddelandet krypteras symmetriskt med en engångsnyckel, och nyckeln krypteras med Alices publika nyckel. Bara Alice kan få fram nyckeln." },
      { text: "A hash of the message is signed with Bob's private key and attached", explain: "Det är en digital signatur. Den visar vem som skickat, men meddelandet kan fortfarande läsas av alla." },
      { text: "Bob's public key is sent along in a certificate signed by a CA", explain: "Ett certifikat intygar vems en publik nyckel är, men krypterar inte meddelandet." },
    ],
    correct: 1, source: "Bokens kapitel 2 (digital envelope)", reviewed: false },

  { id: "sak-bok2-v08", topic: "bok2-krypto", difficulty: 2, ...variant("sak-08", "man-in-the-middle vid nyckelutbyte"),
    question: "Alice and Bob run a key exchange that does not authenticate them. Darth intercepts it and sets up a separate key with each of them. What is this attack called?",
    options: [
      { text: "Man-in-the-middle attack", explain: "Darth sitter mellan Alice och Bob och kan läsa och ändra allt de skickar, medan båda tror att de pratar direkt med varandra. Skyddet är digitala signaturer och certifikat." },
      { text: "Brute-force key search", explain: "En brute-force attack provar alla möjliga nycklar. Darth behöver inte knäcka någon nyckel; han gör upp egna med båda parterna." },
      { text: "Replay of old messages", explain: "Replay är att skicka ett uppfångat meddelande igen senare. Darth gör mer än så: han sitter mitt i förbindelsen hela tiden." },
      { text: "A traffic analysis attack", explain: "Traffic analysis är passiv: angriparen ser vem som kommunicerar men ändrar ingenting. Darth deltar aktivt i nyckelutbytet." },
    ],
    correct: 0, reviewed: false },
];

export const notes = `Byggt på kap. 2 i del1-filen, s. 81–125 (texten) och s. 124–125 (Key Terms och Review Questions 2.1–2.13, som styrde urvalet); Problems s. 126–130 bara skummade. Avsnitt: 2.1 (fem beståndsdelar, två krav, cryptanalysis mot brute force, block mot stream cipher, keystream, DES/3DES/AES som namn), 2.2 (passiv mot aktiv attack, message authentication, MAC, hashfunktion utan nyckel, Figure 2.5 i en mening, de tre praktiska kraven och de tre säkerhetsegenskaperna, lösenord och intrångsdetektering, SHA), 2.3 (sex beståndsdelar, stegen Bob–Alice, två användningssätt, tre missuppfattningar, tre användningar, RSA/Diffie–Hellman/DSS), 2.4 (digital signatur enligt FIPS 186-4, certifikat och CA, X.509, nyckelutbyte, digital envelope), 2.6 (data at rest, PGP, BitLocker/FileVault). Privat mot hemlig nyckel bygger på fotnot 8 (slutnoterna i del3-filen, s. 1634 av 1641).

Man-in-the-middle: kapitel 2 använder inte begreppet, så ingen variant av sak-08. Närmast kommer certifikatavsnittet (2.4): vem som helst kan sprida en förfalskad publik nyckel i Bobs namn och sedan läsa det som krypteras till Bob; boken kallar det bara forgery. Begreppet finns i kap. 21.3, "Man-in-the-Middle Attack" mot Diffie–Hellman (del3-filen, sida 1137 av 1641, bokens s. ~670), och i kap. 22:s Problems (22.2a, om SSL/TLS, sida 1195 av 1641). En sak-08-variant hör hemma i ett kapitel som täcker kap. 21 eller 22.

Granskningen (22 nov) lade ändå varianten sak-bok2-v08 och ett stycke om man-in-the-middle här, eftersom kap. 21 (s. 1137–1138) säger att Diffie–Hellman är sårbart för attacken för att parterna inte autentiseras, och att signaturer och certifikat "as mentioned in Chapter 2" är skyddet. Termen Man-in-the-middle attack är tillagd i ordlistan, utöver Key Terms. Kap. 21 är inte med på sajten, så body hänvisar bara till "ett senare kapitel".

Osäkert:
- Tre användningar av public-key: bokens löptext (2.3) säger "digital signature, symmetric key distribution, and encryption of secret keys", och kapitlet följer den. Uppdraget nämnde kryptering/sekretess, digital signatur och nyckelutbyte (den vanliga indelningen i Stallings andra böcker och sannolikt lösningen på Review Question 2.9). Kapitlet slutar därför tabellen med en mening som knyter ihop dem: "sekretess, signaturer och nyckelutbyte". Ingen fråga bygger på indelningen.
- Table 2.3 (vilka algoritmer som klarar vilka användningar) saknas i textfilen. Tabellen i kapitlet bygger bara på löptexten: RSA klarar kryptering och nyckelutbyte ("unlike RSA, [DSS] cannot be used for encryption or key exchange") och signatur (RSA Digital Signature Algorithm), Diffie–Hellman är "limited to the exchange of the keys", DSS ger bara signaturer. Elliptic curve utelämnad av det skälet.
- Raden "Encryption of secret keys: en hemlig nyckel krypteras med mottagarens publika nyckel" är min tolkning av kategorinamnet; den stöds av 2.4 ("the use of public-key encryption to distribute secret keys") och digital envelope.
- "En myndighet eller en bank": boken säger "a government agency or a financial institution".
- Raden om DES nyckel och 128 bitar: boken säger att 56 bitar är "woefully inadequate" och att 128 bitar eller mer är "effectively unbreakable using simply a brute-force approach". Inga andra siffror i kapitlet.

Medvetet utelämnat (en del för att hålla ordtaket på 1 600): Table 2.1–2.2 och nyckeltider, DES/3DES/AES-historik och blockstorlekar, ECB och modes of operation, autentisering med enbart symmetrisk kryptering (blockomkastning), message authentication utan confidentiality och DAVI89:s tre situationer, TSUD92:s skäl att undvika kryptering, CMAC och authenticated encryption, H(K||M||K) och formlerna, varför varje hashegenskap behövs (inklusive IOU-exemplet för strong collision resistance), weak/strong hash function som namn, hashlängder, MD5-exemplet och SHA-1/2/3, Diffie–Hellmans sex krav på public-key-algoritmer, RSA-utmaningen och nyckellängder, ECC, DSA/ECDSA, certifikatets åtta steg i detalj, IPsec/SSH/S/MIME, kvantdatorer och NISTIR 8413, hela 2.5 (random och pseudorandom numbers, TRNG; key terms men utanför uppdragets fokus), incidenterna i 2.6 (Bank of America m.fl.) och back-end appliance och library-based tape encryption.

Ordlistan: 15 termer ur Key Terms. Utelämnade key terms: confidentiality (finns redan), authentication, data authentication och data integrity (kap. 1 och ordlistans CIA-termer), plaintext, ciphertext, encryption/decryption algorithm (står i body-tabellen), one-way och one-way hash function (ingår i Preimage resistant och Hash function), strong/weak collision resistant (ingår i Collision resistant och Second preimage resistant), DES, triple DES, RSA, SHA, DSA, Diffie–Hellman key exchange (bara namn), keystream, modes of operation, random och pseudorandom number. "Digital envelope" och "certificate authority" är inte key terms och står därför bara i löptexten; lägg till dem om ordlistan får gå utanför Key Terms.

Frågor: 8 st, varav varianterna sak-bok2-v16 (vilken nyckel Bob krypterar med till Alice; ny vinkel på "public key") och sak-bok2-v17 (vilken nyckeluppsättning två parter behöver i symmetrisk kryptering). Rätt position 2/2/2/2. Ingen ordagrann alternativtext från originalen.`;
