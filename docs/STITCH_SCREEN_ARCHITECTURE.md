# Arquitetura de Telas

## 1. Resumo do produto

O **Sistema de Agendamento** é uma aplicação web interna destinada a substituir a planilha compartilhada usada para registrar e acompanhar solicitações de agendamento. O MVP deve centralizar os registros em banco de dados, controlar acesso por usuário, reduzir problemas de concorrência e exclusão acidental e permitir acompanhamento claro da fila operacional.

O produto possui três perfis documentados:

- **Agendador**: cadastra novas solicitações, consulta registros, pesquisa a fila e corrige informações permitidas.
- **Cadastrador**: consulta solicitações, acessa os dados necessários ao atendimento e atualiza o status para `Cadastrado` quando conclui o trabalho.
- **Administrador**: executa as operações autorizadas, administra usuários e perfis, consulta histórico e arquiva/restaura registros.

A entidade central é a **Solicitação**, com dados de identificação, endereço, contato, data da solicitação, status, observações e metadados de auditoria.

### Princípios de arquitetura adotados

1. A **fila de solicitações** é a principal área operacional e também concentra os indicadores simples exigidos pelo MVP. Não foi criada uma tela de dashboard separada porque os requisitos não justificam um painel independente.
2. Cadastro e edição utilizam o mesmo padrão de formulário, em dois modos, evitando duplicação estrutural.
3. Histórico fica dentro dos detalhes da solicitação, em aba/seção própria, e não em uma página independente.
4. Arquivados ficam como visão administrativa dentro do módulo de solicitações, não como módulo separado.
5. Cadastro/edição de usuários ocorre em drawer/modal dentro da administração de usuários, evitando uma tela para cada pequena operação administrativa.
6. Operações sensíveis usam confirmação explícita e feedback de sucesso/erro.
7. Nenhuma função fora do escopo inicial foi adicionada.

**Direção visual: não especificada nas fontes.**

---

## 2. Fontes analisadas

### Fonte FNT-001 — Documento de Requisitos de Software

Arquivo: `Documento_Requisitos_Sistema_Agendamento.pdf`  
Versão: 1.0  
Data documentada: 30 de setembro de 2026.

Conteúdo considerado:

- objetivo e escopo do MVP;
- itens fora do escopo;
- perfis de usuário;
- fluxo operacional resumido;
- RF-01 a RF-14;
- RNF-01 a RNF-12;
- RN-01 a RN-10;
- modelo de dados inicial;
- critérios de aceitação;
- priorização de implementação.

### Fonte FNT-002 — Instrução de arquitetura de telas

Arquivo: `Texto colado.txt`.

Usado como especificação do entregável, método de análise, regras para inferências e estrutura esperada do documento.

### Fontes procuradas e não encontradas entre os arquivos disponíveis

Não foram encontrados, no conjunto de arquivos disponível para esta análise:

- `README.md`;
- `AGENTS.md`;
- diretório `/docs` preexistente;
- histórias de usuário independentes;
- casos de uso independentes;
- protótipos visuais;
- Design System;
- código-fonte, rotas ou componentes implementados;
- modelo físico de banco de dados.

Consequentemente, o Documento de Requisitos de Software foi tratado como **fonte de verdade funcional**.

---

## 3. Atores e permissões

### 3.1 Inventário de atores

| Ator | Objetivo operacional | Capacidades confirmadas |
|---|---|---|
| Agendador | Registrar e localizar solicitações | autenticar; cadastrar; consultar; pesquisar/filtrar; corrigir informações permitidas |
| Cadastrador | Localizar solicitações e concluir o cadastro | autenticar; consultar; pesquisar/filtrar; visualizar dados; alterar status para `Cadastrado` |
| Administrador | Administrar operação, auditoria e acessos | todas as operações autorizadas; gerenciar usuários/perfis; consultar histórico; arquivar/restaurar |

### 3.2 Matriz de permissões de interface

Legenda: **C** = confirmado pela fonte; **P** = condicionado a permissão; **—** = não sustentado como capacidade do perfil.

| Operação | Agendador | Cadastrador | Administrador | Evidência |
|---|---:|---:|---:|---|
| Login/logout | C | C | C | RF-01; critério de aceitação 1 |
| Ver fila | C | C | C | perfis; RF-03 |
| Pesquisar/filtrar | C | C | C | RF-04; perfis |
| Ver detalhes | C | C | C | RF-05 |
| Criar solicitação | C | — | C | perfil Agendador; fluxo operacional |
| Editar dados | C, limitado | — | C | RF-06; perfil Agendador |
| Alterar status para `Cadastrado` | — | C | C | RF-07; perfil Cadastrador |
| Arquivar/restaurar | — | — | C | perfil Administrador; RN-04; RN-09 |
| Ver histórico | — | — | C | perfil Administrador; RF-09 |
| Gerenciar usuários/perfis | — | — | C | RF-13; RN-05 |
| Exportar lista filtrada | P | P | P | RF-14; RN-10 |

**AMBIGUIDADE:** o documento não define exatamente quais campos o Agendador pode corrigir nem quais perfis possuem autorização de exportação. A interface deve depender da autorização entregue pelo backend e não assumir permissões adicionais.

### 3.3 Estados de negócio relevantes

- Solicitação ativa com status **Pendente**.
- Solicitação ativa com status **Cadastrado**.
- Solicitação **Arquivada**; não aparece na fila operacional padrão.
- Possível duplicidade detectada; gera **alerta**, mas não bloqueio automático.
- Alteração concorrente/conflito; não pode resultar em perda silenciosa.
- Usuário ativo ou desativado.

---

## 4. Módulos do sistema

### 4.1 Autenticação

**Objetivo:** permitir acesso individual e encerramento de sessão.  
**Usuários:** Agendador, Cadastrador, Administrador.  
**Entidades:** Usuário/Sessão.  
**Tarefas:** autenticar; encerrar sessão; informar falha de credenciais ou sessão expirada.  
**Telas:** SCR-001.

### 4.2 Solicitações

**Objetivo:** substituir a planilha compartilhada por uma fila controlada e rastreável.  
**Usuários:** todos os perfis, respeitando permissões.  
**Entidades:** Solicitação, Histórico de alterações.  
**Tarefas:** listar; pesquisar; filtrar; ordenar; paginar; visualizar; cadastrar; editar; atualizar status; arquivar; restaurar; consultar histórico; exportar quando autorizado.  
**Telas:** SCR-002, SCR-003, SCR-004.

### 4.3 Administração de usuários

**Objetivo:** permitir ao administrador gerenciar contas e perfis de acesso.  
**Usuários:** Administrador.  
**Entidades:** Usuário, Perfil.  
**Tarefas:** listar usuários; cadastrar; ativar; desativar; alterar perfil.  
**Telas:** SCR-005.

### Módulos não criados

