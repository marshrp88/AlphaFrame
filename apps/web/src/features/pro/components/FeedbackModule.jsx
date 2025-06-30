import React, { useState } from 'react';
import Button from '@/shared/ui/Button';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import executionLogService from '@/core/services/ExecutionLogService';

/**
 * FeedbackModule Component
 * 
 * Purpose: Provides a comprehensive feedback system that allows users to generate
 * and export execution logs and narrative insights in JSON format for debugging
 * and support purposes.
 * 
 * Procedure:
 * 1. Collects execution logs from ExecutionLogService
 * 2. Generates narrative insights from execution data
 * 3. Creates a structured feedback report
 * 4. Exports the report as a downloadable JSON file
 * 5. Handles errors gracefully with user feedback
 * 
 * Conclusion: This component enables users to easily export their AlphaPro usage
 * data for troubleshooting and feedback purposes while maintaining data privacy.
 */

const FeedbackModule = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Generates narrative insights from execution logs
   * @param {Array} logs - The execution logs to analyze
   * @returns {Array} Array of narrative insights
   */
  const generateNarrativeInsights = (logs) => {
    const insights = [];
    
    // Analyze rule execution patterns
    const ruleExecutions = logs.filter(log => log.type === 'rule_triggered');
    if (ruleExecutions.length > 0) {
      insights.push({
        type: 'rule_activity',
        title: 'Rule Execution Summary',
        description: `You have ${ruleExecutions.length} rule executions in this period`,
        priority: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    // Analyze portfolio changes
    const portfolioLogs = logs.filter(log => log.type === 'portfolio_analysis');
    if (portfolioLogs.length > 0) {
      insights.push({
        type: 'portfolio_insight',
        title: 'Portfolio Analysis',
        description: 'Portfolio analysis has been performed to optimize your investments',
        priority: 'high',
        timestamp: new Date().toISOString()
      });
    }

    // Analyze budget activity
    const budgetLogs = logs.filter(log => log.type === 'budget_forecast');
    if (budgetLogs.length > 0) {
      insights.push({
        type: 'budget_insight',
        title: 'Budget Forecasting',
        description: 'Budget forecasting has been used to plan your financial future',
        priority: 'medium',
        timestamp: new Date().toISOString()
      });
    }

    return insights;
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      // Collect execution logs
      const executionLogs = await executionLogService.queryLogs();
      
      // Generate narrative insights
      const narrativeInsights = generateNarrativeInsights(executionLogs);
      
      // Create comprehensive feedback report
      const feedbackReport = {
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          userId: localStorage.getItem('userId') || 'anonymous'
        },
        executionLogs: executionLogs,
        narrativeInsights: narrativeInsights,
        summary: {
          totalLogs: executionLogs.length,
          totalInsights: narrativeInsights.length,
          dateRange: {
            start: executionLogs.length > 0 ? executionLogs[executionLogs.length - 1].timestamp : null,
            end: executionLogs.length > 0 ? executionLogs[0].timestamp : null
          }
        }
      };

      // Convert to JSON and create downloadable file
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
      
      setSuccess(true);
    } catch (err) {
      setError('Could not generate the report. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AlphaPro Feedback Export</CardTitle>
        <CardDescription>
          Generate and download a comprehensive report of your AlphaPro usage data for debugging and support purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">
              ✅ Feedback report generated and downloaded successfully!
            </p>
          </div>
        )}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">What&apos;s included:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Execution logs and system events</li>
            <li>• Narrative insights and analysis</li>
            <li>• Timestamp and version information</li>
            <li>• Structured JSON format for easy analysis</li>
          </ul>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? 'Generating...' : 'Generate & Download Report'}
          </Button>
          {(success || error) && (
            <Button 
              onClick={handleReset}
              variant="outline"
            >
              Reset
            </Button>
          )}
        </div>
        <div className="text-xs text-gray-500">
          <p>💡 This report contains your usage data and can be shared with support for troubleshooting.</p>
          <p>🔒 All data is processed locally and no information is sent to external servers.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackModule;
