---
description: Adiciona atributos data-test nos elementos de UI para automação de testes.
agent: build
---

Você é um assistente especializado em preparar interfaces para automação de testes.

## Instruções

### 0. Escolha do escopo

Pergunte ao usuário: **"Deseja varrer o projeto todo ou apenas as alterações atuais (git diff)?**"

- Se **projeto todo**: varra `src/components/`, `src/pages/` e `src/modals/`.
- Se **apenas alterações atuais**: use `git diff --name-only` para listar os arquivos modificados e não comitados, filtre apenas os que estão em `src/components/`, `src/pages/` ou `src/modals/`, e processe somente esses.

1. Varra os arquivos definidos no escopo acima e adicione o atributo `data-test` em **elementos interativos** e **células de tabela** (`<th>`, `<td>` e equivalentes MRT). Ignore `<div>`, `<span>`, `<section>` e outros elementos meramente estruturais sem interação.

### Obrigatórios

| Tipo | Onde aplicar | Exemplo de valor |
|---|---|---|
| Botões | `<button>`, `<a role="button">`, componentes Button | `data-test="btn-save"`, `data-test="btn-cancel"` |
| Links | `<a href="...">`, componentes Link / NextLink | `data-test="link-home"`, `data-test="link-edit-user"` |
| Inputs / Form fields | `<input>`, `<select>`, `<textarea>`, componentes Input / Select | `data-test="input-name"`, `data-test="select-status"` |
| Ações | Ícones clicáveis, botões de ação, `onClick` em elementos interativos | `data-test="action-edit"`, `data-test="action-delete"`, `data-test="action-view"` |
| Menus | Menu raiz e cada item de menu | `data-test="menu-user"`, `data-test="menu-item-profile"` |
| Listas | Container `<ul>`, `<ol>` e cada `<li>` | `data-test="list-users"`, `data-test="item-user-{id}"` |
| Tabelas (HTML) | `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | `data-test="table-orders"`, `data-test="row-order-{id}"`, `data-test="cell-{rowId}-{columnName}"` |
| Tabelas (MRT) | `muiTableHeadCellProps`, `muiTableBodyCellProps` (nas colunas), `muiTableBodyRowProps` (no `styleConfig`) | `data-test="table-orders"`, `data-test="row-order-{id}"`, `data-test="cell-{rowId}-{columnName}"` |

### Regras de nomenclatura

- Use **kebab-case** para nomes de elementos: `btn-save-user`
- Os valores de `data-test` devem ser sempre em **inglês**
- Use prefixo que identifique o tipo do elemento: `btn-`, `input-`, `link-`, `action-`, `menu-`, `row-`, `cell-`, `header-`
- Quando houver listas/tabelas com dados dinâmicos, use o identificador do registro (do **objeto de dados**, não da tabela): `data-test="row-pedido-${pedido.id}"`
- Para células de tabela, use o identificador da linha (do objeto de dados) + nome da coluna: `data-test="cell-${pedido.id}-name"`, `data-test="cell-${pedido.id}-status"`
- Importante: o identificador da linha deve vir **do objeto de dados** (`cliente.id`, `pedido.name`), **nunca** do ID interno da tabela (`row.id` do MRT). Use `row.original.id` no MRT para acessar o dado original.
- Se o elemento já tiver um `id` ou `name` semântico, reutilize-o como base: `data-test="input-${name}"`
- Evite valores genéricos como `data-test="botao"` ou `data-test="input"`
- `data-test` deve ser **estático** — não pode mudar conforme interação do usuário (ex.: radio ao ser selecionado, toggle ao ser ativado, accordion ao expandir). O valor deve ser o mesmo independente do estado.

### Estratégia de execução

1. Varra apenas os diretórios `src/components/`, `src/pages/` e `src/modals/`.
2. Priorize **componentes reutilizáveis** (pasta `components/`), pois o atributo será herdado por todas as instâncias.
3. Para componentes de biblioteca (MUI, Radix, Chakra, etc.), prefira passar `data-test` via `slotProps`, `componentsProps` ou `inputProps` quando disponível.
4. Se o componente aceitar `data-test` via props, adicione a prop na interface do componente.
5. **Não remova** atributos existentes como `id`, `name`, `aria-label`. Adicione `data-test` como complemento.
6. **Não altere** elementos que já possuem `data-test`. Pule-os.
7. O **plugin Babel** (`babel-plugin-auto-data-test.ts`) gera `data-test` automaticamente para elementos com CSS Modules (`styles.xxx`). Ele **não cobre** tabelas MRT (`muiTableHeadCellProps`, `muiTableBodyCellProps`, `muiTableBodyRowProps`), pois essas props não usam `className` diretamente. Portanto, **sempre adicione manualmente** `data-test` nas props de colunas e linhas do MRT, conforme as seções abaixo.

### Tabelas HTML nativas

Para tabelas HTML comuns (`<table>`, `<tr>`, `<td>`, `<th>`):

**Todas as células são obrigatórias**, tanto cabeçalho quanto corpo.

| Onde | Atributo | Exemplo |
|---|---|---|
| `<table>` | `data-test="table-{nome}"` | `data-test="table-clients"` |
| `<thead>` | `data-test="thead-{nome}"` | `data-test="thead-clients"` |
| `<tbody>` | `data-test="tbody-{nome}"` | `data-test="tbody-clients"` |
| `<tr>` (linha) | `data-test="row-{id}"` | `data-test="row-${client.id}"` |
| `<th>` (cabeçalho) | `data-test="header-{columnName}"` | `data-test="header-name"` |
| `<td>` (célula) | `data-test="cell-{rowId}-{columnName}"` | `data-test="cell-${client.id}-name"` |

Exemplo:
```tsx
<table data-test="table-clients">
  <thead>
    <tr>
      <th data-test="header-name">Nome</th>
      <th data-test="header-email">Email</th>
    </tr>
  </thead>
  <tbody>
    {clients.map((client) => (
      <tr key={client.id} data-test={`row-${client.id}`}>
        <td data-test={`cell-${client.id}-name`}>{client.name}</td>
        <td data-test={`cell-${client.id}-email`}>{client.email}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Tabelas com `material-react-table` (MRT)

O projeto usa `material-react-table` (v3). Não há tags HTML `<table>`, `<td>`, `<tr>`. O `data-test` deve ser aplicado via props do MRT.

**Todas as células são obrigatórias**: cabeçalho (`muiTableHeadCellProps`), corpo (`muiTableBodyCellProps`) e linha (`muiTableBodyRowProps`).

- **Linhas**: use `muiTableBodyRowProps` no `styleConfig` do `CustomMRTTable`. Use `row.original` para acessar os dados reais:
  ```tsx
  muiTableBodyRowProps: ({ row }) => ({
    'data-test': `row-${row.original.id}`,
  })
  ```

- **Células do corpo**: adicione `muiTableBodyCellProps` na **definição de cada coluna** (`MRT_ColumnDef`). **Toda coluna deve ter**, sem exceção:
  ```tsx
  {
    accessorKey: 'name',
    header: 'Nome',
    muiTableBodyCellProps: ({ row }) => ({
      'data-test': `cell-${row.original.id}-name`,
    }),
  }
  ```

- **Células de cabeçalho**: adicione `muiTableHeadCellProps` na **definição de cada coluna**. **Toda coluna deve ter**, sem exceção:
  ```tsx
  {
    accessorKey: 'name',
    header: 'Nome',
    muiTableHeadCellProps: {
      'data-test': 'header-name',
    },
  }
  ```

- Onde houver coluna de ações, adicione `data-test` nos botões dentro do `renderRowActions`. Use `row.original`:
  ```tsx
  <IconButton data-test={`action-edit-${row.original.id}`} onClick={...}>...</IconButton>
  ```

### Validação

- Execute `npm run typecheck` ou comando equivalente para garantir que não houve quebra de tipos.
- Execute `npm run lint` para garantir estilo de código.
- Se houver testes existentes nos arquivos modificados, verifique se continuam passando.
