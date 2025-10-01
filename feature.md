# Explainator User Manual

This manual is designed for enterprise users who need a clear, consistent way to author, organize, and export visual boards (e.g., enterprise architecture views, Kanban flows, office maps). It covers concepts, end‑to‑end workflows, detailed feature behavior, keyboard shortcuts, and governance considerations.

## 1. Overview
- Purpose: Create and maintain structured visual boards composed of columns, sections, and content boxes. Export to PNG/Excel and save/load templates.
- Key Concepts:
  - Columns contain sections; sections contain boxes (text, image, line).
  - Boards can be split, reformatted, and exported without external services.
- Data Handling: Runs locally in the browser. Templates are downloaded as JSON; images can be added by users. No external data transfer is performed by the app itself.

## 2. System Requirements
- Modern desktop browser (Chromium/Edge/Chrome, Firefox, or Safari).
- JavaScript enabled; local file download permission for saving JSON/PNG/XLSX.
- Recommended: 1920×1080 screen for comfortable authoring.

## 3. Getting Started
1) Open Explainator.html in your browser.
2) Select language using the EN/DE toggle in the sidebar.
3) Use the Content section to add Boxes or Lines. Use Styling for Formatting and Categories. Use Canvas for free‑form positioning and connectors. Use Data to save/load/export. About shows version details.

## 4. User Interface Tour
- Sidebar
  - Content: New Box, Lines, Batch Import.
  - Styling: Formatting (typography), Manage Categories.
  - Canvas: Canvas Mode, Resolution, Connections, Column/Section header toggles.
  - Data: Save Template, Load Template, Export PNG/Excel.
  - System: Reset Layout, Clear All, Help, Language.
  - Info: About modal.
- Board Area
  - Columns with headers and split counters; sections with titles; boxes inside sections.
  - Drag‑and‑drop everywhere (boxes, sections, columns in canvas mode).

## 5. Columns
- Create/Rename: Use the default layout or layout builder. Click the column title to edit; press Enter to confirm.
- Show/Hide Headers: Toggle “Columns: On/Off” in Canvas.
- Split Columns (2–3 parts):
  - Use the split counter in the column header to switch 1/2/3.
  - Adjust per‑part width by dragging the vertical handle between parts. Widths are persisted and scale with column size.
  - Tip: Alt + Drop inserts a dragged split section as full‑width.
- Canvas Mode: Columns become free‑positioned; set resolution in the Canvas section.

## 6. Sections
- Add/Move: Each column supports adding sections; drag to order.
- Titles: Click to rename; press Enter to confirm.
- Colors: Click the section color button; choose palette or custom color. Eyedropper available where supported.
- Delete: Use the section delete button (confirmation may apply).

## 7. Boxes (Text, Image, Line)
- Add Box:
  - Toolbar → New Box. Choose width (Full/Half) and height (1–3 lines). Press Enter to add quickly.
  - Image Mode: Select “Image instead of text” then drop/select JPG/PNG.
- Move/Resize:
  - Drag between sections/columns. Toggle width via box ↔ button (Full/Half).
  - Height: Drag the bottom grip (not for image/line boxes).
- Edit Text:
  - Double‑click: Quick single‑line edit. Enter applies; Escape cancels.
  - Alt + Double‑click: Multi‑line editor (textarea). Ctrl/Cmd + Enter applies; Escape cancels.
  - Alignment toolbar during multi‑line edit: Left/Center/Right/Justify.
  - URL Auto‑Linking: Pasted http/https/www URLs become clickable anchors opening in a new tab.
- Delete: Click the box’s x button.

## 8. Lines (Horizontal Separators)
- Toolbar → Lines.
- Style: Solid or Dashed.
- Thickness: 1 / 2 / 3.
- Insert: Adds a dedicated “line box” (non‑text, non‑image) that visually separates content.

## 9. Formatting (Typography)
- Toolbar → Formatting.
- Targets: Columns / Sections / Boxes.
- Controls: Font family, font size (px), line height; Bold/Italic toggles.
- Apply & Close: Commits current settings and closes the modal. Typography applies globally to the chosen target scope.

## 10. Categories & Colors
- Toolbar → Manage Categories.
- Define: Category name plus two colors (for gradients) and a text color; optional “Use gradient”.
- Preview: Live gradient preview is displayed.
- Apply: Category styles are used across generated elements and can be referenced when rendering content.
- Column Header Color: Paintbrush button on each column header.

## 11. Batch Import
- Toolbar → Batch Import.
- Paste: One line per box (empty lines ignored).
- Width: Choose Full Width / Half Width.
- Result: Creates a new “Import” column split into 2 parts with one‑line boxes for each line.

## 12. Canvas Mode & Connectors
- Canvas Mode: Activates free‑form positioning with a fixed board size.
- Resolution: HD 720p (1280×720) or Full HD (1920×1080).
- Connectors: Toggle “Connections” to show/hide; connectors update with movement and are stored with templates.

## 13. Grid, Guides, and Visibility
- Grid Lines: Toggle for subtle background grid aiding alignment.
- Snap/Guide Lines: Dashed helper appears during certain operations.
- Column/Section Headers: Dedicated toggles to show/hide for cleaner exports.

## 14. Save, Load, Export
- Save Template: Downloads JSON with columns, sections, boxes, split settings, categories, canvas mode, and connectors.
- Load Template: Load from local storage or file; confirmation shown before overwriting.
- Export PNG: Temporarily hides controls, exports a clean PNG at the selected canvas resolution.
- Export Excel: Exports content lines to an .xlsx workbook (avoids embedding large Base64 images).

## 15. Localization
- Language: Toggle EN/DE in the sidebar. Dynamic modals rebuild in the selected language upon next open. All UI labels use translation keys for consistency.
- Help: Built‑in Help (❓) provides English and German guidance.
- About: Shows product name, copyright, and version.

## 16. Keyboard Shortcuts
- Alt + Drop: While dragging a split section, insert as full‑width.
- Ctrl + Drag: Duplicate element (if enabled in your environment/build).
- Double‑click on Box: Quick edit; Enter applies; Escape cancels.
- Alt + Double‑click on Box: Multi‑line editor; Ctrl/Cmd + Enter applies; Escape cancels.
- Enter: Confirms new box dialog and inline title edits.

## 17. Best Practices
- Structure: Prefer consistent column/section naming conventions for enterprise use.
- Reuse: Save frequently used boards as templates and version them (e.g., Explainator‑YYYY‑MM‑DD.json).
- Visual Balance: Use column splits and per‑part resizing to maintain readability across screen sizes.
- Accessibility: Ensure adequate color contrast; avoid encoding meaning with color only.

## 18. Governance & Data Handling
- Data Location: Templates download as JSON; images are user‑provided. No telemetry or external storage.
- Security: Be mindful of confidential information written into boards. PNG/Excel exports may be shared outside your environment—follow your organization’s data classification.
- Versioning: Include version strings in filenames; maintain a template catalog for critical boards.

## 19. Troubleshooting
- Language toggle did not update a modal: Close and reopen the modal (dynamic content is rebuilt on open). If needed, re‑toggle language once.
- URLs not clickable: Ensure they start with http/https or www.; after editing, click outside the box to apply and linkify.
- Split column resizing: Drag the handle between parts; minimum width is enforced to prevent collapse.
- PNG export clipped: Choose an appropriate canvas resolution and ensure content fits inside the canvas bounds.

## 20. Support
- Version: 2.5
- Vendor: FruityAlfred Software
- About Modal: Open “Info → About” inside the application for version confirmation.