- **Dashboard independente:** indicadores exigidos são simples e diretamente ligados à fila; ficam em SCR-002.
- **Relatórios:** relatórios avançados estão fora do escopo inicial.
- **Configurações gerais:** não há requisito correspondente.
- **Perfil pessoal:** não há requisito de autoedição de conta.
- **Notificações/mensageria:** fora do escopo inicial.

---

## 5. Arquitetura de navegação

### 5.1 Estrutura global

**INFERÊNCIA — shell autenticado:** para conectar os módulos de forma coerente, a aplicação deve usar uma navegação global simples após o login.

- Navegação principal:
  - **Solicitações** — todos os perfis;
  - **Usuários** — somente Administrador.
- Área de sessão:
  - identificação do usuário;
  - indicação do perfil;
  - ação **Sair**.
- Navegação contextual:
  - breadcrumbs em formulário e detalhes;
  - tabs dentro de telas quando necessário;
  - ações condicionais por perfil/permissão.

**INFERÊNCIA de responsividade da navegação:** em desktop, a navegação principal pode ser sidebar ou barra lateral compacta; em tablet/mobile, deve recolher para menu/drawer. A escolha estética final fica para o Stitch.

### 5.2 Mapa simplificado

```text
Autenticação
└── SCR-001 Login
    └── SCR-002 Fila de solicitações

Solicitações
├── SCR-002 Fila de solicitações
│   ├── Nova solicitação → SCR-003 Formulário de solicitação [modo criação]
│   ├── Abrir registro → SCR-004 Detalhes da solicitação
│   ├── Arquivados [tab administrativa dentro da própria SCR-002]
│   └── Exportar [ação condicional, sem nova tela]
│
├── SCR-003 Formulário de solicitação
│   ├── Salvar → SCR-004 Detalhes da solicitação
│   └── Cancelar → tela de origem
│
└── SCR-004 Detalhes da solicitação
    ├── Editar → SCR-003 [modo edição]
    ├── Marcar como Cadastrado [ação + confirmação]
    ├── Arquivar/Restaurar [admin + confirmação]
    └── Histórico [aba/seção interna, admin]

Administração
└── SCR-005 Usuários
    ├── Novo usuário [drawer/modal]
    ├── Editar perfil [drawer/modal]
    └── Ativar/Desativar [confirmação]
```

### 5.3 Comportamento pós-login

**INFERÊNCIA:** como a fila é o núcleo operacional para todos os perfis e não há dashboard independente requerido, o destino padrão após autenticação é `SCR-002 — Fila de solicitações`.

---

## 6. Catálogo de telas

## [SCR-001] Login

### Módulo
Autenticação.

### Objetivo
Permitir que um usuário cadastrado acesse o sistema mediante credenciais individuais e receba feedback claro quando a autenticação falhar.

### Usuários
Agendador, Cadastrador, Administrador.

### Requisitos relacionados

- RF-01 — Autenticação.
- RNF-01 — Segurança de acesso.
- RNF-02 — Autorização.
- RNF-03 — Confidencialidade.
- RNF-11 — Usabilidade.
- Critério de aceitação 1 — autenticar e encerrar sessão.

### Entrada
Acesso inicial ao sistema; redirecionamento após sessão inexistente/expirada.

### Saídas

- sucesso → SCR-002;
- falha → permanece em SCR-001 com mensagem contextual.

### Conteúdo principal

- título/identificação do sistema;
- campo de identificação do usuário, conforme mecanismo de credencial definido na implementação;
- campo de senha;
- ação **Entrar**;
- área de mensagem de validação/erro.

**Não incluir:** recuperação de senha, cadastro público ou login social, pois não existem requisitos para essas funções.

### Ações do usuário

- preencher credenciais;
- submeter login.

### Estados da tela

- inicial;
- validando credenciais;
- erro de campos obrigatórios;
- credenciais inválidas;
- indisponibilidade/erro de autenticação;
- sessão expirada, quando redirecionado de área autenticada.

### Comportamentos importantes

- não revelar informação sensível em mensagens de erro;
- impedir múltiplas submissões durante a requisição;
- redirecionar somente após autenticação validada no servidor;
- mensagens de erro devem ser claras para usuário não técnico.

### Elementos auxiliares

- validação inline;
- mensagem/alerta de erro;
- indicador de carregamento no botão.

### Responsividade

- **Desktop:** formulário centralizado, largura controlada.
- **Tablet:** mesma hierarquia, margens reduzidas.
- **Mobile:** formulário em coluna, controles em largura disponível e teclado apropriado para os campos.

---

## [SCR-002] Fila de solicitações

### Módulo
Solicitações.

### Objetivo
Ser a área operacional principal para acompanhamento da fila, localização de registros e acesso às operações permitidas, substituindo a visualização da planilha compartilhada.

### Usuários
Agendador, Cadastrador, Administrador.

### Requisitos relacionados

- RF-03 — Listagem.
- RF-04 — Pesquisa e filtros.
- RF-10 — Indicadores da fila.
- RF-11 — Ordenação e paginação.
- RF-14 — Exportação, quando autorizada.
- RN-09 — arquivados fora da fila padrão e disponíveis ao administrador.
- RN-10 — exportação respeita filtros e permissões.
- RNF-05 — desempenho.
- RNF-10 — compatibilidade.
- RNF-11 — usabilidade/responsividade.
- Critérios de aceitação 4, 5 e 7.

### Entrada

- login bem-sucedido;
- navegação principal **Solicitações**;
- retorno de cadastro/edição/detalhes.

### Saídas

- SCR-003 — criar nova solicitação, se autorizado;
- SCR-004 — visualizar detalhes;
- saída de exportação de arquivo, quando autorizada;
- SCR-005 por navegação global somente para administrador.

### Conteúdo principal

1. **Cabeçalho da fila**
   - título da área;
   - ação **Nova solicitação** para perfis autorizados;
   - ação **Exportar** somente quando autorizada.

2. **Indicadores simples**
   - total de registros da visão operacional;
   - total de pendentes;
   - total de cadastrados.

3. **Pesquisa e filtros**
   - pesquisa por nome, telefone, endereço ou campos relevantes;
   - filtro por status;
   - filtro por cidade;
   - filtro por período;
   - limpar filtros.

4. **Lista/tabela paginada**
   - status claramente identificado;
   - acesso ao detalhe de cada registro;
   - ordenação;
   - paginação.

5. **Visão de arquivados — somente Administrador**
   - apresentada como tab/filtro administrativo separado da fila ativa;
   - registros arquivados não se misturam à fila padrão.

**INFERÊNCIA — colunas operacionais mínimas sugeridas:** ID, nome, telefone, cidade, data da solicitação, status e última atualização. Os campos são todos sustentados pelo modelo de dados; a combinação exata de colunas não é explicitada pela fonte.

### Ações do usuário

