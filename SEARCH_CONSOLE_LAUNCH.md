# Search Console Launch Checklist for PixoPDF

This guide outlines the immediate steps to take in Google Search Console after mapping `pixopdf.online` to production.

## 1. Domain Property Setup
- [ ] Log into the [Google Search Console Dashboard](https://search.google.com/search-console).
- [ ] Click **Add Property** in the property selector.
- [ ] Select the **Domain property** option (recommended) and input `pixopdf.online`.
- [ ] Copy the generated `googlesiteverification` TXT record.
- [ ] Go to the Cloudflare DNS dashboard for `pixopdf.online` and add the TXT record at root (`@`).
- [ ] Return to Search Console and click **Verify**.

## 2. Submit Sitemap
- [ ] Go to the **Sitemaps** section in the left sidebar.
- [ ] Under "Add a new sitemap", input:
  `https://pixopdf.online/sitemap.xml`
- [ ] Click **Submit**.
- [ ] Verify that the status column changes to **Success** and registers all indexable routes.

## 3. Indexing Request
- [ ] Input the homepage URL `https://pixopdf.online/` into the URL Inspection search bar.
- [ ] Click **Request Indexing**.
- [ ] Inspect and request indexing for primary entry hubs:
  - `https://pixopdf.online/sign-pdf/`
  - `https://pixopdf.online/edit-pdf/`
  - `https://pixopdf.online/merge-pdf/`

## 4. Monitoring & Diagnostics
- [ ] **Core Web Vitals**: Monitor pages for "Good" status on mobile/desktop.
- [ ] **Page Indexing**: Monitor the index coverage graph weekly for any crawl warnings or issues.
- [ ] **HTTPS Verification**: Confirm that all indexed URLs are detected as secure.
