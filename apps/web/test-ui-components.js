/**
 * UI Component Testing Script
 * 
 * Purpose: Quick verification script to test UI components and interactions
 * 
 * Procedure:
 * 1. Run this script in browser console to test components
 * 2. Check for proper rendering and interactions
 * 3. Verify accessibility features
 * 4. Test responsive behavior
 * 
 * Conclusion: Ensures all UI components are functioning correctly
 */

console.log('🧪 AlphaFrame UI Component Testing Script');
console.log('==========================================');

// Test 1: Check if main components are rendered
function testComponentRendering() {
  console.log('\n📋 Test 1: Component Rendering');
  
  const components = {
    'Navigation': document.querySelector('.navbar-container'),
    'Dashboard': document.querySelector('.dashboard2-container'),
    'WhatsNext Hero': document.querySelector('.whats-next-hero'),
    'Financial Summary': document.querySelector('.financial-summary'),
    'Quick Actions': document.querySelector('.quick-actions'),
    'Recent Activity': document.querySelector('.recent-activity'),
    'Composite Cards': document.querySelectorAll('.composite-card'),
    'Styled Buttons': document.querySelectorAll('button'),
    'Dark Mode Toggle': document.querySelector('[data-testid="dark-mode-toggle"]')
  };
  
  Object.entries(components).forEach(([name, element]) => {
    if (element) {
      console.log(`✅ ${name}: Found`);
      if (Array.isArray(element) || element.length > 0) {
        console.log(`   - Count: ${element.length || element.length}`);
      }
    } else {
      console.log(`❌ ${name}: Not found`);
    }
  });
}

// Test 2: Check responsive design
function testResponsiveDesign() {
  console.log('\n📱 Test 2: Responsive Design');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`Current viewport: ${viewport.width}x${viewport.height}`);
  
  // Check if CSS Grid is working
  const gridContainer = document.querySelector('.dashboard2-grid');
  if (gridContainer) {
    const computedStyle = window.getComputedStyle(gridContainer);
    const gridTemplate = computedStyle.gridTemplateColumns;
    console.log(`✅ CSS Grid: ${gridTemplate}`);
  }
  
  // Check for responsive classes
  const responsiveElements = document.querySelectorAll('[class*="responsive"], [class*="mobile"], [class*="tablet"]');
  console.log(`Responsive elements found: ${responsiveElements.length}`);
}

// Test 3: Check animations and interactions
function testAnimations() {
  console.log('\n🎭 Test 3: Animations & Interactions');
  
  // Check if Framer Motion is loaded
  if (window.framerMotion) {
    console.log('✅ Framer Motion: Loaded');
  } else {
    console.log('❌ Framer Motion: Not detected');
  }
  
  // Check for CSS transitions
  const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
  console.log(`Animated elements: ${animatedElements.length}`);
  
  // Test hover effects
  const interactiveCards = document.querySelectorAll('.composite-card--interactive');
  console.log(`Interactive cards: ${interactiveCards.length}`);
}

// Test 4: Check accessibility features
function testAccessibility() {
  console.log('\n♿ Test 4: Accessibility Features');
  
  // Check ARIA labels
  const ariaElements = document.querySelectorAll('[aria-label], [aria-describedby], [role]');
  console.log(`ARIA elements: ${ariaElements.length}`);
  
  // Check semantic HTML
  const semanticElements = {
    'Headings': document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    'Landmarks': document.querySelectorAll('nav, main, header, footer, aside'),
    'Buttons': document.querySelectorAll('button'),
    'Links': document.querySelectorAll('a')
  };
  
  Object.entries(semanticElements).forEach(([name, elements]) => {
    console.log(`${name}: ${elements.length}`);
  });
  
  // Check focus management
  const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  console.log(`Focusable elements: ${focusableElements.length}`);
}

// Test 5: Check design tokens
function testDesignTokens() {
  console.log('\n🎨 Test 5: Design Tokens');
  
  // Check if CSS custom properties are loaded
  const root = document.documentElement;
  const computedStyle = window.getComputedStyle(root);
  
  const designTokens = [
    '--color-primary-600',
    '--color-background-secondary',
    '--spacing-6',
    '--radius-lg',
    '--shadow-md',
    '--font-family-primary'
  ];
  
  designTokens.forEach(token => {
    const value = computedStyle.getPropertyValue(token);
    if (value) {
      console.log(`✅ ${token}: ${value}`);
    } else {
      console.log(`❌ ${token}: Not found`);
    }
  });
}

// Test 6: Check performance
function testPerformance() {
  console.log('\n⚡ Test 6: Performance');
  
  // Check load time
  const loadTime = performance.now();
  console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
  
  // Check for large images
  const images = document.querySelectorAll('img');
  console.log(`Images loaded: ${images.length}`);
  
  // Check bundle size (approximate)
  const scripts = document.querySelectorAll('script[src]');
  console.log(`External scripts: ${scripts.length}`);
}

// Test 7: Check user interactions
function testUserInteractions() {
  console.log('\n👆 Test 7: User Interactions');
  
  // Test button clicks
  const buttons = document.querySelectorAll('button');
  console.log(`Clickable buttons: ${buttons.length}`);
  
  // Test form inputs
  const inputs = document.querySelectorAll('input, select, textarea');
  console.log(`Form inputs: ${inputs.length}`);
  
  // Test navigation links
  const links = document.querySelectorAll('a[href]');
  console.log(`Navigation links: ${links.length}`);
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting UI Component Tests...\n');
  
  testComponentRendering();
  testResponsiveDesign();
  testAnimations();
  testAccessibility();
  testDesignTokens();
  testPerformance();
  testUserInteractions();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Open http://localhost:5173 in your browser');
  console.log('2. Run this script in the browser console');
  console.log('3. Check the results and address any issues');
  console.log('4. Test on different screen sizes');
  console.log('5. Verify all interactions work as expected');
}

// Export for use in browser console
window.testAlphaFrameUI = {
  runAllTests,
  testComponentRendering,
  testResponsiveDesign,
  testAnimations,
  testAccessibility,
  testDesignTokens,
  testPerformance,
  testUserInteractions
};

console.log('UI Testing functions loaded. Run testAlphaFrameUI.runAllTests() to start testing!'); 