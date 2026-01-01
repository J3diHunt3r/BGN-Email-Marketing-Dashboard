# Klaviyo Campaign Dashboard

A modern React dashboard for analyzing Klaviyo email campaign performance. Upload CSV or Excel files containing campaign data to visualize metrics, compare campaigns, and identify top performers.

## Features

- 📊 **Drag & Drop File Upload** - Easy CSV/Excel file upload
- 📈 **Campaign Comparison** - Compare all campaigns side-by-side
- 💰 **Revenue Analytics** - Track total revenue and sales
- 🎯 **Performance Metrics** - Open rates, click rates, order rates
- 🏆 **Best/Worst Campaigns** - Automatically identify top and bottom performers
- 📉 **Interactive Charts** - Visualize data with beautiful charts
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Export your campaign data from Klaviyo as a CSV or Excel file
2. Drag and drop the file onto the upload area, or click to browse
3. The dashboard will automatically parse and display:
   - Summary statistics (total revenue, recipients, orders, etc.)
   - Best and worst performing campaigns
   - Interactive charts comparing campaigns
   - Detailed comparison table

## Data Format

The dashboard expects CSV/Excel files with the following columns:
- Campaign Name
- Variant Name
- Tags
- Subject
- List
- Send Time
- Send Weekday
- Total Recipients
- Unique Placed Order
- Placed Order Rate
- Revenue
- Unique Opens
- Open Rate
- Total Opens
- Unique Clicks
- Click Rate
- Total Clicks
- Unsubscribes
- Spam Complaints
- Spam Complaints Rate
- Successful Deliveries
- Bounces
- Bounce Rate
- Campaign ID
- Campaign Channel
- Winning Variant?

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **PapaParse** - CSV parsing
- **React Dropzone** - File upload

## Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

# BGN-Email-Marketing-Dashboard


