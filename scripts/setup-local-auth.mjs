import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const authDir = path.join(root, "auth");
const usersPath = path.join(authDir, "users.local.json");
const credentialsPath = path.join(authDir, "credentials.local.txt");
const force = process.argv.includes("--force");

function strongPassword() {
  return crypto.randomBytes(27).toString("base64url");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(24).toString("base64url");
  const params = { N: 16384, r: 8, p: 1, keylen: 64 };
  const hash = crypto.scryptSync(password, salt, params.keylen, {
    N: params.N,
    r: params.r,
    p: params.p,
    maxmem: 64 * 1024 * 1024
  }).toString("base64url");
  return { algorithm: "scrypt", ...params, salt, hash };
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

await fs.mkdir(authDir, { recursive: true });

if (!force && await exists(usersPath)) {
  console.log(`Configuracao existente preservada: ${usersPath}`);
  console.log("Use --force para gerar novas senhas.");
  process.exit(0);
}

const adminPassword = strongPassword();
const userPassword = strongPassword();
const users = {
  createdAt: new Date().toISOString(),
  users: [
    { username: "admin", role: "admin", password: hashPassword(adminPassword) },
    { username: "usuario", role: "usuario", password: hashPassword(userPassword) }
  ]
};

const credentials = [
  "Credenciais locais do Dashboard de Agentes Copilot",
  "Guarde este arquivo fora do repositorio se for compartilhar a pasta.",
  "",
  `admin: ${adminPassword}`,
  `usuario: ${userPassword}`,
  "",
  "Arquivo de hashes: auth/users.local.json",
  "Para rotacionar senhas: node scripts/setup-local-auth.mjs --force"
].join("\n");

await fs.writeFile(usersPath, JSON.stringify(users, null, 2), "utf8");
await fs.writeFile(credentialsPath, credentials, "utf8");

console.log(`Credenciais geradas em: ${credentialsPath}`);
console.log(`Hashes gerados em: ${usersPath}`);
