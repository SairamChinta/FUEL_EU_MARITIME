import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../../hooks/useRoutes', () => ({
  useComparisonData: () => ({
    data: {
      baseline: { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91 },
      comparisons: [
        { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88, percentDiff: -3, compliant: true }
      ]
    },
    isLoading: false,
    error: null
  })
}));

import { CompareTab } from '../CompareTab';

describe('CompareTab', () => {
  it('renders baseline route and comparisons', () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <CompareTab />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Baseline Route/i)).toBeInTheDocument();
    expect(screen.getByText(/R001/)).toBeInTheDocument();
    expect(screen.getByText(/R002/)).toBeInTheDocument();
  });
});
