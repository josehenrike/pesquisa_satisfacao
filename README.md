# Sistema de Pesquisa de Satisfação

Este é um sistema desenvolvido para gerenciar pesquisas de satisfação de clientes, permitindo que empresas criem e distribuam formulários de avaliação.

## Tecnologias Utilizadas

- Frontend: Angular 17
- Backend: .NET 8 (C#)
- Banco de Dados: PostgreSQL 15+

## Funcionalidades Principais

- Criação de pesquisas personalizadas
- Geração de links únicos para cada pesquisa
- Dashboard para visualização de resultados
- Relatórios e análises de satisfação
- Interface responsiva e moderna

## Requisitos

- Node.js 18+
- .NET 8 SDK
- PostgreSQL 15+
- pgAdmin 4 (opcional, para gerenciamento do banco)

## Como Executar

### Banco de Dados
1. Instale o PostgreSQL
2. Crie um banco de dados chamado `pesquisa_satisfacao`
3. Execute os scripts de migração na pasta `backend/Database/Migrations`

### Backend
1. Navegue até a pasta `backend`
2. Configure a string de conexão no `appsettings.json`
3. Execute `dotnet restore`
4. Execute `dotnet run`

### Frontend
1. Navegue até a pasta `frontend`
2. Execute `npm install`
3. Execute `ng serve`

## Estrutura do Projeto

```
PesquisaSatisfacao/
├── backend/           # API .NET
│   ├── Controllers/   # Controladores da API
│   ├── Models/        # Modelos de dados
│   ├── Services/      # Serviços de negócio
│   ├── Database/      # Configurações e migrações do banco
│   └── DTOs/          # Objetos de transferência de dados
├── frontend/         # Aplicação Angular
│   ├── src/
│   │   ├── app/      # Componentes e serviços
│   │   ├── assets/   # Recursos estáticos
│   │   └── environments/ # Configurações
│   └── ...
└── docs/            # Documentação
```

## Modelo de Dados

### Principais Entidades

1. **Pesquisa**
   - ID
   - Título
   - Descrição
   - Data de Criação
   - Status (Ativa/Inativa)
   - Link Único

2. **Pergunta**
   - ID
   - Texto
   - Tipo (Múltipla Escolha, Texto, Escala)
   - Opções (para múltipla escolha)
   - Ordem

3. **Resposta**
   - ID
   - ID da Pesquisa
   - ID da Pergunta
   - Valor
   - Data de Resposta

4. **Cliente**
   - ID
   - Nome
   - Email
   - Data de Cadastro 