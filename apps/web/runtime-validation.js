/**
 * Runtime Validation Script - AlphaFrame VX.1 Production Readiness
 * 
 * Purpose: Comprehensive validation of runtime behavior, UI rendering, and user flows
 * Procedure: Automated testing of key application features and user journeys
 * Conclusion: Ensures customer-ready application quality and functionality
 */

import puppeteer from 'puppeteer';

/**
 * Runtime validation test suite
 */
class RuntimeValidator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Initialize browser and page
   */
  async init() {
    console.log('🚀 Starting runtime validation...');
    this.browser = await puppeteer.launch({ 
      headless: false, // Show browser for visual inspection
      defaultViewport: { width: 1280, height: 720 }
    });
    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
        this.results.errors.push(`Console Error: ${msg.text()}`);
      }
    });

    // Enable error logging
    this.page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
      this.results.errors.push(`Page Error: ${error.message}`);
    });
  }

  /**
   * Test application loading
   */
  async testApplicationLoad() {
    console.log('\n📱 Testing application load...');
    
    try {
      await this.page.goto('http://localhost:5173', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Check if page loads without errors
      const title = await this.page.title();
      console.log(`✅ Page loaded successfully. Title: ${title}`);
      
      // Check for React app mounting
      const appMounted = await this.page.evaluate(() => {
        return document.querySelector('[data-testid="page-mounted"]') !== null;
      });
      
      if (appMounted) {
        console.log('✅ React application mounted successfully');
        this.results.passed++;
      } else {
        console.log('❌ React application not mounted');
        this.results.failed++;
      }
      
    } catch (error) {
      console.log('❌ Failed to load application:', error.message);
      this.results.failed++;
      this.results.errors.push(`Load Error: ${error.message}`);
    }
  }

  /**
   * Test navigation and routing
   */
  async testNavigation() {
    console.log('\n🧭 Testing navigation...');
    
    try {
      // Test navigation to different pages
      const routes = ['/', '/about', '/alphapro'];
      
      for (const route of routes) {
        await this.page.goto(`http://localhost:5173${route}`, { 
          waitUntil: 'networkidle0' 
        });
        
        // Check if page content loads
        const content = await this.page.evaluate(() => {
          return document.body.textContent.length > 100;
        });
        
        if (content) {
          console.log(`✅ Route ${route} loaded successfully`);
          this.results.passed++;
        } else {
          console.log(`❌ Route ${route} failed to load content`);
          this.results.failed++;
        }
      }
      
    } catch (error) {
      console.log('❌ Navigation test failed:', error.message);
      this.results.failed++;
      this.results.errors.push(`Navigation Error: ${error.message}`);
    }
  }

  /**
   * Test UI component rendering
   */
  async testUIComponents() {
    console.log('\n🎨 Testing UI components...');
    
    try {
      await this.page.goto('http://localhost:5173', { 
        waitUntil: 'networkidle0' 
      });
      
      // Test various UI components
      const componentTests = [
        { selector: 'button', name: 'Buttons' },
        { selector: '.card, [class*="card"]', name: 'Cards' },
        { selector: 'input, select, textarea', name: 'Form Elements' },
        { selector: '[class*="badge"]', name: 'Badges' }
      ];
      
      for (const test of componentTests) {
        const elements = await this.page.$$(test.selector);
        if (elements.length > 0) {
          console.log(`✅ ${test.name} rendered (${elements.length} found)`);
          this.results.passed++;
        } else {
          console.log(`❌ ${test.name} not found`);
          this.results.failed++;
        }
      }
      
    } catch (error) {
      console.log('❌ UI component test failed:', error.message);
      this.results.failed++;
      this.results.errors.push(`UI Test Error: ${error.message}`);
    }
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign() {
    console.log('\n📱 Testing responsive design...');
    
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      try {
        await this.page.setViewport(viewport);
        await this.page.goto('http://localhost:5173', { 
          waitUntil: 'networkidle0' 
        });
        
        // Check if page renders without horizontal scroll
        const hasHorizontalScroll = await this.page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        if (!hasHorizontalScroll) {
          console.log(`✅ ${viewport.name} viewport renders correctly`);
          this.results.passed++;
        } else {
          console.log(`❌ ${viewport.name} viewport has horizontal scroll`);
          this.results.failed++;
        }
        
      } catch (error) {
        console.log(`❌ ${viewport.name} responsive test failed:`, error.message);
        this.results.failed++;
        this.results.errors.push(`${viewport.name} Responsive Error: ${error.message}`);
      }
    }
  }

  /**
   * Test user interactions
   */
  async testUserInteractions() {
    console.log('\n👆 Testing user interactions...');
    
    try {
      await this.page.goto('http://localhost:5173', { 
        waitUntil: 'networkidle0' 
      });
      
      // Test button clicks
      const buttons = await this.page.$$('button');
      if (buttons.length > 0) {
        await buttons[0].click();
        console.log('✅ Button click interaction works');
        this.results.passed++;
      }
      
      // Test form interactions
      const inputs = await this.page.$$('input');
      if (inputs.length > 0) {
        await inputs[0].type('test input');
        console.log('✅ Form input interaction works');
        this.results.passed++;
      }
      
    } catch (error) {
      console.log('❌ User interaction test failed:', error.message);
      this.results.failed++;
      this.results.errors.push(`Interaction Error: ${error.message}`);
    }
  }

  /**
   * Test performance metrics
   */
  async testPerformance() {
    console.log('\n⚡ Testing performance...');
    
    try {
      const startTime = Date.now();
      await this.page.goto('http://localhost:5173', { 
        waitUntil: 'networkidle0' 
      });
      const loadTime = Date.now() - startTime;
      
      if (loadTime < 5000) {
        console.log(`✅ Page load time: ${loadTime}ms (acceptable)`);
        this.results.passed++;
      } else {
        console.log(`❌ Page load time: ${loadTime}ms (too slow)`);
        this.results.failed++;
      }
      
      // Test memory usage
      const memoryInfo = await this.page.evaluate(() => {
        return performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize
        } : null;
      });
      
      if (memoryInfo) {
        console.log(`✅ Memory usage: ${Math.round(memoryInfo.used / 1024 / 1024)}MB`);
        this.results.passed++;
      }
      
    } catch (error) {
      console.log('❌ Performance test failed:', error.message);
      this.results.failed++;
      this.results.errors.push(`Performance Error: ${error.message}`);
    }
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log('\n📊 Runtime Validation Report');
    console.log('============================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n🚨 Errors Found:');
      this.results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    const isReady = this.results.failed === 0 && this.results.errors.length === 0;
    console.log(`\n🎯 Production Ready: ${isReady ? 'YES' : 'NO'}`);
    
    return {
      ...this.results,
      isReady
    };
  }

  /**
   * Cleanup
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

/**
 * Run validation suite
 */
async function runValidation() {
  const validator = new RuntimeValidator();
  
  try {
    await validator.init();
    await validator.testApplicationLoad();
    await validator.testNavigation();
    await validator.testUIComponents();
    await validator.testResponsiveDesign();
    await validator.testUserInteractions();
    await validator.testPerformance();
    
    const report = validator.generateReport();
    
    // Wait for manual inspection
    console.log('\n👀 Browser window will remain open for manual inspection...');
    console.log('Press Ctrl+C to close and complete validation');
    
    // Keep browser open for 30 seconds for manual inspection
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    return report;
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return { isReady: false, error: error.message };
  } finally {
    await validator.cleanup();
  }
}

// Export for use in other scripts
export { RuntimeValidator, runValidation };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runValidation().then(report => {
    process.exit(report.isReady ? 0 : 1);
  });
} 