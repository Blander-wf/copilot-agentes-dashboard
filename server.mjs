import crypto from "node:crypto";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, "data");
const authPath = path.join(root, "auth", "users.local.json");
const port = Number(process.env.PORT || 8787);
const sessions = new Map();
const sessionTtlMs = 8 * 60 * 60 * 1000;
const cookieName = "copilot_dash_session";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(body);
}

function json(res, status, body, headers = {}) {
  send(res, status, JSON.stringify(body), { "Content-Type": "application/json; charset=utf-8", ...headers });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || "").split(";").filter(Boolean).map(part => {
    const index = part.indexOf("=");
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
  }));
}

function sessionFromReq(req) {
  const token = parseCookies(req)[cookieName];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  session.expiresAt = Date.now() + sessionTtlMs;
  return session;
}

function sessionCookie(token) {
  return `${cookieName}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(sessionTtlMs / 1000)}`;
}

function clearCookie() {
  return `${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

async function readBody(req, limit = 256 * 1024) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > limit) throw new Error("Payload muito grande.");
  }
  return body ? JSON.parse(body) : {};
}

async function loadUsers() {
  try {
    const config = JSON.parse(await fs.readFile(authPath, "utf8"));
    return config.users || [];
  } catch {
    throw new Error("Credenciais locais ausentes. Rode: node scripts/setup-local-auth.mjs");
  }
}

function verifyPassword(password, stored) {
  if (!stored || stored.algorithm !== "scrypt") return false;
  const candidate = crypto.scryptSync(password, stored.salt, stored.keylen, {
    N: stored.N,
    r: stored.r,
    p: stored.p,
    maxmem: 64 * 1024 * 1024
  });
  const expected = Buffer.from(stored.hash, "base64url");
  return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  if (isSensitivePath(clean)) return null;
  const rel = clean === "/" ? "/index.html" : clean;
  const file = path.resolve(root, "." + rel);
  if (!file.startsWith(root)) return null;
  return file;
}

function isSensitivePath(urlPath) {
  const normalized = urlPath.replace(/\\/g, "/");
  const base = path.basename(normalized);
  return normalized === "/auth"
    || normalized.startsWith("/auth/")
    || base === ".github-token.local"
    || /\.local\./i.test(base)
    || /\.(token|secret)$/i.test(base)
    || base === "credentials.local.txt"
    || base === "users.local.json";
}

async function serveStatic(req, res, session) {
  const url = new URL(req.url, "http://localhost");
  if (!session && (url.pathname === "/" || url.pathname === "/index.html")) {
    send(res, 200, loginPage(), { "Content-Type": "text/html; charset=utf-8" });
    return;
  }
  if (!session && url.pathname.startsWith("/data/")) {
    json(res, 401, { error: "login_required" });
    return;
  }
  const file = safePath(url.pathname);
  if (!file) {
    json(res, 403, { error: "forbidden" });
    return;
  }
  try {
    const stat = await fs.stat(file);
    if (stat.isDirectory()) {
      json(res, 404, { error: "not_found" });
      return;
    }
    let body = await fs.readFile(file);
    if (session && (url.pathname === "/" || url.pathname === "/index.html")) {
      body = Buffer.from(String(body).replace("</body>", `${adminInjection(session)}</body>`), "utf8");
    }
    send(res, 200, body, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
  } catch {
    json(res, 404, { error: "not_found" });
  }
}

function loginPage(error = "") {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login - Dashboard de Agentes Copilot</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #f4f7f9;
      background:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(135deg, rgba(41, 211, 189, 0.1), transparent 32%, rgba(246, 184, 75, 0.08) 68%, transparent),
        #0c0f12;
      background-size: 28px 28px, 28px 28px, auto, auto;
    }
    main {
      width: min(420px, calc(100vw - 32px));
      border: 1px solid rgba(130, 151, 166, 0.24);
      border-radius: 10px;
      padding: 24px;
      background: linear-gradient(145deg, rgba(21, 28, 34, 0.98), rgba(13, 18, 22, 0.96));
      box-shadow: 0 24px 54px rgba(0, 0, 0, 0.35);
    }
    h1 { margin: 0 0 6px; font-size: 23px; }
    p { margin: 0 0 18px; color: #9fb0bd; line-height: 1.45; }
    label { display: block; margin: 12px 0 6px; font-size: 13px; font-weight: 750; }
    input {
      width: 100%;
      min-height: 40px;
      border: 1px solid rgba(130, 151, 166, 0.26);
      border-radius: 7px;
      padding: 9px 10px;
      color: #f4f7f9;
      background: rgba(8, 12, 16, 0.78);
    }
    button {
      width: 100%;
      margin-top: 18px;
      min-height: 40px;
      border: 0;
      border-radius: 7px;
      color: #071113;
      background: linear-gradient(135deg, #29d3bd, #78f0dd);
      font-weight: 800;
      cursor: pointer;
    }
    .error { color: #ffd5dd; margin-top: 12px; min-height: 18px; }
  </style>
</head>
<body>
  <main>
    <h1>Dashboard de Agentes Copilot</h1>
    <p>Entre como admin ou usuario para acessar a base local protegida.</p>
    <form id="loginForm">
      <label for="username">Usuario</label>
      <input id="username" name="username" autocomplete="username" required>
      <label for="password">Senha</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required>
      <button type="submit">Entrar</button>
      <div class="error" id="error">${escapeHtml(error)}</div>
    </form>
  </main>
  <script>
    document.getElementById("loginForm").addEventListener("submit", async event => {
      event.preventDefault();
      const body = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
      };
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (response.ok) location.href = "/";
      else document.getElementById("error").textContent = "Usuario ou senha invalidos.";
    });
  </script>
</body>
</html>`;
}

