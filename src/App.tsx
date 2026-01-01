import { useState } from 'react';
import { Campaign } from '@/types/campaign';
import { FileUpload } from '@/components/FileUpload';
import { StatsCards } from '@/components/StatsCards';
import { CampaignTable } from '@/components/CampaignTable';
import { PerformanceCharts } from '@/components/PerformanceCharts';
import { BestWorstCampaigns } from '@/components/BestWorstCampaigns';
import { CampaignFilters, SortField, SortDirection } from '@/components/CampaignFilters';
import { parseCSV } from '@/lib/csvParser';
import { calculateStats } from '@/lib/campaignStats';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const parsedCampaigns = await parseCSV(file);
      setCampaigns(parsedCampaigns);
      setFilteredCampaigns(parsedCampaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setCampaigns([]);
    setFilteredCampaigns([]);
    setError(null);
    setSortField('none');
    setSortDirection('desc');
    setDateFrom('');
    setDateTo('');
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

  const stats = calculateStats(filteredCampaigns);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">BGN Email Campaign Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload your campaign data to analyze performance, compare campaigns, and identify top performers
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
            {error && (
              <Card className="mt-4 border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <span className="font-semibold">Error:</span>
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Campaign Analytics</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {filteredCampaigns.length} of {campaigns.length} campaigns
                  {filteredCampaigns.length !== campaigns.length && ' (filtered)'}
                </p>
              </div>
              <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                <X className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            </div>

            <CampaignFilters
              campaigns={campaigns}
              onFilterChange={setFilteredCampaigns}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateChange={handleDateChange}
            />

            <StatsCards stats={stats} />

            <BestWorstCampaigns
              bestCampaign={stats.bestCampaign}
              worstCampaign={stats.worstCampaign}
            />

            <PerformanceCharts campaigns={filteredCampaigns} />

            <CampaignTable
              campaigns={filteredCampaigns}
              bestCampaign={stats.bestCampaign}
              worstCampaign={stats.worstCampaign}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

