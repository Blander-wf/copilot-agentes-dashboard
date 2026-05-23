# Dashboard de Agentes Copilot

Dashboard estatico para publicar no GitHub Pages, com modo local seguro para login e administracao.

## Modos de uso

- **GitHub Pages:** publico e read-only. Ideal para consulta e apresentacao.
- **Servidor local:** protegido por login, com perfis `admin` e `usuario`. Use para cadastrar novos agentes e testar mudancas antes de publicar.

## Modos de leitura do agente

- **Lateral:** bom para triagem rapida enquanto compara varios agentes.
- **Inferior:** bom para leitura detalhada; a lista fica compacta e o agente selecionado abre em duas colunas.
- **Foco:** bom para treinamento, apresentacao e copia do prompt/roteiro.

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

- `docs/LOCAL_TESTING.md`
- `docs/SECURITY_REVIEW.md`
