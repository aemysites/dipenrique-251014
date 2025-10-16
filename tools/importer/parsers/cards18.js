/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards18) block parser
  // Header row
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Find all card containers (sections with class 'wixui-column-strip')
  const cardSections = Array.from(element.querySelectorAll('section.wixui-column-strip'));

  cardSections.forEach((section) => {
    // Each card section contains columns (usually one per card)
    const columns = Array.from(section.querySelectorAll('.wixui-column-strip__column'));
    columns.forEach((col) => {
      // Card image (look for .wixui-image inside this column)
      const imageContainer = col.querySelector('.wixui-image');
      let imageEl = null;
      if (imageContainer) {
        imageEl = imageContainer.querySelector('img');
      }

      // Card text content: look for rich text elements
      // We'll collect: title, subtitle, description, price
      const textEls = Array.from(col.querySelectorAll('.wixui-rich-text'));
      let titleEl = null, subtitleEl = null, descEl = null, priceEl = null;

      textEls.forEach((el) => {
        // Title: font-size:18px and bold
        if (!titleEl && el.textContent.trim().length && el.querySelector('span.color_36')) {
          titleEl = el;
        }
        // Subtitle: contains 'Bedrooms'
        if (!subtitleEl && /Bedrooms/.test(el.textContent)) {
          subtitleEl = el;
        }
        // Description: paragraph with a lot of text
        if (!descEl && el.textContent.length > 40 && !/Bedrooms/.test(el.textContent)) {
          descEl = el;
        }
        // Price: contains $ and /per week
        if (!priceEl && /\$\d+/.test(el.textContent)) {
          priceEl = el;
        }
      });

      // Compose text cell: title, subtitle, description, price
      const textCellContent = [];
      if (titleEl) textCellContent.push(titleEl);
      if (subtitleEl) textCellContent.push(subtitleEl);
      if (descEl) textCellContent.push(descEl);
      if (priceEl) textCellContent.push(priceEl);

      // Add card row: [image, text]
      if (imageEl && textCellContent.length) {
        rows.push([imageEl, textCellContent]);
      } else if (imageEl) {
        rows.push([imageEl, '']);
      } else if (textCellContent.length) {
        rows.push(['', textCellContent]);
      }
    });
  });

  // Defensive: if no cards found, fallback to nothing
  if (rows.length === 1) return;

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
