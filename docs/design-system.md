# Identidade visual do SISAGEN

A interface usa como referência os portais [Governo do Piauí](https://www.pi.gov.br/) e [Gov.pi Cidadão](https://pidigital.pi.gov.br/), consultados em 20/10/2026. As cores e a família Montserrat foram conferidas nos estilos publicados pelo portal institucional.

## Tokens

Os tokens estão em `frontend/src/index.css`. Os componentes e layouts usam esses valores em `frontend/src/App.css`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--primary` | `#034EA2` | Ações principais, navegação, ícones |
| `--primary-dark` | `#023E81` | Barra institucional, títulos, hover |
| `--green` | `#006B2D` | Conclusão, confirmação e identidade |
| `--yellow` | `#FDB913` | Pendências e detalhes da identidade |
| `--red` | `#EF4123` | Detalhe da faixa institucional |
| `--ink` | `#24364B` | Texto principal |
| `--muted` | `#647286` | Texto secundário |
| `--canvas` | `#F5F7FA` | Fundo das páginas |
| `--soft` | `#EDF4FC` | Superfícies de apoio |
| `--border` | `#DFE6EE` | Divisores e contornos |
| `--radius` | `10px` | Cartões |

Os estados de erro usam vermelho escuro para legibilidade. As situações de pendência e conclusão têm texto e indicador visual, além da cor.

## Componentes

- `GovernmentBar`, `GovernmentBrand` e `GovernmentFooter`: identificação institucional e links públicos.
- `Layout`: cabeçalho, navegação com página ativa e menu móvel.
- `PageHeader`, `Stats` e `Section`: hierarquia consistente nas telas de fila, usuários, cadastro e detalhes.
- `StatusBadge`, `Notice` e `Modal`: estados, feedback e diálogos.
- Botões, campos, filtros, tabelas e paginação compartilham os estilos globais.

## Responsividade e acessibilidade

Abaixo de 900px, as páginas passam a uma coluna principal e as tabelas reduzem informações secundárias. Abaixo de 640px, as solicitações são apresentadas em cartões, o menu é recolhido e os campos usam fonte de 16px. O rodapé de ações do formulário mantém suporte à área segura do dispositivo.

O menu aceita Escape e clique externo. Os diálogos usam o elemento nativo `dialog` e restauram o foco ao fechar. A navegação possui atalho para o conteúdo, foco visível e identificação da página atual.

## Arquivos locais

A marca em `frontend/public/brand/governo-piaui.svg` veio de `https://www.pi.gov.br/wp-content/uploads/2024/11/logo_color.svg`. Montserrat está em `frontend/public/fonts/`, com licença SIL Open Font License em `OFL.txt`. Esses recursos são servidos pela aplicação, sem dependência de fontes ou imagens externas durante o uso.

## Verificação

Em `frontend/`, executar `npm run build`, `npm run lint`, `npm test` e, com o Vite ativo, `npm run test:ui`. O teste visual existente percorre as cinco telas nas larguras de 1440, 768, 390 e 320px, além de validar filtros, rascunho, diálogos e navegação por teclado.
