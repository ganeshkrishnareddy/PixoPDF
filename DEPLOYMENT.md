# ZeroPDF Deployment Guide (Cloudflare Pages)

Follow these directions to deploy ZeroPDF as a privacy-first, zero-signup, zero-server static site on Cloudflare Pages.

## Git & Repository Setup

Initialize a clean git repository inside the project directory:

```bash
cd D:\zeropdf
git init
git add .
git commit -m "Launch ZeroPDF Phase 1"
git branch -M main
```

1. Create a new private or public repository on GitHub: `https://github.com/new`.
2. Map the local repository to GitHub:
   ```bash
   git remote add origin https://github.com/username/zeropdf.git
   git push -u origin main
   ```

## Cloudflare Pages Configuration

1. Log in to your Cloudflare Dashboard and select **Workers & Pages**.
2. Click **Create Application** → **Pages** → **Connect to Git**.
3. Authorize and choose your `zeropdf` repository.
4. Input the following configuration settings:
   - **Project Name**: `zeropdf` (or custom name)
   - **Production Branch**: `main`
   - **Framework Preset**: `None`
   - **Build Command**: *Leave blank*
   - **Build Output Directory**: `/` (Root directory containing `index.html`)
   - **Root Directory**: `/`
5. Click **Save and Deploy**.

Cloudflare will automatically compile, serve, and cache your static assets globally on the edge.

## Custom Domain Mapping
To connect `zeropdf.com` after deployment:
1. Navigate to the Pages project dashboard and click **Custom Domains**.
2. Click **Set up a Custom Domain** and input your hostname.
3. Update `SITE_URL` in [site-config.js](file:///D:/zeropdf/js/site-config.js) to map sitemaps and breadcrumb structures correctly.
