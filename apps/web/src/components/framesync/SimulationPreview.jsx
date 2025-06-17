/**
 * SimulationPreview.jsx
 * A component that displays a preview of the action's impact before execution
 * This helps users understand the potential outcomes of their actions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { runSimulation } from '@/lib/services/SimulationService';

/**
 * SimulationPreview Component Props
 * @typedef {Object} SimulationPreviewProps
 * @property {string} actionType - The type of action being simulated
 * @property {Object} payload - The action payload to simulate
 * @property {Object} currentState - The current state to simulate from
 */

/**
 * SimulationPreview Component
 * @param {SimulationPreviewProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
function SimulationPreview({ actionType, payload, currentState }) {
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (actionType && payload) {
      runSimulationPreview();
    }
  }, [actionType, payload]);

  const runSimulationPreview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await runSimulation(actionType, payload, currentState);
      setSimulationResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!actionType || !payload) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Simulation Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Running simulation...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">
            <p>Error running simulation: {error}</p>
            <Button
              variant="outline"
              onClick={runSimulationPreview}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : simulationResult ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Before</h4>
                <pre className="mt-2 p-2 bg-gray-100 rounded">
                  {JSON.stringify(currentState, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium">After</h4>
                <pre className="mt-2 p-2 bg-gray-100 rounded">
                  {JSON.stringify(simulationResult, null, 2)}
                </pre>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={runSimulationPreview}
              className="w-full"
            >
              Refresh Simulation
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default SimulationPreview; 