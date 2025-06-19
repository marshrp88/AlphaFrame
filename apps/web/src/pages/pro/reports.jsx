import React from 'react';
import { Link } from 'react-router-dom';

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/pro" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-2">Reports & Insights</h1>
        <p className="text-gray-600">Comprehensive financial analytics and insights</p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          🚧 Financial reporting features are under development. Coming soon:
        </p>
        <ul className="list-disc list-inside mt-2 text-yellow-700">
          <li>Portfolio performance reports</li>
          <li>Budget adherence analysis</li>
          <li>Cash flow statements</li>
          <li>Custom report builder</li>
        </ul>
      </div>
    </div>
  );
}