'use client';

import React, { useState } from 'react';
import { QuickActionModal } from './QuickActionModal';
import { ExportSelector, ExportFormat } from './ExportSelector';
import { executeExport } from '@/lib/exportUtils';
import { Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  fileName: string;
  data: any[];
  headers?: string[];
}

export function ExportModal({
  isOpen,
  onClose,
  title = "OINZPAY Executive Analytics Export",
  description = "Secure financial reporting and operational analytics.",
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
      // Close shortly after initiating download to allow user to see success
      setTimeout(() => {
        onClose();
        setIsExporting(false);
        setSelectedFormat('CSV');
      }, 800);
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
      confirmLabel={isExporting ? "Generating Report..." : "Generate Report"}
      isLoading={isExporting}
      icon={Download}
    >
      <div className="py-1">
        <ExportSelector 
          selectedFormat={selectedFormat} 
          onSelect={setSelectedFormat}
          disabled={isExporting}
        />
      </div>
    </QuickActionModal>
  );
}
