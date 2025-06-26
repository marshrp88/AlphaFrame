import React from 'react';

/**
 * ReportCenter UI Component
 * Purpose: Displays budget heatmaps, optimizer change maps, and dashboard mode reports.
 * Props:
 *   - heatmap: Budget heatmap data
 *   - changeMap: Optimizer change map data
 *   - dashboardReport: Dashboard mode report data
 */
export default function ReportCenter({ heatmap, changeMap, dashboardReport }) {
  return (
    <div className="report-center">
      <h2>Report Center</h2>
      <section>
        <h3>Budget Heatmap</h3>
        <pre>{JSON.stringify(heatmap, null, 2)}</pre>
      </section>
      <section>
        <h3>Optimizer Change Map</h3>
        <pre>{JSON.stringify(changeMap, null, 2)}</pre>
      </section>
      <section>
        <h3>Dashboard Mode Report</h3>
        <pre>{JSON.stringify(dashboardReport, null, 2)}</pre>
      </section>
    </div>
  );
} 