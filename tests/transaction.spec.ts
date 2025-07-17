import { describe, it, expect } from "bun:test";
import type { Transaction, TransactionType } from '@/models/transaction';

describe('Transaction Model', () => {
  it('should create a valid transaction', () => {
    const transaction: Transaction = {
      automationId: '123',
      id: '456',
      timestamp: '2022-01-01T00:00:00Z',
      status: 'success',
      success: true,
      message: 'Transaction completed successfully',
      type: 'incoming',
    };

    expect(transaction).toBeDefined();
    expect(transaction.automationId).toBe('123');
    expect(transaction.id).toBe('456');
    expect(transaction.timestamp).toBe('2022-01-01T00:00:00Z');
    expect(transaction.status).toBe('success');
    expect(transaction.message).toBe('Transaction completed successfully');
    expect(transaction.success).toBe(true);
    expect(transaction.type).toBe('incoming');
  });

  it('should have valid transaction types', () => {
    const validTypes: TransactionType[] = ['incoming', 'outgoing'];

    expect(validTypes).toContain('incoming');
    expect(validTypes).toContain('outgoing');
  });
});
