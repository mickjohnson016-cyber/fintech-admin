/**
 * Professional Operational Export Utilities for OINZpay Admin
 * Handles CSV, JSON, and PDF downloads using browser-native Blobs.
 */

import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportOptions {
  fileName: string;
  data: any[];
  format: 'CSV' | 'JSON' | 'PDF' | 'XLSX';
  headers?: string[];
}

/**
 * Triggers a browser download for a Blob
 */
const downloadFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates a timestamped filename
 */
const getTimestampedName = (base: string, ext: string) => {
  const date = new Date().toISOString().split('T')[0];
  return `${base.toLowerCase().replace(/\s+/g, '-')}-${date}.${ext}`;
};

/**
 * Core export logic
 */
export const executeExport = async ({ fileName, data, format, headers }: ExportOptions) => {
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
              ...data.map(row => activeHeaders.map(header => {
                const cell = row[header] === null || row[header] === undefined ? '' : row[header];
                const cellStr = String(cell).replace(/"/g, '""');
                return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') 
                  ? `"${cellStr}"` 
                  : cellStr;
              }).join(','))
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            downloadFile(blob, getTimestampedName(fileName, 'csv'));
            break;
          }

          case 'JSON': {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            downloadFile(blob, getTimestampedName(fileName, 'json'));
            break;
          }

          case 'XLSX': {
            // Tab-separated for Excel compatibility
            const content = [
              activeHeaders.join('\t'),
              ...data.map(row => activeHeaders.map(header => {
                const cell = row[header] === null || row[header] === undefined ? '' : row[header];
                return String(cell).replace(/\t/g, ' ');
              }).join('\t'))
            ].join('\n');
            const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8;' });
            downloadFile(blob, getTimestampedName(fileName, 'xls'));
            break;
          }

          case 'PDF': {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(fileName.toUpperCase(), 14, 22);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            
            const body = data.length > 0 ? data.map(obj => activeHeaders.map(h => obj[h] ?? '')) : [];

            autoTable(doc, {
              startY: 35,
              head: [activeHeaders],
              body: body as any,
              theme: 'striped',
              headStyles: { fillColor: [37, 99, 235] },
              styles: { fontSize: 8 },
              didDrawPage: (data) => {
                if (body.length === 0) {
                  doc.setFontSize(10);
                  doc.setTextColor(150);
                  doc.text('No data available in this report.', 14, data.cursor?.y ? data.cursor.y + 10 : 45);
                }
              }
            });
            doc.save(getTimestampedName(fileName, 'pdf'));
            break;
          }
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    }, 800); // Quick processing
  });

  toast.promise(promise, {
    loading: `Generating ${format} report...`,
    success: () => `${format} download started.`,
    error: () => `Export failed.`,
  });
};
