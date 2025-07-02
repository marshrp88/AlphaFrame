/**
 * NotificationService.js - Enhanced Alerting System
 * 
 * Purpose: Provide comprehensive notification system for rule triggers, including
 * email, SMS, and in-app alerts with customizable preferences and delivery methods.
 * 
 * Procedure:
 * 1. Handle multiple notification channels (email, SMS, in-app)
 * 2. Manage user notification preferences and delivery schedules
 * 3. Process rule triggers and generate appropriate alert messages
 * 4. Implement rate limiting and notification batching
 * 5. Track notification delivery and user engagement
 * 
 * Conclusion: Provides professional-grade alerting system that keeps users
 * informed about their financial automation without overwhelming them.
 */

class NotificationService {
  constructor() {
    this.preferences = this.loadPreferences();
    this.notificationQueue = [];
    this.isProcessing = false;
    this.lastNotificationTime = {};
  }

  /**
   * Load user notification preferences from localStorage
   * @returns {Object} User preferences
   */
  loadPreferences() {
    const defaultPreferences = {
      email: {
        enabled: true,
        frequency: 'immediate', // immediate, daily, weekly
        types: ['rule_triggers', 'balance_alerts', 'spending_alerts']
      },
      sms: {
        enabled: false,
        frequency: 'immediate',
        types: ['critical_alerts', 'balance_alerts']
      },
      inApp: {
        enabled: true,
        frequency: 'immediate',
        types: ['rule_triggers', 'balance_alerts', 'spending_alerts', 'insights']
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: 'local'
      },
      rateLimit: {
        maxPerHour: 5,
        maxPerDay: 20
      }
    };

    const stored = localStorage.getItem('alphaframe_notification_preferences');
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  }

  /**
   * Save notification preferences to localStorage
   * @param {Object} preferences - Updated preferences
   */
  savePreferences(preferences) {
    this.preferences = { ...this.preferences, ...preferences };
    localStorage.setItem('alphaframe_notification_preferences', JSON.stringify(this.preferences));
  }