- pesquisar;
- filtrar;
- limpar filtros;
- ordenar;
- paginar;
- abrir detalhes;
- criar nova solicitação, se autorizado;
- exportar registros filtrados, se autorizado;
- alternar entre ativos e arquivados, somente administrador.

### Estados da tela

- carregando indicadores e lista;
- fila vazia;
- com dados;
- sem resultados para filtros atuais;
- erro ao consultar registros;
- erro ao carregar indicadores;
- carregando nova página;
- exportação em andamento;
- erro de exportação;
- sem permissão para ação condicional.

### Comportamentos importantes

- filtros aplicados devem determinar o conteúdo exportado;
- paginação evita carregar todos os registros de uma vez;
- status deve ser visualmente inequívoco;
- registros arquivados não aparecem por padrão;
- filtros não devem alterar dados;
- o sistema deve preservar a busca/filtro ao retornar de detalhes sempre que tecnicamente viável.

**INFERÊNCIA:** preservar filtros ao retornar de detalhes reduz retrabalho no fluxo de atendimento e não adiciona nova funcionalidade de negócio.

### Elementos auxiliares

- campo de busca;
- filter bar;
- dropdowns/seletores de filtro;
- paginação;
- status badge;
- empty state;
- toast para exportação concluída/erro;
- tab **Ativos / Arquivados** visível ao administrador.

### Responsividade

- **Desktop:** indicadores em linha e tabela completa.
- **Tablet:** indicadores podem quebrar em duas linhas; filtros reorganizados; tabela com colunas prioritárias.
- **Mobile:** indicadores empilhados ou roláveis; filtros em drawer/painel; lista pode assumir formato de cards/linhas compactas para evitar tabela horizontal excessiva; paginação permanece acessível.

---

## [SCR-003] Formulário de solicitação

### Módulo
Solicitações.

### Objetivo
Permitir cadastrar uma nova solicitação ou editar dados de uma solicitação existente conforme as permissões do usuário.

### Usuários

- **Modo criação:** Agendador e Administrador.
- **Modo edição:** Agendador com limites de permissão e Administrador.

### Requisitos relacionados

- RF-02 — Cadastro de solicitação.
- RF-06 — Edição controlada.
- RF-12 — Validação de dados.
- RN-01 — identificador único gerado pelo sistema.
- RN-02 — nova solicitação inicia como Pendente.
- RN-06 — campos essenciais obrigatórios.
- RN-08 — alerta de possível duplicidade sem bloqueio automático.
- modelo de dados inicial.
- Critério de aceitação 2.

### Entrada

- SCR-002 → **Nova solicitação**;
- SCR-004 → **Editar**, quando autorizado.

### Saídas

- salvar com sucesso → SCR-004 do registro salvo;
- cancelar → tela de origem.

### Conteúdo principal

#### Campos de dados

- nome;
- rua;
- quadra;
- lote;
- cidade;
- telefone;
- data da solicitação;
- observações.

#### Campos/valores do sistema

- ID não editável, gerado automaticamente;
- status inicial `Pendente` no modo criação;
- metadados de criação/atualização não editáveis.

**Observação sobre obrigatoriedade:** nome, rua, cidade, telefone e data da solicitação são explicitamente obrigatórios no modelo de dados. Quadra e lote constam no cadastro mínimo de RF-02, mas o modelo os classifica como “conforme processo”; isso é registrado como ambiguidade na seção 12.

### Ações do usuário

- preencher/editar campos permitidos;
- salvar;
- cancelar;
- confirmar continuidade quando houver alerta de possível duplicidade.

### Estados da tela

- formulário vazio no modo criação;
- formulário carregando no modo edição;
- formulário preenchido;
- validação com erros;
- verificando/sinalizando possível duplicidade;
- salvando;
- sucesso;
- erro de persistência;
- conflito de edição concorrente;
- sem permissão para edição.

### Comportamentos importantes

- nova solicitação deve iniciar como `Pendente` sem exigir escolha manual do usuário;
- validação de campos obrigatórios/formato ocorre antes da gravação e deve também ser validada no servidor;
- possível duplicidade gera aviso, não bloqueio automático;
- em caso de concorrência, não sobrescrever silenciosamente dados alterados por outro usuário;
- no modo edição, somente campos autorizados devem ficar editáveis;
- sair com alterações não salvas deve exigir confirmação.

**INFERÊNCIA:** a confirmação ao sair com alterações não salvas é necessária para reduzir perda acidental durante edição; deve ser tratada como proteção de interação, não como nova regra de negócio.

### Elementos auxiliares

- validação inline por campo;
- banner/alerta de possível duplicidade;
- modal de confirmação para prosseguir após alerta de duplicidade, se necessário;
- modal de alterações não salvas;
- aviso de conflito de concorrência;
- toast de sucesso após persistência, sem substituir a navegação para detalhes.

### Responsividade

- **Desktop:** formulário em uma ou duas colunas conforme associação semântica dos campos.
- **Tablet:** preferir uma coluna ou duas apenas quando houver espaço suficiente.
- **Mobile:** uma coluna, inputs de largura total, ações fixadas ou claramente acessíveis no fim do formulário.

---

## [SCR-004] Detalhes da solicitação

### Módulo
Solicitações.

### Objetivo
Permitir consultar todos os dados de uma solicitação, executar ações operacionais autorizadas e, para o administrador, acessar o histórico de alterações e ações de arquivamento/restauração.

### Usuários
Agendador, Cadastrador, Administrador, com ações condicionadas por perfil.

### Requisitos relacionados

- RF-05 — Visualização detalhada.
- RF-07 — Atualização de status.
- RF-08 — Arquivamento lógico.
- RF-09 — Histórico de alterações.
- RN-03 — marcação como Cadastrado registra usuário e data/hora.
- RN-04 — arquivamento em vez de exclusão física comum.
- RN-07 — alterações relevantes rastreáveis.
- RN-09 — arquivados disponíveis ao administrador.
- modelo de dados de auditoria.
- Critérios de aceitação 6, 7 e 9.

### Entrada

- SCR-002 ao abrir um registro;
- SCR-003 após salvar cadastro/edição.

### Saídas

- voltar para SCR-002;
- SCR-003 em modo edição, quando autorizado;
- permanência na própria tela após alteração de status, arquivamento ou restauração.

### Conteúdo principal

1. **Cabeçalho do registro**
   - identificador;
   - nome;
   - status atual;
   - estado arquivado, quando aplicável.

2. **Dados da solicitação**
   - nome;
   - rua;
   - quadra;
   - lote;
   - cidade;
   - telefone;
   - data da solicitação;
   - observações.

3. **Metadados**
   - criado em;
   - criado por;
   - atualizado em;
   - atualizado por;
   - arquivado em, quando aplicável.

4. **Ações condicionais**
   - **Editar** — Agendador autorizado/Administrador;
   - **Marcar como Cadastrado** — Cadastrador/Administrador quando status permitir;
   - **Arquivar** — Administrador, registro ativo;
   - **Restaurar** — Administrador, registro arquivado.

