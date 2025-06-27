# AlphaFrame Information Architecture & Navigation Hierarchy

**Strategic Foundation:** Business priorities in rank order: 1. Trust, 2. Rule Creation, 3. Dashboard Engagement  
**Design Principle:** Hierarchical navigation that guides users toward activation and engagement  
**User Goal:** Clear pathways to value with minimal cognitive load  

---

## **Primary Navigation Structure**

### **Always Visible: Core Value Drivers**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
└─────────────────────────────────────────────────────────────┘
```

**Rationale:** These three items represent the core user journey:
- **Dashboard:** Where users see results and engage with their financial story
- **Rules:** Where users create value (the "Aha!" moment)
- **Profile:** Where users manage trust and security settings

**Implementation:** Top-level navigation bar with clear, prominent buttons.

---

## **Secondary Navigation: User & System Management**

### **Profile Dropdown Menu**
```
Profile ▼
├── Account Settings
├── Security & Privacy
├── Connected Accounts
├── Notification Preferences
├── Help & Support
└── Sign Out
```

**Rationale:** Groups user-specific functions under a single, familiar pattern.

### **Contextual Secondary Navigation**
```
Dashboard
├── Overview (default view)
├── Rules Performance
├── Financial Insights
├── Goal Tracking
└── Activity History

Rules
├── Active Rules
├── Rule Templates
├── Rule Analytics
├── Create New Rule
└── Rule History
```

**Rationale:** Provides depth without overwhelming the primary navigation.

---

## **Tertiary Navigation: Contextual Links & Actions**

### **Dashboard Contextual Actions**
```
[Financial Summary Card]
├── View Details →
├── Edit Rules →
└── Set Goals →

[Active Rules Widget]
├── Manage Rules →
├── View Performance →
└── Create New →

[Recent Activity]
├── View All Activity →
├── Filter by Type →
└── Export Data →
```

### **Rules Contextual Actions**
```
[Rule Card]
├── Edit Rule →
├── View Performance →
├── Duplicate Rule →
├── Pause/Activate
└── Delete Rule

[Rule Creation Flow]
├── ← Back to Rules
├── Save Draft
├── Preview Rule
└── Activate Rule
```

---

## **Information Architecture: Content Hierarchy**

### **Level 1: Primary Pages**
```
1. Dashboard (Home)
   - Financial overview
   - Active rules summary
   - Recent activity
   - Quick actions

2. Rules
   - Rule management
   - Rule creation
   - Rule templates
   - Rule analytics

3. Profile & Settings
   - Account management
   - Security settings
   - Connected accounts
   - Preferences
```

### **Level 2: Secondary Pages**
```
Dashboard/
├── Overview (default)
├── Rules Performance
├── Financial Insights
├── Goal Tracking
└── Activity History

Rules/
├── Active Rules
├── Rule Templates
├── Rule Analytics
├── Create New Rule
└── Rule History

Profile/
├── Account Settings
├── Security & Privacy
├── Connected Accounts
├── Notification Preferences
└── Help & Support
```

### **Level 3: Detail Pages**
```
Dashboard/Financial Insights/
├── Spending Analysis
├── Income Tracking
├── Net Worth Trends
└── Cash Flow Analysis

Rules/Rule Analytics/
├── Performance Metrics
├── Trigger History
├── Impact Analysis
└── Optimization Suggestions

Profile/Security & Privacy/
├── Password Management
├── Two-Factor Authentication
├── Data Export
└── Account Deletion
```

---

## **Navigation Patterns & User Flows**

### **Primary User Flow: New User Activation**
```
Landing Page
    ↓
Authentication
    ↓
Onboarding Flow
    ├── Welcome & Profile Setup
    ├── Financial Goals
    ├── Account Connection
    └── First Rule Creation
    ↓
Dashboard (with first rule active)
    ↓
Rules (to create more rules)
    ↓
Dashboard (to see results)
```

### **Secondary User Flow: Returning User**
```
Dashboard (default landing)
    ↓
Quick Actions
    ├── Create New Rule
    ├── View Recent Activity
    ├── Check Goal Progress
    └── Manage Active Rules
    ↓
Contextual Navigation
    ├── Rule Performance
    ├── Financial Insights
    └── Settings
```

### **Tertiary User Flow: Power User**
```
Dashboard
    ↓
Rules Performance
    ↓
Rule Analytics
    ↓
Rule Optimization
    ↓
