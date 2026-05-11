import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Native date formatting helper to avoid external dependencies like date-fns
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

/**
 * Professional Banking PDF Statement Generator for OINZPAY
 */
export const exportUserStatement = async (user: any) => {
  const doc = new jsPDF();
  const timestamp = formatDate(new Date());
  const userId = user.id || user.userId || 'N/A';
  const fileName = `OINZPAY-STATEMENT-${userId}.pdf`;

  // --- BRANDING & COLORS ---
  const PRIMARY_BLUE = [37, 99, 235]; // #2563eb
  const DARK_GRAY = [51, 65, 85]; // #334155
  const TEXT_MUTED = [100, 116, 139]; // #64748b
  const BORDER_COLOR = [226, 232, 240]; // #e2e8f0

  // --- HEADER SECTION ---
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(0, 0, 210, 45, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('OINZPAY', 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('FINANCIAL ADMINISTRATION CENTER', 15, 33);

  // Statement Label
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER FINANCIAL STATEMENT', 195, 25, { align: 'right' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${timestamp}`, 195, 32, { align: 'right' });
  doc.text(`Reference ID: STMT-${userId}-${Date.now().toString().slice(-6)}`, 195, 37, { align: 'right' });

  // --- CUSTOMER INFORMATION ---
  let currentY = 60;
  doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER PROFILE', 15, currentY);

  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.line(15, currentY + 2, 195, currentY + 2);

  currentY += 12;
  doc.setFontSize(9);
  
  const drawField = (label: string, value: string, x: number, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
    doc.text(value || 'N/A', x, y + 5);
  };

  drawField('Full Name', user.name || 'N/A', 15, currentY);
  drawField('Account ID', `USR-${userId}`, 80, currentY);
  drawField('Account Status', user.status || 'Active', 145, currentY);

  currentY += 15;
  drawField('Email Address', user.email || 'N/A', 15, currentY);
  drawField('Phone Number', user.phone || 'N/A', 80, currentY);
  drawField('KYC Status', user.kycTier || 'Tier 1', 145, currentY);

  currentY += 15;
  drawField('Account Tier', user.kycTier || 'Basic', 15, currentY);
  drawField('Last Active', user.lastSeen || 'Just now', 80, currentY);
  drawField('Registration Date', user.dateJoined || 'N/A', 145, currentY);

  // --- ACCOUNT SUMMARY ---
  currentY += 25;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FINANCIAL SUMMARY', 15, currentY);
  doc.line(15, currentY + 2, 195, currentY + 2);

  currentY += 10;
  const balances = [
    { label: 'Wallet Balance', value: user.totalBalance || 0 },
    { label: 'Savings Balance', value: user.savings || 0 },
    { label: 'Investment Balance', value: user.investments || 0 }
  ];

  balances.forEach((bal, i) => {
    const x = 15 + (i * 62);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, currentY, 55, 20, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(bal.label.toUpperCase(), x + 5, currentY + 7);
    doc.setFontSize(10);
    doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
    doc.text(`₦${bal.value.toLocaleString()}`, x + 5, currentY + 14);
  });

  // --- TRANSACTION TABLE ---
  currentY += 35;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK_GRAY[0], DARK_GRAY[1], DARK_GRAY[2]);
  doc.text('RECENT TRANSACTIONS', 15, currentY);
  doc.line(15, currentY + 2, 195, currentY + 2);

  // Mock transactions if not provided
  const transactions = user.transactions || [
    ['May 10, 2024', 'Credit', '₦1,204,000', 'Success', 'TRX-9921-A'],
    ['May 09, 2024', 'Debit', '-₦100,000', 'Success', 'TRX-8812-B'],
    ['May 08, 2024', 'Debit', '-₦2,500', 'Success', 'TRX-4421-C'],
    ['May 07, 2024', 'Credit', '₦50,000', 'Success', 'TRX-1123-D'],
    ['May 06, 2024', 'Debit', '-₦10,000', 'Success', 'TRX-0042-E'],
    ['May 05, 2024', 'Credit', '₦450,000', 'Success', 'TRX-5531-F'],
  ];

  autoTable(doc, {
    startY: currentY + 8,
    head: [['Date', 'Type', 'Amount', 'Status', 'Reference ID']],
    body: transactions,
    theme: 'striped',
    headStyles: { 
      fillColor: PRIMARY_BLUE, 
      textColor: [255, 255, 255], 
      fontSize: 9, 
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: { 
      fontSize: 8,
      textColor: DARK_GRAY
    },
    columnStyles: {
      2: { halign: 'right', fontStyle: 'bold' },
      4: { fontStyle: 'italic', textColor: TEXT_MUTED }
    }
  });

  // --- FOOTER ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('Generated from OINZPAY Admin Console', 105, 285, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
    doc.text(`Confidential Document • ${userId}`, 15, 285);
  }

  // --- SAVE ---
  doc.save(fileName);
};
