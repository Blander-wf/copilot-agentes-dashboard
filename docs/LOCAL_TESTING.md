# Ambiente local de testes

Use este modo quando precisar de login, perfis de usuario e cadastro de novos agentes. O GitHub Pages continua sendo uma publicacao estatica e read-only.

## Quando usar

- Testar login `admin` e `usuario`.
- Adicionar agentes pelo formulario.
- Validar novos agentes antes de publicar.
- Conferir a trilha `Prompt + arquivos / sem conector` usando exemplos anonimizados.
- Verificar se `data/agentes.csv` e `data/catalogo-agentes-data.json` foram atualizados.

## 1. Gerar credenciais

```powershell
cd "C:\Users\aleja\Documents\Codex\2026-05-23\estamos-implementando-o-copilot-gpt5-5\github-pages-dashboard"
& "C:\Users\aleja\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\scripts\setup-local-auth.mjs"
```

As senhas serao gravadas em `auth/credentials.local.txt`.

## 2. Rodar o servidor

```powershell
& "C:\Users\aleja\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\server.mjs"
```

Abra:

```text
http://127.0.0.1:8787/
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
& "C:\Users\aleja\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\publish_github_api.mjs"
```

## 5. Rotacionar senhas

```powershell
& "C:\Users\aleja\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\scripts\setup-local-auth.mjs" --force
```

Isso recria `auth/users.local.json` e `auth/credentials.local.txt`.

## 6. Checklist local

Antes de publicar:

- entrar como `usuario` e confirmar que o dashboard abre em modo consulta;
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
- Se o usuario comum conseguir cadastrar agente, revise `server.mjs` e a role usada no login.
