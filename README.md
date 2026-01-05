# Canine Haven Boutique — Working Base (ZIP)

## IMPORTANT (why your buttons broke before)
1) **index.html must load app.js only once**.
2) If you open the app from **file://**, module scripts can fail. Use **GitHub Pages / Netlify / local dev server**.

## Where to paste your links
- `js/config.js`
  - `customerFormEmbedUrl` (Google Form iframe src)
  - `affiliateFormEmbedUrl` (Google Form iframe src)
  - `starterPackSquarePayLink` (Square pay link)
  - `affiliateStatsUrl` (optional)
  - `facebookGroupUrl` (optional)

## Where to add products + Square links
- `js/products.js` — add products and paste each item’s Square checkout link.

## Images
- Put your product images in `/assets/` and reference them like:
  - `image: "assets/my-collar.png"`
