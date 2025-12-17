import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface PerformanceChartsProps {
  campaigns: Campaign[];
}

export function PerformanceCharts({ campaigns }: PerformanceChartsProps) {
  const chartData = campaigns
    .map((c) => ({
      name: c.campaignName.length > 30 
        ? c.campaignName.substring(0, 30) + '...' 
        : c.campaignName,
      revenue: c.revenue,
      orders: c.uniquePlacedOrder,
      openRate: c.openRate,
      clickRate: c.clickRate,
      orderRate: c.placedOrderRate,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Revenue by Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={400} minHeight={350}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 150 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  fontSize={9}
                  interval={0}
                  dy={10}
                />
                <YAxis tickFormatter={(value) => `£${value}`} fontSize={10} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                  verticalAlign="bottom"
                  height={40}
                />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Engagement Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={400} minHeight={350}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 150 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  fontSize={9}
                  interval={0}
                  dy={10}
                />
                <YAxis tickFormatter={(value) => `${value}%`} fontSize={10} />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                  verticalAlign="bottom"
                  height={40}
                />
                <Line
                  type="monotone"
                  dataKey="openRate"
                  stroke="#8884d8"
                  name="Open Rate"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="clickRate"
                  stroke="#82ca9d"
                  name="Click Rate"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="orderRate"
                  stroke="#ffc658"
                  name="Order Rate"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

