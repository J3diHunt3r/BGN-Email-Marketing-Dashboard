import { Campaign } from '@/types/campaign';
import { SortField, SortDirection } from '@/components/CampaignFilters';

export function filterAndSortCampaigns(
  campaigns: Campaign[],
  sortField: SortField,
  sortDirection: SortDirection,
  dateFrom: string,
  dateTo: string
): Campaign[] {
  let filtered = [...campaigns];

  // Filter by date range
  if (dateFrom || dateTo) {
    // Parse filter dates once outside the filter loop for efficiency
    let fromDate: number | null = null;
    let toDate: number | null = null;

    if (dateFrom && dateFrom.trim() !== '') {
      // Parse dateFrom string (format: "YYYY-MM-DD")
      const parts = dateFrom.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          fromDate = new Date(year, month - 1, day).getTime(); // month is 0-indexed
        }
      }
    }

    if (dateTo && dateTo.trim() !== '') {
      // Parse dateTo string (format: "YYYY-MM-DD")
      const parts = dateTo.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          toDate = new Date(year, month - 1, day).getTime(); // month is 0-indexed
        }
      }
    }

    filtered = filtered.filter((campaign) => {
      // Parse campaign date (handles format like "2024-07-26 08:00:00")
      const campaignDate = new Date(campaign.sendTime);
      
      // Check if date is valid
      if (isNaN(campaignDate.getTime())) {
        return false; // Skip invalid dates
      }
      
      // Normalize campaign date to just the date portion (year, month, day)
      const campaignYear = campaignDate.getFullYear();
      const campaignMonth = campaignDate.getMonth();
      const campaignDay = campaignDate.getDate();
      const campaignDateOnly = new Date(campaignYear, campaignMonth, campaignDay).getTime();

      // Apply filters
      if (fromDate !== null && toDate !== null) {
        // Both dates set: campaign must be between fromDate and toDate (inclusive)
        const inRange = campaignDateOnly >= fromDate && campaignDateOnly <= toDate;
        return inRange;
      } else if (fromDate !== null) {
        // Only fromDate set: campaign must be on or after fromDate
        return campaignDateOnly >= fromDate;
      } else if (toDate !== null) {
        // Only toDate set: campaign must be on or before toDate
        return campaignDateOnly <= toDate;
      }
      return true;
    });
  }

  // Sort campaigns
  if (sortField !== 'none') {
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'orders':
          aValue = a.uniquePlacedOrder;
          bValue = b.uniquePlacedOrder;
          break;
        case 'openRate':
          aValue = a.openRate;
          bValue = b.openRate;
          break;
        case 'clickRate':
          aValue = a.clickRate;
          bValue = b.clickRate;
          break;
        case 'time':
          aValue = new Date(a.sendTime).getTime();
          bValue = new Date(b.sendTime).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
      } else {
        const aStr = String(aValue);
        const bStr = String(bValue);
        return sortDirection === 'desc'
          ? bStr.localeCompare(aStr)
          : aStr.localeCompare(bStr);
      }
    });
  }

  return filtered;
}

