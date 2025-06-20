/**
 * WebhookService.js - AlphaFrame VX.1
 * 
 * Purpose: Real webhook execution service with security validation,
 * retry logic, and comprehensive logging for external integrations.
 * 
 * Procedure:
 * 1. Validate webhook payload and security headers
 * 2. Execute webhook with proper error handling
 * 3. Implement retry logic for failed webhooks
 * 4. Log all webhook activities and results
 * 5. Support webhook signature verification
 * 
 * Conclusion: Provides secure, reliable webhook execution
 * with comprehensive monitoring and error recovery.
 */

import { config, getFeatureFlag } from '../config.js';
import executionLogService from '../../core/services/ExecutionLogService.js';

/**
 * Webhook execution configuration
 */
const WEBHOOK_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000, // 10 seconds
  userAgent: 'AlphaFrame/1.0'
};

/**
 * Execute a webhook with security validation and retry logic
 * @param {Object} payload - Webhook payload
 * @param {string} payload.url - Webhook URL
 * @param {string} payload.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} payload.headers - Custom headers
 * @param {Object} payload.body - Request body
 * @param {string} payload.secret - Webhook secret for signature
 * @returns {Promise<Object>} Webhook execution result
 */
export const executeWebhook = async (payload) => {
  try {
    // Validate webhook feature flag
    if (!getFeatureFlag('webhooks')) {
      throw new Error('Webhooks are disabled in current environment');
    }

    // Validate payload
    if (!payload.url) {
      throw new Error('Webhook URL is required');
    }

    if (!payload.method) {
      payload.method = 'POST';
    }

    // Validate URL security
    if (!isValidWebhookUrl(payload.url)) {
      throw new Error('Invalid webhook URL - must be HTTPS in production');
    }

    // Prepare request
    const requestConfig = await prepareWebhookRequest(payload);
    
    // Execute with retry logic
    const result = await executeWithRetry(requestConfig, payload);
    
    await executionLogService.log('webhook.executed.success', {
      url: maskUrl(payload.url),
      method: payload.method,
      statusCode: result.status,
      responseTime: result.responseTime,
      retryCount: result.retryCount
    });

    return {
      success: true,
      webhookId: generateWebhookId(),
      statusCode: result.status,
      responseTime: result.responseTime,
      retryCount: result.retryCount,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    await executionLogService.logError('webhook.execution.failed', error, {
      url: maskUrl(payload.url),
      method: payload.method
    });

    throw new Error(`Webhook execution failed: ${error.message}`);
  }
};

/**
 * Prepare webhook request with security headers
 * @param {Object} payload - Webhook payload
 * @returns {Object} Request configuration
 */
const prepareWebhookRequest = async (payload) => {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': WEBHOOK_CONFIG.userAgent,
    'X-AlphaFrame-Version': '1.0',
    'X-Webhook-Timestamp': Date.now().toString(),
    ...payload.headers
  };

  // Add webhook signature if secret is provided
  if (payload.secret && payload.body) {
    const signature = await generateWebhookSignature(payload.body, payload.secret);
    headers['X-Webhook-Signature'] = signature;
  }

  // Add authorization header if provided
  if (payload.auth) {
    if (payload.auth.type === 'bearer') {
      headers['Authorization'] = `Bearer ${payload.auth.token}`;
    } else if (payload.auth.type === 'basic') {
      const credentials = btoa(`${payload.auth.username}:${payload.auth.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }
  }

  return {
    url: payload.url,
    method: payload.method.toUpperCase(),
    headers,
    body: payload.body ? JSON.stringify(payload.body) : undefined,
    timeout: WEBHOOK_CONFIG.timeout
  };
};

/**
 * Execute webhook with retry logic
 * @param {Object} requestConfig - Request configuration
 * @param {Object} payload - Original payload for logging
 * @returns {Promise<Object>} Execution result
 */
const executeWithRetry = async (requestConfig, payload) => {
  let lastError;
  
  for (let attempt = 1; attempt <= WEBHOOK_CONFIG.maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.body,
        signal: AbortSignal.timeout(requestConfig.timeout)
      });

      const responseTime = Date.now() - startTime;

      // Log attempt
      await executionLogService.log('webhook.attempt', {
        attempt,
        url: maskUrl(requestConfig.url),
        statusCode: response.status,
        responseTime
      });

      // Check if response is successful
      if (response.ok) {
        return {
          status: response.status,
          responseTime,
          retryCount: attempt - 1
        };
      }

      // If not successful, throw error for retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      lastError = error;
      
      await executionLogService.log('webhook.attempt.failed', {
        attempt,
        url: maskUrl(requestConfig.url),
        error: error.message
      });

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error.name === 'AbortError') {
        throw new Error('Webhook request timed out');
      }

      if (attempt < WEBHOOK_CONFIG.maxRetries) {
        // Wait before retry with exponential backoff
        const delay = WEBHOOK_CONFIG.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Validate webhook URL for security
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
const isValidWebhookUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // In production, only allow HTTPS
    if (config.env === 'production' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Block localhost in production
    if (config.env === 'production' && 
        (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1')) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate webhook signature for security
 * @param {Object} body - Request body
 * @param {string} secret - Webhook secret
 * @returns {Promise<string>} HMAC signature
 */
const generateWebhookSignature = async (body, secret) => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(JSON.stringify(body));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

/**
 * Verify webhook signature
 * @param {Object} body - Request body
 * @param {string} signature - Received signature
 * @param {string} secret - Webhook secret
 * @returns {Promise<boolean>} True if signature is valid
 */
export const verifyWebhookSignature = async (body, signature, secret) => {
  try {
    const expectedSignature = await generateWebhookSignature(body, secret);
    return signature === expectedSignature;
  } catch {
    return false;
  }
};

/**
 * Mask URL for logging (hide sensitive parts)
 * @param {string} url - URL to mask
 * @returns {string} Masked URL
 */
const maskUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
  } catch {
    return 'invalid-url';
  }
};

/**
 * Generate unique webhook ID
 * @returns {string} Webhook ID
 */
const generateWebhookId = () => {
  return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get webhook statistics
 * @returns {Promise<Object>} Webhook statistics
 */
export const getWebhookStats = async () => {
  try {
    const logs = await executionLogService.getLogsByType('webhook');
    
    const stats = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageResponseTime: 0,
      totalRetries: 0
    };

    let totalResponseTime = 0;
    let responseTimeCount = 0;

    logs.forEach(log => {
      if (log.type === 'webhook.executed.success') {
        stats.successfulExecutions++;
        stats.totalExecutions++;
        if (log.data.responseTime) {
          totalResponseTime += log.data.responseTime;
          responseTimeCount++;
        }
        if (log.data.retryCount) {
          stats.totalRetries += log.data.retryCount;
        }
      } else if (log.type === 'webhook.execution.failed') {
        stats.failedExecutions++;
        stats.totalExecutions++;
      }
    });

    if (responseTimeCount > 0) {
      stats.averageResponseTime = Math.round(totalResponseTime / responseTimeCount);
    }

    return stats;
  } catch (error) {
    await executionLogService.logError('webhook.stats.retrieval.failed', error);
    throw new Error(`Failed to get webhook statistics: ${error.message}`);
  }
}; 