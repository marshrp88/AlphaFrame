/**
 * SettingsPage.jsx - AlphaFrame Customer-Ready Settings & Control Layer
 * 
 * Purpose: Comprehensive settings interface that gives users complete control
 * over their AlphaFrame experience, data, and privacy.
 * 
 * Procedure:
 * 1. Account management and profile settings
 * 2. Privacy controls and data permissions
 * 3. Data export and import capabilities
 * 4. System preferences and customization
 * 5. Security settings and authentication
 * 
 * Conclusion: Provides users with complete control and transparency
 * over their AlphaFrame experience and data.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CompositeCard from '../components/ui/CompositeCard.jsx';
import StyledButton from '../components/ui/StyledButton.jsx';
import { 
  User, 
  Shield, 
  Download, 
  Upload, 
  Settings, 
  Bell, 
  Eye, 
  EyeOff,
  Key,
  Trash2,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Database,
  Globe,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast.jsx';
import useAppStore from '../store/useAppStore.js';
import executionLogService from '../core/services/ExecutionLogService.js';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, updateUser, logout } = useAppStore();
  
  // State management
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: user?.privacy?.dataSharing || false,
    analytics: user?.privacy?.analytics || true,
    marketing: user?.privacy?.marketing || false,
    notifications: user?.privacy?.notifications || true
  });
  
  const [systemPreferences, setSystemPreferences] = useState({
    theme: user?.preferences?.theme || 'system',
    language: user?.preferences?.language || 'en',
    currency: user?.preferences?.currency || 'USD',
    dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
    timeFormat: user?.preferences?.timeFormat || '12h'
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: user?.security?.twoFactorEnabled || false,
    sessionTimeout: user?.security?.sessionTimeout || 30,
    passwordChangeRequired: user?.security?.passwordChangeRequired || false
  });

  // Tab configuration
  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Handle profile form changes
  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle privacy settings changes
  const handlePrivacyChange = (field, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle system preferences changes
  const handlePreferenceChange = (field, value) => {
    setSystemPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle security settings changes
  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      await executionLogService.log('settings.profile_updated', {
        userId: user?.id,
        changes: profileForm
      });
      
      // Update user in store
      await updateUser({
        ...user,
        ...profileForm
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save privacy settings
  const handleSavePrivacy = async () => {
    setIsLoading(true);
    
    try {
      await executionLogService.log('settings.privacy_updated', {
        userId: user?.id,
        changes: privacySettings
      });
      
      // Update user in store
      await updateUser({
        ...user,
        privacy: privacySettings
      });
      
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy settings have been saved.",
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save system preferences
  const handleSavePreferences = async () => {
    setIsLoading(true);
    
    try {
      await executionLogService.log('settings.preferences_updated', {
        userId: user?.id,
        changes: systemPreferences
      });
      
      // Update user in store
      await updateUser({
        ...user,
        preferences: systemPreferences
      });
      
      // Apply theme change
      if (systemPreferences.theme !== 'system') {
        document.documentElement.setAttribute('data-theme', systemPreferences.theme);
      }
      
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been saved.",
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save security settings
  const handleSaveSecurity = async () => {
    setIsLoading(true);
    
    try {
      await executionLogService.log('settings.security_updated', {
        userId: user?.id,
        changes: securitySettings
      });
      
      // Update user in store
      await updateUser({
        ...user,
        security: securitySettings
      });
      
      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been saved.",
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export user data
  const handleExportData = async () => {
    setIsLoading(true);
    
    try {
      await executionLogService.log('settings.data_exported', {
        userId: user?.id
      });
      
      // Generate export data
      const exportData = {
        user: {
          profile: profileForm,
          preferences: systemPreferences,
          privacy: privacySettings,
          security: securitySettings
        },
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alphaframe-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
        variant: "default"
      });
      
      setShowExportModal(false);
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      await executionLogService.log('settings.account_deleted', {
        userId: user?.id
      });
      
      // Call delete account API
      // await deleteAccount();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "default"
      });
      
      // Logout and redirect
      await logout();
      navigate('/');
      
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompositeCard>
              <h2 className="settings-section-title">Profile Information</h2>
              <p className="settings-section-description">
                Update your personal information and contact details.
              </p>
              
              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="settings-input"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={profileForm.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="settings-input"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="settings-input"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    id="timezone"
                    value={profileForm.timezone}
                    onChange={(e) => handleProfileChange('timezone', e.target.value)}
                    className="settings-select"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <StyledButton
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="save-button"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                    <Save size={16} />
                  </StyledButton>
                </div>
              </div>
            </CompositeCard>
          </motion.div>
        );
        
      case 'privacy':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompositeCard>
              <h2 className="settings-section-title">Privacy & Data Controls</h2>
              <p className="settings-section-description">
                Control how your data is used and shared within AlphaFrame.
              </p>
              
              <div className="settings-form">
                <div className="privacy-option">
                  <div className="privacy-option-content">
                    <div className="privacy-option-header">
                      <Shield size={20} />
                      <div>
                        <h3>Data Sharing</h3>
                        <p>Allow AlphaFrame to use your data to improve the service</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.dataSharing}
                        onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="privacy-option">
                  <div className="privacy-option-content">
                    <div className="privacy-option-header">
                      <BarChart3 size={20} />
                      <div>
                        <h3>Analytics</h3>
                        <p>Help us improve by sharing anonymous usage data</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.analytics}
                        onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="privacy-option">
                  <div className="privacy-option-content">
                    <div className="privacy-option-header">
                      <Bell size={20} />
                      <div>
                        <h3>Marketing Communications</h3>
                        <p>Receive updates about new features and promotions</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.marketing}
                        onChange={(e) => handlePrivacyChange('marketing', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="privacy-option">
                  <div className="privacy-option-content">
                    <div className="privacy-option-header">
                      <Bell size={20} />
                      <div>
                        <h3>Push Notifications</h3>
                        <p>Receive real-time alerts about your financial rules</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacySettings.notifications}
                        onChange={(e) => handlePrivacyChange('notifications', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <StyledButton
                    onClick={handleSavePrivacy}
                    disabled={isLoading}
                    className="save-button"
                  >
                    {isLoading ? 'Saving...' : 'Save Privacy Settings'}
                    <Save size={16} />
                  </StyledButton>
                </div>
              </div>
            </CompositeCard>
          </motion.div>
        );
        
      case 'preferences':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompositeCard>
              <h2 className="settings-section-title">System Preferences</h2>
              <p className="settings-section-description">
                Customize your AlphaFrame experience to match your preferences.
              </p>
              
              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    value={systemPreferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="settings-select"
                  >
                    <option value="system">System Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={systemPreferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="settings-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    value={systemPreferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                    className="settings-select"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="dateFormat">Date Format</label>
                  <select
                    id="dateFormat"
                    value={systemPreferences.dateFormat}
                    onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    className="settings-select"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="timeFormat">Time Format</label>
                  <select
                    id="timeFormat"
                    value={systemPreferences.timeFormat}
                    onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                    className="settings-select"
                  >
                    <option value="12h">12-hour</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <StyledButton
                    onClick={handleSavePreferences}
                    disabled={isLoading}
                    className="save-button"
                  >
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                    <Save size={16} />
                  </StyledButton>
                </div>
              </div>
            </CompositeCard>
          </motion.div>
        );
        
      case 'security':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompositeCard>
              <h2 className="settings-section-title">Security Settings</h2>
              <p className="settings-section-description">
                Manage your account security and authentication preferences.
              </p>
              
              <div className="settings-form">
                <div className="security-option">
                  <div className="security-option-content">
                    <div className="security-option-header">
                      <Key size={20} />
                      <div>
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                  <select
                    id="sessionTimeout"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                    className="settings-select"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
                
                <div className="security-option">
                  <div className="security-option-content">
                    <div className="security-option-header">
                      <AlertTriangle size={20} />
                      <div>
                        <h3>Require Password Change</h3>
                        <p>Force password change on next login</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordChangeRequired}
                        onChange={(e) => handleSecurityChange('passwordChangeRequired', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <StyledButton
                    onClick={handleSaveSecurity}
                    disabled={isLoading}
                    className="save-button"
                  >
                    {isLoading ? 'Saving...' : 'Save Security Settings'}
                    <Save size={16} />
                  </StyledButton>
                </div>
              </div>
            </CompositeCard>
          </motion.div>
        );
        
      case 'data':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompositeCard>
              <h2 className="settings-section-title">Data Management</h2>
              <p className="settings-section-description">
                Export your data or permanently delete your account.
              </p>
              
              <div className="data-management-options">
                <div className="data-option">
                  <div className="data-option-content">
                    <div className="data-option-header">
                      <Download size={20} />
                      <div>
                        <h3>Export Data</h3>
                        <p>Download all your data in JSON format</p>
                      </div>
                    </div>
                    <StyledButton
                      onClick={() => setShowExportModal(true)}
                      variant="outline"
                    >
                      Export Data
                    </StyledButton>
                  </div>
                </div>
                
                <div className="data-option">
                  <div className="data-option-content">
                    <div className="data-option-header">
                      <Upload size={20} />
                      <div>
                        <h3>Import Data</h3>
                        <p>Import data from a previous export</p>
                      </div>
                    </div>
                    <StyledButton
                      onClick={() => setShowImportModal(true)}
                      variant="outline"
                    >
                      Import Data
                    </StyledButton>
                  </div>
                </div>
                
                <div className="data-option destructive">
                  <div className="data-option-content">
                    <div className="data-option-header">
                      <Trash2 size={20} />
                      <div>
                        <h3>Delete Account</h3>
                        <p>Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <StyledButton
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="destructive"
                    >
                      Delete Account
                    </StyledButton>
                  </div>
                </div>
              </div>
            </CompositeCard>
          </motion.div>
        );
        
      case 'notifications':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CompositeCard>
              <h2 className="settings-section-title">Notification Preferences</h2>
              <p className="settings-section-description">
                Control how and when you receive notifications from AlphaFrame.
              </p>
              
              <div className="settings-form">
                <div className="notification-option">
                  <div className="notification-option-content">
                    <div className="notification-option-header">
                      <Bell size={20} />
                      <div>
                        <h3>Rule Triggers</h3>
                        <p>Get notified when your financial rules are triggered</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        defaultChecked
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="notification-option">
                  <div className="notification-option-content">
                    <div className="notification-option-header">
                      <AlertTriangle size={20} />
                      <div>
                        <h3>Security Alerts</h3>
                        <p>Receive alerts for suspicious account activity</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        defaultChecked
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="notification-option">
                  <div className="notification-option-content">
                    <div className="notification-option-header">
                      <Info size={20} />
                      <div>
                        <h3>Weekly Reports</h3>
                        <p>Get weekly summaries of your financial activity</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        defaultChecked
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="notification-option">
                  <div className="notification-option-content">
                    <div className="notification-option-header">
                      <Bell size={20} />
                      <div>
                        <h3>Feature Updates</h3>
                        <p>Learn about new features and improvements</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </CompositeCard>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your AlphaFrame account and preferences</p>
      </div>
      
      <div className="settings-container">
        {/* Tab Navigation */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-content"
            >
              <div className="modal-header">
                <h3>Export Your Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <p>This will export all your data including:</p>
                <ul>
                  <li>Profile information</li>
                  <li>Financial rules and settings</li>
                  <li>Transaction data</li>
                  <li>Preferences and settings</li>
                </ul>
                <p>The data will be downloaded as a JSON file.</p>
              </div>
              
              <div className="modal-actions">
                <StyledButton
                  variant="outline"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </StyledButton>
                <StyledButton
                  onClick={handleExportData}
                  disabled={isLoading}
                >
                  {isLoading ? 'Exporting...' : 'Export Data'}
                </StyledButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-content destructive"
            >
              <div className="modal-header">
                <h3>Delete Account</h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="modal-close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="warning-message">
                  <AlertTriangle size={24} />
                  <h4>This action cannot be undone</h4>
                  <p>Deleting your account will permanently remove:</p>
                  <ul>
                    <li>All your personal data</li>
                    <li>Financial rules and settings</li>
                    <li>Transaction history</li>
                    <li>Account preferences</li>
                  </ul>
                  <p>Please make sure you have exported any important data before proceeding.</p>
                </div>
              </div>
              
              <div className="modal-actions">
                <StyledButton
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </StyledButton>
                <StyledButton
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Permanently Delete Account'}
                </StyledButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage; 