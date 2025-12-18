# Next.js + Strapi (v5) + Prisma (Neon) – Autenticação, Mensagens e Páginas Estáticas

**Live (Vercel)**: https://nextjs-strapi-auth.vercel.app  
**Repositório**: https://github.com/RobertoFarias86/nextjs-strapi-auth



## Visão Geral
Projeto Next.js que consome conteúdos publicados no Strapi via GraphQL (Home + rotas dinâmicas `/posts/[slug]` com SSG) e implementa autenticação com JWT httpOnly, páginas protegidas com SSR (`/messages`) e API Routes protegidas para envio/listagem de mensagens persistidas no PostgreSQL (Neon) via Prisma.

## Stack
- **Next.js 16** (Pages Router)
- **Strapi v5** (GraphQL habilitado)
- **PostgreSQL (Neon)** + **Prisma 7**
- **JWT httpOnly** (login/logout)
- **CSS** em `styles/globals.css` + **CSS-in-JS** (styled-jsx)
- **Imagens** com `next/image` (remotePatterns configurado)

## Como rodar local
1. Suba o Strapi (com GraphQL ligado) em `http://localhost:1337`, crie Content Type **Post** com campos: `title, slug (UID), excerpt, content, cover (Media/Single)` e publique 2–3 posts. Gere um **API Token read-only**.
2. Configure `C:\Users\User\React\nextjs-strapi-auth\.env.local`:
   ```env
   DATABASE_URL=postgresql://...-pooler... (Neon)
   DIRECT_URL=postgresql://... (sem -pooler)
   JWT_SECRET=chave_hex_forte
   STRAPI_GRAPHQL_URL=http://localhost:1337/graphql
   STRAPI_API_TOKEN=seu_token_readonly
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   ```
3. Migrações Prisma (Prisma 7): para migrar use conexão **direta** (sem pooler), depois volte ao pooler.
   ```powershell
   cd C:\Users\User\React\nextjs-strapi-auth
   # TEMP: troque no .env.local o DATABASE_URL pela DIRECT_URL
   npx prisma migrate dev --name init
   npx prisma generate
   # Restaure DATABASE_URL com -pooler no .env.local
   ```
4. Rodar:
   ```powershell
   # Strapi
   cd C:\Users\User\React\cms
   npm run develop

   # Next
   cd C:\Users\User\React\nextjs-strapi-auth
   npm run dev
   ```
5. Teste:
   - Home `/` lista posts do Strapi.
   - `/posts/[slug]` abre conteúdo.
   - `/register` e `/login` funcionam (validação front + back).
   - `/messages` exige login (SSR), envia e lista mensagens (Neon).
   - `npx prisma studio` mostra tabelas **User** e **Message**.

## Rotas & APIs
- **Páginas**:
  - `/` (SSG com `getStaticProps`) – lista últimos posts (até 20) com imagem otimizada.
  - `/posts/[slug]` (SSG com `getStaticPaths/getStaticProps`) – cover, título, excerpt, content.
  - `/register`, `/login` – formulários (validação front + back).
  - `/messages` – **protegida** via **SSR** (checa `/api/profile`).

- **API Routes** (todas em `/pages/api`):
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/profile` (protegida; exige cookie httpOnly)
  - `GET/POST /api/messages` (protegida; cria e lista mensagens do usuário)

## Deploy
- **Strapi**: Render/Railway/Strapi Cloud. Gere `STRAPI_GRAPHQL_URL` público e atualize `NEXT_PUBLIC_STRAPI_URL`/`STRAPI_GRAPHQL_URL` no Vercel.
- **Next.js**: Vercel (conecte o repositório; Builds automáticos a cada push).
- **Variáveis no Vercel** (Production/Preview/Development):
  - `DATABASE_URL` (com -pooler)
  - `JWT_SECRET`
  - `STRAPI_GRAPHQL_URL` (pública)
  - `STRAPI_API_TOKEN`
  - `NEXT_PUBLIC_SITE_URL` (URL do seu site na Vercel)
  - `NEXT_PUBLIC_STRAPI_URL` (domínio público do Strapi)
  > Para migrações em produção, execute-as localmente ou via script usando a DIRECT_URL.

## Como o projeto atende a avaliação
- **Arquitetura**: deploy serverless (Vercel), CMS Strapi (GraphQL), PostgreSQL (Neon), Prisma.
- **Formulários**: cadastro e login com validação front/back; dados persistidos.
- **Evitar renderização desnecessária**: SSG em Home e Post; SSR apenas onde precisa (página protegida).
- **Rotas dinâmicas**: geradas a partir do Strapi (`getStaticPaths/getStaticProps`).
- **API Routes**: criadas e protegidas por JWT httpOnly.

## Colaborador (professor)
Adicionado como colaborador: **@armeniocardoso** (GitHub).

---

MIT © Roberto Carlos Dias de Lucena Farias