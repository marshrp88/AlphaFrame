# AlphaFrame VX.1 - User-Centric Copy for Key Screens
## Final Copy for All UI Elements Based on Design Specifications

**Document Type:** User-Centric Copy Guide  
**Version:** X.1 (Implementation-Ready)  
**Objective:** Provide final, user-centric copy for every element on the four key screens  
**Brand Goal:** Clear, confident, and approachable communication

---

## **Screen 1: Narrative Dashboard**

### **Page Header**
- **Title:** "Your Financial Dashboard"
- **Subtitle:** "Here's what's happening with your money today"

### **WhatsNext Hero Section**
- **Title:** "What's Next"
- **Description:** "Based on your spending patterns, here's what we recommend for this week"
- **Action Button:** "See Details"
- **Alternative States:**
  - **No Data:** "Connect your accounts to see personalized recommendations"
  - **Loading:** "Analyzing your finances..."

### **Financial Summary Card**
- **Title:** "This Month's Overview"
- **Metrics:**
  - **Income:** "Money Coming In"
  - **Spending:** "Money Going Out"
  - **Savings:** "Money Saved"
- **Subtitle:** "Compared to last month"
- **Positive Change:** "You're doing great! [X%] better than last month"
- **Negative Change:** "You spent [X%] more this month. Here are some tips to help"

### **Quick Actions Card**
- **Title:** "Quick Actions"
- **Actions:**
  - **Add Transaction:** "Add a transaction"
  - **Create Rule:** "Set up a new rule"
  - **View Reports:** "See detailed reports"
  - **Export Data:** "Download your data"

### **Recent Activity Card**
- **Title:** "Recent Activity"
- **Empty State:** "No recent activity. Connect your accounts to see your transactions"
- **Transaction Items:**
  - **Format:** "[Merchant] - [Amount] - [Date]"
  - **Example:** "Grocery Store - $45.67 - 2 hours ago"

### **Navigation Elements**
- **Dashboard Tab:** "Dashboard"
- **Rules Tab:** "Rules"
- **Profile Tab:** "Profile"
- **Settings Tab:** "Settings"

---

## **Screen 2: Guided Onboarding Flow**

### **Progress Indicator**
- **Step 1:** "Welcome"
- **Step 2:** "Connect Accounts"
- **Step 3:** "Set Goals"
- **Step 4:** "Complete"

### **Step 1: Welcome**
- **Title:** "Welcome to AlphaFrame"
- **Subtitle:** "Your journey to financial confidence starts here"
- **Description:** "AlphaFrame helps you understand your money, set goals, and make smart financial decisions. We'll guide you through connecting your accounts and setting up your financial dashboard."
- **Primary Button:** "Get Started"
- **Secondary Button:** "Learn More"
- **Learn More Content:** "See how AlphaFrame helps thousands of people take control of their finances with simple, powerful tools."

### **Step 2: Connect Accounts**
- **Title:** "Connect Your Financial Accounts"
- **Subtitle:** "We'll help you see your complete financial picture"
- **Description:** "Connect securely with your bank, credit cards, and investment accounts. We use bank-level security to keep your information safe."
- **Account Types:**
  - **Banking:** "Checking & Savings"
  - **Credit Cards:** "Credit Cards"
  - **Investments:** "Investment Accounts"
- **Security Note:** "Bank-level security • Read-only access • Your data stays private"
- **Primary Button:** "Connect Accounts"
- **Skip Option:** "I'll do this later"
- **Skip Message:** "You can always connect your accounts later from your settings."

### **Step 3: Set Goals**
- **Title:** "What are your financial goals?"
- **Subtitle:** "We'll personalize your experience based on your priorities"
- **Goal Cards:**
  - **Emergency Fund:** "Build an emergency fund"
  - **Debt Payoff:** "Pay off debt faster"
  - **Retirement Planning:** "Plan for retirement"
  - **Home Purchase:** "Save for a home"
  - **Investment Growth:** "Grow my investments"
- **Description:** "Select the goals that matter most to you. We'll help you track your progress and suggest ways to reach them faster."
- **Primary Button:** "Continue"
- **Back Button:** "Previous"

