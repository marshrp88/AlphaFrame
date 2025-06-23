import React from 'react';
import { render, screen } from '@testing-library/react';
import RulesPage from './RulesPage';

describe('RulesPage - Isolation Runtime Trace', () => {
  it('should render RulesPage and log all lifecycle phases', () => {
    // Console tracing at runtime
    console.log('[TestMount] About to render RulesPage');
    
    const { getByTestId, debug } = render(<RulesPage />);
    
    console.log('[TestMount] Rendered RulesPage');

    // Check for any error elements first
    const errorElement = screen.queryByTestId('error-caught');
    if (errorElement) {
      console.error('[TestMount] Error element found:', errorElement.textContent);
      throw new Error(`RulesPage failed to render: ${errorElement.textContent}`);
    }

    const innerErrorElement = screen.queryByTestId('debug-rulespage-error');
    if (innerErrorElement) {
      console.error('[TestMount] Inner error element found:', innerErrorElement.textContent);
      throw new Error(`RulesPage inner render failed: ${innerErrorElement.textContent}`);
    }

    // Try to find the main element
    const el = getByTestId('debug-rulespage');
    expect(el).toBeVisible();
    
    console.log('[TestMount] RulesPage rendered successfully');
    debug();
  });
}); 