5. **Histórico de alterações — Administrador**
   - usuário;
   - data/hora;
   - natureza da mudança.

**INFERÊNCIA:** o histórico deve ser apresentado como tab ou seção expansível dentro da tela de detalhes para evitar uma página dedicada apenas à auditoria de um registro.

### Ações do usuário

- consultar dados;
- voltar à fila;
- editar, quando autorizado;
- marcar como cadastrado, quando autorizado;
- arquivar/restaurar, somente administrador;
- consultar histórico, somente administrador.

### Estados da tela

- carregando;
- com dados;
- erro ao carregar;
- registro não encontrado/indisponível;
- sem permissão para ação específica;
- atualizando status;
- arquivando/restaurando;
- sucesso da operação;
- erro da operação;
- conflito de atualização concorrente;
- histórico vazio;
- histórico carregando/erro.

### Comportamentos importantes

- alteração para `Cadastrado` deve registrar automaticamente responsável e data/hora;
- arquivar exige confirmação explícita;
- restaurar exige confirmação explícita;
- não oferecer exclusão física comum;
- ações não autorizadas não devem ser apenas ocultadas: o servidor deve rejeitá-las caso sejam tentadas diretamente;
- após ação bem-sucedida, dados e metadados devem ser atualizados na própria tela.

### Elementos auxiliares

- status badge;
- tabs/seções **Dados** e **Histórico** quando autorizado;
- confirmation dialog para status sensível, arquivamento e restauração;
- toast de sucesso/erro;
- mensagem de conflito de concorrência.

### Responsividade

- **Desktop:** informações agrupadas em seções/grade; ações no cabeçalho/contexto.
- **Tablet:** seções em uma ou duas colunas conforme espaço.
- **Mobile:** uma coluna, ações em menu contextual ou bloco próprio; histórico em lista vertical.

---

## [SCR-005] Administração de usuários

### Módulo
Administração de usuários.

### Objetivo
Permitir que o administrador cadastre usuários, altere perfil e ative/desative contas sem criar páginas separadas para cada operação.

### Usuários
Administrador.

### Requisitos relacionados

- RF-13 — Administração de usuários.
- RN-05 — somente administrador gerencia contas e perfis.
- RNF-02 — autorização.
- RNF-11 — confirmação para operações sensíveis.
- Critério de aceitação 8.

### Entrada
Navegação principal **Usuários**, visível somente ao Administrador.

### Saídas

- permanece na mesma tela após criar/editar/ativar/desativar;
- navegação global para Solicitações;
- logout pela área de sessão.

### Conteúdo principal

1. título **Usuários**;
2. ação **Novo usuário**;
3. lista/tabela de usuários;
4. para cada usuário:
   - identificação suficiente para reconhecimento;
   - perfil;
   - estado ativo/desativado;
   - ação de editar perfil/dados suportados;
   - ação ativar/desativar;
5. drawer/modal de criação/edição;
6. confirmação para ativação/desativação quando necessário.

**Não incluir:** redefinição manual de senha, convite por e-mail, permissões granulares ou auditoria própria de contas, pois não há requisito explícito para essas funções.

### Ações do usuário

- listar usuários;
- cadastrar usuário;
- alterar perfil;
- ativar;
- desativar;
- cancelar edição.

### Estados da tela

- carregando;
- sem usuários exibíveis;
- com dados;
- erro ao carregar;
- drawer/modal vazio para criação;
- drawer/modal preenchido para edição;
- validação com erro;
- salvando;
- sucesso;
- erro de persistência;
- operação de ativação/desativação em andamento.

### Comportamentos importantes

- somente administrador acessa a tela e executa mutações;
- desativar deve exigir confirmação clara;
- ações devem ser validadas também no servidor;
- após salvar alteração, a lista deve refletir o estado atualizado.

### Elementos auxiliares

- data table/lista;
- status de conta;
- badge de perfil;
- drawer/modal para criação/edição;
- confirmation dialog para desativação/ativação sensível;
- toast de sucesso/erro.

### Responsividade

- **Desktop:** tabela e drawer lateral adequados.
- **Tablet:** tabela reduz colunas secundárias; drawer ocupa maior largura relativa.
- **Mobile:** lista em cards/linhas compactas; formulário de usuário em modal full-screen/drawer; ações agrupadas em menu contextual.

---

## 7. Fluxos principais

## FLW-001 — Autenticar e acessar a fila

**Ator:** Agendador, Cadastrador ou Administrador.  
**Objetivo:** iniciar uma sessão e chegar à área operacional.

```text
SCR-001 Login
↓
preencher credenciais
↓
autenticação válida
↓
SCR-002 Fila de solicitações
```

**Resultado esperado:** usuário autenticado acessa a fila com ações compatíveis com seu perfil.

---

## FLW-002 — Cadastrar nova solicitação

**Ator:** Agendador ou Administrador.  
**Objetivo:** registrar uma nova solicitação válida.

```text
SCR-002 Fila
↓
Nova solicitação
↓
SCR-003 Formulário [criação]
↓
preencher dados
↓
validação
↓
[se possível duplicidade] alerta sem bloqueio automático
↓
salvar
↓
status inicial = Pendente
↓
SCR-004 Detalhes
```

**Resultado esperado:** solicitação criada com identificador único, status `Pendente` e metadados de criação.

---

## FLW-003 — Localizar e consultar solicitação

**Ator:** qualquer usuário autenticado.  
**Objetivo:** encontrar um registro e consultar seus dados.

```text
SCR-002 Fila
↓
pesquisar / filtrar / ordenar / paginar
↓
selecionar registro
↓
SCR-004 Detalhes
```

**Resultado esperado:** usuário visualiza o registro completo e somente as ações autorizadas.

---

## FLW-004 — Concluir cadastro da solicitação

**Ator:** Cadastrador ou Administrador.  
**Objetivo:** marcar atendimento concluído.

```text
SCR-002 Fila
↓
abrir solicitação Pendente
↓
SCR-004 Detalhes
↓
Marcar como Cadastrado
↓
confirmação
↓
sistema grava status + usuário + data/hora
↓
SCR-004 atualizado
```

**Resultado esperado:** solicitação fica com status `Cadastrado` e a alteração é rastreável.

---

## FLW-005 — Editar dados da solicitação

**Ator:** Agendador autorizado ou Administrador.  
**Objetivo:** corrigir dados permitidos sem perda silenciosa de concorrência.

```text
SCR-004 Detalhes
↓
Editar
↓
SCR-003 Formulário [edição]
↓
alterar campos permitidos
↓
validação
↓
[se conflito concorrente] informar conflito e impedir sobrescrita silenciosa
↓
salvar
↓
SCR-004 Detalhes atualizados
```

**Resultado esperado:** alteração persistida e rastreável conforme regras de auditoria.

