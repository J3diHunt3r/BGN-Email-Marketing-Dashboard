import { useEffect } from 'react';
import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Filter, X } from 'lucide-react';
import { filterAndSortCampaigns } from '@/lib/campaignFilters';

export type SortField = 'revenue' | 'orders' | 'openRate' | 'clickRate' | 'time' | 'none';
export type SortDirection = 'asc' | 'desc';

interface CampaignFiltersProps {
  campaigns: Campaign[];
  onFilterChange: (filtered: Campaign[]) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
}

export function CampaignFilters({
  campaigns,
  onFilterChange,
  sortField,
  sortDirection,
  onSortChange,
  dateFrom,
  dateTo,
  onDateChange,
}: CampaignFiltersProps) {
  // Apply filters and sorting whenever they change
  useEffect(() => {
    const filtered = filterAndSortCampaigns(campaigns, sortField, sortDirection, dateFrom, dateTo);
    onFilterChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns, sortField, sortDirection, dateFrom, dateTo]);

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  const handleDateFromChange = (value: string) => {
    onDateChange(value, dateTo);
  };

  const handleDateToChange = (value: string) => {
    onDateChange(dateFrom, value);
  };

  const clearFilters = () => {
    onSortChange('none', 'desc');
    onDateChange('', '');
  };

  const hasActiveFilters = sortField !== 'none' || dateFrom || dateTo;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-base sm:text-lg">Filters & Sorting</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="sort-by">Sort By</Label>
            <Select
              value={sortField}
              onValueChange={(value) => handleSortChange(value as SortField)}
            >
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sorting</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="openRate">Open Rate</SelectItem>
                <SelectItem value="clickRate">Click Rate</SelectItem>
                <SelectItem value="time">Send Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort-direction">Direction</Label>
            <Select
              value={sortDirection}
              onValueChange={(value) => onSortChange(sortField, value as SortDirection)}
              disabled={sortField === 'none'}
            >
              <SelectTrigger id="sort-direction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-from">From Date</Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-to">To Date</Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

