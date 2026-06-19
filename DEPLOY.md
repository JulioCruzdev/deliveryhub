# Deploy — Vercel + Neon.tech

## 1. Banco de dados no Neon.tech (grátis)

1. Acesse [neon.tech](https://neon.tech) e crie uma conta
2. Clique em **New Project** → dê o nome `deliveryhub`
3. Após criar, vá em **Dashboard → Connection Details**
4. Copie a **Connection string** (formato: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/deliveryhub?sslmode=require`)

---

## 2. Repositório no GitHub

1. Crie um repositório no GitHub (pode ser privado)
2. Na pasta do projeto, execute:

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/seu-usuario/deliveryhub.git
git push -u origin main
```

---

## 3. Deploy no Vercel (grátis)

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub
2. Clique em **Add New → Project**
3. Selecione o repositório `deliveryhub`
4. Na tela de configuração, **antes de clicar em Deploy**, vá em **Environment Variables** e adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | A connection string do Neon copiada no passo 1 |
| `JWT_SECRET` | Um texto aleatório longo (ex: gere em https://generate-secret.vercel.app/32) |
| `JWT_REFRESH_SECRET` | Outro texto aleatório longo |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `NEXT_PUBLIC_APP_URL` | `https://seu-projeto.vercel.app` (preencha depois do deploy) |
| `NODE_ENV` | `production` |

5. Clique em **Deploy** — o Vercel vai:
   - Instalar dependências (`npm install` → aciona `postinstall` → `prisma generate`)
   - Aplicar as migrations no banco (`prisma migrate deploy`)
   - Fazer o build do Next.js (`next build`)

---

## 4. Após o deploy

1. Copie a URL gerada pelo Vercel (ex: `https://deliveryhub-xxx.vercel.app`)
2. Volte em **Vercel → Settings → Environment Variables**
3. Atualize `NEXT_PUBLIC_APP_URL` com a URL real
4. Vá em **Deployments** e clique em **Redeploy** para aplicar

---

## 5. Popular o banco em produção (opcional)

Se quiser criar o usuário demo em produção, execute localmente apontando para o banco do Neon:

```bash
# Substitua pela sua connection string do Neon
DATABASE_URL="postgresql://..." npm run db:seed
```

---

## Variáveis obrigatórias resumidas

```
DATABASE_URL=        # Neon connection string (com ?sslmode=require)
JWT_SECRET=          # string aleatória segura
JWT_REFRESH_SECRET=  # string aleatória segura
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL= # URL do Vercel
NODE_ENV=production
```
