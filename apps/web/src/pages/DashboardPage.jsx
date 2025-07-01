// DashboardPage.jsx - Phoenix Initiative V3.1
// Purpose: Minimal shell for the Dashboard page for routing scaffold
import React from 'react';
import PageLayout from '../components/PageLayout.jsx';
import Card from '../components/ui/Card.jsx';

const DashboardPage = () => (
  <PageLayout title="Dashboard" description="Your main financial overview">
    <h1>Dashboard</h1>
    <p className="subtitle">Your main financial overview will appear here.</p>
    <Card style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center' }}>
      <strong>Dashboard content coming soon.</strong>
    </Card>
  </PageLayout>
);

export default DashboardPage; 