/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero3)'];

  // 2. Background image (none in this case)
  const backgroundImageCell = '';

  // 3. Hero content: heading, subheading, divider, filter label, filter dropdown, loading spinner
  const section = element.querySelector('section');
  let heroContentCell = [];

  if (section) {
    // Heading
    const heading = section.querySelector('h1');
    if (heading) heroContentCell.push(heading);
    // Subheading
    const subheading = section.querySelector('p');
    if (subheading) heroContentCell.push(subheading);
    // Divider
    const divider = section.querySelector('hr');
    if (divider) heroContentCell.push(divider);
    // Filter label
    const filterLabel = section.querySelector('span[data-hook="filter-label"]');
    if (filterLabel) heroContentCell.push(filterLabel);
    // Filter dropdown (button)
    const filterDropdown = section.querySelector('button[data-hook^="filter-cta"]');
    if (filterDropdown) heroContentCell.push(filterDropdown);
  }

  // Loading spinner (img) - search entire element for spinner under [data-hook="widget-loader"]
  const spinner = element.querySelector('[data-hook="widget-loader"] img');
  if (spinner) heroContentCell.push(spinner);

  // Defensive fallback: if nothing found, try to find heading/subheading anywhere
  if (heroContentCell.length === 0) {
    const heading = element.querySelector('h1');
    if (heading) heroContentCell.push(heading);
    const subheading = element.querySelector('p');
    if (subheading) heroContentCell.push(subheading);
  }

  // 4. Compose table rows
  const cells = [
    headerRow,
    [backgroundImageCell],
    [heroContentCell]
  ];

  // 5. Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
