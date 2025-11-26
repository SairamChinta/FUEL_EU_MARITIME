import { Route } from '../../core/entities/Route';
import { RouteRepository } from '../../ports/RouteRepository';
import { prisma } from '../../infrastructure/database';

export class PrismaRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    const routes = await prisma.route.findMany();
    
    return routes.map((route: any) => new Route({
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

  async findById(routeId: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({
      where: { routeId }
    });

    if (!route) return null;

    return new Route({
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

  async setBaseline(routeId: string): Promise<Route> {
    await prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false }
    });

    const route = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true }
    });

    return new Route({
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

  async getComparisonData(): Promise<{
    baseline: Route;
    comparisons: Array<Route & { percentDiff: number; compliant: boolean }>;
  }> {
    const TARGET = 89.3368;
    
    const baselineRoute = await prisma.route.findFirst({
      where: { isBaseline: true }
    });

    if (!baselineRoute) {
      throw new Error('No baseline route set');
    }

    const allRoutes = await prisma.route.findMany({
      where: { isBaseline: false }
    });

    const baseline = new Route({
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

    const comparisons = allRoutes.map((route: any) => {
      const routeEntity = new Route({
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

      const percentDiff = ((route.ghgIntensity / baselineRoute.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= TARGET;

      return Object.assign(routeEntity, {
        percentDiff: Number(percentDiff.toFixed(2)),
        compliant
      });
    });

    return { baseline, comparisons };
  }
}