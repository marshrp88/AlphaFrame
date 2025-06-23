import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

const Dummy = () => <div>test</div>;

describe('React 18 Rendering Sanity Test', () => {
  it('renders a basic component', () => {
    // Log DOM state before render to see what we're working with
    console.log('=== DOM STATE BEFORE RENDER ===');
    console.log('document.body.innerHTML:', document.body.innerHTML);
    console.log('document.getElementById("root"):', document.getElementById('root'));
    console.log('document.body.children.length:', document.body.children.length);
    
    const result = render(<Dummy />);
    expect(result.getByText('test')).toBeTruthy();
  });
}); 