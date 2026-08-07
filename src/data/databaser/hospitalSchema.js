import { hospitalSeed } from "./hospitalSeed.js";

// Schemat härleds ur seed-skriptet i stället för att skrivas av — då kan
// panelen aldrig glida ifrån databasen.
function parseSchema(ddl) {
  const tables = [];
  const createRe = /CREATE TABLE (\w+)\s*\(([\s\S]*?)\n\);/g;
  let match;

  while ((match = createRe.exec(ddl)) !== null) {
    const [, name, body] = match;
    const columns = [];
    const primaryKeys = [];
    const foreignKeys = {};

    for (const rawLine of body.split("\n")) {
      const line = rawLine.trim().replace(/,$/, "");
      if (!line) continue;

      if (/^CONSTRAINT/i.test(line)) {
        const pk = /PRIMARY KEY\s*\(([^)]+)\)/i.exec(line);
        if (pk) {
          pk[1].split(",").forEach((column) => primaryKeys.push(column.trim()));
        }
        const fk = /FOREIGN KEY\s*\(([^)]+)\)\s*REFERENCES\s+(\w+)\s*\(([^)]+)\)/i.exec(line);
        if (fk) {
          foreignKeys[fk[1].trim()] = `${fk[2].trim()}.${fk[3].trim()}`;
        }
        continue;
      }

      const [columnName, ...typeParts] = line.split(/\s+/);
      const type = typeParts.join(" ");
      if (/PRIMARY KEY/i.test(type)) primaryKeys.push(columnName);
      columns.push({ name: columnName, type });
    }

    tables.push({
      name,
      columns: columns.map((column) => ({
        ...column,
        pk: primaryKeys.includes(column.name),
        fk: foreignKeys[column.name] || null,
      })),
    });
  }

  return tables;
}

export const hospitalSchema = parseSchema(hospitalSeed);
