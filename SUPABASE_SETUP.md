# 🔧 Como Configurar o Supabase - Guia Passo a Passo

## ✅ O que já foi configurado:

- ✅ Arquivo `.env` atualizado com as chaves do Supabase
- ✅ Prisma schema configurado para Supabase
- ✅ Connection pooling habilitado
- ⏳ **Falta apenas**: Adicionar a senha do banco de dados

---

## 📍 Passo 1: Obter a Senha do Banco de Dados

### Opção A: Se você lembra da senha
Se você salvou a senha quando criou o projeto Supabase, use ela!

### Opção B: Resetar a senha (recomendado)

1. **Acesse o Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecione seu projeto** (o que tem o ID: bmf1e-n30ww0xyxgmmwfa)
3. **Clique em "Project Settings"** (ícone de engrenagem no menu lateral)
4. **Clique em "Database"** no submenu
5. **Role até "Database Password"**
6. **Clique em "Reset Database Password"**
7. **Copie a nova senha** (ela será exibida apenas uma vez!)

![Guia Visual do Supabase](file:///C:/Users/emill/.gemini/antigravity/artifacts/supabase_password_guide.webp)

---

## 📝 Passo 2: Atualizar o arquivo .env

Abra o arquivo `.env` na raiz do projeto e substitua `[YOUR-DATABASE-PASSWORD]` pela senha que você copiou:

**Antes:**
```env
DATABASE_URL="postgresql://postgres.bmf1e-n30ww0xyxgmmwfa:[YOUR-DATABASE-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Depois (exemplo com senha "minha_senha_123"):**
```env
DATABASE_URL="postgresql://postgres.bmf1e-n30ww0xyxgmmwfa:minha_senha_123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

⚠️ **IMPORTANTE**: Faça o mesmo para a linha `DIRECT_URL`!

---

## 🚀 Passo 3: Criar as Tabelas no Supabase

Depois de atualizar a senha no `.env`, execute os seguintes comandos:

```bash
# 1. Parar o servidor (Ctrl+C no terminal onde está rodando)

# 2. Gerar o Prisma Client
npx prisma generate

# 3. Criar todas as tabelas no Supabase
npx prisma db push

# 4. Iniciar o servidor novamente
npm run dev
```

---

## ✨ O que acontecerá:

Quando você executar `npx prisma db push`, o Prisma irá:
- ✅ Conectar ao seu banco de dados Supabase
- ✅ Criar todas as tabelas necessárias:
  - `users` (usuários/criadores)
  - `materials` (materiais exclusivos)
  - `access_requests` (solicitações de acesso)
  - `video_materials` (vídeos associados)
  - `subscriptions` (assinaturas)

---

## 🔑 Suas Credenciais Supabase:

- **Project URL**: (disponível no Supabase Dashboard)
- **Anon Key**: (ver variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` no .env)
- **Service Role Key**: (ver variável `SUPABASE_SERVICE_ROLE_KEY` no .env)
- **Database Password**: ⏳ Você precisa obter/resetar no dashboard

---

## ❓ Problemas Comuns:

### "Error: P1001: Can't reach database server"
- ✅ Verifique se a senha está correta no `.env`
- ✅ Certifique-se de que não há espaços extras na URL
- ✅ Verifique se o projeto Supabase está ativo

### "Error: P3009: migrate encountered database errors"
- ✅ O banco pode já ter algumas tabelas. Use `npx prisma db push --force-reset` para resetar

---

## 📞 Precisa de Ajuda?

Se tiver algum problema, me avise! Posso ajudar com:
- Verificação da configuração
- Troubleshooting de erros
- Ajustes no schema do banco

---

**Próximo passo**: Obtenha a senha do Supabase e atualize o arquivo `.env`! 🚀
