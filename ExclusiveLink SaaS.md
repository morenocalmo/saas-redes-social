# ExclusiveLink SaaS

## Objetivo

Plataforma para criadores de conteúdo compartilharem materiais exclusivos com seguidores mediante verificação de inscrição e códigos secretos.

## Telas

### Login e Cadastro

**Rota:** `/`

**Objetivo:** Autenticação de criadores de conteúdo na plataforma.

**Componentes:**

- **Input E-mail**: Realiza o login do criador e redireciona para /dashboard.
- **Input Senha**: Realiza o login do criador e redireciona para /dashboard.
- **Botão Entrar**: Autentica o usuário e redireciona para o painel principal.
- **Botão Cadastrar-se**: Cria uma nova conta e inicia o onboarding.

### Dashboard do Criador

**Rota:** `/dashboard`

**Objetivo:** Visão geral de desempenho e atalhos de gestão.

**Componentes:**

- **Card Métricas Gerais**: Exibe o total de downloads e materiais ativos.
- **Lista de Atividades Recentes**: Mostra as últimas solicitações de acesso pendentes.
- **Botão Novo Material**: Redireciona para /materials/new.

### Configurações de Perfil

**Rota:** `/settings/profile`

**Objetivo:** Personalizar a aparência e links das redes sociais do criador.

**Componentes:**

- **Input Links Redes Sociais**: Permite vincular perfis de YouTube, TikTok e Instagram.
- **Input Nome do Canal/Perfil**: Permite alterar o nome de exibição e bio da página pública.
- **Botão Salvar Perfil**: Salva as alterações do perfil público.

### Gestão de Materiais

**Rota:** `/materials`

**Objetivo:** Administrar os arquivos exclusivos oferecidos aos seguidores.

**Componentes:**

- **Botão Adicionar Material**: Abre formulário para upload de novo arquivo.
- **Tabela de Materiais**: Exibe todos os PDFs, planilhas e templates cadastrados.
- **Input Código Secreto por Material**: Define o código secreto necessário para o seguidor baixar o arquivo.
- **Botão Excluir Material**: Remove o material da plataforma.

### Validação de Acessos

**Rota:** `/verifications`

**Objetivo:** Analisar e aprovar pedidos de download baseados em screenshot e código.

**Componentes:**

- **Thumbnail Screenshot de Inscrição**: Exibe a imagem enviada pelo seguidor como prova.
- **Label Código Informado**: Mostra o código digitado pelo seguidor para conferência.
- **Botão Aprovar Solicitação**: Libera o acesso ao material para o seguidor.
- **Botão Rejeitar Solicitação**: Nega o acesso e permite enviar justificativa.

### Página Pública do Criador

**Rota:** `/u/:username
`

**Objetivo:** Interface pública onde os seguidores visualizam vídeos e materiais disponíveis.


**Componentes:**

- **Grid de Vídeos YouTube/TikTok**: Lista os vídeos vinculados; o botão 'Resgatar Material' posicionado abaixo de cada card abre o modal de instruções.
- **Modal de Instruções de Resgate**: Exibe as orientações detalhadas sobre como obter o material selecionado.
- **Card de Material Exclusivo**: Redireciona o usuário para a página de resgate do material específico.

### Resgate de Material

**Rota:** `/u/:username/material/:id`

**Objetivo:** Página onde o seguidor fornece as provas para liberar o download.

**Componentes:**

- **Input Código Secreto**: Campo para o seguidor digitar o código mencionado no vídeo.
- **Upload Screenshot de Inscrição**: Upload da imagem que comprova a inscrição no canal.
- **Botão Solicitar Download**: Envia os dados para revisão do criador.

### Assinatura do Plano Mensal

**Rota:** `/subscription`

**Objetivo:** Realizar a contratação do plano de assinatura para liberar o acesso total às funcionalidades da plataforma.

**Componentes:**

- **Resumo do Plano Criador**: Exibe os detalhes e o valor recorrente de R$ 49,00 por mês
- **Seleção de Forma de Pagamento**: Permite selecionar entre Cartão de Crédito ou Pix como meio de pagamento
- **Campos de Dados do Cartão**: Captura os dados necessários para o processamento do pagamento via cartão
- **Botão Finalizar Pagamento**: Inicia o processamento da transação e ativa a assinatura do usuário
- **Botão Cancelar**: Retorna o usuário para a tela de configurações ou dashboard

