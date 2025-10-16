/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero16) block: 1 column, 3 rows
  // Row 1: block name
  // Row 2: background image (optional, none in this HTML)
  // Row 3: heading, subheading, CTA (all optional)

  // Compose the table rows
  const headerRow = ['Hero (hero16)'];
  const imageRow = ['']; // No image in HTML
  // The original HTML has no visible text content, so row 3 is empty
  const contentRow = [''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
