/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main content container (skip background layers)
  const mesh = element.querySelector('[data-testid="inline-content"] [data-testid="mesh-container-content"]');
  if (!mesh) return;

  // 2. Find the heading (first rich text block with h2)
  const headingDiv = mesh.querySelector('h2')?.closest('div');

  // 3. Find all card icon+text pairs (pattern: img/svg, then rich-text, then paragraph)
  // We'll look for all vector images and pair them with the next two rich-text blocks
  const cardRows = [];
  const children = Array.from(mesh.children);
  // Find all vector images (icons)
  const iconDivs = children.filter((el) => el.classList.contains('wixui-vector-image'));

  // For each icon, find its two following rich-text blocks
  iconDivs.forEach((iconDiv) => {
    // Find index of iconDiv in children
    const iconIdx = children.indexOf(iconDiv);
    // Find the next two rich-text divs after the iconDiv
    let titleDiv = null, descDiv = null;
    for (let i = iconIdx + 1, found = 0; i < children.length && found < 2; i++) {
      if (children[i].classList.contains('wixui-rich-text')) {
        if (!titleDiv) titleDiv = children[i];
        else if (!descDiv) descDiv = children[i];
        found++;
      }
    }
    // Defensive: only add if both exist
    if (titleDiv && descDiv) {
      cardRows.push([
        // Icon cell: use the <img> inside the iconDiv
        iconDiv.querySelector('img'),
        // Text cell: combine title and description
        [titleDiv, descDiv]
      ]);
    }
  });

  // 4. Assemble the table
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace the original element
  // Insert heading above the table if present
  if (headingDiv) {
    element.replaceWith(headingDiv, table);
  } else {
    element.replaceWith(table);
  }
}