function adminInjection(session) {
  const isAdmin = session.role === "admin";
  return `<style>
    .local-authbar {
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: 14px;
      z-index: 80;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border: 1px solid rgba(130,151,166,.26);
      border-radius: 9px;
      padding: 10px;
      color: #f4f7f9;
      background: rgba(8, 12, 16, .92);
      box-shadow: 0 18px 38px rgba(0,0,0,.38);
      backdrop-filter: blur(12px);
      font-size: 13px;
    }
    .local-authbar button {
      border: 1px solid rgba(130,151,166,.28);
      border-radius: 7px;
      min-height: 34px;
      padding: 7px 10px;
      color: #071113;
      background: linear-gradient(135deg, #29d3bd, #78f0dd);
      font-weight: 800;
      cursor: pointer;
    }
    .local-authbar button.secondary {
      color: #f4f7f9;
      background: rgba(255,255,255,.06);
    }
    .admin-modal {
      position: fixed;
      inset: 0;
      z-index: 90;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0,0,0,.62);
    }
    .admin-modal.open { display: flex; }
    .admin-box {
      width: min(920px, 100%);
      max-height: calc(100vh - 36px);
      overflow: auto;
      border: 1px solid rgba(130,151,166,.26);
      border-radius: 10px;
      padding: 18px;
      background: #10171d;
      color: #f4f7f9;
      box-shadow: 0 24px 54px rgba(0,0,0,.45);
    }
    .admin-box h2 { margin: 0 0 12px; font-size: 19px; }
    .admin-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .admin-grid label { color: #dce7ee; font-size: 12px; font-weight: 750; }
    .admin-grid input, .admin-grid textarea, .admin-grid select {
      width: 100%;
      margin-top: 5px;
      border: 1px solid rgba(130,151,166,.26);
      border-radius: 7px;
      min-height: 37px;
      padding: 8px;
      color: #f4f7f9;
      background: rgba(8,12,16,.78);
    }
    .admin-grid textarea { min-height: 78px; resize: vertical; }
    .admin-wide { grid-column: 1 / -1; }
    .admin-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; flex-wrap: wrap; }
    @media (max-width: 760px) { .admin-grid { grid-template-columns: 1fr; } .local-authbar { align-items: flex-start; flex-direction: column; } }
  </style>
  <div class="local-authbar">
    <div><strong>${escapeHtml(session.username)}</strong> · ${escapeHtml(session.role)} · ambiente local seguro</div>
    <div>
      ${isAdmin ? '<button type="button" id="openAdminAgent">Adicionar agente</button>' : ''}
      <button type="button" class="secondary" id="logoutLocal">Sair</button>
    </div>
  </div>
  ${isAdmin ? adminModal() : ""}
  <script>
    document.getElementById("logoutLocal").addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST" });
      location.href = "/";
    });
    const openAdminAgent = document.getElementById("openAdminAgent");
    if (openAdminAgent) {
      const modal = document.getElementById("adminAgentModal");
      openAdminAgent.addEventListener("click", () => modal.classList.add("open"));
      document.getElementById("closeAdminAgent").addEventListener("click", () => modal.classList.remove("open"));
      document.getElementById("agentCreateForm").addEventListener("submit", async event => {
        event.preventDefault();
        const form = new FormData(event.target);
        const payload = Object.fromEntries(form.entries());
        const response = await fetch("/api/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: "Erro ao salvar." }));
          alert(error.error || "Erro ao salvar.");
          return;
        }
        alert("Agente adicionado. A pagina sera recarregada.");
        location.reload();
      });
    }
  </script>`;
}

