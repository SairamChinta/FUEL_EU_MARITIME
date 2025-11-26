
import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'routes', label: 'Routes', icon: '🛳️' },
  { id: 'compare', label: 'Compare', icon: '📊' },
  { id: 'banking', label: 'Banking', icon: '🏦' },
  { id: 'pooling', label: 'Pooling', icon: '🤝' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-card border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-maritime-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FE</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  FuelEU Maritime
                </h1>
                <p className="text-sm text-gray-600">
                  Compliance Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Compliance Module</p>
                <p className="text-xs text-gray-500">Regulation (EU) 2023/1805</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="glass-card border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-maritime-600 text-maritime-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>© 2024 FuelEU Maritime Compliance Platform</p>
            <p>Annex IV & Articles 20-21 Implementation</p>
          </div>
        </div>
      </footer>
    </div>
  );
};