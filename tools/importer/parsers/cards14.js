/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards container
  const columnsContainer = element.querySelector('[data-testid="columns"]');
  if (!columnsContainer) return;

  // Find all card grid containers (each card is a grid container)
  const cardContainers = Array.from(columnsContainer.querySelectorAll('[data-mesh-id$="inlineContent-gridContainer"]'));
  if (!cardContainers.length) return;

  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  cardContainers.forEach(cardContainer => {
    // Find the first image for this card
    const image = cardContainer.querySelector('.wixui-image img');
    // Find all rich-text blocks for this card (title/price, bedrooms/desc)
    const richTexts = cardContainer.querySelectorAll('.wixui-rich-text');
    // Find the button for this card
    const button = cardContainer.querySelector('.wixui-button');

    // Compose text cell
    const textCell = document.createElement('div');
    richTexts.forEach(rt => {
      // Only add non-empty rich text blocks
      Array.from(rt.childNodes).forEach(node => {
        if (node.textContent && node.textContent.replace(/\s+/g, '').length > 0) {
          textCell.appendChild(node.cloneNode(true));
        }
      });
    });
    if (button) {
      textCell.appendChild(button.cloneNode(true));
    }

    if (image && textCell.childNodes.length) {
      rows.push([image, textCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
