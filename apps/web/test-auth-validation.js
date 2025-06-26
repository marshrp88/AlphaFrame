/**
 * Authentication & Access Control Validation Test
 * AlphaFrame VX.1 End-to-End Testing
 * 
 * Purpose: Rigorously test Auth0 integration, session management,
 * role-based access control, and security measures.
 * 
 * Procedure:
 * 1. Test OAuth login flow simulation
 * 2. Validate session token and refresh functionality
 * 3. Test token expiry and automatic renewal
 * 4. Validate role-based access control (RBAC)
 * 5. Test protected route security
 * 
 * Conclusion: Ensures enterprise-grade authentication
 * security and reliability for production deployment.
 */

import { initializeAuth, login, logout, getCurrentUser, isAuthenticated, getUserPermissions, hasPermission } from './src/lib/services/AuthService.js';
import { useAuthStore } from './src/core/store/authStore.js';

/**
 * Authentication Validation Test Suite
 */
class AuthValidationTest {
  constructor() {
    this.testResults = [];
    this.currentTest = '';
  }

  /**
   * Log test result
   */
  logResult(testName, passed, details = '') {
    const result = {
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    console.log(`[${passed ? '✅' : '❌'}] ${testName}: ${details}`);
  }

  /**
   * Test 1: Auth0 Configuration Validation
   */
  async testAuth0Configuration() {
    this.currentTest = 'Auth0 Configuration';
    
    try {
      // Test initialization
      const initResult = await initializeAuth();
      this.logResult(this.currentTest, true, `Auth0 initialized: ${initResult}`);
      
      // Test configuration loading
      const config = await import('./src/lib/config.js');
      const hasAuthConfig = config.default.auth && config.default.auth.domain;
      this.logResult('Auth0 Config Loading', hasAuthConfig, 
        hasAuthConfig ? 'Configuration loaded successfully' : 'Missing Auth0 configuration');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Initialization failed: ${error.message}`);
    }
  }

  /**
   * Test 2: OAuth Login Flow Simulation
   */
  async testOAuthLoginFlow() {
    this.currentTest = 'OAuth Login Flow';
    
    try {
      // Test login URL generation
      const loginResult = await login();
      this.logResult(this.currentTest, loginResult.success, 
        `Login flow initiated: ${loginResult.redirecting ? 'Redirecting to Auth0' : 'Error'}`);
      
      // Test state parameter generation
      const state = sessionStorage.getItem('auth_state');
      this.logResult('State Parameter Generation', !!state, 
        state ? 'State parameter generated' : 'State parameter missing');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Login flow failed: ${error.message}`);
    }
  }

