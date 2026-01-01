export interface Campaign {
  campaignName: string;
  variantName: string;
  tags: string;
  subject: string;
  list: string;
  sendTime: string;
  sendWeekday: string;
  totalRecipients: number;
  uniquePlacedOrder: number;
  placedOrderRate: number;
  revenue: number;
  uniqueOpens: number;
  openRate: number;
  totalOpens: number;
  uniqueClicks: number;
  clickRate: number;
  totalClicks: number;
  unsubscribes: number;
  spamComplaints: number;
  spamComplaintsRate: number;
  successfulDeliveries: number;
  bounces: number;
  bounceRate: number;
  campaignId: string;
  campaignChannel: string;
  winningVariant?: string;
}

export interface CampaignStats {
  totalCampaigns: number;
  totalRecipients: number;
  totalRevenue: number;
  totalOrders: number;
  totalOpens: number;
  totalClicks: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageOrderRate: number;
  bestCampaign: Campaign | null;
  worstCampaign: Campaign | null;
}



