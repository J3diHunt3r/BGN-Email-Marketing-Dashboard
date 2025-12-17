import { Campaign, CampaignStats } from '@/types/campaign';

export function calculateStats(campaigns: Campaign[]): CampaignStats {
  if (campaigns.length === 0) {
    return {
      totalCampaigns: 0,
      totalRecipients: 0,
      totalRevenue: 0,
      totalOrders: 0,
      totalOpens: 0,
      totalClicks: 0,
      averageOpenRate: 0,
      averageClickRate: 0,
      averageOrderRate: 0,
      bestCampaign: null,
      worstCampaign: null,
    };
  }

  const totalRecipients = campaigns.reduce((sum, c) => sum + c.totalRecipients, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalOrders = campaigns.reduce((sum, c) => sum + c.uniquePlacedOrder, 0);
  const totalOpens = campaigns.reduce((sum, c) => sum + c.uniqueOpens, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.uniqueClicks, 0);

  const averageOpenRate = campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length;
  const averageClickRate = campaigns.reduce((sum, c) => sum + c.clickRate, 0) / campaigns.length;
  const averageOrderRate = campaigns.reduce((sum, c) => sum + c.placedOrderRate, 0) / campaigns.length;

  // Find best and worst campaigns by revenue
  const sortedByRevenue = [...campaigns].sort((a, b) => b.revenue - a.revenue);
  const bestCampaign = sortedByRevenue[0];
  const worstCampaign = sortedByRevenue[sortedByRevenue.length - 1];

  return {
    totalCampaigns: campaigns.length,
    totalRecipients,
    totalRevenue,
    totalOrders,
    totalOpens,
    totalClicks,
    averageOpenRate,
    averageClickRate,
    averageOrderRate,
    bestCampaign,
    worstCampaign,
  };
}

