
import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { FaHandsHelping } from 'react-icons/fa';
import { useRoutes } from '../hooks/useRoutes';
import { useCreatePool } from '../hooks/useCompliance';
import { formatNumber } from '../utils/formatters';

export const PoolingTab: React.FC = () => {
  const { data: routes = [] } = useRoutes();
  const [year, setYear] = useState<number | ''>('');
  const [selectedShips, setSelectedShips] = useState<string[]>([]);

  // Use the same ship mapping used elsewhere — backend uses SHIP001..SHIP005
  const shipToRouteMap: Record<string, string> = {
    'SHIP001': 'R001',
    'SHIP002': 'R002',
    'SHIP003': 'R003',
    'SHIP004': 'R004',
    'SHIP005': 'R005'
  };

  const shipOptions = Object.keys(shipToRouteMap);

  const availableYears = useMemo(() => {
    const s = new Set<number>();
    routes.forEach(r => s.add(r.year));
    return Array.from(s).sort();
  }, [routes]);

  const createPoolMutation = useCreatePool();
  const [resultPool, setResultPool] = useState<any | null>(null);

  const toggleShip = (shipId: string) => {
    setSelectedShips(prev => prev.includes(shipId) ? prev.filter(s => s !== shipId) : [...prev, shipId]);
  };

  const handleCreate = async () => {
    if (!year || selectedShips.length < 2) return;

    try {
      const pool = await createPoolMutation.mutateAsync({ year: Number(year), shipIds: selectedShips });
      setResultPool(pool);
    } catch (err) {
      console.error('Create pool failed', err);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pooling Management</h2>
        <p className="text-gray-600 mt-1">Create and manage compliance pools according to FuelEU Article 21 regulations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Pools</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Select year</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Ships ({selectedShips.length})</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {shipOptions.map(sid => {
                  const routeId = shipToRouteMap[sid];
                  const route = routes.find(r => r.routeId === routeId);
                  const disabled = year === '' || !availableYears.includes(Number(year));
                  return (
                    <label key={sid} className={`border rounded-lg p-3 flex items-center gap-3 ${selectedShips.includes(sid) ? 'bg-gray-100' : 'bg-white'}`}>
                      <input
                        type="checkbox"
                        checked={selectedShips.includes(sid)}
                        disabled={disabled}
                        onChange={() => toggleShip(sid)}
                        className="form-checkbox"
                      />
                      <div className="text-sm">
                        <div className="font-medium">{sid}</div>
                        <div className="text-xs text-gray-500">{route ? `${routeId} — ${route.vesselType}` : routeId}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" onClick={() => { setYear(''); setSelectedShips([]); setResultPool(null); }}>Reset</Button>
            <Button onClick={handleCreate} disabled={createPoolMutation.status === 'pending' || selectedShips.length < 2 || year === ''}>
              {createPoolMutation.status === 'pending' ? <LoadingSpinner size="sm" /> : 'Create Pool'}
            </Button>
            <div className="text-sm text-gray-500">Select at least 2 ships and a year to create a pool.</div>
          </div>

          {createPoolMutation.error && (
            <div className="text-sm text-red-500 mb-4">
              {(createPoolMutation.error as any)?.message || 'Failed to create pool.'}
              {(createPoolMutation.error as any)?.message?.toLowerCase().includes('backend') && (
                <div className="mt-2 text-xs text-gray-500">Tip: start the backend dev server (cd backend && npm run dev) and retry.</div>
              )}
            </div>
          )}

          {resultPool ? (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Pool Created — ID: {resultPool.id}</h3>
              <div className="text-sm text-gray-600 mb-2">Year: {resultPool.year} — Pool total: {formatNumber(resultPool.poolTotal)}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resultPool.members.map((m: any) => (
                  <div key={m.shipId} className="p-2 border rounded">
                    <div className="text-sm font-medium">{m.shipId}</div>
                    <div className="text-xs text-gray-500">Before: {formatNumber(m.cbBefore)} — After: {formatNumber(m.cbAfter)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<FaHandsHelping />}
              title="Pool Management"
              description="Create compliance pools to optimize surplus and deficit allocation between vessels."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export {};