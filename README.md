# Domera editorial catalog preview

Isolated staging / owner visual review. Not a production release.

Source: spayzik/sitedomera, exact commit `65b1e54e7e35441795ed7307ae95b381f32e1823`.

The workflow checks out the immutable source commit, runs all existing production gates, then copies only verified dist to a separate staging directory. The staging copy adds noindex and a small test-version notice, removes sitemap.xml and uses a robots.txt without a sitemap. Source files and the production verifier are never altered.

No analytics counter, Avito credentials or live sync are configured. Telegram links remain functional for draft inspection; do not send actual inquiries during review.

Only the staging artifact is uploaded to GitHub Pages. No deployment action targets the source repository or REG.RU.
