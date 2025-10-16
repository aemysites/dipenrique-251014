/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards24) block: 2 columns, multiple rows, each card = image + text
  // Header row must contain exactly one column
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find all card items (role="listitem") in correct visual order
  // The HTML structure groups cards in .cGWabE containers, each with two cards
  const containers = element.querySelectorAll('.cGWabE');
  containers.forEach(container => {
    const cardNodes = container.querySelectorAll('[role="listitem"]');
    cardNodes.forEach(card => {
      // Find the image (mandatory)
      const img = card.querySelector('img');
      // Find the name/title (mandatory, styled heading)
      let title = null;
      let desc = null;
      const richTexts = card.querySelectorAll('[data-testid="richTextElement"]');
      if (richTexts.length > 0) {
        title = richTexts[0];
        if (richTexts.length > 1) {
          desc = richTexts[1];
        }
      }
      // Compose the text cell: title (heading) + description (subtitle)
      const textCell = document.createElement('div');
      if (title) textCell.appendChild(title);
      if (desc) textCell.appendChild(desc);
      rows.push([img, textCell]);
    });
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
