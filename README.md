# Family Wishlists

A static GitHub Pages site for Nicolai, Cecillie, Peter, and the shared family wishlist.

[Open the wishlists](https://ptrsc.github.io/wishlist/)

## How it works

- The [front page](index.html) links to the four lists. All pages use the shared styles in [`assets/css/main.css`](assets/css/main.css).
- [Peter’s list](Peter/) and the [shared list](xn--flles-sra/) load their published Google Docs. Each page sets the source URL in the `data-doc` attribute. [`assets/js/doc-loader.js`](assets/js/doc-loader.js) renders the document in the site’s layout and opens external product links in a new tab.
- The Google Docs pages display a date-only `Last edit` line when the published document includes a timestamp. The existing Google Apps Script updates the timestamp in the source document on a daily schedule.
- [Cecillie’s list](Cecillie/) and [Nicolai’s list](Nicolai/) display their shared Ønskeskyen lists. Visitors can also open each list directly in Ønskeskyen to reserve gifts.
- Changes to wishes appear after Google Docs republishes them or Ønskeskyen makes them available. These content updates do not require a GitHub Pages deployment.

## Adding a wishlist

1. **Prepare the source.** For Google Docs, choose **File → Share → Publish to web** and copy the published link. For Ønskeskyen, copy the list’s share link.
2. **Create the page.** Copy `Peter/index.html` for a Google Docs list or `Nicolai/index.html` for an Ønskeskyen list into a new folder. Update the page title, heading, and source URL. For an Ønskeskyen page, update both the iframe source and the direct link.
3. **Add a front-page card.** Add a link in the `nav.grid` element in `index.html` and point it at the new folder. Use relative paths so the site works under `/wishlist/` on GitHub Pages.
4. **Check the result locally.** Open the new list from the front page and verify its content, links, and navigation back to the front page.

## Local preview

Run this from the repository root and open [the local preview](http://127.0.0.1:8765/).

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

## Deployment and rollback

GitHub Pages publishes the repository root from `master`. Review site changes in a pull request before merging them.

The [pre-modernization backup branch](https://github.com/PTRSC/wishlist/tree/codex/pre-modernization-2026-11-25) preserves the exact source of the previous site. To restore the previous site without rewriting history, use **Revert** on the merged modernization pull request and merge the resulting revert pull request.
