const contentTags = new Set(
  'a b blockquote br caption code dd del div dl dt em h1 h2 h3 h4 h5 h6 hr i img li ol p pre s span strong sub sup table tbody td th thead tr u ul'.toUpperCase().split(' ')
);
const omittedTags = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM']);

function webUrl(value, base) {
  if (!value) return null;
  try {
    const url = new URL(value, base);
    return ['https:', 'http:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

function copyContent(node, base) {
  if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
  if (node.nodeType !== Node.ELEMENT_NODE || omittedTags.has(node.tagName)) {
    return document.createDocumentFragment();
  }

  const clean = contentTags.has(node.tagName) && node.namespaceURI === 'http://www.w3.org/1999/xhtml'
    ? document.createElement(node.localName)
    : document.createDocumentFragment();

  if (clean.tagName === 'A') {
    let link = webUrl(node.getAttribute('href'), base);
    if (link && ['www.google.com', 'google.com'].includes(link.hostname) && link.pathname === '/url') {
      link = webUrl(link.searchParams.get('q') || link.searchParams.get('url'), base);
    }
    if (link) {
      clean.href = link.href;
      if (link.origin !== location.origin) {
        clean.target = '_blank';
        clean.rel = 'noopener noreferrer';
      }
    }
  }

  if (clean.tagName === 'IMG') {
    const source = webUrl(node.getAttribute('src'), base);
    if (!source) return document.createDocumentFragment();
    clean.src = source;
    clean.alt = node.getAttribute('alt') || '';
    clean.loading = 'lazy';
  }

  for (const attribute of ['start', 'value', 'colspan', 'rowspan']) {
    const value = node.getAttribute(attribute);
    if (clean.nodeType === Node.ELEMENT_NODE && value && /^\d+$/.test(value)) {
      clean.setAttribute(attribute, value);
    }
  }

  for (const child of node.childNodes) clean.append(copyContent(child, base));
  return clean;
}

async function loadWishlist() {
  const source = document.body.dataset.doc;
  const status = document.querySelector('#doc-status');
  const wishes = document.querySelector('#wishes');
  const lastEdit = document.querySelector('#last-edit');
  status.textContent = 'Henter ønskelisten …';

  try {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Google Docs: ${response.status}`);

    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const content = page.querySelector('.doc-content') || page.querySelector('#contents');
    if (!content) throw new Error('Dokumentindholdet mangler');

    for (const paragraph of page.querySelectorAll('#contents p, .doc-content p')) {
      const stamp = /^Last edit:\s*(\d{4}\.\d{2}\.\d{2})(?:\s+\d{2}:\d{2})?$/.exec(paragraph.textContent.trim());
      if (!stamp) continue;

      lastEdit.textContent = `Last edit: ${stamp[1]}`;
      lastEdit.hidden = false;
      paragraph.remove();
    }

    wishes.append(copyContent(content, response.url || source));
    status.textContent = '';
  } catch {
    status.textContent = 'Ønskelisten kunne ikke hentes. Prøv at genindlæse siden.';
  }
}

loadWishlist();
