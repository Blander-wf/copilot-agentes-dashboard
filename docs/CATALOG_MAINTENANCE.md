# Manutencao do catalogo

Este documento explica como manter a base de agentes, especialmente a trilha de demos simples com prompt + arquivos.

## Estado atual

- Total atual: 401 agentes.
- Fontes catalogadas: 54.
- Casos Cowork: 27, incluindo 9 casos com vídeo direto validado.
- Trilha sem conector complexo: 130 agentes.
- Tipo recomendado para demos simples: `M365 Copilot / Agent Builder + arquivos`.
- Categoria recomendada para demos simples: `Prompt + arquivos / sem conector`.

## Quando usar a trilha simples

Use esta trilha quando o agente puder ser testado com:

- documentos Word, PDFs, PowerPoints ou politicas;
- planilhas Excel, CSVs ou exports manuais;
- transcricoes de reuniao, atas, chats ou emails exportados;
- pastas do OneDrive ou SharePoint;
- instrucoes do Agent Builder, sem API, ERP, Copilot Studio ou write-back.

Bons exemplos:

- comparar contratos, propostas, curriculos, cronogramas ou politicas;
- analisar variancias, outliers, divergencias e tendencias em planilhas;
- transformar atas/transcricoes em acoes, donos e prazos;
- criar scorecards, matrizes de decisao, briefings, FAQs e roteiros;
- montar um agente de consulta sobre uma pasta de documentos.

## Arquivos principais

- `data/agentes.csv`: fonte editavel principal.
- `data/catalogo-agentes-data.json`: JSON consumido pelo dashboard.
- `data/fontes.csv`: lista de fontes usadas no catalogo.
- `data/como-escolher.csv`: matriz de decisao.
- `data/catalogo-agentes-operacionais-copilot.xlsx`: workbook completo para consulta.
- `agentes.html`: dashboard público de agentes.
- `index.html` e `catalogos.html`: guia e hub de adoção.

## Arquivos da trilha de prompts recorrentes

- `prompts-agendados.html`: dashboard de prompts diarios, semanais, mensais e recorrentes manuais.
- `data/prompts-agendados.csv`: fonte editavel da biblioteca de prompts.
- `data/prompts-agendados-data.json`: JSON consumido pelo dashboard de prompts.
- `docs/PROMPTS_AGENDADOS.md`: metodologia, fontes e regra de licenciamento.

Use esta trilha quando a conversa for sobre **habito de uso**: briefing matinal, pendencias de fim do dia, planejamento semanal, resumo de projeto, revisao de arquivos ou analise recorrente de planilhas/CSVs.

Estado atual da trilha:

- 378 prompts recorrentes.
- 24 fontes catalogadas.
- 180 prompts adaptados de fontes fora da Microsoft.
- 90 prompts para usuarios sem add-on / com arquivos.

Regra pratica:

- `Prompt agendado nativo`: exige Microsoft 365 Copilot add-on.
- `Lembrete manual recorrente`: funciona bem para usuarios sem add-on, desde que eles executem o prompt manualmente e anexem/abram os arquivos certos.
- `Workflows / Power Automate`: use quando a saida precisa ser enviada, registrada ou virar tarefa.
- `Copilot Cowork / Frontier`: use para pacotes de trabalho multi-etapa com checkpoints.

## Campos importantes em `data/agentes.csv`

- `category`: familia do caso. Use `Prompt + arquivos / sem conector` para demos simples.
- `area`: area de negocio.
- `agent`: nome curto e especifico.
- `copilotType`: tecnologia/caminho sugerido.
- `license`: observacao de licenca.
- `trigger`: quando o agente seria usado.
- `objective`: objetivo em linguagem de negocio.
- `inputs`: arquivos ou dados de entrada.
- `systems`: onde o agente busca informacao. Para trilha simples, prefira OneDrive, SharePoint e arquivos.
- `actions`: o que o agente faz.
- `outputs`: entregaveis esperados.
- `demo`: prompt pronto para copiar.
- `governance`: cuidados, permissoes e revisao humana.
- `source` e `url`: referencia usada.

## Critérios para casos com vídeo

Inclua um vídeo como caso operacional apenas quando:

- a URL direta estiver ativa e os metadados forem confirmados no YouTube;
- o conteúdo descrever um caso concreto, com entradas, ações e entregáveis replicáveis;
- o caso acrescentar um padrão novo, sem duplicar um playbook existente;
- o resumo deixar claro se a fonte é oficial ou comunitária;
- licenças, conectores, permissões, custos e checkpoints forem registrados quando relevantes.

Não promova a caso operacional notícias repetidas, roundups, comparativos opinativos, títulos de marketing sem fluxo concreto ou vídeos sem URL confirmada. Esses materiais podem permanecer apenas como fonte de contexto.

Para vídeos aprovados, use `category: Cowork - caso em video`, informe a URL do YouTube em `url` e registre a data de validação em `notes`. O dashboard identifica a URL, mostra o filtro `Com vídeo` e cria o link `Assistir no YouTube`.

## Padrao para novos agentes simples

Use este modelo:

```text
category: Prompt + arquivos / sem conector
copilotType: M365 Copilot / Agent Builder + arquivos
systems: OneDrive, SharePoint, Word, Excel, PowerPoint, PDF, CSV, transcricoes e arquivos anexados; sem write-back em sistemas.
complexity: Baixa
priority: Alta - demo rapida sem conector
governance: Permissoes herdadas dos arquivos, fonte citada, dados anonimizados em demo e revisao humana antes de decisao.
```

## Atualizar a base

Depois de editar `data/agentes.csv`, rode:

```powershell
node scripts/csv-to-json.mjs
```

Se editar o gerador principal na raiz do workspace, rode:

```powershell
cd "C:\Users\aleja\Documents\Codex\2026-05-23\estamos-implementando-o-copilot-gpt5-5"
node ".\build_copilot_agent_examples.mjs"
node ".\build_catalog_hub.mjs"
```

Se editar a biblioteca de prompts recorrentes, rode:

```powershell
cd "C:\Users\aleja\Documents\Codex\2026-05-23\estamos-implementando-o-copilot-gpt5-5"
node ".\build_scheduled_prompt_catalog.mjs"
node ".\build_catalog_hub.mjs"
```

## Validacao rapida

Antes de publicar, confirme:

- total de agentes esperado;
- zero duplicados por `area + agent`;
- todos os agentes novos tem `source` e `url`;
- `demo` e `outputs` estao prontos para treinamento;
- nenhum dado real de cliente foi colocado nos arquivos publicados.

## Publicar

Na raiz do workspace:

```powershell
node ".\publish_github_api.mjs"
```

Depois valide:

```text
https://blander-wf.github.io/copilot-agentes-dashboard/
```

Se o navegador mostrar versao antiga, use Ctrl+F5 ou acrescente `?v=algum-texto` ao final da URL.
