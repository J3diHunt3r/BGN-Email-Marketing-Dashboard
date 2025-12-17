import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface BestWorstCampaignsProps {
  bestCampaign: Campaign | null;
  worstCampaign: Campaign | null;
}

export function BestWorstCampaigns({ bestCampaign, worstCampaign }: BestWorstCampaignsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-GB').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {bestCampaign && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <CardTitle className="text-base sm:text-lg">Best Performing Campaign</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Campaign Name</p>
                <p className="text-base sm:text-lg font-semibold break-words">{bestCampaign.campaignName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Subject</p>
                <p className="text-sm sm:text-base break-words">{bestCampaign.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600 break-words">
                    {formatCurrency(bestCampaign.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Orders</p>
                  <p className="text-lg sm:text-xl font-bold break-words">{formatNumber(bestCampaign.uniquePlacedOrder)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Open Rate</p>
                  <p className="text-base sm:text-lg font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    {formatPercentage(bestCampaign.openRate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Click Rate</p>
                  <p className="text-base sm:text-lg font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    {formatPercentage(bestCampaign.clickRate)}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="success">Best Performer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {worstCampaign && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <CardTitle className="text-base sm:text-lg">Worst Performing Campaign</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Campaign Name</p>
                <p className="text-base sm:text-lg font-semibold break-words">{worstCampaign.campaignName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Subject</p>
                <p className="text-sm sm:text-base break-words">{worstCampaign.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-lg sm:text-xl font-bold text-red-600 break-words">
                    {formatCurrency(worstCampaign.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Orders</p>
                  <p className="text-lg sm:text-xl font-bold break-words">{formatNumber(worstCampaign.uniquePlacedOrder)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Open Rate</p>
                  <p className="text-base sm:text-lg font-semibold flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    {formatPercentage(worstCampaign.openRate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Click Rate</p>
                  <p className="text-base sm:text-lg font-semibold flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    {formatPercentage(worstCampaign.clickRate)}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="destructive">Needs Improvement</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

