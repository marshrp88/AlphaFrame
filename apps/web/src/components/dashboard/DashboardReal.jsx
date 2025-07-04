import { useEffect, useState } from 'react';
import { getDemoTransactions } from '../../lib/demo-data';

export default function DashboardReal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDemoTransactions().then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 800, margin: '2rem auto' }}>
      <div
        className="card"
        style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-base)', boxShadow: 'var(--shadow-sm)', padding: 'var(--spacing-lg)' }}
        aria-label="Net Cash Flow"
      >
        <h2 style={{ margin: 0, fontFamily: 'var(--font-family-base)' }}>Net Cash Flow</h2>
        <div style={{ fontSize: '2rem', color: 'var(--color-accent)', margin: '1rem 0' }}>${data.net}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>Last updated: {data.lastUpdated}</div>
      </div>
      <div
        className="card"
        style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-base)', boxShadow: 'var(--shadow-sm)', padding: 'var(--spacing-lg)' }}
        aria-label="Latest Triggered Rule"
      >
        <h2 style={{ margin: 0, fontFamily: 'var(--font-family-base)' }}>Latest Triggered Rule</h2>
        <div style={{ fontSize: '1.2rem', margin: '1rem 0' }}>{data.rules[0].description}</div>
        <a href="#" style={{ color: 'var(--color-accent)', fontSize: '0.95rem', textDecoration: 'underline', cursor: 'pointer' }} aria-label="View all rules">+ View All</a>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginTop: '1rem' }}>Last updated: {data.lastUpdated}</div>
      </div>
    </div>
  );
} 