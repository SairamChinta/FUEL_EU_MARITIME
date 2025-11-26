"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const PrismaRouteRepository_1 = require("../database/PrismaRouteRepository");
const routeRepository = new PrismaRouteRepository_1.PrismaRouteRepository();
class RouteController {
    static async getRoutes(_req, res) {
        try {
            const routes = await routeRepository.findAll();
            res.json(routes);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch routes' });
        }
    }
    static async setBaseline(req, res) {
        try {
            const { routeId } = req.params;
            if (!routeId) {
                return res.status(400).json({ error: 'routeId is required' });
            }
            const updated = await routeRepository.setBaseline(routeId);
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to set baseline' });
        }
    }
}
exports.RouteController = RouteController;
exports.default = RouteController;
