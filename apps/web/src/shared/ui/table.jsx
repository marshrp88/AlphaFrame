/**
 * Table Components - Phoenix Initiative V3.1
 * 
 * Purpose: Provides consistent table functionality across the application
 * using ONLY design tokens - NO TAILWIND, NO TYPESCRIPT, NO SVELTE.
 * 
 * Procedure: 
 * 1. Use CSS classes that reference design tokens
 * 2. Apply consistent table styling with proper borders
 * 3. Support responsive behavior and accessibility
 * 4. Ensure proper spacing and typography
 * 
 * Conclusion: Ensures uniform table behavior and appearance
 * while maintaining design system consistency with vanilla CSS only.
 */
import React from 'react';
import { cn } from '@/lib/utils.js';
import './table.css';

export const Table = ({ children, className = '', ...props }) => {
  return (
    <table className={cn('table', className)} {...props}>
      {children}
    </table>
  );
};

export const TableRow = ({ children, className = '', ...props }) => {
  return (
    <tr className={cn('table-row', className)} {...props}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '', ...props }) => {
  return (
    <td className={cn('table-cell', className)} {...props}>
      {children}
    </td>
  );
};

export const TableHeader = ({ children, className = '', ...props }) => {
  return (
    <th className={cn('table-header', className)} {...props}>
      {children}
    </th>
  );
}; 