  /**
   * Check if notifications should be sent during quiet hours
   * @returns {boolean} Whether notifications are allowed
   */
  isQuietHours() {
    if (!this.preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.preferences.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.preferences.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  /**
   * Check rate limiting for notification type
   * @param {string} type - Notification type
   * @returns {boolean} Whether notification is allowed
   */
  isRateLimited(type) {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    const dayAgo = now - (24 * 60 * 60 * 1000);

    if (!this.lastNotificationTime[type]) {
      this.lastNotificationTime[type] = [];
    }

    // Clean old timestamps
    this.lastNotificationTime[type] = this.lastNotificationTime[type].filter(
      time => time > hourAgo
    );

    const hourlyCount = this.lastNotificationTime[type].length;
    const dailyCount = this.lastNotificationTime[type].filter(time => time > dayAgo).length;

    return hourlyCount >= this.preferences.rateLimit.maxPerHour ||
           dailyCount >= this.preferences.rateLimit.maxPerDay;
  }

  /**
   * Record notification sent for rate limiting
   * @param {string} type - Notification type
   */
  recordNotification(type) {
    if (!this.lastNotificationTime[type]) {
      this.lastNotificationTime[type] = [];
    }
    this.lastNotificationTime[type].push(Date.now());
  }

  /**
   * Send notification through specified channel
   * @param {Object} notification - Notification object
   * @param {string} channel - Notification channel (email, sms, inApp)
   * @returns {Promise<boolean>} Success status
   */
  async sendNotification(notification, channel) {
    try {
      switch (channel) {
        case 'email':
          return await this.sendEmail(notification);
        case 'sms':
          return await this.sendSMS(notification);
        case 'inApp':
          return await this.sendInApp(notification);
        default:
          console.warn(`Unknown notification channel: ${channel}`);
          return false;
      }
    } catch (error) {
      console.error(`Error sending ${channel} notification:`, error);
      return false;
    }
  }

  /**
   * Send email notification (mock implementation)
   * @param {Object} notification - Notification object
   * @returns {Promise<boolean>} Success status
   */
  async sendEmail(notification) {
    // In production, this would integrate with SendGrid, Mailgun, etc.
    console.log('📧 Email notification sent:', {
      to: notification.user.email,
      subject: notification.subject,
      message: notification.message,
      priority: notification.priority
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Store notification history
    this.storeNotificationHistory(notification, 'email');
    
    return true;
  }

  /**
   * Send SMS notification (mock implementation)
   * @param {Object} notification - Notification object
   * @returns {Promise<boolean>} Success status
   */
  async sendSMS(notification) {
    // In production, this would integrate with Twilio, AWS SNS, etc.
    console.log('📱 SMS notification sent:', {
      to: notification.user.phone,
      message: notification.message,
      priority: notification.priority
    });

    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Store notification history
    this.storeNotificationHistory(notification, 'sms');
    
    return true;
  }

  /**
   * Send in-app notification
   * @param {Object} notification - Notification object
   * @returns {Promise<boolean>} Success status
   */
  async sendInApp(notification) {
    // In-app notifications are handled by the UI components
    // This method stores them for display
    const inAppNotifications = JSON.parse(
      localStorage.getItem('alphaframe_inapp_notifications') || '[]'
    );
    
    inAppNotifications.push({
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    });

    // Keep only last 50 notifications
    if (inAppNotifications.length > 50) {
      inAppNotifications.splice(0, inAppNotifications.length - 50);
    }

    localStorage.setItem('alphaframe_inapp_notifications', JSON.stringify(inAppNotifications));
    
    // Store notification history
    this.storeNotificationHistory(notification, 'inApp');
    
    return true;
  }

  /**
   * Store notification in history for analytics
   * @param {Object} notification - Notification object
   * @param {string} channel - Delivery channel
   */
  storeNotificationHistory(notification, channel) {
    const history = JSON.parse(
      localStorage.getItem('alphaframe_notification_history') || '[]'
    );
    
    history.push({
      ...notification,
      channel,
      sentAt: new Date().toISOString(),
      delivered: true
    });

    // Keep only last 1000 notifications
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }

    localStorage.setItem('alphaframe_notification_history', JSON.stringify(history));
  }

  /**
   * Create notification for rule trigger
   * @param {Object} rule - Rule that was triggered
   * @param {Object} transaction - Transaction that triggered the rule
   * @param {Object} user - User information
   * @returns {Object} Notification object
   */
  createRuleTriggerNotification(rule, transaction, user) {
    const amount = Math.abs(transaction.amount).toFixed(2);
    const merchant = transaction.merchantName || transaction.name;
    
    return {
      type: 'rule_triggers',
      priority: 'high',
      subject: `🚨 Rule Alert: ${rule.name}`,
      message: `Your rule "${rule.name}" was triggered by a ${amount} transaction at ${merchant}.`,
      user,
      rule,
      transaction,
      timestamp: new Date().toISOString(),
      actions: [
        {
          label: 'View Details',
          action: 'view_rule',
          data: { ruleId: rule.id }
        },
        {
          label: 'Edit Rule',
          action: 'edit_rule',
          data: { ruleId: rule.id }
        }
      ]
    };
  }

  /**
   * Create notification for balance alert
   * @param {Object} account - Account information
   * @param {number} threshold - Balance threshold
   * @param {Object} user - User information
   * @returns {Object} Notification object
   */
  createBalanceAlertNotification(account, threshold, user) {
    const balance = account.balances.available || account.balances.current;
    const isLow = balance < threshold;
    
    return {
      type: 'balance_alerts',
      priority: isLow ? 'high' : 'medium',
      subject: isLow ? `⚠️ Low Balance Alert: ${account.name}` : `💰 Balance Update: ${account.name}`,
      message: isLow 
        ? `Your ${account.name} balance is $${balance.toFixed(2)}, below the $${threshold.toFixed(2)} threshold.`
        : `Your ${account.name} balance is $${balance.toFixed(2)}.`,
      user,
      account,
      threshold,
      timestamp: new Date().toISOString(),
      actions: [
        {
          label: 'View Account',
          action: 'view_account',
          data: { accountId: account.id }
        }
      ]
    };
  }

  /**
   * Create notification for spending alert
   * @param {string} category - Spending category
   * @param {number} amount - Spending amount
   * @param {number} threshold - Spending threshold
   * @param {Object} user - User information
   * @returns {Object} Notification object
   */
  createSpendingAlertNotification(category, amount, threshold, user) {
    return {
      type: 'spending_alerts',
      priority: 'medium',
      subject: `💸 Spending Alert: ${category}`,
      message: `You've spent $${amount.toFixed(2)} on ${category} this month, approaching your $${threshold.toFixed(2)} limit.`,
      user,
      category,
      amount,
      threshold,
      timestamp: new Date().toISOString(),
      actions: [
        {
          label: 'View Spending',
          action: 'view_spending',
          data: { category }
        },
        {
          label: 'Set Budget',
          action: 'set_budget',
          data: { category }
        }
      ]
    };
  }

  /**
   * Process and send notification
   * @param {Object} notification - Notification object
   * @returns {Promise<boolean>} Success status
   */
  async processNotification(notification) {
    // Check quiet hours
    if (this.isQuietHours() && notification.priority !== 'critical') {
      console.log('Notification suppressed during quiet hours');
      return false;
    }

    // Check rate limiting
    if (this.isRateLimited(notification.type)) {
      console.log('Notification rate limited');
      return false;
    }

    const channels = [];
    
    // Determine which channels to use based on preferences
    if (this.preferences.email.enabled && 
        this.preferences.email.types.includes(notification.type)) {
      channels.push('email');
    }
    
    if (this.preferences.sms.enabled && 
        this.preferences.sms.types.includes(notification.type)) {
      channels.push('sms');
    }
    
    if (this.preferences.inApp.enabled && 
        this.preferences.inApp.types.includes(notification.type)) {
      channels.push('inApp');
    }

    // Send to all enabled channels
    const results = await Promise.all(
      channels.map(channel => this.sendNotification(notification, channel))
    );

    // Record notification for rate limiting
    this.recordNotification(notification.type);

    return results.some(result => result);
  }

  /**
   * Get in-app notifications for user
   * @param {string} userId - User identifier
   * @returns {Array} Array of notifications
   */
  getInAppNotifications(userId) {
    const notifications = JSON.parse(
      localStorage.getItem('alphaframe_inapp_notifications') || '[]'
    );
    
    return notifications.filter(n => n.user?.id === userId);
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification identifier
   */
  markAsRead(notificationId) {
    const notifications = JSON.parse(
      localStorage.getItem('alphaframe_inapp_notifications') || '[]'
    );
    
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem('alphaframe_inapp_notifications', JSON.stringify(notifications));
    }
  }

  /**
   * Get notification statistics
   * @returns {Object} Notification statistics
   */
  getNotificationStats() {
    const history = JSON.parse(
      localStorage.getItem('alphaframe_notification_history') || '[]'
    );
    
    const now = new Date();
    const dayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    return {
      total: history.length,
      last24Hours: history.filter(n => new Date(n.sentAt) > dayAgo).length,
      lastWeek: history.filter(n => new Date(n.sentAt) > weekAgo).length,
      byType: history.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {}),
      byChannel: history.reduce((acc, n) => {
        acc[n.channel] = (acc[n.channel] || 0) + 1;
        return acc;
      }, {})
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 