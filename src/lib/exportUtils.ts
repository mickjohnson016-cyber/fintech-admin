/**
 * Professional Operational Export Utilities for OINZpay Admin
 * Handles CSV, JSON, PDF, and XLSX downloads.
 */

import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportOptions {
  fileName?: string;
  data: any[];
  format: 'CSV' | 'JSON' | 'PDF' | 'XLSX';
  headers?: string[];
  summary?: string[];
}

/**
 * Generates a timestamped filename following the format: oinzpay-analytics-YYYY-MM-DD
 */
const getTimestampedName = (ext: string) => {
  const date = new Date().toISOString().split('T')[0];
  return `oinzpay-analytics-${date}.${ext}`;
};

/**
 * Triggers a browser download for a Blob (fallback if file-saver isn't used)
 */
const downloadFile = (blob: Blob, fileName: string) => {
  saveAs(blob, fileName);
};

/**
 * Core export logic
 */
export const executeExport = async ({ fileName, data, format, headers, summary }: ExportOptions) => {
  // Use provided headers or extract from first data object
  const activeHeaders = headers || (data.length > 0 ? Object.keys(data[0]) : []);

  if (activeHeaders.length === 0 && data.length === 0) {
    toast.error("Export failed", { description: "No schema or data available to export." });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        switch (format) {
          case 'CSV': {
            const csvContent = [
              activeHeaders.join(','),
              ...data.map((row) =>
                activeHeaders
                  .map((header) => {
                    const cell = row[header] === null || row[header] === undefined ? '' : row[header];
                    const cellStr = String(cell).replace(/"/g, '""');
                    return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
                      ? `"${cellStr}"`
                      : cellStr;
                  })
                  .join(',')
              ),
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            downloadFile(blob, getTimestampedName('csv'));
            break;
          }

          case 'JSON': {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            downloadFile(blob, getTimestampedName('json'));
            break;
          }

          case 'XLSX': {
            // Reformat data to map headers correctly if needed, or use XLSX.utils.json_to_sheet
            // We ensure columns are mapped to activeHeaders
            const sheetData = data.map(row => {
              const newRow: any = {};
              activeHeaders.forEach(header => {
                newRow[header] = row[header] ?? '';
              });
              return newRow;
            });

            const worksheet = XLSX.utils.json_to_sheet(sheetData, { header: activeHeaders });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics');

            // Generate buffer and save
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            downloadFile(blob, getTimestampedName('xlsx'));
            break;
          }

          case 'PDF': {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Header
            doc.setFontSize(16);
            doc.setTextColor(30, 41, 59); // slate-800
            doc.text("OINZPAY Executive Analytics", 14, 22);
            
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
            
            let startY = 35;
            if (summary && summary.length > 0) {
              doc.setTextColor(51, 65, 85); // slate-700
              doc.setFontSize(10);
              summary.forEach((line, i) => {
                doc.text(line, 14, startY + (i * 6));
              });
              startY += (summary.length * 6) + 5;
            }
            
            const body = data.length > 0
              ? data.map((obj) => activeHeaders.map((h) => obj[h] ?? ''))
              : [];

            autoTable(doc, {
              startY: startY,
              head: [activeHeaders],
              body: body as any,
              theme: 'grid',
              headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
              alternateRowStyles: { fillColor: [248, 250, 252] },
              styles: { fontSize: 8, cellPadding: 3 },
              margin: { bottom: 20 },
              didDrawPage: (data) => {
                // Add Footer
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184); // slate-400
                doc.text('OINZPAY Confidential • Internal Administrative Use Only', pageWidth / 2, pageHeight - 10, { align: 'center' });

                if (body.length === 0) {
                  doc.setFontSize(10);
                  doc.setTextColor(150);
                  doc.text('No data available in this report.', 14, data.cursor?.y ? data.cursor.y + 10 : startY + 10);
                }
              }
            });
            doc.save(getTimestampedName('pdf'));
            break;
          }
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    }, 500); // Small delay to show "Generating Report..."
  });

  toast.promise(promise, {
    loading: `Generating ${format} report...`,
    success: () => `${format} download completed successfully.`,
    error: () => `Failed to export ${format} report.`,
  });
};