---

## FLW-006 — Arquivar solicitação

**Ator:** Administrador.  
**Objetivo:** remover um registro da fila operacional sem exclusão física.

```text
SCR-004 Detalhes
↓
Arquivar
↓
confirmação
↓
arquivamento lógico
↓
registro deixa a fila padrão
↓
SCR-002 Fila
```

**Resultado esperado:** registro permanece preservado e acessível na visão de arquivados do administrador.

---

## FLW-007 — Restaurar solicitação arquivada

**Ator:** Administrador.  
**Objetivo:** reativar um registro arquivado.

```text
SCR-002 Fila
↓
tab Arquivados
↓
abrir registro
↓
SCR-004 Detalhes
↓
Restaurar
↓
confirmação
↓
registro volta à visão ativa conforme seu status operacional
```

**Resultado esperado:** registro deixa o estado arquivado e volta a ficar disponível na fila ativa.

---

## FLW-008 — Administrar usuários

**Ator:** Administrador.  
**Objetivo:** criar ou alterar conta/perfil e controlar ativação.

```text
SCR-005 Usuários
↓
Novo usuário OU editar usuário existente
↓
drawer/modal
↓
validar e salvar
↓
lista atualizada

ou

SCR-005 Usuários
↓
Ativar/Desativar
↓
confirmação
↓
lista atualizada
```

**Resultado esperado:** conta reflete a alteração solicitada, respeitando a exclusividade administrativa.

---

## FLW-009 — Exportar registros filtrados

**Ator:** usuário com autorização de exportação.  
**Objetivo:** obter representação tabular da visão filtrada.

```text
SCR-002 Fila
↓
aplicar filtros
↓
Exportar
↓
geração de arquivo
↓
sucesso ou erro informado na própria tela
```

**Resultado esperado:** arquivo contém os registros compatíveis com os filtros e permissões atuais.

---

## 8. Matriz de telas

| ID | Tela | Módulo | Usuário | Objetivo | Entrada principal | Prioridade |
|---|---|---|---|---|---|---|
| SCR-001 | Login | Autenticação | Todos | Autenticar usuário | acesso inicial | Essencial |
| SCR-002 | Fila de solicitações | Solicitações | Todos | Acompanhar e localizar registros | login / navegação principal | Essencial |
| SCR-003 | Formulário de solicitação | Solicitações | Agendador, Administrador | Criar/editar solicitação | fila ou detalhes | Essencial |
| SCR-004 | Detalhes da solicitação | Solicitações | Todos | Consultar registro e executar ações autorizadas | fila / após salvar | Essencial |
| SCR-005 | Administração de usuários | Usuários | Administrador | Criar, ativar, desativar e definir perfil | navegação administrativa | Essencial |

### Elementos explicitamente tratados sem tela própria

| Elemento | Solução | Justificativa |
|---|---|---|
| Histórico de alterações | aba/seção em SCR-004 | pertence ao contexto de uma solicitação específica |
| Arquivados | tab/visão em SCR-002 | é uma variação administrativa da mesma entidade/listagem |
| Criar/editar usuário | drawer/modal em SCR-005 | operação curta e contextual |
| Marcar como Cadastrado | ação + confirmação em SCR-004 | não exige mudança de contexto |
| Arquivar/restaurar | ação + confirmação em SCR-004 | ação sobre o registro atual |
| Exportação | ação em SCR-002 | gera arquivo; não requer página dedicada |
| Logout | menu/ação global | não representa domínio ou tarefa de conteúdo |
| Erros de permissão | estado de tela/global | não justificam módulo independente |

---

## 9. Matriz de rastreabilidade

| Requisito | Fonte | Tela(s) / componente | Cobertura |
|---|---|---|---|
| RF-01 Autenticação | FNT-001 | SCR-001; ação global de logout | Completa |
| RF-02 Cadastro de solicitação | FNT-001 | SCR-003 | Completa |
| RF-03 Listagem | FNT-001 | SCR-002 | Completa |
| RF-04 Pesquisa e filtros | FNT-001 | SCR-002 | Completa |
| RF-05 Visualização detalhada | FNT-001 | SCR-004 | Completa |
| RF-06 Edição controlada | FNT-001 | SCR-003 [edição], entrada via SCR-004 | Completa, com permissão exata pendente |
| RF-07 Atualização de status | FNT-001 | SCR-004 | Completa |
| RF-08 Arquivamento lógico | FNT-001 | SCR-004 + visão Arquivados em SCR-002 | Completa |
| RF-09 Histórico de alterações | FNT-001 | seção/aba em SCR-004 | Completa |
| RF-10 Indicadores da fila | FNT-001 | SCR-002 | Completa |
| RF-11 Ordenação e paginação | FNT-001 | SCR-002 | Completa |
| RF-12 Validação de dados | FNT-001 | SCR-003; SCR-001/005 conforme formulário | Completa |
| RF-13 Administração de usuários | FNT-001 | SCR-005 | Completa |
| RF-14 Exportação | FNT-001 | SCR-002 | Completa, permissão por perfil pendente |
| RN-01 ID único | FNT-001 | SCR-003/004 | Completa |
| RN-02 status inicial Pendente | FNT-001 | SCR-003 | Completa |
| RN-03 auditoria ao marcar Cadastrado | FNT-001 | SCR-004 | Completa |
| RN-04 arquivamento em vez de exclusão | FNT-001 | SCR-004 | Completa |
| RN-05 somente admin gerencia contas | FNT-001 | SCR-005 | Completa |
| RN-06 obrigatoriedade de essenciais | FNT-001 | SCR-003 | Completa |
| RN-07 rastreabilidade de alterações | FNT-001 | SCR-004 | Completa |
| RN-08 alerta de duplicidade | FNT-001 | SCR-003 | Completa |
| RN-09 arquivados fora da fila padrão | FNT-001 | SCR-002/004 | Completa |
| RN-10 exportação respeita filtro/permissão | FNT-001 | SCR-002 | Completa |
| RNF-02 autorização | FNT-001 | todas as telas autenticadas | Completa no desenho de interface; requer servidor |
| RNF-05 desempenho percebido | FNT-001 | SCR-002/004 | Considerado em estados/loading/paginação |
| RNF-06 concorrência | FNT-001 | SCR-003/004 | Considerado em estados de conflito |
| RNF-10 compatibilidade | FNT-001 | todas | Considerado globalmente |
| RNF-11 usabilidade/responsividade | FNT-001 | todas | Completa no nível arquitetural |

### Requisitos predominantemente não visuais

Os requisitos abaixo impactam implementação/infraestrutura, mas não justificam telas próprias:

- RNF-01 armazenamento seguro de senhas;
- RNF-03 HTTPS;
- RNF-04 LGPD/controle de dados;
- RNF-07 disponibilidade;
- RNF-08 backup;
- RNF-09 recuperação;
- RNF-12 logs/manutenibilidade.

