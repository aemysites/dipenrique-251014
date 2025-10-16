/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards13) block parser

  // 1. Find the grid container holding all cards
  const grid = element.querySelector('[data-hook="Grid-container"] > ul');
  if (!grid) return;

  // 2. Get all card items (li elements)
  const cardItems = Array.from(grid.querySelectorAll('li[data-hook="Grid-item"]'));

  // 3. Prepare the table rows
  const rows = [];
  // Header row as required
  rows.push(['Cards (cards13)']);

  // 4. For each card, extract image and text content
  cardItems.forEach((li) => {
    // --- IMAGE/ICON ---
    // Find the image inside the card
    let imgEl = li.querySelector('img');
    // Defensive: if not found, leave cell empty
    let imageCell = imgEl ? imgEl : '';

    // --- TEXT CONTENT ---
    // Find the card info section
    const cardInfo = li.querySelector('[data-hook="card-info"]');
    let textCellContent = [];
    if (cardInfo) {
      // Title (h2 inside a link)
      const titleLink = cardInfo.querySelector('[data-hook="service-info-title-link"]');
      let titleEl = null;
      if (titleLink) {
        // Use the heading (h2) inside the link
        const h2 = titleLink.querySelector('h2');
        if (h2) {
          // Clone h2 to avoid moving it from DOM
          titleEl = h2.cloneNode(true);
        }
      }
      if (titleEl) textCellContent.push(titleEl);

      // Duration (p[data-type="duration"])
      const duration = cardInfo.querySelector('p[data-type="duration"]');
      if (duration) {
        textCellContent.push(duration.cloneNode(true));
      }
      // Accessible price (div[data-hook="service-info-sr-only-price"])
      const srPrice = cardInfo.querySelector('div[data-hook="service-info-sr-only-price"]');
      if (srPrice) {
        textCellContent.push(srPrice.cloneNode(true));
      }
      // Price (p[data-type="price"])
      const price = cardInfo.querySelector('p[data-type="price"]');
      if (price) {
        textCellContent.push(price.cloneNode(true));
      }
      // CTA button (link with [data-hook="book-button-button"])
      const cta = cardInfo.querySelector('[data-hook="book-button-button"]');
      if (cta) {
        textCellContent.push(cta.cloneNode(true));
      }
    }
    // Defensive: if nothing found, fallback to all text
    if (textCellContent.length === 0) {
      textCellContent.push(document.createTextNode(li.textContent.trim()));
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // 5. Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // 6. Replace the element
  element.replaceWith(table);
}
