# 🧪 Guia de Teste do Sistema

## 🚀 Iniciando o Sistema

### 1. Backend (.NET)
```bash
cd backend
dotnet run
```
✅ **Verificação**: Deve mostrar "Now listening on: http://localhost:5010"

### 2. Frontend (Angular)
```bash
cd frontend
npm start
```
✅ **Verificação**: Deve iniciar em http://localhost:4200 com proxy configurado

## 🔧 Problemas Resolvidos

### ✅ CORS Configurado
- Backend aceita requisições do Angular
- Proxy configurado no Angular para evitar problemas de CORS

### ✅ Porta Correta
- Backend: `http://localhost:5010`
- Frontend: `http://localhost:4200`
- API: `/api/*` (proxy redirecionado)

### ✅ HttpClient Configurado
- `provideHttpClient()` sem withFetch
- Proxy configurado no `angular.json`

## 🧪 Testando Funcionalidades

### 1. Login
- Acesse http://localhost:4200
- Use qualquer credencial (ex: admin/admin)

### 2. Dashboard
- Deve carregar estatísticas do backend
- Botões funcionais

### 3. Criar Formulário
- Clique em "Criar Formulário"
- Preencha título e descrição
- Adicione perguntas
- Salve (deve ir para o banco PostgreSQL)

### 4. Listar Formulários
- Deve carregar do banco de dados
- Opções de copiar link, visualizar, excluir

### 5. Responder Formulário
- Copie um link de formulário
- Acesse em nova aba
- Preencha e envie
- Resposta salva no banco

## 🛠️ Troubleshooting

### Erro de Conexão (Status 0)
- ✅ **Resolvido**: Proxy configurado
- Verifique se backend está rodando
- Verifique se frontend usa `npm start`

### Erro CORS
- ✅ **Resolvido**: Backend configurado para aceitar Angular
- Backend permite http://localhost:4200

### FormService não encontrado
- ✅ **Resolvido**: HttpClient configurado corretamente
- Imports corretos nos componentes

## 📊 Dados de Teste

O sistema já tem alguns dados criados nos testes:
- Formulário "Teste de Formulário" já foi criado
- Estatísticas mostrarão dados reais do banco

## ✅ Sistema Totalmente Funcional!

Todas as integrações foram implementadas e testadas:
- ✅ Frontend ↔ Backend
- ✅ Backend ↔ PostgreSQL
- ✅ CORS resolvido
- ✅ Proxy configurado
- ✅ APIs funcionando
- ✅ Dados persistentes 