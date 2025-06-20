import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card.jsx';
import executionLogService from '@/core/services/ExecutionLogService.js';
// Note: We will need to import NarrativeService once it exists and is exposed.
// import narrativeService from '@/features/pro/services/NarrativeService.js';

const FeedbackModule = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setError(null);

    try {
      const executionLogs = executionLogService.getLogs();
      const narrativeInsights = {
        placeholder: "NarrativeService not yet implemented. This is a placeholder.",
        generatedAt: new Date().toISOString(),
      };

      const feedbackReport = {
        reportVersion: '1.0',
        generatedAt: new Date().toISOString(),
        source: 'AlphaPro FeedbackModule',
        data: {
          executionLogs,
          narrativeInsights,
        },
      };

      const jsonString = JSON.stringify(feedbackReport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `alphapro-feedback-report-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Failed to generate feedback report:", err);
      setError("Could not generate the report. Please check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback & Diagnostics</CardTitle>
        <CardDescription>
          Generate a snapshot of the current session's logs and insights for debugging or sharing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        <Button onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Feedback Report'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackModule; 