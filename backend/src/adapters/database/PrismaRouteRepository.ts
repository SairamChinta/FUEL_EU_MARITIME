import { Route } from '../../core/entities/Route';
import { RouteRepository, ComparisonRoute } from '../../ports/RouteRepository';
import { prisma } from '../../infrastructure/database';

export class PrismaRouteRepository implements RouteRepository {
  async findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    // Build a Prisma "where" clause from provided filters — only include keys that exist
    const where: any = {};

    if (filters?.vesselType) {
      where.vesselType = filters.vesselType;
    }

    if (filters?.fuelType) {
      where.fuelType = filters.fuelType;
    }

    if (typeof filters?.year === 'number') {
      where.year = filters!.year;
    }

    const routes = await prisma.route.findMany({ where });
    
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
    comparisons: ComparisonRoute[];
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

    const comparisons: ComparisonRoute[] = allRoutes.map((route: any) => {
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