/**
 * EnhancedInsightCard.jsx - AlphaFrame Customer-Ready Insight Card
 * 
 * Purpose: Enhanced insight card with smooth animations, haptic feedback,
 * visual confirmations, and comprehensive interaction tracking.
 * 
 * Procedure:
 * 1. Smooth animations for all state transitions
 * 2. Haptic feedback on mobile devices
 * 3. Visual confirmation for all actions
 * 4. Integration with ExecutionLogService for audit trail
 * 5. Archive and history system integration
 * 
 * Conclusion: Provides premium user experience with immediate feedback
 * and comprehensive interaction tracking.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompositeCard from './CompositeCard.jsx';
import StyledButton from './StyledButton.jsx';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Target, 
  BarChart3,
  Activity,
  Calendar,
  Zap,
  Clock,
  CheckCircle,
  X,
  Archive,
  RotateCcw,
  Eye,
  EyeOff,
  MoreHorizontal,
  Share2,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';
import { useToast } from './use-toast.jsx';
import executionLogService from '../../core/services/ExecutionLogService.js';

const EnhancedInsightCard = ({ 
  insight, 
  ruleResult = null, 
  transactions = [],
  onAction,
  onDismiss,
  onSnooze,
  onArchive,
  onShare,
  showDetails = false,
  isArchived = false,
  isSnoozed = false
}) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const cardRef = useRef(null);
  const menuRef = useRef(null);

  // Generate dynamic insight from rule result if provided
  const generateDynamicInsight = () => {
    if (!ruleResult) return insight;
    
    const { ruleName, status, message, matchedTransactions, metrics, evaluatedAt } = ruleResult;
    
    // Calculate rule accuracy
    const ruleAccuracy = calculateRuleAccuracy(ruleResult, transactions);
    
    // Calculate projected impact
    const projectedImpact = calculateProjectedImpact(ruleResult, transactions);
    
    switch (status) {
      case 'triggered':
        return {
          ...insight,
          title: `🚨 ${ruleName} Alert`,
          description: message || `Your rule "${ruleName}" has been triggered based on recent activity.`,
          status: 'negative',
          statusLabel: 'Alert',
          type: 'rule_trigger',
          value: matchedTransactions?.length || 0,
          valueLabel: 'Matching Transactions',
          action: 'Review triggered transactions and adjust your rule if needed.',
          urgency: 'high',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      case 'warning':
        return {
          ...insight,
          title: `⚠️ ${ruleName} Warning`,
          description: message || `Your rule "${ruleName}" is approaching its threshold.`,
          status: 'warning',
          statusLabel: 'Warning',
          type: 'rule_warning',
          value: metrics?.currentValue || 0,
          valueLabel: 'Current Value',
          action: 'Monitor this category closely and consider adjusting your spending.',
          urgency: 'medium',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      case 'success':
        return {
          ...insight,
          title: `✅ ${ruleName} Success`,
          description: message || `Your rule "${ruleName}" is working perfectly.`,
          status: 'positive',
          statusLabel: 'Success',
          type: 'rule_success',
          value: metrics?.savings || 0,
          valueLabel: 'Money Saved',
          action: 'Keep up the great work! Your automation is working as intended.',
          urgency: 'low',
          metrics: {
            lastTriggered: evaluatedAt,
            ruleAccuracy: ruleAccuracy,
            projectedImpact: projectedImpact
          }
        };
        
      default:
        return insight;
    }
  };

  // Calculate rule accuracy based on historical performance
  const calculateRuleAccuracy = (ruleResult, transactions) => {
    if (!ruleResult || !transactions.length) return null;
    
    // Simple accuracy calculation based on rule performance
    const { type, metrics } = ruleResult;
    
    if (type === 'spending_limit' && metrics?.threshold && metrics?.totalSpent) {
      const accuracy = Math.min(100, (metrics.threshold / metrics.totalSpent) * 100);
      return Math.round(accuracy);
    }
    
    return 85; // Default accuracy
  };

  // Calculate projected impact based on rule performance
  const calculateProjectedImpact = (ruleResult, transactions) => {
    if (!ruleResult || !transactions.length) return null;
    
    const { type, metrics } = ruleResult;
    
    if (type === 'spending_limit' && metrics?.totalSpent && metrics?.threshold) {
      const overspend = metrics.totalSpent - metrics.threshold;
      if (overspend > 0) {
        return {
          type: 'savings',
          value: overspend,
          period: 'monthly',
          description: `Potential monthly savings if rule prevents overspending`
        };
      }
    }
    
    return {
      type: 'monitoring',
      value: 0,
      period: 'ongoing',
      description: `Continuous monitoring and alerts`
    };
  };

  // Get appropriate icon based on insight type
  const getIcon = (type) => {
    switch (type) {
      case 'rule_trigger':
        return <AlertTriangle size={20} />;
      case 'rule_warning':
        return <AlertTriangle size={20} />;
      case 'rule_success':
        return <CheckCircle size={20} />;
      case 'spending_alert':
        return <DollarSign size={20} />;
      case 'savings_goal':
        return <Target size={20} />;
      case 'trend_analysis':
        return <TrendingUp size={20} />;
      default:
        return <BarChart3 size={20} />;
    }
  };

  // Format time ago for timestamps
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Provide haptic feedback on mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Handle card click with haptic feedback
  const handleCardClick = () => {
    triggerHapticFeedback();
    setIsExpanded(!isExpanded);
    setInteractionCount(prev => prev + 1);
    
    // Log interaction
    executionLogService.log('insight_card.interacted', {
      insightId: insight.id,
      action: 'expand',
      interactionCount: interactionCount + 1
    });
  };

  // Handle action button click
  const handleActionClick = async () => {
    setIsLoading(true);
    triggerHapticFeedback();
    
    try {
      // Log action
      await executionLogService.log('insight_card.action_taken', {
        insightId: insight.id,
        action: insight.action,
        ruleResult: ruleResult?.ruleName
      });
      
      // Show success toast
      toast({
        title: "Action Taken",
        description: insight.action || "Processing your request...",
        variant: "default"
      });
      
      // Call parent handler
      if (onAction) {
        onAction(insight, ruleResult);
      }
      
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dismiss
  const handleDismiss = async () => {
    triggerHapticFeedback();
    
    try {
      await executionLogService.log('insight_card.dismissed', {
        insightId: insight.id,
        reason: 'user_dismissed'
      });
      
      toast({
        title: "Insight Dismissed",
        description: "We'll show you new insights as they come in.",
        variant: "default"
      });
      
      if (onDismiss) {
        onDismiss(insight);
      }
    } catch (error) {
      console.error('Failed to log dismiss action:', error);
    }
  };

  // Handle snooze
  const handleSnooze = async () => {
    triggerHapticFeedback();
    
    try {
      await executionLogService.log('insight_card.snoozed', {
        insightId: insight.id,
        duration: '1_hour'
      });
      
      toast({
        title: "Insight Snoozed",
        description: "We'll remind you about this in 1 hour.",
        variant: "default"
      });
      
      if (onSnooze) {
        onSnooze(insight);
      }
    } catch (error) {
      console.error('Failed to log snooze action:', error);
    }
  };

  // Handle archive
  const handleArchive = async () => {
    triggerHapticFeedback();
    
    try {
      await executionLogService.log('insight_card.archived', {
        insightId: insight.id,
        reason: 'user_archived'
      });
      
      toast({
        title: "Insight Archived",
        description: "You can find this in your archive later.",
        variant: "default"
      });
      
      if (onArchive) {
        onArchive(insight);
      }
    } catch (error) {
      console.error('Failed to log archive action:', error);
    }
  };

  // Handle share
  const handleShare = async () => {
    triggerHapticFeedback();
    
    try {
      await executionLogService.log('insight_card.shared', {
        insightId: insight.id,
        method: 'clipboard'
      });
      
      // Copy to clipboard
      const shareText = `${insight.title}: ${insight.description}`;
      await navigator.clipboard.writeText(shareText);
      
      toast({
        title: "Insight Shared",
        description: "Copied to clipboard!",
        variant: "default"
      });
      
      if (onShare) {
        onShare(insight);
      }
    } catch (error) {
      console.error('Failed to share insight:', error);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async () => {
    triggerHapticFeedback();
    setIsBookmarked(!isBookmarked);
    
    try {
      await executionLogService.log('insight_card.bookmarked', {
        insightId: insight.id,
        bookmarked: !isBookmarked
      });
      
      toast({
        title: isBookmarked ? "Bookmark Removed" : "Bookmark Added",
        description: isBookmarked ? "Removed from bookmarks." : "Added to bookmarks.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to log bookmark action:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dynamicInsight = generateDynamicInsight();

  const getStatusColor = (status) => {
    switch (status) {
      case 'negative':
        return 'var(--color-error-50)';
      case 'warning':
        return 'var(--color-warning-50)';
      case 'positive':
        return 'var(--color-success-50)';
      default:
        return 'var(--color-primary-50)';
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'negative':
        return 'var(--color-error-200)';
      case 'warning':
        return 'var(--color-warning-200)';
      case 'positive':
        return 'var(--color-success-200)';
      default:
        return 'var(--color-primary-200)';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'negative':
        return 'var(--color-error-700)';
      case 'warning':
        return 'var(--color-warning-700)';
      case 'positive':
        return 'var(--color-success-700)';
      default:
        return 'var(--color-primary-700)';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={`enhanced-insight-card ${isArchived ? 'archived' : ''} ${isSnoozed ? 'snoozed' : ''}`}
    >
      <CompositeCard 
        variant="elevated"
        style={{
          backgroundColor: getStatusColor(dynamicInsight.status),
          border: `1px solid ${getStatusBorder(dynamicInsight.status)}`,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={handleCardClick}
      >
        {/* Urgency indicator */}
        {dynamicInsight.urgency === 'high' && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: 'var(--color-error-500)'
            }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        <div style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              flex: 1
            }}>
              <motion.div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getStatusTextColor(dynamicInsight.status),
                  border: `2px solid ${getStatusBorder(dynamicInsight.status)}`
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {getIcon(dynamicInsight.type)}
              </motion.div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  lineHeight: '1.3'
                }}>
                  {dynamicInsight.title}
                </h3>
                
                {dynamicInsight.metrics?.lastTriggered && (
                  <p style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                    margin: '0.25rem 0 0 0'
                  }}>
                    Last triggered: {formatTimeAgo(dynamicInsight.metrics.lastTriggered)}
                  </p>
                )}
              </div>
            </div>
            
            {/* Menu button */}
            <motion.div
              ref={menuRef}
              style={{ position: 'relative' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <StyledButton
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                style={{ padding: '0.25rem' }}
              >
                <MoreHorizontal size={16} />
              </StyledButton>
              
              {/* Dropdown menu */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'var(--color-white)',
                      border: '1px solid var(--color-border-primary)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1000,
                      minWidth: '160px',
                      padding: '0.5rem 0'
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkToggle();
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {isBookmarked ? <Bookmark size={14} /> : <BookmarkPlus size={14} />}
                      {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSnooze();
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Clock size={14} />
                      Snooze
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive();
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Archive size={14} />
                      Archive
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Description */}
          <p style={{ 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.5',
            margin: '0 0 1rem 0'
          }}>
            {dynamicInsight.description}
          </p>
          
          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                {/* Value display */}
                {dynamicInsight.value && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-secondary)',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ 
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      {dynamicInsight.valueLabel}
                    </span>
                    <span style={{ 
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {dynamicInsight.value}
                    </span>
                  </div>
                )}
                
                {/* Action recommendation */}
                {dynamicInsight.action && (
                  <div style={{ 
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-primary-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-primary-200)'
                  }}>
                    <p style={{ 
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-primary-700)',
                      margin: 0,
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      💡 {dynamicInsight.action}
                    </p>
                  </div>
                )}
                
                {/* Metrics */}
                {dynamicInsight.metrics && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {dynamicInsight.metrics.ruleAccuracy && (
                      <div style={{
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-white)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-secondary)'
                        }}>
                          Accuracy
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)'
                        }}>
                          {dynamicInsight.metrics.ruleAccuracy}%
                        </div>
                      </div>
                    )}
                    
                    {dynamicInsight.metrics.projectedImpact && (
                      <div style={{
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-white)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-secondary)'
                        }}>
                          Impact
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)'
                        }}>
                          ${dynamicInsight.metrics.projectedImpact.value}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Action buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <StyledButton
              variant={dynamicInsight.status === 'negative' ? 'destructive' : 'primary'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick();
              }}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RotateCcw size={14} />
                </motion.div>
              ) : (
                <>
                  {dynamicInsight.action || 'Take Action'}
                  <ArrowRight size={14} />
                </>
              )}
            </StyledButton>
            
            <StyledButton
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
            >
              <X size={14} />
            </StyledButton>
          </div>
        </div>
      </CompositeCard>
    </motion.div>
  );
};

export default EnhancedInsightCard; 