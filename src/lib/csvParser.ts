import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Campaign } from '@/types/campaign';

function parseData(data: any[]): Campaign[] {
  return data.map((row: any) => {
    // Normalize column names (handle spaces, case, etc.)
    const normalizeKey = (key: string) => 
      key.trim().toLowerCase().replace(/\s+/g, '');

    const getValue = (key: string) => {
      const normalizedKey = normalizeKey(key);
      const foundKey = Object.keys(row).find(k => normalizeKey(k) === normalizedKey);
      return foundKey ? row[foundKey] : '';
    };

    const parseNumber = (value: string | number): number => {
      if (typeof value === 'number') return value;
      if (!value || value === 'n/a' || value === '') return 0;
      // Remove commas, percentage signs, and parse
      const cleaned = String(value).replace(/,/g, '').replace(/%/g, '').trim();
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    return {
      campaignName: getValue('Campaign Name') || '',
      variantName: getValue('Variant Name') || '',
      tags: getValue('Tags') || '',
      subject: getValue('Subject') || '',
      list: getValue('List') || '',
      sendTime: getValue('Send Time') || '',
      sendWeekday: getValue('Send Weekday') || '',
      totalRecipients: parseNumber(getValue('Total Recipients')),
      uniquePlacedOrder: parseNumber(getValue('Unique Placed Order')),
      placedOrderRate: parseNumber(getValue('Placed Order Rate')),
      revenue: parseNumber(getValue('Revenue')),
      uniqueOpens: parseNumber(getValue('Unique Opens')),
      openRate: parseNumber(getValue('Open Rate')),
      totalOpens: parseNumber(getValue('Total Opens')),
      uniqueClicks: parseNumber(getValue('Unique Clicks')),
      clickRate: parseNumber(getValue('Click Rate')),
      totalClicks: parseNumber(getValue('Total Clicks')),
      unsubscribes: parseNumber(getValue('Unsubscribes')),
      spamComplaints: parseNumber(getValue('Spam Complaints')),
      spamComplaintsRate: parseNumber(getValue('Spam Complaints Rate')),
      successfulDeliveries: parseNumber(getValue('Successful Deliveries')),
      bounces: parseNumber(getValue('Bounces')),
      bounceRate: parseNumber(getValue('Bounce Rate')),
      campaignId: getValue('Campaign ID') || '',
      campaignChannel: getValue('Campaign Channel') || '',
      winningVariant: getValue('Winning Variant?') || undefined,
    };
  }).filter(c => c.campaignName); // Filter out empty rows
}

export function parseCSV(file: File): Promise<Campaign[]> {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Handle Excel files
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          const campaigns = parseData(jsonData);
          resolve(campaigns);
        } catch (error) {
          reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
      return;
    }

    // Handle CSV files
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const campaigns = parseData(results.data);
          resolve(campaigns);
        } catch (error) {
          reject(new Error('Failed to parse CSV: ' + (error as Error).message));
        }
      },
      error: (error) => {
        reject(new Error('CSV parsing error: ' + error.message));
      },
    });
  });
}

