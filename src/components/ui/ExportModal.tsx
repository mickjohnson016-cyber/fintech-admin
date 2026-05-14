'use client';

import React, { useState } from'react';
import { QuickActionModal } from'./QuickActionModal';
import { ExportSelector, ExportFormat } from'./ExportSelector';
import { executeExport } from'@/lib/exportUtils';
import { Download } from'lucide-react';

interface ExportModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 description?: string;
 fileName: string;
 data: any[];
 headers?: string[];
}

export function ExportModal({
 isOpen,
 onClose,
 title,
 description ="Choose your preferred format for the dashboard export.",
 fileName,
 data,
 headers
}: ExportModalProps) {
 const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('CSV');
 const [isExporting, setIsExporting] = useState(false);

 const handleExport = async () => {
 setIsExporting(true);
 try {
 await executeExport({
 fileName,
 data,
 format: selectedFormat,
 headers
 });
 // We don't automatically close so user can see success or download another format
 // But user might expect it to close. I'll close it after a small delay.
 setTimeout(() => {
 onClose();
 setIsExporting(false);
 setSelectedFormat('CSV'); // Reset for next time
 }, 1000);
 } catch (error) {
 setIsExporting(false);
 }
 };

 return (
 <QuickActionModal
 isOpen={isOpen}
 onClose={onClose}
 onConfirm={handleExport}
 title={title}
 description={description}
 type="export"
 confirmLabel="Generate Report"
 isLoading={isExporting}
 icon={Download}
 >
 <div className="py-2">
 <ExportSelector 
 selectedFormat={selectedFormat} 
 onSelect={setSelectedFormat}
 disabled={isExporting}
 />
 </div>
 </QuickActionModal>
 );
}
