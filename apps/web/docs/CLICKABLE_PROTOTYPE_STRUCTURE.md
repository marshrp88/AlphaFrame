# AlphaFrame Clickable Prototype Structure

**Purpose:** Validate user journey flow and navigation hierarchy through interactive prototype  
**Tool:** Figma (or design tool of choice)  
**Fidelity:** Low to medium - enough detail to test flow and navigation, not final design  

---

## **Prototype Screen Inventory**

### **Phase 1: Trust Establishment (Screens 1-3)**

#### **Screen 1: Landing Page**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame Logo                    [Login] [Sign Up]        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    "Automate your financial decisions with confidence"     │
│                                                             │
│    [Security Badge] [Privacy Badge] [Professional Design]  │
│                                                             │
│    "Trusted by 10,000+ users"                              │
│                                                             │
│                    [Start Your Financial Journey]          │
│                                                             │
│    How it works:                                           │
│    1. Connect your accounts                                │
│    2. Create automation rules                              │
│    3. Watch your finances improve                          │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Login button → Screen 2A (Login)
- Sign Up button → Screen 2B (Sign Up)
- "Start Your Financial Journey" → Screen 2B (Sign Up)

#### **Screen 2A: Login**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame Logo                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Welcome Back                             │
│                                                             │
│    Email: [________________]                                │
│    Password: [________________]                             │
│                                                             │
│    [Login with Google] [Login with Apple]                   │
│                                                             │
│                    [Sign In]                                │
│                                                             │
│    [Forgot Password?] [Don't have account? Sign Up]        │
│                                                             │
│    "Your data is encrypted and secure"                     │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Sign In → Screen 4 (Dashboard - returning user)
- Sign Up link → Screen 2B (Sign Up)
- Forgot Password → Screen 2C (Password Reset)

#### **Screen 2B: Sign Up**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame Logo                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Create Your Account                      │
│                                                             │
│    Full Name: [________________]                            │
│    Email: [________________]                                │
│    Password: [________________]                             │
│                                                             │
│    [Sign up with Google] [Sign up with Apple]               │
│                                                             │
│    [I agree to Terms & Privacy Policy]                     │
│                                                             │
│                    [Create Account]                         │
│                                                             │
│    [Already have account? Sign In]                          │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Create Account → Screen 3 (Welcome & Profile Setup)
- Sign In link → Screen 2A (Login)

---

### **Phase 2: Guided Onboarding (Screens 3-7)**

#### **Screen 3: Welcome & Profile Setup**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Welcome, [Name]! Let's set up your financial profile.   │
│                                                             │
│    Step 1 of 4: Basic Information                          │
│    [████████████████████████████████████████████████████]  │
│                                                             │
│    What's your primary financial goal?                     │
│    ○ Save more money                                       │
│    ○ Pay off debt                                          │
│    ○ Invest for the future                                 │
│    ○ Track spending better                                 │
│    ○ Other: [________________]                             │
│                                                             │
│    [Skip for now] [Continue]                               │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Continue → Screen 4 (Financial Goals)
- Skip for now → Screen 4 (Financial Goals)

#### **Screen 4: Financial Goals**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Step 2 of 4: Financial Goals                            │
│    [████████████████████████████████████████████████████]  │
│                                                             │
│    How much do you want to save monthly?                   │
│    $ [____]                                                │
│                                                             │
│    What's your risk tolerance?                             │
│    ○ Conservative (low risk, steady growth)                │
│    ○ Moderate (balanced risk and return)                   │
│    ○ Aggressive (higher risk, higher potential)            │
│                                                             │
│    [Back] [Continue]                                       │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Continue → Screen 5 (Account Connection)
- Back → Screen 3 (Welcome & Profile Setup)

#### **Screen 5: Account Connection**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Step 3 of 4: Connect Your Accounts                      │
│    [████████████████████████████████████████████████████]  │
│                                                             │
│    Connect your bank accounts to get started:              │
│                                                             │
│    [Connect Chase Bank] [Connect Bank of America]          │
│    [Connect Wells Fargo] [Connect Other Bank]              │
│                                                             │
│    "We use bank-level security. We can only read your      │
│     data, never make changes to your accounts."            │
│                                                             │
│    [Skip for now] [Continue]                               │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Any bank connection → Screen 6 (Connection Success)
- Skip for now → Screen 7 (First Rule Creation)
- Continue → Screen 7 (First Rule Creation)

#### **Screen 6: Connection Success**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ✓ Successfully connected Chase Bank                     │
│                                                             │
│    Account: ****1234                                        │
│    Balance: $2,450.67                                       │
│                                                             │
│    [Connect Another Account] [Continue to Rules]           │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Continue to Rules → Screen 7 (First Rule Creation)
- Connect Another Account → Screen 5 (Account Connection)

---

### **Phase 3: The "Aha!" Moment (Screens 7-10)**

#### **Screen 7: First Rule Creation**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Step 4 of 4: Create Your First Rule                     │
│    [████████████████████████████████████████████████████]  │
│                                                             │
│    Rules automate your financial decisions. Here's how:    │
│                                                             │
│    "When my checking account balance is above $1000,       │
│     automatically transfer $50 to savings"                 │
│                                                             │
│    [Use This Template] [Create Custom Rule] [Skip for Now] │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Use This Template → Screen 8 (Rule Configuration)
- Create Custom Rule → Screen 8 (Rule Configuration)
- Skip for Now → Screen 11 (Dashboard with Empty State)

#### **Screen 8: Rule Configuration**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Configure Your Rule                                      │
│                                                             │
│    When [checking account balance] [is above] [$1000]      │
│    Then [transfer] [$50] to [savings account]              │
│                                                             │
│    Preview: This rule will transfer $50 to savings         │
│    whenever your checking balance exceeds $1000.           │
│                                                             │
│    Estimated impact: Save $200-300 per month               │
│                                                             │
│    [Back] [Preview Rule] [Activate Rule]                   │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Activate Rule → Screen 9 (Rule Activation Success)
- Preview Rule → Screen 9 (Rule Preview)
- Back → Screen 7 (First Rule Creation)

#### **Screen 9: Rule Activation Success**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    🎉 Your First Rule is Active!                           │
│                                                             │
│    "Auto-Save Rule" is now monitoring your accounts        │
│    and will automatically transfer $50 to savings when     │
│    your checking balance exceeds $1000.                    │
│                                                             │
│    [View Dashboard] [Create Another Rule] [Learn More]     │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- View Dashboard → Screen 10 (Dashboard with Active Rule)
- Create Another Rule → Screen 8 (Rule Configuration)
- Learn More → Screen 12 (Rules Help)

---

### **Phase 4: Dashboard Engagement (Screens 10-13)**

#### **Screen 10: Dashboard with Active Rule**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Welcome back, [Name]!                                   │
│                                                             │
│    [Financial Summary Card]                                │
│    Checking: $2,450.67 | Savings: $1,200.00                │
│    Net Worth: $3,650.67 (+$200 this month)                 │
│                                                             │
│    [Active Rules Widget]                                   │
│    ✓ Auto-Save Rule (Active)                               │
│    Last triggered: 2 days ago                              │
│    Total saved: $150.00                                    │
│                                                             │
│    [Recent Activity]                                       │
│    • Auto-transfer to savings: $50 (2 days ago)            │
│    • Auto-transfer to savings: $50 (5 days ago)            │
│    • Auto-transfer to savings: $50 (8 days ago)            │
│                                                             │
│    [Create New Rule] [View All Rules] [See Insights]       │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Create New Rule → Screen 8 (Rule Configuration)
- View All Rules → Screen 13 (Rules Management)
- See Insights → Screen 14 (Financial Insights)
- Active Rules Widget → Screen 13 (Rules Management)

#### **Screen 11: Dashboard with Empty State**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Welcome to AlphaFrame!                                  │
│                                                             │
│    [Empty State Illustration]                              │
│                                                             │
│    You haven't created any rules yet.                      │
│    Rules help you automate your financial decisions        │
│    and reach your goals faster.                            │
│                                                             │
│    [Create Your First Rule] [View Templates] [Learn More]  │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Create Your First Rule → Screen 8 (Rule Configuration)
- View Templates → Screen 15 (Rule Templates)
- Learn More → Screen 12 (Rules Help)

#### **Screen 12: Rules Help**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    How Rules Work                                           │
│                                                             │
│    Rules are automated actions that happen when            │
│    certain conditions are met.                             │
│                                                             │
│    Examples:                                                │
│    • Save money when checking balance is high              │
│    • Pay extra on debt when income is above average        │
│    • Invest spare change from purchases                    │
│    • Alert when spending exceeds budget                    │
│                                                             │
│    [Back to Dashboard] [Create Your First Rule]            │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Back to Dashboard → Screen 10 (Dashboard with Active Rule)
- Create Your First Rule → Screen 8 (Rule Configuration)

---

### **Phase 5: Rules Management (Screens 13-15)**

#### **Screen 13: Rules Management**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Your Rules                                               │
│                                                             │
│    [Active Rules Tab] [Templates] [Analytics]              │
│                                                             │
│    ✓ Auto-Save Rule                                        │
│    When checking > $1000, transfer $50 to savings          │
│    Status: Active | Last triggered: 2 days ago             │
│    [Edit] [Pause] [Delete]                                 │
│                                                             │
│    [Create New Rule] [Import Template]                     │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Create New Rule → Screen 8 (Rule Configuration)
- Edit → Screen 16 (Edit Rule)
- Templates tab → Screen 15 (Rule Templates)
- Analytics tab → Screen 17 (Rule Analytics)

#### **Screen 14: Financial Insights**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Financial Insights                                       │
│                                                             │
│    [Spending Analysis] [Income Tracking] [Net Worth]       │
│                                                             │
│    Your spending patterns:                                 │
│    • 40% on housing                                        │
│    • 25% on food & dining                                   │
│    • 15% on transportation                                  │
│    • 20% on other                                          │
│                                                             │
│    [View Detailed Analysis] [Set Budget Goals]             │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- View Detailed Analysis → Screen 18 (Detailed Analysis)
- Set Budget Goals → Screen 19 (Budget Goals)

#### **Screen 15: Rule Templates**
```
┌─────────────────────────────────────────────────────────────┐
│ AlphaFrame                    [Dashboard] [Rules] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Rule Templates                                           │
│                                                             │
│    [Auto-Save] [Debt Payoff] [Investment] [Budget]         │
│                                                             │
│    Auto-Save Templates:                                     │
│    • Save when checking balance is high                     │
│    • Save spare change from purchases                       │
│    • Save percentage of income                              │
│                                                             │
│    [Use Template] [Customize] [Learn More]                 │
└─────────────────────────────────────────────────────────────┘
```

**Clickable Elements:**
- Use Template → Screen 8 (Rule Configuration)
- Customize → Screen 8 (Rule Configuration)

---

## **Prototype Navigation Map**

```
Landing (1) → Login (2A) → Dashboard (10)
     ↓
Sign Up (2B) → Welcome (3) → Goals (4) → Connect (5) → Success (6)
     ↓
First Rule (7) → Configure (8) → Success (9) → Dashboard (10)
     ↓
Rules Mgmt (13) → Templates (15) → Configure (8)
     ↓
Insights (14) → Analysis (18) → Goals (19)
```

---

## **Testing Scenarios**

### **Scenario 1: New User Journey**
1. Start at Landing Page (1)
2. Click "Start Your Financial Journey" → Sign Up (2B)
3. Complete signup → Welcome (3)
4. Complete onboarding → First Rule (7)
5. Create first rule → Dashboard (10)

### **Scenario 2: Returning User Journey**
1. Start at Login (2A)
2. Sign in → Dashboard (10)
3. Click "Create New Rule" → Configure (8)
4. Create rule → Dashboard (10)

### **Scenario 3: Rules Management**
1. Start at Dashboard (10)
2. Click "View All Rules" → Rules Mgmt (13)
3. Click "Templates" → Templates (15)
4. Use template → Configure (8)

### **Scenario 4: Financial Insights**
1. Start at Dashboard (10)
2. Click "See Insights" → Insights (14)
3. Click "View Detailed Analysis" → Analysis (18)

---

## **Success Metrics for Prototype Testing**

### **Usability Metrics**
- Task completion rate: 90%+
- Time to complete key tasks: <2 minutes
- Error rate: <5%
- User satisfaction: 4.5/5

### **Navigation Metrics**
- Users can find key features within 3 clicks
- No dead ends or broken flows
- Clear understanding of current location
- Intuitive next steps

### **Trust & Confidence Metrics**
- Users feel secure about data sharing
- Clear understanding of what AlphaFrame does
- Confidence in creating first rule
- Excitement about potential impact

---

This prototype structure provides a comprehensive framework for testing the user journey and navigation hierarchy. Each screen serves a specific purpose in the user flow, and the clickable elements guide users toward the key business goals of trust, activation, and engagement. 