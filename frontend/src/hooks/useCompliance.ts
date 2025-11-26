
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComplianceService } from '../adapters/serviceFactory';
import { ComplianceBalance, BankEntry, Pool } from '../core/entities/Compliance';

export const useComplianceCalculation = (shipId?: string, year?: number) => {
  return useQuery({
    queryKey: ['compliance', shipId, year],
    queryFn: () => getComplianceService().calculateCompliance(shipId!, year!),
    enabled: !!shipId && !!year,
  });
};

export const useBankSurplus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ shipId, year }: { shipId: string; year: number }) => 
      getComplianceService().bankSurplus(shipId, year),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['compliance', variables.shipId, variables.year] });
      queryClient.invalidateQueries({ queryKey: ['bankRecords', variables.shipId, variables.year] });
    },
  });
};

export const useBankRecords = (shipId?: string, year?: number) => {
  return useQuery({
    queryKey: ['bankRecords', shipId, year],
    queryFn: () => getComplianceService().getBankRecords(shipId!, year!),
    enabled: !!shipId && !!year,
  });
};

export const useCreatePool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ year, shipIds }: { year: number; shipIds: string[] }) => 
      getComplianceService().createPool(year, shipIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance'] });
    },
  });
};

export const useApplyBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fromShipId, toShipId, year, amount }: { fromShipId: string; toShipId: string; year: number; amount: number }) =>
      getComplianceService().applyBank(fromShipId, toShipId, year, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['compliance', variables.toShipId, variables.year] });
      queryClient.invalidateQueries({ queryKey: ['bankRecords', variables.fromShipId, variables.year] });
      queryClient.invalidateQueries({ queryKey: ['bankRecords', variables.toShipId, variables.year] });
    }
  });
};