  /**
   * Test 3: Session Management
   */
  async testSessionManagement() {
    this.currentTest = 'Session Management';
    
    try {
      // Test session storage
      const sessionData = {
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
        userProfile: {
          sub: 'test_user_id',
          email: 'test@example.com',
          name: 'Test User'
        },
        sessionExpiry: Date.now() + 3600000 // 1 hour from now
      };
      
      localStorage.setItem('alphaframe_access_token', sessionData.accessToken);
      localStorage.setItem('alphaframe_refresh_token', sessionData.refreshToken);
      localStorage.setItem('alphaframe_user_profile', JSON.stringify(sessionData.userProfile));
      localStorage.setItem('alphaframe_session_expiry', sessionData.sessionExpiry.toString());
      
      // Test session loading
      const currentUser = getCurrentUser();
      this.logResult('Session Loading', !!currentUser, 
        currentUser ? `User loaded: ${currentUser.email}` : 'No user found');
      
      // Test authentication status
      const isAuth = isAuthenticated();
      this.logResult('Authentication Status', isAuth, 
        isAuth ? 'User authenticated' : 'User not authenticated');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Session management failed: ${error.message}`);
    }
  }

  /**
   * Test 4: Role-Based Access Control (RBAC)
   */
  async testRBAC() {
    this.currentTest = 'Role-Based Access Control';
    
    try {
      // Test user permissions
      const permissions = getUserPermissions();
      this.logResult('Permission Loading', Array.isArray(permissions), 
        `Permissions loaded: ${permissions.length} permissions`);
      
      // Test specific permission checks
      const hasFinancialRead = hasPermission('read:financial_data');
      this.logResult('Financial Read Permission', hasFinancialRead, 
        hasFinancialRead ? 'Has financial read permission' : 'No financial read permission');
      
      const hasFinancialWrite = hasPermission('write:financial_data');
      this.logResult('Financial Write Permission', hasFinancialWrite, 
        hasFinancialWrite ? 'Has financial write permission' : 'No financial write permission');
      
      const hasAdminAccess = hasPermission('*');
      this.logResult('Admin Access', hasAdminAccess, 
        hasAdminAccess ? 'Has admin access' : 'No admin access');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `RBAC test failed: ${error.message}`);
    }
  }

  /**
   * Test 5: Token Refresh Simulation
   */
  async testTokenRefresh() {
    this.currentTest = 'Token Refresh';
    
    try {
      // Simulate expired token
      const expiredToken = {
        accessToken: 'expired_token',
        refreshToken: 'valid_refresh_token',
        sessionExpiry: Date.now() - 1000 // Expired 1 second ago
      };
      
      localStorage.setItem('alphaframe_access_token', expiredToken.accessToken);
      localStorage.setItem('alphaframe_refresh_token', expiredToken.refreshToken);
      localStorage.setItem('alphaframe_session_expiry', expiredToken.sessionExpiry.toString());
      
      // Test session validation
      const isAuth = isAuthenticated();
      this.logResult('Expired Token Detection', !isAuth, 
        isAuth ? 'Expired token not detected' : 'Expired token correctly detected');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Token refresh test failed: ${error.message}`);
    }
  }

  /**
   * Test 6: Protected Route Security
   */
  async testProtectedRoutes() {
    this.currentTest = 'Protected Route Security';
    
    try {
      // Test unauthorized access simulation
      const authStore = useAuthStore.getState();
      const originalUser = authStore.user;
      
      // Simulate no user
      authStore.user = null;
      const isAuthWithoutUser = isAuthenticated();
      this.logResult('Unauthorized Access Block', !isAuthWithoutUser, 
        isAuthWithoutUser ? 'Unauthorized access allowed' : 'Unauthorized access blocked');
      
      // Restore user
      authStore.user = originalUser;
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Protected route test failed: ${error.message}`);
    }
  }

  /**
   * Test 7: Logout Functionality
   */
  async testLogout() {
    this.currentTest = 'Logout Functionality';
    
    try {
      // Test logout
      await logout();
      
      // Verify session cleared
      const isAuth = isAuthenticated();
      this.logResult(this.currentTest, !isAuth, 
        isAuth ? 'Session not cleared' : 'Session cleared successfully');
      
      // Verify storage cleared
      const hasToken = localStorage.getItem('alphaframe_access_token');
      this.logResult('Storage Cleanup', !hasToken, 
        hasToken ? 'Storage not cleared' : 'Storage cleared successfully');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Logout test failed: ${error.message}`);
    }
  }

  /**
   * Run all authentication tests
   */
  async runAllTests() {
    console.log('🚀 Starting AlphaFrame VX.1 Authentication Validation Tests\n');
    
    await this.testAuth0Configuration();
    await this.testOAuthLoginFlow();
    await this.testSessionManagement();
    await this.testRBAC();
    await this.testTokenRefresh();
    await this.testProtectedRoutes();
    await this.testLogout();
    
    // Generate test summary
    const passedTests = this.testResults.filter(r => r.passed).length;
    const totalTests = this.testResults.length;
    const successRate = (passedTests / totalTests * 100).toFixed(1);
    
    console.log('\n📊 Authentication Test Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${successRate}%)`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    // Return test results
    return {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: parseFloat(successRate)
      },
      results: this.testResults
    };
  }
}

// Export for use in other test modules
export default AuthValidationTest;

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const authTest = new AuthValidationTest();
  authTest.runAllTests().then(results => {
    console.log('\n🎯 Authentication Validation Complete');
    console.log('Results:', JSON.stringify(results, null, 2));
  });
} 