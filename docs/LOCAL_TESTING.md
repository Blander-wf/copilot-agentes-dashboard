# Ambiente local de testes

Use este modo quando precisar de login, perfis de usuario e cadastro de novos agentes. O GitHub Pages continua sendo uma publicacao estatica e read-only.

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
