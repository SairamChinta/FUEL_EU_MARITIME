import { Request, Response } from 'express';
import { PrismaRouteRepository } from '../database/PrismaRouteRepository';

const routeRepository = new PrismaRouteRepository();

export class RouteController {
  static async getRoutes(_req: Request, res: Response) {
    try {
      const routes = await routeRepository.findAll();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch routes' });
    }
  }

  static async setBaseline(req: Request, res: Response) {
    try {
      const { routeId } = req.params;

      if (!routeId) {
        return res.status(400).json({ error: 'routeId is required' });
      }

      const updated = await routeRepository.setBaseline(routeId);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to set baseline' });
    }
  }
}

export default RouteController;
