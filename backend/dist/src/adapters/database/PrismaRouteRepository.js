"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRouteRepository = void 0;
const Route_1 = require("../../core/entities/Route");
const database_1 = require("../../infrastructure/database");
class PrismaRouteRepository {
    async findAll() {
        const routes = await database_1.prisma.route.findMany();
        return routes.map((route) => new Route_1.Route({
            routeId: route.routeId,
            vesselType: route.vesselType,
            fuelType: route.fuelType,
            year: route.year,
            ghgIntensity: route.ghgIntensity,
            fuelConsumption: route.fuelConsumption,
            distance: route.distance,
            totalEmissions: route.totalEmissions,
            isBaseline: route.isBaseline
        }));
    }
    async findById(routeId) {
        const route = await database_1.prisma.route.findUnique({
            where: { routeId }
        });
        if (!route)
            return null;
        return new Route_1.Route({
            routeId: route.routeId,
            vesselType: route.vesselType,
            fuelType: route.fuelType,
            year: route.year,
            ghgIntensity: route.ghgIntensity,
            fuelConsumption: route.fuelConsumption,
            distance: route.distance,
            totalEmissions: route.totalEmissions,
            isBaseline: route.isBaseline
        });
    }
    async setBaseline(routeId) {
        await database_1.prisma.route.updateMany({
            where: { isBaseline: true },
            data: { isBaseline: false }
        });
        const route = await database_1.prisma.route.update({
            where: { routeId },
            data: { isBaseline: true }
        });
        return new Route_1.Route({
            routeId: route.routeId,
            vesselType: route.vesselType,
            fuelType: route.fuelType,
            year: route.year,
            ghgIntensity: route.ghgIntensity,
            fuelConsumption: route.fuelConsumption,
            distance: route.distance,
            totalEmissions: route.totalEmissions,
            isBaseline: route.isBaseline
        });
    }
    async getComparisonData() {
        const TARGET = 89.3368;
        const baselineRoute = await database_1.prisma.route.findFirst({
            where: { isBaseline: true }
        });
        if (!baselineRoute) {
            throw new Error('No baseline route set');
        }
        const allRoutes = await database_1.prisma.route.findMany({
            where: { isBaseline: false }
        });
        const baseline = new Route_1.Route({
            routeId: baselineRoute.routeId,
            vesselType: baselineRoute.vesselType,
            fuelType: baselineRoute.fuelType,
            year: baselineRoute.year,
            ghgIntensity: baselineRoute.ghgIntensity,
            fuelConsumption: baselineRoute.fuelConsumption,
            distance: baselineRoute.distance,
            totalEmissions: baselineRoute.totalEmissions,
            isBaseline: baselineRoute.isBaseline
        });
        const comparisons = allRoutes.map((route) => {
            const percentDiff = ((route.ghgIntensity / baselineRoute.ghgIntensity) - 1) * 100;
            const compliant = route.ghgIntensity <= TARGET;
            return {
                routeId: route.routeId,
                vesselType: route.vesselType,
                fuelType: route.fuelType,
                year: route.year,
                ghgIntensity: route.ghgIntensity,
                fuelConsumption: route.fuelConsumption,
                distance: route.distance,
                totalEmissions: route.totalEmissions,
                isBaseline: route.isBaseline,
                percentDiff: Number(percentDiff.toFixed(2)),
                compliant
            };
        });
        return { baseline, comparisons };
    }
}
exports.PrismaRouteRepository = PrismaRouteRepository;
