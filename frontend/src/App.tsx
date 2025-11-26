import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { queryClient } from './infrastructure/query-client';
import { RoutesTab } from './pages/RoutesTab';
import { CompareTab } from './pages/CompareTab';
import { BankingTab } from './pages/BankingTab';
import { PoolingTab } from './pages/PoolingTab';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<string>('routes');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'routes':
        return <RoutesTab />;
      case 'compare':
        return <CompareTab />;
      case 'banking':
        return <BankingTab />;
      case 'pooling':
        return <PoolingTab />;
      default:
        return <RoutesTab />;
    }
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderActiveTab()}
        </DashboardLayout>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;