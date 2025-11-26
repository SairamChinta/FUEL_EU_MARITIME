import express from 'express';
import cors from 'cors';
import helmet from 'helmet';//@ts-ignore
import { RouteController } from '../adapters/web/RouteController';
import { ComplianceController } from '../adapters/web/ComplianceController';
import { ComparisonController } from '../adapters/web/ComparisonController';
import { BankingController } from '../adapters/web/BankingController';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/routes', RouteController.getRoutes);
app.post('/routes/:routeId/baseline', RouteController.setBaseline);
app.get('/compliance/calculate', ComplianceController.calculateCompliance);
app.get('/routes/comparison', ComparisonController.getComparison);
app.post('/banking/bank', BankingController.bankSurplus);
app.get('/banking/records', BankingController.getBankRecords);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});