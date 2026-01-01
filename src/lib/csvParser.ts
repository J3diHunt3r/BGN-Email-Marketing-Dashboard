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

    const parseDate = (value: any): string => {
      if (!value && value !== 0) return '';
      
      // If it's already a string in the correct format (YYYY-MM-DD HH:MM:SS), return it
      if (typeof value === 'string') {
        // Check if it's already in the format we want
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
          return value;
        }
        // Try to parse the string as a date
        const date = new Date(value);
        if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        return value; // Return as-is if we can't parse it
      }
      
      // If it's a Date object
      if (value instanceof Date) {
        if (isNaN(value.getTime())) return '';
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        const hours = String(value.getHours()).padStart(2, '0');
        const minutes = String(value.getMinutes()).padStart(2, '0');
        const seconds = String(value.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      
      // If it's a number (could be Excel serial date or Unix timestamp)
      if (typeof value === 'number') {
        // Excel serial dates are typically between 1 and 100000 (days since 1900)
        // Unix timestamps are much larger (milliseconds since 1970)
        if (value > 0 && value < 100000) {
          // Likely Excel serial date: days since January 1, 1900
          // Excel epoch is December 30, 1899 (not Jan 1, 1900 due to a bug)
          const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
          const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
          if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
        } else {
          // Likely Unix timestamp (milliseconds)
          const date = new Date(value);
          if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
        }
      }
      
      return '';
    };

    return {
      campaignName: getValue('Campaign Name') || '',
      variantName: getValue('Variant Name') || '',
      tags: getValue('Tags') || '',
      subject: getValue('Subject') || '',
      list: getValue('List') || '',
      sendTime: parseDate(getValue('Send Time')),
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
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellDates: false, // We'll handle dates manually
            cellNF: false,
            cellText: false
          });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          // Use raw: true to get actual values (numbers, dates, etc.)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            raw: true, // Get raw values to handle dates properly
            defval: '' // Default value for empty cells
          });
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

