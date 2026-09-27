import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SAMPLE_OPPORTUNITIES } from './src/data/opportunities.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'OpportunityHub AI',
    timestamp: new Date().toISOString(),
    opportunitiesCount: SAMPLE_OPPORTUNITIES.length
  });
});

// API endpoint for opportunities
app.get('/api/opportunities', (req, res) => {
  const { category, mode, search } = req.query;
  let results = [...SAMPLE_OPPORTUNITIES];

  if (category && typeof category === 'string' && category !== 'All') {
    results = results.filter(opp => opp.category.toLowerCase() === category.toLowerCase());
  }

  if (mode && typeof mode === 'string' && mode !== 'All') {
    results = results.filter(opp => opp.mode.toLowerCase() === mode.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(opp => 
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      opp.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  res.json({
    total: results.length,
    opportunities: results
  });
});

// Production: Serve static client build from dist directory
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`OpportunityHub AI server running on port ${PORT} (http://0.0.0.0:${PORT})`);
});
