import { useState } from 'react';
import { Campaign } from '@/types/campaign';
import { FileUpload } from '@/components/FileUpload';
import { StatsCards } from '@/components/StatsCards';
import { CampaignTable } from '@/components/CampaignTable';
import { PerformanceCharts } from '@/components/PerformanceCharts';
import { BestWorstCampaigns } from '@/components/BestWorstCampaigns';
import { parseCSV } from '@/lib/csvParser';
import { calculateStats } from '@/lib/campaignStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const parsedCampaigns = await parseCSV(file);
      setCampaigns(parsedCampaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setCampaigns([]);
    setError(null);
  };

  const stats = calculateStats(campaigns);

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
                  {campaigns.length} campaigns loaded
                </p>
              </div>
              <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                <X className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
            </div>

            <StatsCards stats={stats} />

            <BestWorstCampaigns
              bestCampaign={stats.bestCampaign}
              worstCampaign={stats.worstCampaign}
            />

            <PerformanceCharts campaigns={campaigns} />

            <CampaignTable
              campaigns={campaigns}
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