A ausência de telas específicas para esses itens não representa falta de cobertura funcional de interface.

---

## 10. Componentes compartilhados

### 10.1 Componentes globais

- **App Shell autenticado** — contém navegação principal e área de sessão.
- **Primary Navigation** — Solicitações; Usuários para administrador.
- **User Session Menu** — identificação, perfil e logout.
- **Breadcrumb** — usado em formulário e detalhes.
- **Page Header** — título, contexto e ações principais.

### 10.2 Componentes compartilhados de dados

- **DataList/DataTable responsiva** — listas de solicitações e usuários.
- **SearchInput** — busca textual.
- **FilterBar** — status, cidade, período e ações de limpar.
- **Pagination** — navegação entre páginas.
- **StatusBadge** — `Pendente`, `Cadastrado`, `Arquivado`, `Ativo`, `Desativado` conforme contexto.
- **LoadingState** — carregamento inicial e incremental.
- **EmptyState** — nenhum dado cadastrado.
- **NoResultsState** — nenhum resultado para filtros atuais.
- **ErrorState** — falha de carregamento/operação.

### 10.3 Componentes de formulário e interação

- **FormField** com rótulo, obrigatoriedade e mensagem de erro.
- **ValidationSummary** quando houver múltiplos erros.
- **DuplicateWarning** para RN-08.
- **ConfirmationDialog** para ações sensíveis.
- **Toast/FeedbackMessage** para sucesso/erro.
- **UnsavedChangesDialog** para saída com edição não salva.
- **ConcurrencyConflictMessage** para conflito de atualização.
- **Drawer/Modal Form** para criação/edição de usuário.
- **Tabs/Sections** para Dados/Histórico e Ativos/Arquivados.

### 10.4 Regras de consistência dos componentes

- mensagens devem usar linguagem simples e operacional;
- ações indisponíveis por permissão não devem ser simuladas apenas no front-end;
- confirmações são reservadas para ações sensíveis, não para operações rotineiras de leitura;
- estados vazios e sem resultado devem ser distintos;
- componentes não devem introduzir branding, cores ou tipografia não documentados.

---

## 11. Stitch Screen Briefs

## STITCH — SCR-001 — Login

**Tipo de produto:**  
Aplicação web interna de gestão de solicitações de agendamento.

**Tela:**  
Login.

**Objetivo:**  
Autenticar usuários cadastrados por credenciais individuais e encaminhá-los à fila operacional.

**Usuário:**  
Agendador, Cadastrador ou Administrador.

**Estrutura da página:**

1. identificação/título do Sistema de Agendamento;
2. bloco de autenticação;
3. campo de usuário/identificador;
4. campo de senha;
5. ação Entrar;
6. região de validação/erro.

**Componentes principais:**

- login form;
- campos de credenciais;
- botão Entrar;
- inline validation;
- alert de erro;
- loading no submit.

**Dados apresentados:**

- somente identificação do sistema e mensagens de autenticação;
- nenhum dado de solicitação antes do login.

**Ações disponíveis:**

- preencher credenciais;
- entrar.

**Estados necessários:**

- inicial;
- validando;
- campos inválidos;
- credenciais inválidas;
- erro de serviço;
- sessão expirada.

**Navegação:**

- vem de: acesso inicial ou expiração de sessão;
- vai para: SCR-002 em caso de sucesso.

**Observações importantes:**

- não criar cadastro público, recuperação de senha ou login social sem novo requisito;
- autenticação/autorização devem ser validadas no servidor;
- mensagens devem ser claras sem expor informação sensível;
- direção visual não especificada nas fontes.

---

## STITCH — SCR-002 — Fila de solicitações

**Tipo de produto:**  
Aplicação web interna de gestão de fila operacional.

**Tela:**  
Fila de solicitações.

**Objetivo:**  
Permitir acompanhar volume, status, pesquisa, filtragem e acesso aos registros sem depender de planilha compartilhada.

**Usuário:**  
Agendador, Cadastrador e Administrador.

**Estrutura da página:**

1. shell autenticado com navegação e sessão;
2. cabeçalho “Solicitações”;
3. ação Nova solicitação, quando permitida;
4. ação Exportar, quando autorizada;
5. indicadores de total, pendentes e cadastrados;
6. pesquisa;
7. filtros de status, cidade e período;
8. lista/tabela paginada;
9. paginação;
10. tab/visão Arquivados somente para Administrador.

**Componentes principais:**

- app shell;
- page header;
- indicator cards;
- search input;
- filter bar;
- data table/list;
- status badges;
- pagination;
- empty/no-results/error states;
- optional export feedback.

**Dados apresentados:**

- contagem total;
- contagem de pendentes;
- contagem de cadastrados;
- lista com identificação e status claro de cada solicitação;
- INFERÊNCIA de colunas mínimas: ID, nome, telefone, cidade, data da solicitação, status, última atualização.

**Ações disponíveis:**

- pesquisar;
- filtrar;
- limpar filtros;
- ordenar;
- paginar;
- abrir registro;
- criar solicitação quando autorizado;
- exportar quando autorizado;
- consultar arquivados quando administrador.

**Estados necessários:**

- carregando;
- vazio;
- com dados;
- sem resultados;
- erro;
- exportando;
- erro de exportação.

**Navegação:**

- vem de: SCR-001 ou navegação global;
- vai para: SCR-003, SCR-004 e, via navegação global administrativa, SCR-005.

**Observações importantes:**

- arquivados não entram na fila padrão;
- exportação respeita filtros e permissões;
- tabela precisa de paginação;
- interface responsiva para usuário não técnico;
- não criar dashboard separado;
- direção visual não especificada nas fontes.

---

## STITCH — SCR-003 — Formulário de solicitação

**Tipo de produto:**  
Aplicação web interna de cadastro e manutenção de solicitações.

**Tela:**  
Formulário de solicitação em modo criação ou edição.

**Objetivo:**  
Registrar uma nova solicitação ou corrigir dados existentes conforme autorização.

**Usuário:**  
Agendador e Administrador; edição limitada conforme permissões.

**Estrutura da página:**

1. shell autenticado;
2. breadcrumb;
3. cabeçalho indicando “Nova solicitação” ou “Editar solicitação”;
4. campos de identificação e endereço;
5. campos de contato/data;
6. observações;
7. área de validação e alerta de duplicidade;
8. ações Salvar e Cancelar.

**Componentes principais:**

- form fields;
- validation messages;
- duplicate warning;
- save/cancel actions;
- unsaved changes dialog;
- concurrency conflict message.

**Dados apresentados:**

- nome;
- rua;
- quadra;
- lote;
- cidade;
- telefone;
- data da solicitação;
- observações;
- no modo edição, dados atuais do registro.

**Ações disponíveis:**

- preencher/editar campos permitidos;
- salvar;
- cancelar;
- continuar após alerta de possível duplicidade.

