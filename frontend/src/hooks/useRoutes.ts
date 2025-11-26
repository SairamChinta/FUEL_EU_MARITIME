
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteService } from '../adapters/serviceFactory';
import { Route } from '../core/entities/Route';

export const useRoutes = (filters?: { vesselType?: string; fuelType?: string; year?: number }) => {
  return useQuery({
    queryKey: ['routes', filters],
    queryFn: () => getRouteService().getRoutes(filters),
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