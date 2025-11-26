import { Route } from '../../core/entities/Route';
import { RouteRepository } from '../../ports/RouteRepository';
//@ts-ignore
import { prisma } from '../../infrastructure/database';

export class PrismaRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    const routes = await prisma.route.findMany();
    return routes.map((route:any) => new Route({
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
}