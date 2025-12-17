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
import { ArrowUp, ArrowDown } from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
  bestCampaign: Campaign | null;
  worstCampaign: Campaign | null;
}

export function CampaignTable({ campaigns, bestCampaign, worstCampaign }: CampaignTableProps) {
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
              {campaigns.map((campaign) => (
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
      </CardContent>
    </Card>
  );
}

