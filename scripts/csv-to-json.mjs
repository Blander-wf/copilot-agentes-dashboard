import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        value += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        value += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(value);
      value = "";
    } else if (ch === "\n") {
      row.push(value.replace(/\r$/, ""));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += ch;
    }
  }
  row.push(value.replace(/\r$/, ""));
  if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift() || [];
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

async function readCsv(name) {
  return parseCsv(await fs.readFile(path.join(dataDir, name), "utf8"));
}

const rows = await readCsv("agentes.csv");
const sourceCatalog = await readCsv("fontes.csv");
const decisionRows = await readCsv("como-escolher.csv");
const topRows = [...rows].sort((a, b) => Number(b.trainingScore || 0) - Number(a.trainingScore || 0) || String(a.area).localeCompare(String(b.area))).slice(0, 40);
const coworkRows = rows.filter(row => /cowork/i.test([row.category, row.copilotType, row.agent].join(" ")));

const data = {
  generatedAt: new Date().toISOString().slice(0, 10),
  rows,
  topRows,
  coworkRows,
  sourceCatalog,
  decisionRows,
  summary: {
    total: rows.length,
    highPriority: rows.filter(row => String(row.priority || "").startsWith("Alta")).length,
    cowork: coworkRows.length,
    sources: sourceCatalog.length,
    sourcedRows: rows.filter(row => row.url).length
  }
};

await fs.writeFile(path.join(dataDir, "catalogo-agentes-data.json"), JSON.stringify(data, null, 2), "utf8");
console.log(JSON.stringify(data.summary, null, 2));
