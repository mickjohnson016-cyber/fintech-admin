import { toast } from "sonner";
import { executeExport } from "./exportUtils";

/**
 * Standardized toast actions for the OINZpay Admin Dashboard.
 * Ensures consistent feedback for operational actions.
 */
export const toastActions = {
  /**
   * For features that are designed but not yet wired to a backend.
   */
  showComingSoon: (featureName: string) => {
    toast.info(`${featureName} is coming soon`, {
      description: "This feature is currently being integrated with our core services.",
    });
  },

  /**
   * Standard feedback for primary operational actions.
   */
  showActionToast: (title: string, description?: string) => {
    toast.success(title, {
      description: description || "Operational command executed successfully.",
    });
  },

  /**
   * For confirmation-heavy actions like freezes or reversals.
   */
  confirmAction: (actionName: string, onConfirm: () => void) => {
    toast(`Confirm ${actionName}`, {
      description: "Are you sure you want to perform this high-impact operation?",
      action: {
        label: "Confirm",
        onClick: onConfirm,
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
  },

  /**
   * For data export triggers with real file generation.
   */
  triggerExport: (format: 'CSV' | 'PDF' | 'JSON' | 'XLSX', fileName: string, data: any[]) => {
    if (!data || data.length === 0) {
      toast.error("Export Error", { description: "No data available in current view to export." });
      return;
    }
    executeExport({ format, fileName, data });
  },

  /**
   * Copy to clipboard with toast feedback.
   */
  copyToClipboard: (text: string, label: string = "ID") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} Copied`, {
      description: "Value saved to administrative clipboard.",
    });
  }
};
