# Ambiente local de testes

Use este modo para consultar o dashboard localmente e, quando necessario, entrar na area protegida para cadastrar novos agentes. O GitHub Pages continua sendo uma publicacao estatica e read-only.

## Quando usar

- Testar a consulta publica e, quando `LOCAL_REQUIRE_LOGIN=true`, os logins `admin` e `usuario`.
- Adicionar agentes pelo formulario.
- Validar novos agentes antes de publicar.
- Conferir a trilha `Prompt + arquivos / sem conector` usando exemplos anonimizados.
- Verificar se `data/agentes.csv` e `data/catalogo-agentes-data.json` foram atualizados.

## 1. Consultar o dashboard localmente

Nao abra `agentes.html` com duplo clique: o navegador bloqueia a leitura do JSON quando a pagina usa `file://`.

Rode:

```powershell
cd "C:\Users\aleja\Documents\Codex\2026-05-23\estamos-implementando-o-copilot-gpt5-5\github-pages-dashboard"
node ".\server.mjs"
```

Abra:

```text
http://127.0.0.1:8787/agentes.html
```

A consulta aos catalogos e publica por padrao. A administracao e qualquer gravacao continuam protegidas.

## 2. Gerar credenciais para administrar

```powershell
cd "C:\Users\aleja\Documents\Codex\2026-05-23\estamos-implementando-o-copilot-gpt5-5\github-pages-dashboard"
node ".\scripts\setup-local-auth.mjs"
```

As senhas serao gravadas em `auth/credentials.local.txt`.

Para entrar como administrador, abra:

```text
http://127.0.0.1:8787/admin
```

Se for necessario exigir login tambem para consultar os catalogos:

```powershell
$env:LOCAL_REQUIRE_LOGIN="true"
node ".\server.mjs"
```

## 3. Perfis

- `admin`: acessa o dashboard e pode adicionar agentes.
- `usuario`: acessa o dashboard em modo consulta.

## 4. Adicionar agente

1. Entre como `admin`.
2. Clique em `Adicionar agente`.
3. Preencha os campos obrigatorios.
4. Salve.

O servidor atualiza:

- `data/catalogo-agentes-data.json`
- `data/agentes.csv`

Para agentes simples de prompt + arquivos, use:

- `category`: `Prompt + arquivos / sem conector`
- `copilotType`: `M365 Copilot / Agent Builder + arquivos`
- `systems`: OneDrive, SharePoint, Word, Excel, PDF, CSV, transcricoes e arquivos anexados; sem write-back.
- `complexity`: `Baixa`
- `priority`: `Alta - demo rapida sem conector`

Depois, publique novamente usando o script da raiz do workspace:

```powershell
cd "C:\Users\aleja\Documents\Codex\2026-05-23\estamos-implementando-o-copilot-gpt5-5"
node ".\publish_github_api.mjs"
```

## 5. Rotacionar senhas

```powershell
node ".\scripts\setup-local-auth.mjs" --force
```

Isso recria `auth/users.local.json` e `auth/credentials.local.txt`.

## 6. Checklist local

Antes de publicar:

- abrir sem login e confirmar que os dois dashboards carregam em modo consulta;
- opcionalmente iniciar com `LOCAL_REQUIRE_LOGIN=true`, entrar como `usuario` e confirmar o modo consulta;
- entrar como `admin` e testar o formulario de novo agente;
- confirmar que o total de agentes aparece corretamente no topo;
- filtrar por `Tipo > M365 Copilot / Agent Builder + arquivos`;
- testar os modos de leitura `Lateral`, `Inferior` e `Foco`;
- confirmar que nenhum arquivo em `auth/` sera publicado;
- revisar se os dados novos sao exemplos anonimizados.

## 7. Problemas comuns

- Se o navegador mostrar dados antigos, use `Ctrl+F5`.
- Se o GitHub Pages demorar a atualizar, aguarde alguns segundos e use `?v=teste` na URL.
- Se o dashboard mostrar `0 agentes`, confira se `data/catalogo-agentes-data.json` existe e se o HTML usa `agent-data-url`.
- Se abriu o arquivo por duplo clique e apareceu erro de carregamento, feche a aba e use `http://127.0.0.1:8787/agentes.html`.
- Se o usuario comum conseguir cadastrar agente, revise `server.mjs` e a role usada no login.
