# Nauman Ahmad Mughal, portfolio

Personal portfolio of Nauman Ahmad Mughal, Laravel web developer and UI/UX designer in Lahore, Pakistan.

Live site: https://nauman-ahmad-mughal.github.io/

## What is here

- `index.html` is the whole site: markup, styles and scripts in one file, with no build step.
- `assets/` holds the CV and the portrait.
- `tests/site.test.mjs` checks the page: every local file it links to exists, it only links inside `assets/`, the source is plain ASCII, and `.gitignore` still publishes only the site files. GitHub Actions runs it on every pull request.
- `.nojekyll` tells GitHub Pages to serve the files exactly as they are.

## Add project screenshots

Save them as `assets/img/excellence-hub.png` and `assets/img/oneten-exporter.png`. Each one replaces the drawn cover on its project card automatically.

## Run the checks

    node --test tests/site.test.mjs

## What gets published

`.gitignore` ignores everything by default and lists the site files that may be committed. Anything else in the folder stays local.