function adminModal() {
  return `<div class="admin-modal" id="adminAgentModal" role="dialog" aria-modal="true">
    <form class="admin-box" id="agentCreateForm">
      <h2>Adicionar novo agente</h2>
      <div class="admin-grid">
        <label>Area<input name="area" required placeholder="Ex.: Financas"></label>
        <label>Nome do agente<input name="agent" required placeholder="Ex.: Agente de conciliacao bancaria"></label>
        <label>Tipo<select name="copilotType">
          <option>Copilot Studio + Power Automate</option>
          <option>Agent Builder</option>
          <option>Microsoft 365 Copilot</option>
          <option>Copilot Cowork (Frontier)</option>
          <option>Dynamics 365 built agent</option>
        </select></label>
        <label>Complexidade<select name="complexity">
          <option>Baixa/Media</option>
          <option>Media</option>
          <option>Media/Alta</option>
          <option>Alta</option>
        </select></label>
        <label class="admin-wide">Objetivo<textarea name="objective" required></textarea></label>
        <label>Trigger<textarea name="trigger"></textarea></label>
        <label>Entradas<textarea name="inputs"></textarea></label>
        <label>Sistemas<textarea name="systems"></textarea></label>
        <label>Acoes<textarea name="actions" required></textarea></label>
        <label>Saidas<textarea name="outputs" required></textarea></label>
        <label>KPI<textarea name="kpi"></textarea></label>
        <label>Fonte/URL<input name="url" placeholder="https://..."></label>
        <label class="admin-wide">Observacoes<textarea name="notes"></textarea></label>
      </div>
      <div class="admin-actions">
        <button type="button" class="secondary" id="closeAdminAgent">Cancelar</button>
        <button type="submit">Salvar agente</button>
      </div>
    </form>
  </div>`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(headers, items) {
  return [headers.join(","), ...items.map(item => headers.map(header => csvEscape(item[header])).join(","))].join("\r\n");
}

function scoreFor(row) {
  let score = 3;
  const text = `${row.agent} ${row.objective} ${row.actions} ${row.copilotType || ""}`.toLowerCase();
  if (/(api|erp|dynamics|servicenow|jira|dataverse|sap|salesforce|foundry|ocr|invoice|contrato|risk|workflow|aprova)/.test(text)) score += 1;
  if (/(cowork|multi|supervisor|orquestra|autonom|agent flow|computer use|write-back|atualiza|cria caso|planner|approval)/.test(text)) score += 1;
  return Math.max(1, Math.min(5, score));
}

function priorityFor(score) {
  return score >= 5 ? "Alta - demo diferenciada" : score >= 4 ? "Alta" : score === 3 ? "Media" : "Baixa";
}

function licenseFor(type = "") {
  if (/Cowork|Researcher|Analyst|Work IQ/.test(type)) return "Exige Microsoft 365 Copilot add-on / Frontier quando aplicavel";
  if (/Agent Builder|Declarative/.test(type)) return "Pode funcionar com Copilot Chat; com add-on ganha Work grounding completo";
  if (/Studio/.test(type)) return "Copilot Studio incluido para usuarios M365 Copilot; sem add-on pode gerar consumo/PAYG";
  return "Depende do canal e dos conectores";
}

async function addAgent(req, res, session) {
  if (!session) {
    json(res, 401, { error: "login_required" });
    return;
  }
  if (session.role !== "admin") {
    json(res, 403, { error: "Apenas admin pode adicionar agentes." });
    return;
  }
  const payload = await readBody(req);
  for (const field of ["area", "agent", "objective", "actions", "outputs"]) {
    if (!String(payload[field] || "").trim()) {
      json(res, 400, { error: `Campo obrigatorio ausente: ${field}` });
      return;
    }
  }
  const dataPath = path.join(dataDir, "catalogo-agentes-data.json");
  const csvPath = path.join(dataDir, "agentes.csv");
  const data = JSON.parse(await fs.readFile(dataPath, "utf8"));
  const headers = String(await fs.readFile(csvPath, "utf8")).split(/\r?\n/, 1)[0].split(",");
  const next = Math.max(0, ...data.rows.map(row => Number(String(row.id || "").replace(/\D/g, "")) || 0)) + 1;
  const score = scoreFor(payload);
  const row = {
    id: `AG-${String(next).padStart(3, "0")}`,
    category: "Adicionado pelo admin",
    area: String(payload.area).trim(),
    agent: String(payload.agent).trim(),
    maturity: "Piloto local",
    copilotType: String(payload.copilotType || "Copilot Studio + Power Automate").trim(),
    license: licenseFor(String(payload.copilotType || "")),
    channel: "Teams, Microsoft 365 Copilot ou portal interno",
    trigger: String(payload.trigger || "Solicitacao manual, evento de negocio ou rotina agendada").trim(),
    objective: String(payload.objective).trim(),
    inputs: String(payload.inputs || "Arquivos, mensagens, planilhas, registros de sistema e politicas internas").trim(),
    systems: String(payload.systems || "SharePoint, Outlook, Teams, Excel, Dataverse, Power Automate e sistemas de negocio").trim(),
    actions: String(payload.actions).trim(),
    outputs: String(payload.outputs).trim(),
    demo: `Demonstre pedindo ao agente: "Execute ${String(payload.agent).trim()} com dados anonimizados e gere as proximas acoes."`,
    differentiator: "Adicionado pelo admin para avaliacao de piloto e treinamento.",
    implementation: "Validar fontes, conectores, owner de processo e pontos de aprovacao antes de publicar.",
    complexity: String(payload.complexity || "Media").trim(),
    governance: "Permissoes por usuario, DLP, registro de fontes, avaliacao de qualidade e aprovacao para write-back.",
    kpi: String(payload.kpi || "Tempo economizado, SLA, qualidade da decisao e retrabalho evitado.").trim(),
    priority: priorityFor(score),
    trainingScore: score,
    source: payload.url ? "Adicionado pelo admin com fonte" : "Adicionado pelo admin",
    url: String(payload.url || "").trim(),
    notes: String(payload.notes || "").trim()
  };
  data.rows.push(row);
  data.topRows = [...data.rows].sort((a, b) => Number(b.trainingScore || 0) - Number(a.trainingScore || 0) || String(a.area).localeCompare(String(b.area))).slice(0, 40);
  data.coworkRows = data.rows.filter(item => /cowork/i.test([item.category, item.copilotType, item.agent].join(" ")));
  data.summary = {
    total: data.rows.length,
    highPriority: data.rows.filter(item => String(item.priority || "").startsWith("Alta")).length,
    cowork: data.coworkRows.length,
    sources: data.sourceCatalog.length,
    sourcedRows: data.rows.filter(item => item.url).length
  };
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8");
  await fs.writeFile(csvPath, toCsv(headers, data.rows), "utf8");
  json(res, 201, { row, summary: data.summary });
}

async function handleApi(req, res, session) {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/session" && req.method === "GET") {
    json(res, 200, { authenticated: Boolean(session), user: session ? { username: session.username, role: session.role } : null });
    return;
  }
  if (url.pathname === "/api/login" && req.method === "POST") {
    const body = await readBody(req, 8 * 1024);
    const users = await loadUsers();
    const user = users.find(item => item.username === body.username);
    if (!user || !verifyPassword(String(body.password || ""), user.password)) {
      json(res, 401, { error: "invalid_credentials" });
      return;
    }
    const token = crypto.randomBytes(32).toString("base64url");
    sessions.set(token, { username: user.username, role: user.role, expiresAt: Date.now() + sessionTtlMs });
    json(res, 200, { ok: true, user: { username: user.username, role: user.role } }, { "Set-Cookie": sessionCookie(token) });
    return;
  }
  if (url.pathname === "/api/logout" && req.method === "POST") {
    const token = parseCookies(req)[cookieName];
    if (token) sessions.delete(token);
    json(res, 200, { ok: true }, { "Set-Cookie": clearCookie() });
    return;
  }
  if (url.pathname === "/api/agents" && req.method === "POST") {
    await addAgent(req, res, session);
    return;
  }
  json(res, 404, { error: "not_found" });
}

const server = http.createServer(async (req, res) => {
  try {
    const session = sessionFromReq(req);
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res, session);
      return;
    }
    await serveStatic(req, res, session);
  } catch (error) {
    json(res, 500, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Dashboard local seguro: http://127.0.0.1:${port}/`);
});
