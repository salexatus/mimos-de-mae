# Mimos de Mãe — Landing Page

Landing page premium da **Mimos de Mãe Confeitaria** (Ji-Paraná/RO), com destaque para o lançamento da **Estação Gourmet** em **13/06/2026**.

Site estático, sem dependências de build — HTML + CSS + JS puro, pronto para publicar em qualquer hospedagem ou no GitHub Pages.

## 📁 Estrutura

```
.
├── index.html                 # Página principal (semântica + SEO + JSON-LD)
├── assets/
│   ├── css/styles.css         # Estilos (premium, responsivo, acessível)
│   ├── js/main.js             # Cursor, contagem regressiva, menu, reveals
│   └── favicon.svg            # Ícone da marca
├── CNAME                      # Domínio personalizado do GitHub Pages
├── robots.txt                 # SEO
├── sitemap.xml                # SEO
├── .nojekyll                  # Impede processamento Jekyll no Pages
└── .github/workflows/deploy.yml  # Deploy automático no GitHub Pages
```

## 🚀 Publicar no subdomínio (GitHub Pages)

1. **Crie o repositório** e envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Landing page Mimos de Mãe"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```

2. **Ative o GitHub Pages**: no repositório, vá em **Settings → Pages** e em *Build and deployment → Source* escolha **GitHub Actions**. O workflow `deploy.yml` publica automaticamente a cada push na `main`.

3. **Configure o subdomínio**:
   - Edite o arquivo [`CNAME`](CNAME) trocando `mimos.seudominio.com.br` pelo seu subdomínio real.
   - No seu provedor de DNS, crie um registro **CNAME** apontando o subdomínio para `SEU_USUARIO.github.io`.
   - Em **Settings → Pages → Custom domain**, informe o mesmo subdomínio e marque **Enforce HTTPS**.

> Hospedagem alternativa (cPanel/FTP, Netlify, Vercel): basta enviar todos os arquivos para a raiz pública. Não há etapa de build.

## ⚙️ Pontos de configuração

Antes de ir ao ar, ajuste:

| O quê | Onde | Valor atual (placeholder) |
|---|---|---|
| Subdomínio | `CNAME`, `robots.txt`, `sitemap.xml`, `<link rel="canonical">` e tags `og:`/`twitter:` no `index.html` | `mimos.seudominio.com.br` |
| Data do lançamento | `assets/js/main.js` → `target` | `2026-06-13T00:00:00-04:00` (fuso de RO, UTC-4) |
| WhatsApp | `index.html` (links `wa.me`) e `assets/js/main.js` → `WHATSAPP` | `5569992284490` |
| Instagram | `index.html` | `@mimosdemaeconfeitaria` |
| Logo / favicon | `assets/favicon.svg` | Monograma "M" rosê |
| Imagens | `index.html` | Fotos do Unsplash (trocar pelas reais do ateliê) |

## 🖥️ Testar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## ✨ Recursos

- Contagem regressiva para o lançamento, com estado "Já disponível" automático após a data.
- Cursor personalizado (apenas em desktop/pointer fino; nunca deixa o usuário sem cursor).
- Menu mobile acessível (teclado, ESC, foco, trava de scroll).
- Revelação ao rolar via `IntersectionObserver`.
- Respeita `prefers-reduced-motion`.
- SEO: meta tags, Open Graph/Twitter, dados estruturados `Bakery` (LocalBusiness), `sitemap.xml` e `robots.txt`.
- Imagens com `loading="lazy"` e `decoding="async"`.

## 📝 Observação

O **painel de administração** (editor de conteúdo client-side) presente no protótipo original **foi removido** desta versão de produção: ele ficava exposto a qualquer visitante e só salvava em `localStorage`/download local, sem persistência real. Caso queira um editor de conteúdo de verdade, posso integrar um CMS (ex.: Decap/Netlify CMS) ou um painel protegido.