**Estados necessários:**

- inicial;
- carregando edição;
- válido/inválido;
- alerta de duplicidade;
- salvando;
- sucesso;
- erro;
- conflito concorrente;
- sem permissão.

**Navegação:**

- vem de: SCR-002 para criação; SCR-004 para edição;
- vai para: SCR-004 após salvar ou origem ao cancelar.

**Observações importantes:**

- status inicial é Pendente e não precisa ser escolhido manualmente;
- ID e metadados de auditoria não são editáveis;
- possível duplicidade alerta, mas não bloqueia automaticamente;
- não sobrescrever alteração concorrente silenciosamente;
- direção visual não especificada nas fontes.

---

## STITCH — SCR-004 — Detalhes da solicitação

**Tipo de produto:**  
Aplicação web interna de consulta, acompanhamento e auditoria operacional.

**Tela:**  
Detalhes da solicitação.

**Objetivo:**  
Centralizar todos os dados de uma solicitação e as ações permitidas no contexto do registro.

**Usuário:**  
Agendador, Cadastrador e Administrador, com permissões distintas.

**Estrutura da página:**

1. shell autenticado;
2. breadcrumb/voltar;
3. cabeçalho com ID, nome e status;
4. ações condicionais por perfil;
5. seção de dados da solicitação;
6. seção de metadados;
7. tab/seção de histórico somente para administrador.

**Componentes principais:**

- status badge;
- data sections;
- action bar/menu;
- tabs/accordion;
- confirmation dialogs;
- toast feedback;
- concurrency conflict message.

**Dados apresentados:**

- todos os campos da solicitação;
- criado em/por;
- atualizado em/por;
- arquivado em, quando aplicável;
- histórico com usuário, data/hora e natureza da mudança, para administrador.

**Ações disponíveis:**

- editar quando autorizado;
- marcar como Cadastrado para Cadastrador/Administrador;
- arquivar/restaurar para Administrador;
- consultar histórico para Administrador;
- voltar à fila.

**Estados necessários:**

- carregando;
- com dados;
- não encontrado;
- erro;
- ação em andamento;
- sucesso/erro de ação;
- sem permissão;
- conflito concorrente;
- histórico vazio/carregando/erro.

**Navegação:**

- vem de: SCR-002 ou SCR-003 após salvar;
- vai para: SCR-003 para edição ou SCR-002 ao voltar.

**Observações importantes:**

- marcar Cadastrado registra automaticamente responsável e data/hora;
- arquivamento é lógico, nunca exclusão comum;
- operações sensíveis exigem confirmação;
- ações precisam de proteção no servidor além da interface;
- direção visual não especificada nas fontes.

---

## STITCH — SCR-005 — Administração de usuários

**Tipo de produto:**  
Aplicação web interna com controle de acesso por perfil.

**Tela:**  
Administração de usuários.

**Objetivo:**  
Permitir ao administrador cadastrar contas, definir perfil e controlar ativação/desativação.

**Usuário:**  
Administrador.

**Estrutura da página:**

1. shell autenticado com item Usuários;
2. cabeçalho “Usuários”;
3. ação Novo usuário;
4. lista/tabela de contas;
5. ações por usuário;
6. drawer/modal de criação/edição;
7. confirmação para ativar/desativar.

**Componentes principais:**

- data table/list;
- account status;
- role badge/select;
- drawer/modal form;
- confirmation dialog;
- validation messages;
- toast feedback.

**Dados apresentados:**

- identificação suficiente do usuário;
- perfil;
- estado ativo/desativado.

**Ações disponíveis:**

- novo usuário;
- alterar perfil/dados suportados;
- ativar;
- desativar.

**Estados necessários:**

- carregando;
- vazio;
- com dados;
- erro;
- criando/editando;
- validação com erro;
- salvando;
- sucesso/erro.

**Navegação:**

- vem de: item Usuários da navegação administrativa;
- vai para: permanece em SCR-005 ou navegação global para Solicitações.

**Observações importantes:**

- acesso exclusivo do Administrador;
- não adicionar recuperação de senha, convite por e-mail ou permissões granulares sem requisitos;
- desativação deve ter confirmação;
- direção visual não especificada nas fontes.

---

## 12. Lacunas e ambiguidades

### GAP-001 — Campos editáveis pelo Agendador

**Classificação:** AMBIGUIDADE  
**Problema:** o perfil Agendador pode “corrigir informações permitidas” e RF-06 condiciona a edição às permissões, mas não define quais campos são editáveis.  
**Impacto:** afeta o estado de edição de SCR-003 e a ação Editar em SCR-004.  
**Fontes relacionadas:** perfil Agendador; RF-06.  
**Decisão adotada:** manter edição condicionada à autorização entregue pelo sistema, sem declarar campos específicos como liberados.  
**Nível de confiança:** alto.

### GAP-002 — Quem pode exportar

**Classificação:** REQUISITO AUSENTE  
**Problema:** RF-14 diz “quando autorizado” e RN-10 exige respeito às permissões, mas não define quais perfis podem exportar.  
**Impacto:** visibilidade da ação Exportar em SCR-002.  
**Fontes relacionadas:** RF-14; RN-10.  
**Decisão adotada:** tratar exportação como ação condicional por permissão, sem atribuí-la automaticamente a um perfil.  
**Nível de confiança:** alto.

### GAP-003 — Obrigatoriedade de quadra e lote

**Classificação:** CONFLITO ENTRE FONTES  
**Problema:** RF-02 lista quadra e lote entre os dados mínimos da solicitação, enquanto o modelo de dados marca ambos como “Conforme processo”, diferentemente dos campos explicitamente obrigatórios.  
**Impacto:** validação em SCR-003.  
**Fontes relacionadas:** RF-02; modelo de dados inicial; RN-06.  
**Decisão adotada:** exibir os campos, mas não afirmar obrigatoriedade universal até definição operacional.  
**Nível de confiança:** médio.

### GAP-004 — Credencial de login

**Classificação:** REQUISITO AUSENTE  
**Problema:** RF-01 exige credenciais individuais, mas não especifica se o identificador é usuário, e-mail, matrícula ou outro valor.  
**Impacto:** rótulo exato do primeiro campo em SCR-001.  
**Fontes relacionadas:** RF-01.  
**Decisão adotada:** especificar genericamente “usuário/identificador” no briefing e deixar o mecanismo para definição técnica/operacional.  
**Nível de confiança:** alto.

### GAP-005 — Alteração reversa de status

**Classificação:** AMBIGUIDADE  
**Problema:** RF-07 afirma que o status pode ser alterado “entre, no mínimo, Pendente e Cadastrado”, mas o fluxo operacional documenta apenas Pendente → Cadastrado. Não há regra explícita para reabrir de Cadastrado para Pendente nem quem poderia fazê-lo.  
**Impacto:** ações disponíveis em SCR-004.  
**Fontes relacionadas:** RF-07; fluxo operacional resumido; RN-03.  
**Decisão adotada:** desenhar o fluxo explícito Pendente → Cadastrado e não expor reversão até definição do negócio.  
**Nível de confiança:** médio.