Advanced Rule Creation
    ↓
AlphaPro Features (conversion)
```

---

## **Breadcrumb Navigation**

### **Dashboard Breadcrumbs**
```
Home > Dashboard > Financial Insights > Spending Analysis
Home > Dashboard > Rules Performance > Rule Analytics
```

### **Rules Breadcrumbs**
```
Home > Rules > Active Rules > Edit Rule: "Save $50 when checking > $1000"
Home > Rules > Create New Rule > Rule Templates > Savings Template
```

### **Profile Breadcrumbs**
```
Home > Profile > Security & Privacy > Two-Factor Authentication
Home > Profile > Connected Accounts > Add New Account
```

---

## **Mobile Navigation Adaptation**

### **Primary Mobile Navigation**
```
┌─────────────────┐
│ [Dashboard]     │
│ [Rules]         │
│ [Profile]       │
│ [Create Rule +] │
└─────────────────┘
```

**Rationale:** Bottom navigation for thumb accessibility, with prominent "Create Rule" action.

### **Mobile Secondary Navigation**
```
Dashboard
├── Swipe between tabs
├── Pull to refresh
└── Long press for quick actions

Rules
├── Swipe to edit/delete
├── Pull to refresh
└── Floating action button for new rule
```

---

## **Search & Discovery**

### **Global Search**
```
Search: [Type to search rules, accounts, or help...]
├── Quick Results
│   ├── Active Rules
│   ├── Recent Activity
│   └── Help Articles
├── Advanced Search
│   ├── Filter by Date
│   ├── Filter by Type
│   └── Filter by Status
└── Search History
```

### **Smart Suggestions**
```
Dashboard Suggestions
├── "Create a rule to save when checking account > $2000"
├── "Connect your investment account for better insights"
└── "Set up a goal to save $5000 by end of year"

Rules Suggestions
├── "Based on your spending, try this savings rule"
├── "Optimize your existing rule for better results"
└── "Create a rule for your upcoming vacation"
```

---

## **Accessibility & Usability Considerations**

### **Keyboard Navigation**
```
Tab Order:
1. Primary Navigation (Dashboard, Rules, Profile)
2. Secondary Navigation (dropdowns, tabs)
3. Main Content Area
4. Contextual Actions
5. Footer Links
```

### **Screen Reader Support**
```
ARIA Labels:
- Primary nav: "Main navigation, Dashboard, Rules, Profile"
- Secondary nav: "Rules sub-navigation, Active Rules, Templates"
- Contextual actions: "Create new rule, Edit rule, View performance"
```

### **Focus Management**
```
- Focus moves to main content after navigation
- Focus returns to trigger after modal closes
- Focus indicators are clearly visible
- Skip links for main content
```

---

## **Analytics & Tracking Points**

### **Navigation Analytics**
```
Primary Navigation Clicks:
- Dashboard: Track engagement and return visits
- Rules: Track rule creation and management
- Profile: Track settings engagement

Secondary Navigation Clicks:
- Track which features are most used
- Identify user journey patterns
- Measure feature discovery rates
```

### **User Flow Analytics**
```
Conversion Funnels:
- Landing → Authentication: Trust establishment
- Authentication → First Rule: Activation
- First Rule → Dashboard: Engagement
- Dashboard → Return Visit: Retention
```

---

## **Implementation Guidelines**

### **React Router Structure**
```javascript
// Primary Routes
<Route path="/" element={<Dashboard />} />
<Route path="/rules" element={<Rules />} />
<Route path="/profile" element={<Profile />} />

// Secondary Routes
<Route path="/dashboard/insights" element={<FinancialInsights />} />
<Route path="/rules/create" element={<CreateRule />} />
<Route path="/profile/security" element={<SecuritySettings />} />
```

### **Navigation Component Structure**
```javascript
// Primary Navigation
<PrimaryNav>
  <NavItem to="/" icon="dashboard">Dashboard</NavItem>
  <NavItem to="/rules" icon="rules">Rules</NavItem>
  <NavItem to="/profile" icon="profile">Profile</NavItem>
</PrimaryNav>

// Secondary Navigation
<SecondaryNav>
  <TabNav items={dashboardTabs} />
  <BreadcrumbNav path={currentPath} />
</SecondaryNav>
```

---

This information architecture provides a clear, hierarchical structure that supports the business priorities while maintaining excellent usability and accessibility. The navigation guides users toward value creation while providing easy access to all necessary functions. 