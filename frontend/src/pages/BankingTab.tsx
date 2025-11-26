
import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useRoutes } from '../hooks/useRoutes';
import { useComplianceCalculation, useBankSurplus, useBankRecords, useApplyBank } from '../hooks/useCompliance';
import { formatNumber } from '../utils/formatters';

export const BankingTab: React.FC = () => {
  // The backend test data maps SHIPXXX -> route IDs (R001..R005).
  // Use these ship IDs in the UI so compliance calculation matches backend expectations.
  const [shipId, setShipId] = useState<string>('');
  const [year, setYear] = useState<number | undefined>(undefined);

  // get routes so we can show which route belongs to each ship for a helpful label
  const { data: routes = [], isLoading: routesLoading } = useRoutes();

  // Hard-coded ship → route mapping used by backend CalculateComplianceBalance
  const shipToRouteMap: Record<string, string> = {
    'SHIP001': 'R001',
    'SHIP002': 'R002',
    'SHIP003': 'R003',
    'SHIP004': 'R004',
    'SHIP005': 'R005'
  };

  const shipOptions = Object.keys(shipToRouteMap);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    routes.forEach(r => set.add(r.year));
    return Array.from(set).sort();
  }, [routes]);

  const { data: compliance, isLoading: loadingCompliance, refetch: refetchCompliance, error: complianceError } =
    useComplianceCalculation(shipId || undefined, year);

  const bankMutation = useBankSurplus();

  const { data: bankRecords = [], isLoading: loadingRecords, refetch: refetchRecords } =
    useBankRecords(shipId || undefined, year);

  const [fromShip, setFromShip] = useState<string>('');
  const [applyAmount, setApplyAmount] = useState<number | ''>('');

  const applyMutation = useApplyBank();

  const { data: fromRecords = [] } = useBankRecords(fromShip || undefined, year);
  const availableFromBank = fromRecords?.reduce((s, r) => s + r.amountGCO2eq, 0) || 0;

  const handleBank = async () => {
    if (!shipId || !year) return;

    try {
      await bankMutation.mutateAsync({ shipId, year });
    } catch (err) {
      // the hook will surface errors; keep UI quiet here
      console.error('Failed to bank surplus', err);
    } finally {
      // refresh both calculation and records
      refetchCompliance();
      refetchRecords();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Banking Operations</h2>
        <p className="text-gray-600 mt-1">
          Manage compliance balance banking according to FuelEU Article 20 regulations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Banking</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vessel / Ship</label>
              <select
                value={shipId}
                onChange={(e) => setShipId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Select vessel</option>
                {shipOptions.map(sid => {
                  const routeId = shipToRouteMap[sid];
                  const route = routes.find(r => r.routeId === routeId);
                  return (
                    <option key={sid} value={sid}>
                      {sid} — {route ? `${routeId} (${route.vesselType})` : routeId}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={year ?? ''}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">Select year</option>
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-end">
              <div className="text-right">
                <div className="text-sm text-gray-500">Actions</div>
                <div className="mt-2 flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => { setShipId(''); setYear(undefined); }}>
                    Reset
                  </Button>
                  <Button
                    onClick={() => { refetchCompliance(); refetchRecords(); }}
                    disabled={!shipId || !year}
                    variant="primary"
                  >
                    {loadingCompliance ? <LoadingSpinner size="sm" /> : 'Calculate'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Compliance Balance</h4>

            {loadingCompliance ? (
              <div className="flex items-center gap-2"><LoadingSpinner /> Loading...</div>
            ) : compliance ? (
              <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                <div>
                  <div className="text-xs text-gray-500">CB (gCO2e)</div>
                  <div className="text-xl font-semibold">{formatNumber(compliance.cbGCO2eq)}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {compliance.isSurplus && 'Surplus — eligible to bank'}
                    {compliance.isDeficit && 'Deficit — not eligible to bank'}
                    {!compliance.isSurplus && !compliance.isDeficit && 'Balanced'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleBank}
                    disabled={!compliance.isSurplus || bankMutation.status === 'pending'}
                  >
                    {bankMutation.status === 'pending' ? <LoadingSpinner size="sm" /> : 'Bank Surplus'}
                  </Button>
                  {!compliance.isSurplus && (
                    <div className="text-xs text-gray-400 mt-2">Banking is only enabled when a surplus (positive CB) exists.</div>
                  )}
                </div>
              </div>
            ) : (() => {
              if (!shipId || !year) return <div className="text-sm text-gray-500">Select vessel and year to calculate compliance balance.</div>;
              if ((complianceError as any) || bankMutation.error) {
                return (
                  <div className="text-sm text-red-500">
                    {(complianceError as any)?.message || (bankMutation.error as any)?.message || 'Failed to load compliance data.'}
                  </div>
                );
              }

              return <div className="text-sm text-gray-500">No compliance data available.</div>;
            })()}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Bank Records</h4>

            {loadingRecords ? (
              <div className="flex items-center gap-2"><LoadingSpinner /> Loading records...</div>
            ) : bankRecords.length === 0 ? (
              <div className="text-sm text-gray-500">No bank records found for this vessel and year.</div>
            ) : (
              <div className="overflow-x-auto bg-white border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount (gCO2e)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bankRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">{r.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(r.amountGCO2eq)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {/* Apply banked surplus UI */}
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Apply Banked Surplus</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end mb-3">
              <div>
                <label className="text-xs text-gray-500">From (surplus ship)</label>
                <select value={fromShip} onChange={(e) => setFromShip(e.target.value)} className="w-full rounded-lg border px-3 py-2">
                  <option value="">Select ship</option>
                  {shipOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-400 mt-1">Available bank: {formatNumber(availableFromBank)}</div>
              </div>

              <div>
                <label className="text-xs text-gray-500">To (target ship)</label>
                <select value={shipId} onChange={(e) => setShipId(e.target.value)} className="w-full rounded-lg border px-3 py-2">
                  <option value="">Select target ship</option>
                  {shipOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Amount to apply (gCO2e)</label>
                <input type="number" value={applyAmount} onChange={(e) => setApplyAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border px-3 py-2" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  if (!fromShip || !shipId || !year || !applyAmount) return;
                  try {
                    await applyMutation.mutateAsync({ fromShipId: fromShip, toShipId: shipId, year: year!, amount: Number(applyAmount) });
                    refetchCompliance();
                    refetchRecords();
                    setApplyAmount('');
                  } catch (err) {
                    // handled through mutation error and UI
                  }
                }}
                disabled={!fromShip || !shipId || !year || !applyAmount || applyMutation.status === 'pending' || applyAmount > availableFromBank}
                variant="primary"
              >
                {applyMutation.status === 'pending' ? <LoadingSpinner size="sm" /> : 'Apply Bank'}
              </Button>

              {applyMutation.error && (
                <div className="text-sm text-red-500">{(applyMutation.error as any)?.message}</div>
              )}

              {applyAmount !== '' && applyAmount > availableFromBank && (
                <div className="text-xs text-red-400">Amount exceeds available bank of {formatNumber(availableFromBank)}</div>
              )}
            </div>
          </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export {};