### **Step 4: Complete Setup**
- **Title:** "You're all set!"
- **Subtitle:** "Let's explore your financial dashboard"
- **Success Message:** "Your accounts are connected and your goals are set. We're ready to help you take control of your finances."
- **Dashboard Preview:** "Here's what you'll see on your dashboard:"
- **Preview Items:**
  - "Your financial overview"
  - "Personalized recommendations"
  - "Progress toward your goals"
- **Primary Button:** "Go to Dashboard"

---

## **Screen 3: Rules Page**

### **Page Header**
- **Title:** "FrameSync Rules"
- **Subtitle:** "Set up rules to automatically manage your money"
- **Create Button:** "Create Rule"

### **Empty State (Primary View)**
- **Icon:** Settings gear with "Set up your first rule" text
- **Title:** "Create Your First Rule"
- **Description:** "Rules automatically monitor your finances and take action when conditions are met. They help you save money and stay on track with your goals."
- **Example:** "Example: Transfer $500 to savings when checking balance exceeds $5,000"
- **Primary Button:** "Create Rule"
- **Help Text:** "Rules run automatically in the background, so you don't have to think about them."

### **Rules List State**
- **Header:** "Your Rules" with count (e.g., "3 active rules")
- **Rule Cards:**
  - **Rule Name:** User-defined name
  - **Trigger Description:** "When [condition]"
  - **Action Description:** "Then [action]"
  - **Status:** "Active" or "Paused"
  - **Last Run:** "Last ran [time]"
  - **Edit Button:** "Edit"
  - **Delete Button:** "Delete"
- **Empty List:** "No rules yet. Create your first rule to start automating your finances."

### **Rule Creation Modal**
- **Header:** "Create New Rule"
- **Close Button:** "×"
- **Form Fields:**
  - **Rule Name Label:** "Rule Name"
  - **Rule Name Placeholder:** "e.g., Save when I have extra money"
  - **Trigger Label:** "When this happens"
  - **Trigger Options:**
    - "My checking balance is above $[amount]"
    - "I receive a paycheck"
    - "My credit card balance is below $[amount]"
    - "My savings are below $[amount]"
  - **Action Label:** "Then do this"
  - **Action Options:**
    - "Transfer $[amount] to savings"
    - "Transfer $[amount] to [account]"
    - "Send me a notification"
    - "Create a budget alert"
  - **Frequency Label:** "How often should this run?"
  - **Frequency Options:**
    - "Once when condition is met"
    - "Every time condition is met"
    - "Once per day when condition is met"
- **Buttons:** "Cancel" (secondary), "Create Rule" (primary)
- **Help Text:** "Rules help you save money automatically. You can always edit or pause them later."

### **Rule Edit Modal**
- **Header:** "Edit Rule"
- **Same fields as creation modal**
- **Buttons:** "Cancel" (secondary), "Save Changes" (primary), "Delete Rule" (destructive)

---

## **Screen 4: Profile/Settings Page**

### **Profile Header**
- **Name:** User's full name
- **Email:** User's email address
- **Verification Badge:** "✓ Email Verified" (if applicable)
- **Account Type:** "Free Account" or "Pro Account"

### **Account Information Section**
- **Title:** "Account Information"
- **Fields:**
  - **Full Name Label:** "Full Name"
  - **Full Name Placeholder:** "Enter your full name"
  - **Email Label:** "Email Address"
  - **Email Note:** "This email is used for login and notifications"
  - **User ID Label:** "User ID"
  - **User ID Note:** "Your unique account identifier"
  - **Account Type Label:** "Account Type"
  - **Account Type Note:** "Your current plan and features"
- **Save Button:** "Save Changes"
- **Saved Message:** "Changes saved successfully"

