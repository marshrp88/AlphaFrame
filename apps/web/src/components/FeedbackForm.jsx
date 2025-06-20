/**
 * FeedbackForm.jsx
 * 
 * Purpose: Pioneer Feedback Module that allows users to export
 * user-approved snapshots of their vault and logs for feedback
 * and improvement purposes.
 * 
 * Procedure:
 * 1. Display feedback categories and options
 * 2. Allow users to select what data to include in snapshot
 * 3. Generate encrypted snapshot with user approval
 * 4. Provide export functionality (no automatic upload)
 * 5. Log feedback submission for analytics
 * 
 * Conclusion: Provides safe, user-controlled feedback mechanism
 * while maintaining zero-knowledge compliance and data privacy.
 */

import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Checkbox } from './ui/switch.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Select } from './ui/Select.jsx';
import { Badge } from '../shared/ui/badge.jsx';
import feedbackUploader from '../lib/services/FeedbackUploader.js';
import executionLogService from '../lib/services/ExecutionLogService.js';

const FEEDBACK_CATEGORIES = {
  BUG_REPORT: {
    id: 'bug_report',
    name: 'Bug Report',
    description: 'Report a bug or technical issue',
    icon: '🐛',
    color: 'red'
  },
  FEATURE_REQUEST: {
    id: 'feature_request',
    name: 'Feature Request',
    description: 'Suggest a new feature or improvement',
    icon: '💡',
    color: 'blue'
  },
  UX_FEEDBACK: {
    id: 'ux_feedback',
    name: 'UX Feedback',
    description: 'Share user experience feedback',
    icon: '🎨',
    color: 'purple'
  },
  GENERAL: {
    id: 'general',
    name: 'General Feedback',
    description: 'General comments or suggestions',
    icon: '💬',
    color: 'green'
  }
};

const DATA_INCLUSION_OPTIONS = [
  {
    id: 'execution_logs',
    name: 'Execution Logs',
    description: 'Recent system activity and performance logs',
    default: true,
    size: '~50KB'
  },
  {
    id: 'financial_summary',
    name: 'Financial Summary',
    description: 'Aggregated financial data (no personal details)',
    default: true,
    size: '~10KB'
  },
  {
    id: 'ui_preferences',
    name: 'UI Preferences',
    description: 'Dashboard mode and display preferences',
    default: true,
    size: '~5KB'
  },
  {
    id: 'error_logs',
    name: 'Error Logs',
    description: 'Recent error messages and stack traces',
    default: false,
    size: '~20KB'
  },
  {
    id: 'performance_metrics',
    name: 'Performance Metrics',
    description: 'App performance and response time data',
    default: false,
    size: '~15KB'
  }
];

const FeedbackForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [includedData, setIncludedData] = useState(
    DATA_INCLUSION_OPTIONS.reduce((acc, option) => {
      acc[option.id] = option.default;
      return acc;
    }, {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snapshotGenerated, setSnapshotGenerated] = useState(false);
  const [snapshotData, setSnapshotData] = useState(null);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    calculateTotalSize();
  }, [includedData]);

  const calculateTotalSize = () => {
    const total = DATA_INCLUSION_OPTIONS.reduce((sum, option) => {
      return includedData[option.id] ? sum + parseFloat(option.size.replace('~', '').replace('KB', '')) : sum;
    }, 0);
    setTotalSize(total);
  };

  const handleDataToggle = (dataId) => {
    setIncludedData(prev => ({
      ...prev,
      [dataId]: !prev[dataId]
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !feedbackText.trim()) {
      alert('Please select a category and provide feedback text.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate snapshot with selected data
      const snapshot = await feedbackUploader.generateSnapshot({
        category: selectedCategory,
        feedback: feedbackText,
        includedData,
        timestamp: new Date().toISOString()
      });

      setSnapshotData(snapshot);
      setSnapshotGenerated(true);

      await executionLogService.log('feedback.snapshot.created', {
        category: selectedCategory,
        dataIncluded: Object.keys(includedData).filter(key => includedData[key]),
        totalSize: `${totalSize}KB`
      });

    } catch (error) {
      console.error('Error generating feedback snapshot:', error);
      alert('Error generating snapshot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    if (!snapshotData) return;

    try {
      await feedbackUploader.exportSnapshot(snapshotData, 'file');
      await executionLogService.log('feedback.snapshot.exported', {
        category: selectedCategory,
        totalSize: `${totalSize}KB`
      });
      alert('Snapshot exported successfully!');
    } catch (error) {
      console.error('Error exporting snapshot:', error);
      alert('Error exporting snapshot. Please try again.');
    }
  };

  const handleClipboardExport = async () => {
    if (!snapshotData) return;

    try {
      await feedbackUploader.exportSnapshot(snapshotData, 'clipboard');
      await executionLogService.log('feedback.snapshot.exported', {
        category: selectedCategory,
        totalSize: `${totalSize}KB`,
        format: 'clipboard'
      });
      alert('Snapshot data copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Error copying to clipboard. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedCategory('');
    setFeedbackText('');
    setIncludedData(
      DATA_INCLUSION_OPTIONS.reduce((acc, option) => {
        acc[option.id] = option.default;
        return acc;
      }, {})
    );
    setSnapshotGenerated(false);
    setSnapshotData(null);
  };

  const getCategoryColor = (color) => {
    const colorMap = {
      red: 'border-red-200 bg-red-50 hover:bg-red-100',
      blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
      purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
      green: 'border-green-200 bg-green-50 hover:bg-green-100'
    };
    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pioneer Feedback</h1>
        <p className="text-gray-600">
          Help us improve AlphaPro by sharing your feedback. Your data remains private and secure.
        </p>
      </div>

      {!snapshotGenerated ? (
        <div className="space-y-6">
          {/* Feedback Category Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Feedback Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(FEEDBACK_CATEGORIES).map((category) => (
                <div
                  key={category.id}
                  data-testid={`category-${category.id}`}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-100'
                      : getCategoryColor(category.color)
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Feedback Text */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Your Feedback</h2>
            <Textarea
              placeholder="Please describe your feedback in detail..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-32"
            />
            <p className="text-sm text-gray-500 mt-2">
              Be as specific as possible to help us understand and address your feedback.
            </p>
          </Card>

          {/* Data Inclusion Options */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Data to Include in Snapshot</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select what data to include in your feedback snapshot. All data is anonymized and encrypted.
            </p>
            
            <div className="space-y-3">
              {DATA_INCLUSION_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={includedData[option.id]}
                    onCheckedChange={() => handleDataToggle(option.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{option.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {option.size}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Snapshot Size:</span>
                <span className="text-sm font-semibold text-gray-900">~{totalSize}KB</span>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleReset}>
              Reset Form
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedCategory || !feedbackText.trim()}
            >
              {isSubmitting ? 'Generating Snapshot...' : 'Generate Snapshot'}
            </Button>
          </div>
        </div>
      ) : (
        /* Snapshot Generated View */
        <div className="space-y-6">
          <Card className="p-6 border-2 border-green-200 bg-green-50">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">✅</span>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Snapshot Generated Successfully!</h2>
                <p className="text-sm text-green-700">
                  Your feedback snapshot has been created and is ready for export.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {FEEDBACK_CATEGORIES[selectedCategory.toUpperCase()]?.name || selectedCategory}
                </div>
                <div className="text-sm text-gray-600">Category</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">~{totalSize}KB</div>
                <div className="text-sm text-gray-600">Size</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {Object.values(includedData).filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-600">Data Types</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Included Data:</h3>
              <div className="flex flex-wrap gap-2">
                {DATA_INCLUSION_OPTIONS.map((option) => (
                  includedData[option.id] && (
                    <Badge key={option.id} variant="secondary" className="text-xs">
                      {option.name}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Download Snapshot</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download the encrypted snapshot file to your device. You can then share it with our team
                  through your preferred secure channel.
                </p>
                <Button onClick={handleExport} className="w-full">
                  Download Snapshot File
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">Copy to Clipboard</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Copy the snapshot data to your clipboard for easy sharing.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleClipboardExport}
                  className="w-full"
                >
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleReset}>
              Create New Feedback
            </Button>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <span className="text-blue-600 text-lg">🔒</span>
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Privacy & Security</h3>
            <p className="text-sm text-blue-700">
              Your feedback snapshot is encrypted and contains no personally identifiable information. 
              All data is processed locally and never automatically uploaded. You maintain full control 
              over what data is included and how it's shared.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackForm; 
