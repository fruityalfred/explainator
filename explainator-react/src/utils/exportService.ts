/**
 * Export Service
 * Handles exporting layouts to various formats (PNG, Excel, HTML, JSON)
 */

import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { ColumnData, BoxData, SectionData } from '../types';

/**
 * Export layout as PNG image
 */
export const exportToPNG = async (elementId: string = 'main-container', filename: string = 'explainator-export.png') => {
  const element = document.getElementById(elementId) || document.querySelector('.main-container');

  if (!element) {
    throw new Error('Container element not found for export');
  }

  try {
    const canvas = await html2canvas(element as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    });

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');

    return true;
  } catch (error) {
    console.error('PNG export failed:', error);
    throw error;
  }
};

/**
 * Export layout as Excel file
 */
export const exportToExcel = (columns: ColumnData[], filename: string = 'explainator-export.xlsx') => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create main sheet with all columns
    const mainSheetData: any[][] = [];

    // Find max number of rows needed
    let maxRows = 0;
    columns.forEach((column) => {
      const sections = Array.isArray(column.sections[0]) ? [] : (column.sections as SectionData[]);
      let columnRows = 0;
      sections.forEach((section) => {
        columnRows += 1; // Section header
        columnRows += section.boxes.length;
      });
      maxRows = Math.max(maxRows, columnRows);
    });

    // Build header row
    const headerRow = columns.map((col) => col.title);
    mainSheetData.push(headerRow);

    // Build data rows
    for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
      const row: string[] = [];

      columns.forEach((column) => {
        const sections = Array.isArray(column.sections[0]) ? [] : (column.sections as SectionData[]);
        let currentRow = 0;
        let cellValue = '';

        for (const section of sections) {
          if (currentRow === rowIdx) {
            cellValue = `[${section.title}]`;
            break;
          }
          currentRow++;

          for (const box of section.boxes) {
            if (currentRow === rowIdx) {
              cellValue = box.text;
              break;
            }
            currentRow++;
          }

          if (cellValue) break;
        }

        row.push(cellValue);
      });

      mainSheetData.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(mainSheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Layout');

    // Create individual sheets for each column
    columns.forEach((column, idx) => {
      const sections = Array.isArray(column.sections[0]) ? [] : (column.sections as SectionData[]);
      const columnData: any[][] = [[column.title]];

      sections.forEach((section) => {
        columnData.push([`[${section.title}]`]);
        section.boxes.forEach((box) => {
          columnData.push([box.text, box.type]);
        });
      });

      const colWs = XLSX.utils.aoa_to_sheet(columnData);
      XLSX.utils.book_append_sheet(wb, colWs, `Column ${idx + 1}`);
    });

    // Write file
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Excel export failed:', error);
    throw error;
  }
};

/**
 * Export layout as HTML file
 */
export const exportToHTML = (columns: ColumnData[], filename: string = 'explainator-export.html') => {
  try {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Explainator Export</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      display: flex;
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .column {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 300px;
    }
    .column-header {
      padding: 15px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      border-radius: 8px 8px 0 0;
    }
    .column-content {
      padding: 15px;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      padding: 8px 12px;
      background: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 14px;
    }
    .box {
      padding: 10px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      font-size: 14px;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
`;

    // Add columns
    columns.forEach((column) => {
      const sections = Array.isArray(column.sections[0]) ? [] : (column.sections as SectionData[]);
      html += `    <div class="column">
      <div class="column-header" style="background: ${column.headerColor || 'linear-gradient(to bottom, #8B4513, #A0522D)'}">
        ${escapeHtml(column.title)}
      </div>
      <div class="column-content">
`;

      sections.forEach((section) => {
        html += `        <div class="section">
          <div class="section-title">${escapeHtml(section.title)}</div>
`;
        section.boxes.forEach((box) => {
          const bgColor = getCategoryColor(box.type);
          html += `          <div class="box" style="background: ${bgColor}; color: ${box.textColor || 'white'};">
            ${escapeHtml(box.text)}
          </div>
`;
        });
        html += `        </div>
`;
      });

      html += `      </div>
    </div>
`;
    });

    html += `  </div>
</body>
</html>`;

    // Download HTML file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('HTML export failed:', error);
    throw error;
  }
};

/**
 * Export layout as JSON file
 */
export const exportToJSON = (
  columns: ColumnData[],
  categories: any,
  canvasConfig: any,
  filename: string = 'explainator-export.json'
) => {
  try {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      columns,
      categories,
      canvas: canvasConfig,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('JSON export failed:', error);
    throw error;
  }
};

/**
 * Import layout from JSON file
 */
export const importFromJSON = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

// Helper functions
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const getCategoryColor = (type: string): string => {
  const colors: Record<string, string> = {
    blue: 'linear-gradient(to bottom, #4A90E2, #357ABD)',
    green: 'linear-gradient(to bottom, #7ED321, #6AB01A)',
    red: 'linear-gradient(to bottom, #D0021B, #A00116)',
    yellow: 'linear-gradient(to bottom, #F5A623, #E89A1C)',
    purple: 'linear-gradient(to bottom, #9013FE, #7310CA)',
    orange: 'linear-gradient(to bottom, #F5A623, #E89A1C)',
    pink: 'linear-gradient(to bottom, #FF6B9D, #E85C8A)',
    teal: 'linear-gradient(to bottom, #50E3C2, #3EC9A8)',
    gray: 'linear-gradient(to bottom, #9B9B9B, #7D7D7D)',
    brown: 'linear-gradient(to bottom, #8B4513, #6B3410)',
  };
  return colors[type] || colors.blue;
};
