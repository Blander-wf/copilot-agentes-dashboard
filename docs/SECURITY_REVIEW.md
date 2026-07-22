# Revisao de seguranca

## Decisao de arquitetura

O GitHub Pages e estatico. Por isso, nao deve ser usado para login real, controle de acesso ou gravacao segura de novos agentes. Qualquer senha ou regra colocada apenas no JavaScript publico pode ser lida e burlada.

Todo conteudo publicado em GitHub Pages deve ser tratado como publico: `index.html`, `data/*.json`, `data/*.csv`, `data/*.xlsx` e os documentos em `docs/`.

Para administracao, este pacote usa `server.mjs`, um servidor local Node que:

- libera a consulta de `agentes.html`, `prompts-agendados.html` e `data/*` por padrao;
- permite exigir login tambem na consulta com `LOCAL_REQUIRE_LOGIN=true`;
- protege a rota `/admin` e toda gravacao;
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

## Dados do catalogo

O catalogo deve conter exemplos, fontes publicas e descricoes genericas. Nao inclua:

- nomes reais de clientes, funcionarios ou fornecedores;
- contratos, propostas, politicas internas ou tickets reais;
- URLs privadas;
- emails ou transcricoes reais;
- dados pessoais, financeiros ou regulados.

Para a trilha `Prompt + arquivos / sem conector`, use arquivos ficticios ou anonimizados nos treinamentos. O dashboard pode sugerir que o usuario teste com arquivos reais no ambiente dele, mas a base publicada nao deve conter esses arquivos nem trechos sensiveis.

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
- No modo local padrao, os dados dos catalogos tambem sao legiveis sem login; nao trate o servidor local como cofre de dados.
- O token GitHub usado para publicar deve ser rotacionado periodicamente.
- O controle de acesso local nao substitui Entra ID, SSO ou RBAC corporativo.
- Agentes que usam arquivos respeitam permissoes do Microsoft 365, mas o catalogo publicado nao aplica essas permissoes.

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
- Rodar teste de consulta sem login, da rota `/admin` e da gravacao autenticada como `admin`.
- Se `LOCAL_REQUIRE_LOGIN=true` for usado, testar tambem o perfil `usuario`.
- Confirmar que `data/catalogo-agentes-data.json` carrega o total esperado de agentes.
- Confirmar que a trilha simples nao promete automacao/write-back quando o caso usa apenas arquivos.
- Confirmar que prompts de demo nao incentivam envio de dados sensiveis para fora do tenant.
