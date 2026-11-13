// Betygsskalan på SYSB23:s tentor (instruktionssidan i Databasers och
// Säkerhets HT25-tentor): A 85–100 %, B 75–84 %, C 65–74 %, D 55–64 %,
// E 50–54 %, U under 50 %. Tar procent; på tentor om 100 p är det poängen.
export const GRADE_LIMITS = [["A", 85], ["B", 75], ["C", 65], ["D", 55], ["E", 50]];
export const gradeFor = (percent) => GRADE_LIMITS.find(([, min]) => percent >= min)?.[0] ?? "U";
