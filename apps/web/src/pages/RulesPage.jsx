import React, { useState } from "react";
import RuleBinderRoot from '@/components/framesync/RuleBinderRoot';
import ActionLogView from '@/components/framesync/ActionLogView';

/**
 * RulesPage - FrameSync Integration
 * This page now uses the real FrameSync components for rule creation and action logging.
 * All mock/demo logic has been removed for E2E and production fidelity.
 */
export default function RulesPage() {
  const [showForm, setShowForm] = useState(false);
  const [showLog, setShowLog] = useState(false);

  return (
    <div>
      <div data-testid="debug-rulespage">RulesPage is mounted</div>
      <h1>Rules Page</h1>
      <button data-testid="create-rule" onClick={() => { setShowForm(true); setShowLog(false); }}>
        Create Rule
      </button>
      <a href="#" data-testid="action-log-link" onClick={e => { e.preventDefault(); setShowLog(true); setShowForm(false); }}>
        Action Log
      </a>

      {/* Render the real FrameSync RuleBinderRoot for rule creation/configuration */}
      {showForm && (
        <RuleBinderRoot initialConfig={{}} onConfigurationChange={() => setShowForm(false)} />
      )}

      {/* Render the real FrameSync ActionLogView for the action log */}
      {showLog && (
        <ActionLogView />
      )}
    </div>
  );
} 