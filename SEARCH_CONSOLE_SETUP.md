# Google Search Console Verification & Setup Guide

Preparing ZeroPDF for indexing inside Google Search Console:

## 1. Domain Registration & Setup

1. Deploy the compiled ZeroPDF folder onto Cloudflare Pages (`https://zeropdf.pages.dev`).
2. Log into the Google Search Console dashboard: `https://search.google.com/search-console/`.
3. Add a new **URL-prefix** property using the target domain:
   - Target: `https://zeropdf.pages.dev/` (or your mapped custom domain: `https://zeropdf.com/`).

## 2. Ownership Verification

To complete ownership checks via HTML meta tag:
1. Select the **HTML tag** option under verification methods.
2. Copy the resulting meta code:
   ```html
   <meta name="google-site-verification" content="PLACEHOLDER_VERIFICATION_TOKEN" />
   ```
3. Open [index.html](file:///D:/zeropdf/index.html) and paste the verification tag directly inside the `<head>` tag.
4. Click **Verify** in Search Console.

## 3. Sitemap Submission

1. Once verified, click **Sitemaps** in the left menu.
2. Under "Add a new sitemap", type:
   - Path: `sitemap.xml`
3. Click **Submit**.

Search Console will automatically scrape `https://zeropdf.pages.dev/sitemap.xml` and discover all tool directories for crawl indexing.
