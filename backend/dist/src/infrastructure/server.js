"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet")); //@ts-ignore
const RouteController_1 = require("../adapters/web/RouteController");
const ComplianceController_1 = require("../adapters/web/ComplianceController");
const ComparisonController_1 = require("../adapters/web/ComparisonController");
const BankingController_1 = require("../adapters/web/BankingController");
const PoolController_1 = require("../adapters/web/PoolController");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.get('/routes', RouteController_1.RouteController.getRoutes);
app.post('/routes/:routeId/baseline', RouteController_1.RouteController.setBaseline);
app.get('/compliance/calculate', ComplianceController_1.ComplianceController.calculateCompliance);
app.get('/routes/comparison', ComparisonController_1.ComparisonController.getComparison);
app.post('/banking/bank', BankingController_1.BankingController.bankSurplus);
app.get('/banking/records', BankingController_1.BankingController.getBankRecords);
app.post('/pools', PoolController_1.PoolController.createPool);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
