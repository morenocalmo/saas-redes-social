# 🔄 Migração para Supabase - Instruções

## ⚠️ AÇÃO NECESSÁRIA: Adicione a senha do banco de dados

### Passo 1: Obter a senha do Supabase

1. **Acesse**: https://supabase.com/dashboard
2. **Selecione seu projeto**: bmf1e-n30ww0xyxgmmwfa
3. **Vá em**: Project Settings > Database
4. **Encontre**: "Database Password"
5. **Copie a senha** (ou resete se não lembra)

### Passo 2: Atualizar o arquivo .env

Abra o arquivo `.env` e substitua `[SUA-SENHA-AQUI]` pela senha que você copiou:

**Exemplo:**
Se sua senha é `minha_senha_123`, altere:

```env
DATABASE_URL="postgresql://postgres.bmf1e-n30ww0xyxgmmwfa:minha_senha_123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.bmf1e-n30ww0xyxgmmwfa:minha_senha_123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

⚠️ **Importante**: Faça isso nas DUAS linhas (DATABASE_URL e DIRECT_URL)!

### Passo 3: Executar a migração

Depois de adicionar a senha, execute:

```bash
# 1. Parar o servidor (Ctrl+C)

# 2. Gerar o Prisma Client
npx prisma generate

# 3. Criar as tabelas no Supabase
npx prisma db push

# 4. Reiniciar o servidor
npm run dev
```

---

## ✅ O que já foi configurado:

- ✅ Arquivo `.env` atualizado com URLs do Supabase
- ✅ Chaves de API do Supabase configuradas
- ✅ Prisma schema atualizado para PostgreSQL
- ✅ Connection pooling configurado
- ⏳ **Aguardando**: Senha do banco de dados

---

## 🔑 Suas credenciais Supabase:

- **Project URL**: (disponível no Supabase Dashboard)
- **Anon Key**: (ver variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` no .env)
- **Service Role**: (ver variável `SUPABASE_SERVICE_ROLE_KEY` no .env)
- **Database Password**: ⏳ Você precisa adicionar no .env

---

## 📊 O que acontecerá após a migração:

Quando você executar `npx prisma db push`, o Prisma irá:
1. ✅ Conectar ao Supabase
2. ✅ Criar todas as tabelas (users, materials, access_requests, etc.)
3. ✅ Configurar os relacionamentos
4. ✅ Aplicar índices e constraints

**Nota**: Os dados do SQLite local NÃO serão migrados automaticamente. Se você tem dados importantes, me avise que posso criar um script de migração.

---

## ❓ Precisa de ajuda?

Se tiver algum problema:
- Verifique se a senha está correta
- Certifique-se de que não há espaços extras
- Confirme que o projeto Supabase está ativo

**Próximo passo**: Obtenha a senha do Supabase e atualize o arquivo `.env`! 🚀
