/**
 * Design System Test Page - Phoenix Initiative V3.1
 * 
 * Purpose: Showcases all UI components using design tokens
 * for development and testing purposes.
 * 
 * Procedure:
 * 1. Import all refactored components
 * 2. Display them in organized sections
 * 3. Show different variants and states
 * 4. Validate design token usage
 * 
 * Conclusion: Provides a visual reference for the design system
 * and validates token implementation.
 */
import React, { useState } from 'react';
import Button from '../shared/ui/Button';
import Card, { CardHeader, CardContent, CardTitle, CardDescription } from '../shared/ui/Card';
import Input from '../shared/ui/Input';
import Badge from '../shared/ui/badge';
import Label from '../shared/ui/Label';
import Switch from '../shared/ui/switch';
import './DesignSystem.css';

const DesignSystem = () => {
  const [inputValue, setInputValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);

  return (
    <div className="design-system">
      <div className="design-system-header">
        <h1 className="design-system-title">AlphaFrame Design System</h1>
        <p className="design-system-subtitle">Phoenix Initiative V3.1 - Vanilla CSS with Design Tokens</p>
      </div>

      <div className="design-system-content">
        {/* Colors Section */}
        <section className="design-section">
          <h2 className="section-title">Color Palette</h2>
          <div className="color-grid">
            <div className="color-item">
              <div className="color-swatch bg-primary"></div>
              <span className="color-name">Primary</span>
            </div>
            <div className="color-item">
              <div className="color-swatch bg-secondary"></div>
              <span className="color-name">Secondary</span>
            </div>
            <div className="color-item">
              <div className="color-swatch bg-accent"></div>
              <span className="color-name">Accent</span>
            </div>
            <div className="color-item">
              <div className="color-swatch bg-success"></div>
              <span className="color-name">Success</span>
            </div>
            <div className="color-item">
              <div className="color-swatch bg-warning"></div>
              <span className="color-name">Warning</span>
            </div>
            <div className="color-item">
              <div className="color-swatch bg-error"></div>
              <span className="color-name">Error</span>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="design-section">
          <h2 className="section-title">Typography</h2>
          <div className="typography-examples">
            <h1 className="text-4xl font-bold">Heading 1 - 4xl Bold</h1>
            <h2 className="text-3xl font-semibold">Heading 2 - 3xl Semibold</h2>
            <h3 className="text-2xl font-medium">Heading 3 - 2xl Medium</h3>
            <h4 className="text-xl font-normal">Heading 4 - xl Normal</h4>
            <p className="text-lg">Body Large - lg</p>
            <p className="text-base">Body Base - base</p>
            <p className="text-sm">Body Small - sm</p>
            <p className="text-xs">Body Extra Small - xs</p>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="design-section">
          <h2 className="section-title">Buttons</h2>
          <div className="component-grid">
            <div className="component-group">
              <h3 className="component-group-title">Variants</h3>
              <div className="button-row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            <div className="component-group">
              <h3 className="component-group-title">Sizes</h3>
              <div className="button-row">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div className="component-group">
              <h3 className="component-group-title">States</h3>
              <div className="button-row">
                <Button disabled>Disabled</Button>
                <Button className="btn-loading">Loading</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="design-section">
          <h2 className="section-title">Cards</h2>
          <div className="card-grid">
            <Card className="card-elevated">
              <CardHeader>Basic Card</CardHeader>
              <CardContent>
                <p>This is a basic card with header and content.</p>
              </CardContent>
            </Card>
            
            <Card className="card-interactive">
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>This card has hover effects and is clickable.</CardDescription>
              <CardContent>
                <p>Hover over this card to see the interaction.</p>
              </CardContent>
            </Card>
            
            <Card className="card-success">
              <CardTitle>Success Card</CardTitle>
              <CardContent>
                <p>This card has a success border indicator.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="design-section">
          <h2 className="section-title">Form Elements</h2>
          <div className="form-grid">
            <div className="form-group">
              <Label htmlFor="basic-input">Basic Input</Label>
              <Input 
                id="basic-input"
                placeholder="Enter text here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="error-input">Error Input</Label>
              <Input 
                id="error-input"
                className="input-error"
                placeholder="This input has an error state"
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="success-input">Success Input</Label>
              <Input 
                id="success-input"
                className="input-success"
                placeholder="This input has a success state"
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="disabled-input">Disabled Input</Label>
              <Input 
                id="disabled-input"
                disabled
                placeholder="This input is disabled"
              />
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="design-section">
          <h2 className="section-title">Badges</h2>
          <div className="badge-row">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        {/* Switches Section */}
        <section className="design-section">
          <h2 className="section-title">Switches</h2>
          <div className="switch-row">
            <div className="switch-item">
              <Label htmlFor="switch-1">Switch 1</Label>
              <Switch 
                id="switch-1"
                checked={switchValue}
                onCheckedChange={setSwitchValue}
              />
            </div>
            <div className="switch-item">
              <Label htmlFor="switch-2">Switch 2</Label>
              <Switch 
                id="switch-2"
                disabled
              />
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="design-section">
          <h2 className="section-title">Spacing Scale</h2>
          <div className="spacing-examples">
            <div className="spacing-item">
              <div className="spacing-box spacing-xs"></div>
              <span>XS (4px)</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-box spacing-sm"></div>
              <span>SM (8px)</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-box spacing-md"></div>
              <span>MD (16px)</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-box spacing-lg"></div>
              <span>LG (24px)</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-box spacing-xl"></div>
              <span>XL (32px)</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystem; 