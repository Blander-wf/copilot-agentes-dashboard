# Revisao de seguranca

## Decisao de arquitetura

O GitHub Pages e estatico. Por isso, nao deve ser usado para login real, controle de acesso ou gravacao segura de novos agentes. Qualquer senha ou regra colocada apenas no JavaScript publico pode ser lida e burlada.

Para administracao, este pacote usa `server.mjs`, um servidor local Node que:

- protege `index.html` e `data/*` atras de login;
- usa cookie `HttpOnly` e `SameSite=Strict`;
- mantem sessoes em memoria;
- armazena apenas hashes `scrypt` das senhas;
- permite `POST /api/agents` apenas para role `admin`;
- grava novos agentes em `data/agentes.csv` e `data/catalogo-agentes-data.json`.

## Arquivos sensiveis

Estes arquivos sao locais e ignorados pelo Git:

- `auth/users.local.json`
- `auth/credentials.local.txt`
- `.github-token.local`
- `*.token`
- `*.secret`

Nao publique esses arquivos.

## Senhas

As senhas sao geradas com `crypto.randomBytes` e hash `scrypt`. Para trocar senhas:

```bash
node scripts/setup-local-auth.mjs --force
```

## Limitacoes conhecidas

- O servidor local usa HTTP em `127.0.0.1`. Em producao, use HTTPS.
- As sessoes ficam em memoria e caem quando o servidor reinicia.
- Nao ha recuperacao de senha; rotacione via script.
- O modo GitHub Pages continua publico/read-only.
- O token GitHub usado para publicar deve ser rotacionado periodicamente.

## Recomendacao para producao

Para login corporativo real, use:

- Azure Static Web Apps + Microsoft Entra ID;
- Azure App Service/Container Apps com Entra ID;
- Cloudflare Access/Zero Trust na frente de uma app estatica;
- GitHub OAuth App ou GitHub App com backend proprio.

O papel `admin` deve vir de grupo/claim corporativo, nao de senha compartilhada.

## Checklist antes de publicar

- Confirmar que `auth/` nao foi incluido no commit.
- Confirmar que `.github-token.local` nao foi incluido no commit.
- Revisar se `data/agentes.csv` nao contem dados sensiveis de clientes.
- Revisar URLs de fontes antes de publicar.
- Rodar teste local como `usuario` e como `admin`.
