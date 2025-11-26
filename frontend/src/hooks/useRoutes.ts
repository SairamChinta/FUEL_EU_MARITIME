// src/hooks/useRoutes.ts - ADD ERROR HANDLING
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteService } from '../adapters/serviceFactory';
import { Route } from '../core/entities/Route';

export const useRoutes = (filters?: { vesselType?: string; fuelType?: string; year?: number }) => {
  return useQuery({
    queryKey: ['routes', filters],
    queryFn: async () => {
      try {
        console.log('useRoutes: Starting API call');
        const service = getRouteService();
        console.log('useRoutes: Service instance created');
        const result = await service.getRoutes(filters);
        console.log('useRoutes: Data received', result.length, 'routes');
        return result;
      } catch (error) {
        console.error('useRoutes: Error in queryFn', error);
        throw error;
      }
    },
  });
};

export const useSetBaseline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (routeId: string) => getRouteService().setBaseline(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['comparison'] });
    },
  });
};

export const useComparisonData = () => {
  return useQuery({
    queryKey: ['comparison'],
    queryFn: () => getRouteService().getComparisonData(),
  });
};