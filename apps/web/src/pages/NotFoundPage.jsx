// NotFoundPage.jsx - Phoenix Initiative V3.1
// Purpose: Minimal 404 page shell for routing fallback
import React from 'react';
import PageLayout from '../components/PageLayout';

const NotFoundPage = () => (
  <PageLayout title="404 - Page Not Found" description="The page you are looking for does not exist.">
    <div className="notfound-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  </PageLayout>
);

export default NotFoundPage; 