### GAP-006 — Critério de possível duplicidade

**Classificação:** REQUISITO AUSENTE  
**Problema:** RN-08 exige alerta por combinação suficientemente semelhante, mas não define campos, algoritmo ou limiar.  
**Impacto:** lógica que dispara o alerta em SCR-003.  
**Fontes relacionadas:** RN-08.  
**Decisão adotada:** reservar estado/componente de alerta sem especificar a regra de detecção.  
**Nível de confiança:** alto.

### GAP-007 — Conteúdo exato do histórico

**Classificação:** AMBIGUIDADE  
**Problema:** RF-09 exige usuário, data, horário e natureza da mudança, mas não determina se o histórico deve mostrar valor anterior/novo valor.  
**Impacto:** nível de detalhe da aba Histórico em SCR-004.  
**Fontes relacionadas:** RF-09; RN-07.  
**Decisão adotada:** mostrar apenas os elementos explicitamente exigidos; diferenças de valores ficam pendentes.  
**Nível de confiança:** alto.

### GAP-008 — Campos do cadastro de usuário

**Classificação:** REQUISITO AUSENTE  
**Problema:** RF-13 define cadastrar, ativar/desativar e definir perfil, mas não especifica os campos necessários para criar uma conta.  
**Impacto:** drawer/modal de SCR-005.  
**Fontes relacionadas:** RF-13; RF-01; RN-05.  
**Decisão adotada:** o briefing define a operação, mas não inventa campos além de identificação suficiente, perfil e estado.  
**Nível de confiança:** alto.

### GAP-009 — Colunas exatas da fila

**Classificação:** INFERÊNCIA NECESSÁRIA  
**Problema:** RF-03 exige lista organizada e status claro, mas não fixa colunas.  
**Impacto:** composição da lista em SCR-002.  
**Fontes relacionadas:** RF-03; RF-04; modelo de dados.  
**Decisão adotada:** sugerir, como inferência, ID, nome, telefone, cidade, data, status e atualização, priorizando dados já existentes no modelo.  
**Nível de confiança:** médio.

### GAP-010 — Navegação global

**Classificação:** INFERÊNCIA NECESSÁRIA  
**Problema:** requisitos definem módulos/tarefas, mas não especificam sidebar, topbar ou menu.  
**Impacto:** conexão entre SCR-002 e SCR-005 e ação de logout.  
**Fontes relacionadas:** requisitos de acesso, administração e logout.  
**Decisão adotada:** propor shell autenticado simples com Solicitações, Usuários para administrador e menu de sessão; padrão visual fica em aberto.  
**Nível de confiança:** médio.

### GAP-011 — Tratamento visual de concorrência

**Classificação:** INFERÊNCIA NECESSÁRIA  
**Problema:** RNF-06 exige que atualizações simultâneas não causem perda silenciosa, mas não define experiência do usuário quando há conflito.  
**Impacto:** SCR-003 e SCR-004.  
**Fontes relacionadas:** RNF-06.  
**Decisão adotada:** prever estado explícito de conflito, impedir sobrescrita silenciosa e orientar recarregamento/revisão; detalhes da estratégia dependem da implementação de controle de versão/transação.  
**Nível de confiança:** alto.

---

## 13. Recomendações

### 13.1 Recomendações para validação antes do Stitch visual

Priorizar a definição das seguintes lacunas antes de fechar os prompts visuais finais:

1. campos que o Agendador pode editar;
2. perfis autorizados a exportar;
3. obrigatoriedade real de quadra e lote;
4. identificador usado no login;
5. possibilidade ou não de reverter `Cadastrado` para `Pendente`;
6. campos do cadastro de usuário;
7. regra de detecção de duplicidade.

Essas definições alteram controles, estados e permissões, mas não exigem mudar a arquitetura geral proposta.

### 13.2 Recomendações para o primeiro ciclo de Stitch

Gerar primeiro as telas essenciais nesta ordem, para manter coerência:

1. SCR-002 — Fila de solicitações;
2. SCR-004 — Detalhes da solicitação;
3. SCR-003 — Formulário de solicitação;
4. SCR-001 — Login;
5. SCR-005 — Administração de usuários.

A fila deve ser tratada como **tela de referência do produto**, pois concentra a maior quantidade de padrões reutilizáveis: navegação, indicadores, pesquisa, filtros, lista, badges, paginação e responsividade.

### 13.3 Decisões a preservar no desenho visual

- não criar dashboard independente sem novo requisito;
- não criar página separada de histórico;
- não criar página separada de arquivados;
- não criar páginas separadas para novo usuário/editar usuário;
- não criar exclusão física comum;
- não adicionar comunicação WhatsApp/SMS/e-mail;
- não adicionar mapas/georreferenciamento;
- não adicionar relatórios avançados;
- não adicionar fluxo de aprovação;
- não criar branding, cores, gradientes, tipografia ou ilustrações como requisito.

### 13.4 Revisão crítica final

- [x] principais requisitos funcionais considerados;
- [x] três atores considerados;
- [x] permissões refletidas sem expandir capacidades não documentadas;
- [x] cada tela possui justificativa por requisito;
- [x] nenhuma tela redundante identificada;
- [x] ações simples foram resolvidas com modal/drawer/tab/confirmação;
- [x] fluxos críticos documentados;
- [x] estados de vazio, erro, carregamento e permissão considerados;
- [x] requisitos predominantemente não visuais identificados;
- [x] nenhuma tela sem justificativa funcional foi incluída;
- [x] briefings Stitch são autocontidos;
- [x] inferências foram marcadas;
- [x] lacunas e conflitos foram registrados.

### 13.5 Respostas ao critério de conclusão

1. **Quais telas são necessárias?** SCR-001 a SCR-005.
2. **Por que cada tela existe?** Documentado no objetivo e requisitos relacionados de cada catálogo.
3. **Qual requisito justifica cada tela?** Coberto pela matriz de rastreabilidade.
4. **Quem acessa cada tela?** Definido no catálogo e matriz de permissões.
5. **Como as telas se conectam?** Definido na arquitetura de navegação e fluxos FLW-001 a FLW-009.
6. **Quais estados cada tela precisa suportar?** Definidos individualmente no catálogo e nos briefings Stitch.
7. **Quais elementos podem ser modais/drawers?** criação/edição de usuário, confirmações e alertas; histórico/arquivados usam tabs/seções.
8. **Quais componentes são compartilhados?** Definidos na seção 10.
9. **Quais requisitos ainda possuem ambiguidade?** GAP-001 a GAP-011.
10. **Existe briefing individual para cada tela essencial?** Sim, seção 11.
