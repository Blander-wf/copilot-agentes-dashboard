# Dashboard de Agentes Copilot

Dashboard estatico para publicar no GitHub Pages.

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

5. Faça commit de `data/agentes.csv` e `data/catalogo-agentes-data.json`.

Tambem existem:

- `data/fontes.csv`: catalogo de fontes.
- `data/como-escolher.csv`: matriz de decisao.
- `data/catalogo-agentes-operacionais-copilot.xlsx`: workbook completo para consulta.

## Atualizacao automatica no GitHub

A pasta `.github/workflows` inclui um workflow que regenera `data/catalogo-agentes-data.json` quando os CSVs mudarem. Para ele conseguir commitar o JSON atualizado, deixe o repositorio com permissao de escrita para GitHub Actions em Settings > Actions > General > Workflow permissions.
