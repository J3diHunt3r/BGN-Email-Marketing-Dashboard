import { useState, useEffect } from 'react';
import { Campaign } from '@/types/campaign';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
  bestCampaign: Campaign | null;
  worstCampaign: Campaign | null;
}

const ITEMS_PER_PAGE = 10;

export function CampaignTable({ campaigns, bestCampaign, worstCampaign }: CampaignTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-GB').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const isBest = (campaign: Campaign) => bestCampaign?.campaignId === campaign.campaignId;
  const isWorst = (campaign: Campaign) => worstCampaign?.campaignId === campaign.campaignId;

  // Pagination
  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCampaigns = campaigns.slice(startIndex, endIndex);

  // Reset to page 1 when campaigns change
  useEffect(() => {
    setCurrentPage(1);
  }, [campaigns.length]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Campaign Name</TableHead>
                  <TableHead className="min-w-[150px] hidden sm:table-cell">Subject</TableHead>
                  <TableHead className="min-w-[100px]">Send Date</TableHead>
                  <TableHead className="text-right min-w-[80px]">Recipients</TableHead>
                  <TableHead className="text-right min-w-[100px]">Revenue</TableHead>
                  <TableHead className="text-right min-w-[70px] hidden md:table-cell">Orders</TableHead>
                  <TableHead className="text-right min-w-[80px] hidden lg:table-cell">Open Rate</TableHead>
                  <TableHead className="text-right min-w-[80px] hidden lg:table-cell">Click Rate</TableHead>
                  <TableHead className="text-right min-w-[80px] hidden xl:table-cell">Order Rate</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {paginatedCampaigns.map((campaign) => (
                <TableRow
                  key={campaign.campaignId}
                  className={isBest(campaign) ? 'bg-green-50 dark:bg-green-950/20' : isWorst(campaign) ? 'bg-red-50 dark:bg-red-950/20' : ''}
                >
                  <TableCell className="font-medium min-w-[150px] max-w-[200px] truncate">
                    <div className="truncate" title={campaign.campaignName}>
                      {campaign.campaignName}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[150px] max-w-[200px] truncate hidden sm:table-cell">
                    <div className="truncate" title={campaign.subject}>
                      {campaign.subject}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[100px] whitespace-nowrap">
                    {new Date(campaign.sendTime).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right min-w-[80px] whitespace-nowrap">
                    {formatNumber(campaign.totalRecipients)}
                  </TableCell>
                  <TableCell className="text-right font-semibold min-w-[100px] whitespace-nowrap">
                    {formatCurrency(campaign.revenue)}
                  </TableCell>
                  <TableCell className="text-right min-w-[70px] hidden md:table-cell whitespace-nowrap">
                    {formatNumber(campaign.uniquePlacedOrder)}
                  </TableCell>
                  <TableCell className="text-right min-w-[80px] hidden lg:table-cell whitespace-nowrap">
                    {formatPercentage(campaign.openRate)}
                  </TableCell>
                  <TableCell className="text-right min-w-[80px] hidden lg:table-cell whitespace-nowrap">
                    {formatPercentage(campaign.clickRate)}
                  </TableCell>
                  <TableCell className="text-right min-w-[80px] hidden xl:table-cell whitespace-nowrap">
                    {formatPercentage(campaign.placedOrderRate)}
                  </TableCell>
                  <TableCell className="min-w-[80px]">
                    <div className="flex items-center gap-2">
                      {isBest(campaign) && (
                        <Badge variant="success" className="gap-1 text-xs">
                          <ArrowUp className="h-3 w-3" />
                          <span className="hidden sm:inline">Best</span>
                        </Badge>
                      )}
                      {isWorst(campaign) && (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <ArrowDown className="h-3 w-3" />
                          <span className="hidden sm:inline">Worst</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, campaigns.length)} of {campaigns.length} campaigns
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsisBefore && <span className="px-2">...</span>}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

