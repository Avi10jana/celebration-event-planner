import type { EventModel } from '../types/event';

/**
 * Exports budget items to CSV format
 */
export function exportBudgetToCsv(event: EventModel): void {
  const headers = ['Category', 'Item Name', 'Estimated Cost', 'Actual Cost', 'Paid', 'Status', 'Vendor', 'Notes'];
  const rows = event.budgetItems.map(item => [
    `"${item.category}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    item.estimatedCost,
    item.actualCost,
    item.paid,
    `"${item.status}"`,
    `"${(item.vendorName || '').replace(/"/g, '""')}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Budget.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports complete Event Model as JSON
 */
export function exportEventToJson(event: EventModel): void {
  const jsonContent = JSON.stringify(event, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_MasterDossier.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers standard browser print for the event dossier
 */
export function printEventDossier(): void {
  window.print();
}

/**
 * Copies arbitrary text to the clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}
