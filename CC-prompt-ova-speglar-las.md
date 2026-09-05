# Uppdrag: gör om Öva så att den speglar Läs

Det här handlar bara om frågebanken i **Databaser**. Rör inte innehållet i Läs mer än
att du läser det, och rör inte verkstaden.

## Problemet

Frågebanken har vuxit fritt. Fö4 fick 36 frågor på tre kapitel medan andra kapitel har
noll. Det finns frågor som inte hör hemma i något kapitel alls, och det diskuterades en
utbyggnad till ungefär 170 frågor. Den utbyggnaden ska inte göras.

Frågebanken har byggts utifrån vilket material som råkade vara färskt, inte utifrån vad
man kan läsa på sidan. Det är felet som ska rättas.

## Regeln

**Öva speglar Läs.** Ett ämne i Öva per kapitel i Läs, i samma ordning, med samma namn.
Har du läst ett kapitel ska du kunna testa dig på just det. Inget annat.

Riktvärde **sex frågor per kapitel**, spann fem till åtta. Fler än åtta betyder att du
gått på täckning istället för på förståelse. Målet är inte att täcka kapitlet utan att
träffa de ställen där man tror sig ha förstått men inte har det.

Varje fråga ska gå att besvara **enbart utifrån kapiteltexten i Läs**. Behöver frågan
kunskap som inte står i kapitlet är antingen frågan fel eller kapitlet ofullständigt.
Uppfinn inte innehåll från föreläsningsmaterialet för att täppa till hålet — rapportera
det istället.

## Referens

**Läs ekonomistyrning-delen först och använd den som mall.** Där fungerar förhållandet
mellan Läs och Öva som det ska. Kopiera dess struktur, dess frågetäthet och dess
frågeformat rakt av till Databaser. Avviker Databaser från ekonomistyrning på något sätt
som inte är motiverat av ämnet — rätta Databaser, inte tvärtom.

## Frågornas karaktär

Frågor på **principer, inte på exempel**. "Vad kräver 2NF" överlever att en föreläsning
görs om. "Vad heter entiteten i exemplet på slide 34" gör det inte. Det är inte hypotetiskt:
Fö4 har redan bytt terminologi och exempel en gång.

Frågor som **går att svara på i flervalsform**, inte sådant som kräver att man skriver kod
eller ritar diagram. Skrivträningen ligger redan i verkstaden med sina 53 övningar och ska
inte dupliceras. För SQL betyder det resonemangsfrågor: vad returnerar den här frågan,
varför ger IN och EXISTS olika svar vid NULL, varför behövs `<>` i en self-join, varför får
en vy inte ha ORDER BY.

## Så här gör du

**1. Inventera.** Lista varje kapitel i Läs och varje befintlig fråga, och koppla ihop dem.
Redovisa tabellen innan du ändrar något: kapitel, antal frågor nu, antal efter. Frågor som
inte kopplar till ett kapitel ska synas i listan som just det.

**2. Gallra.** Kapitel över spannet skärs ner. Fö4:s tre kapitel är den tydligaste
kandidaten. Behåll de skarpaste — de som träffar en distinktion man lätt går bet på — och
stryk resten. Behåll inte en fråga bara för att den är korrekt.

**3. Fyll.** Kapitel med noll frågor får sina sex. Skriv dem mot kapiteltexten, inte mot
föreläsningsslidesen.

**4. Städa strukturen.** Ämneslistan i Öva ska efter det vara identisk med kapitellistan i
Läs. Ligger frågor inbakade i fel ämne — SQL-frågorna ligger idag under "Databaser, servrar
och designprocessen" — flyttar du dem dit de hör hemma enligt kapitelindelningen.

Ordningen spelar roll: inventeringen först, för det är den som avgör hur mycket som ska
gallras respektive fyllas.

## Gör inte

Bygg inte ut till 170 frågor. Skapa inga frågor för områden som saknar kapitel i Läs —
application development är ett sådant område, och det är ett separat beslut om det ska få
ett kapitel. Duplicera inte verkstadens SQL-övningar. Återinför inte Prov-vyn; den är
borttagen ur Databaser-manifestet eftersom tentan är konstruktionsbaserad.

## Stanna och fråga

Fyra lägen där du inte ska gissa:

Om kapitelindelningen i Läs i sig behöver göras om snarare än lappas — det är ett beslut
jag vill ta.

Om ett kapitel är för tunt för att bära sex bra frågor. Rapportera det som ett hål i Läs
istället för att fylla ut med material från slidesen.

Om en fråga du är på väg att stryka i gallringen är så bärande att den borde få kapitlet
att gå över spannet. Flagga den, håll inte tyst och behåll nio.

Om du ser en bättre lösning än den jag beskrivit. Du sitter på koden, jag gör det inte —
avvik gärna, men säg till att du gjort det och varför.

## Redovisa

Inventeringstabellen före ändring, en sammanfattning efter, och en lista på vad du strök
och varför. Om något område saknar kapitel i Läs, säg det uttryckligen så jag kan ta det
beslutet separat.
