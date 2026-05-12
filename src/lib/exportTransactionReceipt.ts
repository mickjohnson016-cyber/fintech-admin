import jsPDF from 'jspdf';
import { toast } from 'sonner';

/**
 * Professional Transaction Receipt Generator
 */

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

export const exportTransactionReceipt = async (txn: any) => {
  const doc = new jsPDF();
  const timestamp = formatDate(new Date());
  const txnId = txn.id || 'N/A';
  const fileName = `OINZPAY-RECEIPT-${txnId}.pdf`;

  // Branding Colors
  const PRIMARY_BLUE = [37, 99, 235];
  const DARK_GRAY = [51, 65, 85];
  const TEXT_MUTED = [100, 116, 139];
  const LIGHT_BG = [248, 250, 252];

  // --- HEADER ---
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(0, 0, 210, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('OINZPAY', 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL TRANSACTION RECEIPT', 15, 33);
  doc.text(timestamp, 195, 25, { align: 'right' });
  doc.text(`REF: ${txnId}`, 195, 32, { align: 'right' });

  // --- MAIN AMOUNT ---
  let currentY = 70;
  doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION AMOUNT', 105, currentY, { align: 'center' });
  
  currentY += 12;
  doc.setFontSize(32);
  const amountStr = `₦${txn.amount?.toLocaleString() || '0'}`;
  doc.text(amountStr, 105, currentY, { align: 'center' });
  
  currentY += 8;
  doc.setFontSize(10);
  if (txn.status === 'Completed') {
    doc.setTextColor(16, 185, 129);
  } else {
    doc.setTextColor(244, 63, 94);
  }
  doc.text(txn.status?.toUpperCase() || 'SUCCESSFUL', 105, currentY, { align: 'center' });

  // --- DETAILS TABLE ---
  currentY += 25;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY, 195, currentY);
  currentY += 12;

  const drawRow = (label: string, value: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), 15, y);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
    doc.setFontSize(10);
    doc.text(String(value), 195, y, { align: 'right' });
  };

  drawRow('Transaction Type', txn.type || 'Electronic Transfer', currentY);
  currentY += 12;
  drawRow('Sender Name', txn.sender || 'OINZpay User', currentY);
  currentY += 12;
  drawRow('Receiver / Merchant', txn.receiver || 'N/A', currentY);
  currentY += 12;
  drawRow('Transaction Date', txn.date || timestamp, currentY);
  currentY += 12;
  drawRow('Channel', txn.channel || 'Mobile App', currentY);
  currentY += 12;
  drawRow('Risk Index', `${((txn.risk || 0) * 100).toFixed(1)}%`, currentY);
  currentY += 12;
  drawRow('Transaction Fee', `₦${txn.fee?.toLocaleString() || '0'}`, currentY);

  // --- FOOTER BOX ---
  currentY += 20;
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.roundedRect(15, currentY, 180, 25, 3, 3, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('This transaction was processed securely via OINZpay Infrastructure.', 105, currentY + 10, { align: 'center' });
  doc.text('For support, contact operations@oinzpay.com with the Reference ID above.', 105, currentY + 16, { align: 'center' });

  // Save the PDF
  doc.save(fileName);
  toast.success("Receipt Exported", { description: `Transaction ${txnId} saved to downloads.` });
};
