# Dashboard de Agentes Copilot

Dashboard estatico para publicar no GitHub Pages, com modo local seguro para login e administracao.

## Visao geral

- **Total atual:** 370 agentes operacionais.
- **Fontes catalogadas:** 45.
- **Trilha rapida:** 130 agentes de prompt + arquivos, sem conector complexo.
- **Publicacao:** GitHub Pages read-only para consulta e treinamento.
- **Administracao:** servidor local Node com login para cadastrar novos agentes antes de publicar.

## Modos de uso

- **Inicio guiado:** `catalogos.html` ajuda usuarios novos a escolher entre agentes, prompts recorrentes e trilhas sem add-on.
- **GitHub Pages:** publico e read-only. Ideal para consulta e apresentacao.
- **Servidor local:** protegido por login, com perfis `admin` e `usuario`. Use para cadastrar novos agentes e testar mudancas antes de publicar.

## Modos de leitura do agente

- **Lateral:** bom para triagem rapida enquanto compara varios agentes.
- **Inferior:** bom para leitura detalhada; a lista fica compacta e o agente selecionado abre em duas colunas.
- **Foco:** bom para treinamento, apresentacao e copia do prompt/roteiro.

## Trilha sem conector complexo

O catalogo inclui uma categoria chamada **Prompt + arquivos / sem conector**. Ela foi criada para demos rapidas em que o usuario testa com documentos, planilhas, PDFs, CSVs, transcricoes, decks ou pastas do OneDrive/SharePoint, sem depender de Copilot Studio, API, ERP ou write-back em sistemas.

Use o filtro **Tipo > M365 Copilot / Agent Builder + arquivos** para encontrar esses casos.

Casos tipicos:

- comparar contratos, propostas, curriculos, politicas ou cronogramas;
- analisar planilhas/CSVs com variancias, outliers, divergencias e tendencias;
- transformar transcricoes, atas ou chats exportados em acoes, FAQs e handoffs;
- criar scorecards, checklists, matrizes de decisao, briefings e roteiros de treinamento;
- montar agentes simples em OneDrive, SharePoint ou Agent Builder com fontes limitadas.

## Trilha de prompts recorrentes

Tambem existe uma biblioteca separada para criar habito diario/semanal com Copilot antes de partir para agentes complexos:

- **Total atual:** 378 prompts recorrentes.
- **Fontes fora da Microsoft:** 15 fontes, com 180 prompts adaptados de comunidades, Zapier, Slack, Notion, Dify, Needle, Google/Gemini e padroes de reuniao.
- `prompts-agendados.html`: dashboard estatico com filtros por area, cadencia, licenca, modo de execucao e dados usados.
- `data/prompts-agendados.csv`: base editavel com os prompts.
- `data/prompts-agendados-data.json`: base estruturada do dashboard.
- `docs/PROMPTS_AGENDADOS.md`: metodologia, regra de licenciamento e fontes.

A regra principal: **prompts agendados nativos exigem Microsoft 365 Copilot**. Para usuarios sem add-on, use lembretes recorrentes no Outlook/Teams/To Do com o prompt salvo e execute manualmente com arquivos anexados ou abertos.

## Publicar no GitHub Pages

1. Crie um repositorio no GitHub.
2. Envie todo o conteudo desta pasta para a raiz do repositorio.
3. No GitHub, abra Settings > Pages.
4. Em Build and deployment, selecione Deploy from a branch.
5. Escolha a branch main e a pasta /root.
6. Abra a URL gerada pelo GitHub Pages.

## Atualizar a base por planilha

O arquivo mais simples para editar e `data/agentes.csv`.

1. Abra `data/agentes.csv` no Excel.
2. Edite ou adicione linhas mantendo os nomes das colunas.
3. Salve como CSV UTF-8.
4. Rode:

```bash
node scripts/csv-to-json.mjs
```

5. Faca commit de `data/agentes.csv` e `data/catalogo-agentes-data.json`.

Campos mais importantes para novos agentes:

- `category`: use `Prompt + arquivos / sem conector` para demos simples.
- `copilotType`: use `M365 Copilot / Agent Builder + arquivos` quando nao houver conector/API.
- `inputs`: descreva quais arquivos o usuario anexaria.
- `systems`: deixe claro se e apenas OneDrive/SharePoint/arquivos.
- `demo`: escreva um prompt pronto para copiar.
- `governance`: inclua permissao, fonte, revisao humana e cuidado com dados sensiveis.

Tambem existem:

- `data/fontes.csv`: catalogo de fontes.
- `data/como-escolher.csv`: matriz de decisao.
- `data/catalogo-agentes-operacionais-copilot.xlsx`: workbook completo para consulta.

## Atualizacao automatica no GitHub

A pasta `.github/workflows` inclui um workflow que regenera `data/catalogo-agentes-data.json` quando os CSVs mudarem. Para ele conseguir commitar o JSON atualizado, deixe o repositorio com permissao de escrita para GitHub Actions em Settings > Actions > General > Workflow permissions.

## Login e administracao local

Gere credenciais:

```bash
node scripts/setup-local-auth.mjs
```

Rode o servidor local:

```bash
node server.mjs
```

Abra:

```text
http://127.0.0.1:8787/
```

Documentacao detalhada:

- `docs/CATALOG_MAINTENANCE.md`
- `docs/LOCAL_TESTING.md`
- `docs/SECURITY_REVIEW.md`
