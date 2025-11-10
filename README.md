# Sistema de Pesquisa de Satisfação

Sistema completo de criação e gerenciamento de formulários de pesquisa com Angular e .NET Core.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Angular 18** - Framework principal
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **Standalone Components** - Arquitetura moderna do Angular

### Backend
- **.NET 9.0** - Framework backend
- **ASP.NET Core Web API** - API RESTful
- **Entity Framework Core** - ORM
- **PostgreSQL** - Banco de dados
- **Swagger** - Documentação da API

## 📋 Funcionalidades

### Dashboard Administrativo
- ✅ Estatísticas em tempo real
- ✅ Visão geral de formulários e respostas
- ✅ Interface moderna e responsiva

### Gerenciamento de Formulários
- ✅ Criação de formulários dinâmicos
- ✅ 7 tipos de campos suportados:
  - Texto simples
  - Número
  - Email
  - Múltipla escolha (radio)
  - Seleção múltipla (checkbox)
  - Texto longo (textarea)
  - Avaliação (1-5 estrelas)
- ✅ Campos obrigatórios
- ✅ Validação automática
- ✅ Edição e exclusão

### Sistema de Respostas
- ✅ Links únicos para compartilhamento
- ✅ Interface otimizada para mobile
- ✅ Validação de campos obrigatórios
- ✅ Salvamento automático no banco

### Sistema de Notificações
- ✅ Notificações em tempo real
- ✅ Design moderno (sucesso, erro, warning, info)
- ✅ Posicionamento no canto superior direito

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+ e npm
- .NET 9.0 SDK
- PostgreSQL 13+
- Git

## 📖 Como Usar

### 1. Acesso ao Sistema
- Acesse `http://localhost:4200`
- Faça login com qualquer credencial (admin/admin)

### 2. Criar Formulário
- No dashboard, clique em "Criar Formulário"
- Preencha título e descrição
- Adicione perguntas clicando em "Adicionar Pergunta"
- Configure cada pergunta (título, tipo, obrigatório, opções)
- Clique em "Salvar Formulário"

### 3. Compartilhar Formulário
- Na listagem de formulários, clique nos 3 pontos
- Selecione "Copiar Link"
- Compartilhe o link gerado

### 4. Responder Formulário
- Acesse o link compartilhado
- Preencha todas as perguntas
- Clique em "Enviar Resposta"

## 🗂️ Estrutura do Projeto

```
PesquisaSatisfacao/
├── backend/
│   ├── Controllers/          # Controladores da API
│   ├── Models/              # Modelos de dados
│   │   └── DTOs/           # Data Transfer Objects
│   ├── Data/               # Contexto do banco
│   ├── Migrations/         # Migrações do EF Core
│   └── Program.cs          # Configuração da aplicação
├── frontend/
│   ├── src/app/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── services/       # Serviços Angular
│   │   ├── dashboard/      # Dashboard administrativo
│   │   ├── create-form/    # Criação de formulários
│   │   ├── forms/          # Listagem de formulários
│   │   ├── survey/         # Interface de resposta
│   │   └── login/          # Tela de login
│   └── ...
└── README.md
```

## 🔗 Endpoints da API

### Formulários
- `GET /api/pesquisas` - Listar todos os formulários
- `GET /api/pesquisas/{id}` - Obter formulário específico
- `POST /api/pesquisas` - Criar novo formulário
- `PUT /api/pesquisas/{id}` - Editar formulário
- `DELETE /api/pesquisas/{id}` - Excluir formulário

### Respostas
- `POST /api/pesquisas/{id}/respostas` - Enviar resposta

### Estatísticas
- `GET /api/pesquisas/estatisticas` - Obter estatísticas do dashboard

## 📱 Design Responsivo

O sistema foi desenvolvido com foco em responsividade:

- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Interface otimizada para touch
- **Touch Targets**: Mínimo 48px conforme guidelines

## 🔧 Tecnologias e Padrões

### Frontend
- **Standalone Components**: Arquitetura moderna do Angular
- **Observables**: Programação reativa com RxJS
- **TypeScript Strict**: Tipagem rigorosa
- **SCSS Modules**: Estilos componentizados
- **Angular Signals**: Para reatividade (preparado para futuro)

### Backend
- **Clean Architecture**: Separação clara de responsabilidades
- **Repository Pattern**: Com Entity Framework
- **DTO Pattern**: Para transferência de dados
- **CORS**: Configurado para desenvolvimento
- **Swagger**: Documentação automática da API

## 📝 Próximas Melhorias

- [ ] Autenticação JWT
- [ ] Relatórios avançados
- [ ] Exportação de dados (Excel, PDF)
- [ ] Templates de formulários
- [ ] Análise de dados com gráficos
- [ ] Notifications push
- [ ] API de webhooks
