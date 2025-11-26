// src/adapters/serviceFactory.ts - ADD DEBUG LOGS
import { ApiRouteService } from './ApiRouteService';
import { ApiComplianceService } from './ApiComplianceService';

console.log('🔧 serviceFactory: Importing ApiRouteService');
const routeService = new ApiRouteService();
console.log('✅ serviceFactory: ApiRouteService created');

console.log('🔧 serviceFactory: Importing ApiComplianceService');
const complianceService = new ApiComplianceService();
console.log('✅ serviceFactory: ApiComplianceService created');

export const getRouteService = () => {
  console.log('🔧 getRouteService called');
  return routeService;
};

export const getComplianceService = () => {
  console.log('🔧 getComplianceService called');
  return complianceService;
};