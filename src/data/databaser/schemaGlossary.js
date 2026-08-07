// Vad tabellerna och kolumnerna i sjukhusdatabasen innehåller.
// Beskrivningarna är lästa ur hospitalSeed.js — DDL:n och testdatan — och
// säger vad som står i kolumnen, inte hur man löser en övning.

export const tableNotes = {
  Unit: "Sjukhusets enheter (avdelningar). Testdatan har tre: General Surgery, Rehabilitation och Trauma.",
  Employee: "De anställda. Sex stycken, var och en knuten till en enhet. Flera delar förnamn — två heter Anna och två Eva.",
  Patient: "Patienterna. Sex stycken, var och en inskriven på en enhet. Även här återkommer namn: tre heter Anna.",
  Illness: "Katalog över sjukdomar som finns i systemet. Sex stycken, oberoende av vem som har dem.",
  Examines: "Vilken anställd som undersöker vilken patient. En kopplingstabell — samma anställd kan ha flera patienter och tvärtom.",
  Suffers: "Sjukdomar patienten lider av just nu, med det datum det började.",
  HasSuffered: "Sjukdomar patienten har lidit av tidigare. Samma struktur som Suffers men utan datum — det är det som skiljer dem åt.",
  Car: "Bilarna i registret, sju stycken. Kan sakna ägare: EmployeeID är NULL för de två bilar som ingen anställd har.",
};

export const columnNotes = {
  "Unit.UnitID": "Enhetens id, satt av databasen. Det är detta värde andra tabeller pekar på.",
  "Unit.UnitNo": "Enhetens kortkod, till exempel U1. Läsbar för människor och unik, men inte det andra tabeller kopplar mot.",
  "Unit.UnitName": "Enhetens namn, till exempel Trauma.",
  "Unit.UnitAddress": "Enhetens gatuadress.",

  "Employee.EmployeeID": "Den anställdes id, satt av databasen.",
  "Employee.EmpNo": "Anställningsnummer, till exempel E1. Unikt och läsbart, men inte nyckeln andra tabeller pekar på.",
  "Employee.EmpName": "Den anställdes namn. Inte unikt — flera personer delar namn.",
  "Employee.EmpAddress": "Ort där den anställde bor.",
  "Employee.EmpPhoneNumber": "Telefonnummer, lagrat som text.",
  "Employee.EmpSalary": "Månadslön i kronor, som heltal. Spannet i testdatan är 18 000 till 279 000.",
  "Employee.UnitID": "Enheten personen arbetar på. Pekar på Unit.UnitID.",

  "Patient.PatientID": "Patientens id, satt av databasen.",
  "Patient.PatientNo": "Patientnummer, till exempel PP1. Unikt och läsbart.",
  "Patient.PatientName": "Patientens namn. Måste finnas och är inte unikt.",
  "Patient.PatientAddress": "Ort där patienten bor.",
  "Patient.PatientPhoneNumber": "Telefonnummer, lagrat som text.",
  "Patient.UnitID": "Enheten patienten är inskriven på. Pekar på Unit.UnitID.",

  "Illness.IllnessID": "Sjukdomens id, satt av databasen.",
  "Illness.IllnessName": "Sjukdomens namn, till exempel Insomnia. Unikt.",

  "Examines.EmployeeID": "Den anställde i kopplingen. Pekar på Employee.EmployeeID och ingår i primärnyckeln.",
  "Examines.PatientID": "Patienten i kopplingen. Pekar på Patient.PatientID och ingår i primärnyckeln.",

  "Suffers.IllnessID": "Sjukdomen patienten har just nu. Pekar på Illness.IllnessID.",
  "Suffers.PatientID": "Patienten som är sjuk. Pekar på Patient.PatientID.",
  "Suffers.StartDate": "Datum då sjukdomen började, lagrat som text i formen ÅÅÅÅ-MM-DD.",

  "HasSuffered.IllnessID": "Sjukdomen patienten haft tidigare. Pekar på Illness.IllnessID.",
  "HasSuffered.PatientID": "Patienten det gäller. Pekar på Patient.PatientID.",

  "Car.CarID": "Bilens id, satt av databasen.",
  "Car.LicenseNo": "Registreringsnummer, till exempel C1. Unikt.",
  "Car.Brand": "Bilmärke. Testdatan har saab, volvo och audi, skrivna med små bokstäver.",
  "Car.Price": "Pris i kronor, som heltal.",
  "Car.EmployeeID": "Vilken anställd som har bilen. Får vara NULL — två bilar i testdatan saknar ägare.",
};

// Begreppen i panelens märkning.
export const keyNotes = {
  PK: {
    term: "PK — primärnyckel",
    text: "Kolumnen som identifierar raden entydigt. Står flera kolumner märkta PK i samma tabell bildar de tillsammans nyckeln, som i Examines där en rad är ett par av anställd och patient.",
  },
  FK: {
    term: "FK — främmande nyckel",
    text: "Kolumnen pekar på en rad i en annan tabell. Det är på dessa kolumner du joinar, och databasen hindrar värden som inte finns i den andra tabellen.",
  },
};
