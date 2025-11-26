"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonController = void 0;
const PrismaRouteRepository_1 = require("../database/PrismaRouteRepository");
const routeRepository = new PrismaRouteRepository_1.PrismaRouteRepository();
class ComparisonController {
    static async getComparison(req, res) {
        try {
            const comparisonData = await routeRepository.getComparisonData();
            // Convert baseline Route instance to plain object
            const cleanBaseline = {
                routeId: comparisonData.baseline.routeId,
                vesselType: comparisonData.baseline.vesselType,
                fuelType: comparisonData.baseline.fuelType,
                year: comparisonData.baseline.year,
                ghgIntensity: comparisonData.baseline.ghgIntensity,
                fuelConsumption: comparisonData.baseline.fuelConsumption,
                distance: comparisonData.baseline.distance,
                totalEmissions: comparisonData.baseline.totalEmissions,
                isBaseline: comparisonData.baseline.isBaseline
            };
            const response = {
                baseline: cleanBaseline,
                comparisons: comparisonData.comparisons
            };
            console.log('=== FINAL RESPONSE ===');
            console.log(JSON.stringify(response, null, 2));
            res.json(response);
        }
        catch (error) {
            console.error('Comparison error:', error);
            res.status(500).json({ error: 'Failed to get comparison data' });
        }
    }
}
exports.ComparisonController = ComparisonController;