### **Security Section**
- **Title:** "Security & Privacy"
- **Options:**
  - **Change Password:** "Change Password"
  - **Password Description:** "Update your login password"
  - **Two-Factor Authentication:** "Two-Factor Authentication"
  - **2FA Description:** "Add an extra layer of security to your account"
  - **2FA Enabled:** "Enabled - SMS verification"
  - **2FA Disabled:** "Disabled - Recommended for added security"
  - **Session Management:** "Active Sessions"
  - **Session Description:** "See and manage devices signed into your account"
  - **Privacy Settings:** "Privacy Settings"
  - **Privacy Description:** "Control how your data is used and shared"

### **Preferences Section**
- **Title:** "Preferences"
- **Options:**
  - **Theme Label:** "Theme"
  - **Theme Options:** "Light", "Dark", "Auto"
  - **Theme Description:** "Choose your preferred appearance"
  - **Notifications Label:** "Notifications"
  - **Notifications Description:** "Manage email and push notifications"
  - **Language Label:** "Language"
  - **Language Options:** "English", "Spanish", "French"
  - **Language Description:** "Choose your preferred language"
  - **Currency Label:** "Currency"
  - **Currency Options:** "USD ($)", "EUR (€)", "GBP (£)"
  - **Currency Description:** "Display currency for your financial data"

### **Actions Section**
- **Title:** "Account Actions"
- **Options:**
  - **Manage Account:** "Manage Account"
  - **Manage Description:** "Update billing information and subscription"
  - **Export Data:** "Export My Data"
  - **Export Description:** "Download a copy of your financial data"
  - **Delete Account:** "Delete Account"
  - **Delete Description:** "Permanently delete your account and all data"
- **Logout Button:** "Logout"
- **Logout Description:** "Sign out of your account"

### **Help & Support Section**
- **Title:** "Help & Support"
- **Options:**
  - **Help Center:** "Help Center"
  - **Help Description:** "Find answers to common questions"
  - **Contact Support:** "Contact Support"
  - **Contact Description:** "Get help from our support team"
  - **Privacy Policy:** "Privacy Policy"
  - **Terms of Service:** "Terms of Service"
  - **Security:** "Security Information"

---

## **Common UI Elements**

### **Buttons**
- **Primary Actions:** "Save", "Continue", "Create", "Connect"
- **Secondary Actions:** "Cancel", "Back", "Skip", "Learn More"
- **Destructive Actions:** "Delete", "Remove", "Logout"
- **Loading States:** "Saving...", "Connecting...", "Creating..."

### **Form Labels & Placeholders**
- **Name Fields:** "Full Name", "First Name", "Last Name"
- **Email Fields:** "Email Address", "Enter your email"
- **Password Fields:** "Password", "Enter your password"
- **Amount Fields:** "Amount", "Enter amount"
- **Date Fields:** "Date", "Select date"

### **Status Messages**
- **Success:** "Successfully saved", "Account connected", "Rule created"
- **Error:** "Something went wrong", "Please try again", "Unable to connect"
- **Loading:** "Please wait...", "Working on it...", "Almost done..."
- **Empty:** "No data yet", "Get started by...", "Nothing to show"

### **Tooltips & Help Text**
- **Security:** "Your data is encrypted and secure"
- **Privacy:** "We never share your personal information"
- **Connectivity:** "We use bank-level security to connect your accounts"
- **Automation:** "Rules run automatically in the background"

---

## **Error Messages & Empty States**

### **Connection Errors**
- **Bank Connection Failed:** "We couldn't connect to your bank. Please check your credentials and try again."
- **Network Error:** "Connection failed. Please check your internet connection and try again."
- **Account Not Found:** "We couldn't find that account. Please verify the account information."

### **Data Loading Errors**
- **No Data Available:** "No financial data available yet. Connect your accounts to get started."
- **Data Sync Failed:** "We couldn't update your data. We'll try again automatically."
- **Historical Data:** "Limited historical data available. Your data will become more complete over time."

### **Rule Errors**
- **Rule Creation Failed:** "We couldn't create your rule. Please check the details and try again."
- **Rule Execution Failed:** "Your rule couldn't run. We'll try again automatically."
- **Insufficient Funds:** "Not enough money available to complete this transfer."

---

This user-centric copy guide provides the complete language framework for all four key screens, ensuring every element communicates clearly, builds trust, and embodies the "Calm Confidence" brand goal. 