
import React from 'react';
import { cn } from '../utils/cn';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className="overflow-x-auto">
    <table className={cn('w-full text-sm text-left text-gray-700', className)}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <thead className={cn('bg-gray-50 text-gray-900 text-xs uppercase', className)}>
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <tbody className={cn('divide-y divide-gray-200', className)}>{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <tr className={cn('hover:bg-gray-50 transition-colors', className)}>{children}</tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <th className={cn('px-4 py-3 font-semibold', className)}>{children}</th>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <td className={cn('px-4 py-3', className)}>{children}</td>
);