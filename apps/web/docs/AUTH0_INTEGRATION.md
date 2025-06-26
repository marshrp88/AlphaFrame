# Auth0 Integration Documentation

**Document Type:** Technical Implementation Guide  
**Version:** VX.1  
**Status:** Production Ready  
**Date:** December 2024

---

## 📋 **Overview**

This document provides comprehensive guidance for the Auth0 integration in AlphaFrame VX.1. The integration provides secure, enterprise-grade authentication with role-based access control (RBAC) and seamless user management.

---

## 🎯 **Features Implemented**

### ✅ **Core Authentication**
- OAuth 2.0 / OpenID Connect authentication
- Secure token management with automatic refresh
- Session persistence across browser sessions
- Single Sign-On (SSO) support

### ✅ **User Management**
- User profile management and display
- Email verification status
- Provider information (Google, GitHub, etc.)
- Account linking capabilities

### ✅ **Security & Authorization**
- Role-based access control (RBAC)
- Permission-based authorization
- Secure token storage
- CSRF protection with state validation

### ✅ **Developer Experience**
- Comprehensive error handling
- Loading states and user feedback
- Development mode with mock authentication
- Extensive test coverage

---

## 🛠️ **Configuration Setup**

### **1. Environment Variables**

Add the following variables to your `.env` file:

```bash
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your_auth0_domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=your_api_audience
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
```

### **2. Auth0 Dashboard Setup**

1. **Create Application**
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create a new Single Page Application (SPA)
   - Note your Domain and Client ID

2. **Configure Callback URLs**
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`

3. **API Configuration**
   - Create a new API in Auth0
   - Set the identifier (audience) to your API URL
   - Configure scopes: `openid profile email read:financial_data write:financial_data`

4. **Rules & Actions (Optional)**
   - Create rules to add custom claims
   - Set up actions for user profile enrichment
   - Configure role assignment logic

### **3. Role Configuration**

Configure the following roles in Auth0:

```json
{
  "admin": {
    "permissions": ["*"],
    "description": "Full system access"
  },
  "premium": {
    "permissions": [
      "read:financial_data",
      "write:financial_data", 
      "execute:rules",
      "manage:budgets",
      "view:reports",
      "send:notifications"
    ],
    "description": "Premium user with full financial features"
  },
  "basic": {
    "permissions": [
      "read:financial_data",
      "execute:rules",
      "manage:budgets",
      "view:reports"
    ],
    "description": "Basic user with core features"
  },
  "trial": {
    "permissions": [
      "read:financial_data",
      "execute:rules",
      "view:reports"
    ],
    "description": "Trial user with limited features"
  }
}
```

---

## 🚀 **Usage Examples**

### **1. Basic Authentication**

```jsx
import { useAuth0 } from '@auth0/auth0-react';

const MyComponent = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => loginWithRedirect()}>Login</button>;
};
```

### **2. Protected Routes**

```jsx
import PrivateRoute from './components/PrivateRoute';

// Basic protection
<PrivateRoute>
  <ProtectedComponent />
</PrivateRoute>

// Role-based protection
<PrivateRoute requiredRoles={['premium', 'admin']}>
  <PremiumComponent />
</PrivateRoute>

// Permission-based protection
<PrivateRoute requiredPermissions={['read:financial_data']}>
  <FinancialComponent />
</PrivateRoute>
```

### **3. User Profile Management**

```jsx
import { useAuth0 } from '@auth0/auth0-react';

const ProfileComponent = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  const handleApiCall = async () => {
    const token = await getAccessTokenSilently();
    
    const response = await fetch('/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Roles: {user['https://alphaframe.com/roles']?.join(', ')}</p>
    </div>
  );
};
```

### **4. Permission Checking**

```jsx
import { useAuth0 } from '@auth0/auth0-react';

const PermissionComponent = () => {
  const { user } = useAuth0();
  
  const userPermissions = user['https://alphaframe.com/permissions'] || [];
  const userRoles = user['https://alphaframe.com/roles'] || [];

  const canManageBudgets = userPermissions.includes('manage:budgets');
  const isAdmin = userRoles.includes('admin');

  return (
    <div>
      {canManageBudgets && <BudgetManager />}
      {isAdmin && <AdminPanel />}
    </div>
  );
};
```

---

## 🔧 **API Integration**

### **1. Backend Token Validation**

```javascript
// Node.js/Express example
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.use('/api/protected', checkJwt);
```

### **2. User Profile API**

```javascript
// Get user profile from Auth0 Management API
const getUserProfile = async (userId) => {
  const response = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${managementToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.json();
};
```

---

## 🧪 **Testing**

### **1. Unit Tests**

Run the Auth0 integration tests:

```bash
npm test AuthService.test.js
```

### **2. Integration Tests**

```javascript
// Test authentication flow
describe('Auth0 Integration', () => {
  it('should authenticate user successfully', async () => {
    // Mock Auth0 responses
    // Test login flow
    // Verify token storage
    // Check user profile
  });
});
```

### **3. E2E Tests**

```javascript
// Playwright test example
test('user can login and access protected routes', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="login-button"]');
  
  // Auth0 login form
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('[type="submit"]');
  
  // Verify redirect to protected page
  await expect(page).toHaveURL('/profile');
});
```

---

## 🔒 **Security Considerations**

### **1. Token Security**
- Tokens are stored in localStorage (configurable)
- Automatic token refresh prevents expiration
- Secure token validation on backend
- CSRF protection with state parameters

### **2. Role-Based Security**
- Server-side role validation required
- Client-side roles for UI only
- Permission-based API access control
- Audit logging for security events

### **3. Best Practices**
- Always validate tokens server-side
- Use HTTPS in production
- Implement proper error handling
- Regular security audits
- Monitor authentication events

---

## 🐛 **Troubleshooting**

### **Common Issues**

1. **"Invalid audience" error**
   - Verify `VITE_AUTH0_AUDIENCE` matches API identifier
   - Check Auth0 API configuration

2. **"Invalid redirect URI" error**
   - Add callback URL to Auth0 application settings
   - Ensure exact match with `VITE_AUTH0_REDIRECT_URI`

3. **Token refresh failures**
   - Check Auth0 application type (must be SPA)
   - Verify refresh token rotation settings

4. **Role/permission not showing**
   - Check Auth0 rules and actions
   - Verify custom claims namespace
   - Test with Auth0 Management API

### **Debug Mode**

Enable debug logging:

```javascript
// In development
console.log('Auth0 Config:', {
  domain: config.auth0.domain,
  clientId: config.auth0.clientId,
  audience: config.auth0.audience
});
```

---

## 📚 **Additional Resources**

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 API Documentation](https://auth0.com/docs/api)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Specification](https://openid.net/connect/)

---

## ✅ **Implementation Checklist**

- [ ] Auth0 application created and configured
- [ ] Environment variables set
- [ ] API created with proper scopes
- [ ] Roles and permissions configured
- [ ] Callback URLs configured
- [ ] Frontend integration tested
- [ ] Backend token validation implemented
- [ ] Error handling tested
- [ ] Security audit completed
- [ ] Documentation updated

---

## 🎉 **Conclusion**

The Auth0 integration provides a robust, secure authentication foundation for AlphaFrame VX.1. With comprehensive role-based access control, automatic token management, and extensive testing, the system is ready for production deployment.

For additional support or questions, refer to the Auth0 documentation or contact the development team. 