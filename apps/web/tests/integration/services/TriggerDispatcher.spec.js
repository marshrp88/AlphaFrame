import { describe, it, expect, beforeEach, vi } from 'vitest';
import { queueAction, listenForEvents } from '../../../src/lib/services/TriggerDispatcher';

describe('TriggerDispatcher', () => {
  let mockLogStore;
  let mockRuleEngineService;

  beforeEach(() => {
    // Create mock logStore
    mockLogStore = {
      addAction: vi.fn()
    };

    // Create mock RuleEngineService
    mockRuleEngineService = {
      on: vi.fn()
    };
  });

  it('should format and queue an action', () => {
    // Arrange
    const mockAction = {
      ruleId: 'rule_123',
      type: 'TRANSFER',
      payload: {
        amount: 100,
        fromAccount: 'checking',
        toAccount: 'savings'
      }
    };

    // Act
    queueAction(mockAction, mockLogStore);

    // Assert
    expect(mockLogStore.addAction).toHaveBeenCalledWith(expect.objectContaining({
      ruleId: 'rule_123',
      actionType: 'TRANSFER',
      status: 'queued',
      timestamp: expect.any(Number),
      payload: expect.objectContaining({
        amount: 100,
        fromAccount: 'checking',
        toAccount: 'savings'
      })
    }));
  });

  it('should listen for rule events and queue them', () => {
    // Arrange
    const mockEvent = {
      ruleId: 'rule_456',
      type: 'NOTIFICATION',
      payload: {
        message: 'Test notification'
      }
    };

    // Act
    listenForEvents(mockRuleEngineService, mockLogStore);
    
    // Simulate event trigger
    const eventCallback = mockRuleEngineService.on.mock.calls[0][1];
    eventCallback(mockEvent);

    // Assert
    expect(mockRuleEngineService.on).toHaveBeenCalledWith('ruleTriggered', expect.any(Function));
    expect(mockLogStore.addAction).toHaveBeenCalledWith(expect.objectContaining({
      ruleId: 'rule_456',
      actionType: 'NOTIFICATION',
      status: 'queued',
      timestamp: expect.any(Number),
      payload: expect.objectContaining({
        message: 'Test notification'
      })
    }));
  });
}); 