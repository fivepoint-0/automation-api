import { describe, it, expect } from "bun:test";
import { MockDataSource } from "./mock-data-source.spec";
import { ValidatedAutomationApi } from "@/api/automation/validated-api";
import { ValidatedTransactionApi } from "@/api/transaction/validated-api";
import { ValidationError } from "@/validation/validation-utils";
import type { Automation } from "@/models/automation";
import type { Transaction } from "@/models/transaction";
import type { AutomationCreateRequest, AutomationUpdateRequest, AutomationDeleteRequest, AutomationReadRequest } from "@/api/automation/types";
import type { TransactionCreateRequest, TransactionUpdateRequest, TransactionDeleteRequest, TransactionReadRequest } from "@/api/transaction/types";
import type { IDataSource } from "@/data-source";

// Create a mock data source that works with Automation
class MockAutomationDataSource extends MockDataSource {
  // Override the methods to work with Automation types
}

// Create a mock data source for Transactions
class MockTransactionDataSource implements IDataSource<Transaction, TransactionCreateRequest, TransactionReadRequest, TransactionUpdateRequest, TransactionDeleteRequest> {
  private store: Transaction[] = [
    {
      id: "txn-1",
      automationId: "auto-1",
      timestamp: "2022-01-01T00:00:00Z",
      status: "success",
      success: true,
      message: "Initial transaction",
      type: "incoming"
    }
  ];

  getNextId(): string {
    return `txn-${Date.now()}`;
  }

  async create(data: TransactionCreateRequest): Promise<Transaction> {
    const transaction = { id: this.getNextId(), ...data };
    this.store.push(transaction);
    return transaction;
  }

  async read(data?: TransactionReadRequest | undefined): Promise<Transaction | Transaction[]> {
    if (data) {
      if (data.id) {
        return this.store.find((transaction) => transaction.id === data.id) || [];
      }
      return this.store.filter((transaction: Transaction) => {
        return Object.keys(data).every((key) => 
          transaction[key as keyof Transaction] === data[key as keyof Transaction]
        );
      });
    }
    return this.store;
  }

  async update(data: TransactionUpdateRequest): Promise<Transaction | undefined> {
    const transactionIndex = this.store.findIndex(transaction => transaction.id === data.id);
    if (transactionIndex === -1) {
      return;
    }
    this.store[transactionIndex] = { ...this.store[transactionIndex], ...data };
    return this.store[transactionIndex];
  }

  async delete(data: TransactionDeleteRequest): Promise<boolean> {
    const transactionIndex = this.store.findIndex(transaction => transaction.id === data.id);
    if (transactionIndex === -1) {
      return false;
    }
    this.store.splice(transactionIndex, 1);
    return true;
  }
}

describe('ValidatedAutomationApi', () => {
  const dataSource = new MockAutomationDataSource();
  const api = new ValidatedAutomationApi(dataSource as any);

  describe('create', () => {
    it('should create automation with valid data', async () => {
      const validData: AutomationCreateRequest = {
        name: "Test Automation",
        description: "This is a test automation"
      };

      const result = await api.create(validData);
      expect(result).toBeDefined();
      expect(result.name).toBe(validData.name);
      expect(result.description).toBe(validData.description);
      expect(result.id).toBeDefined();
    });

    it('should throw ValidationError with invalid data', async () => {
      const invalidData = {
        name: "", // empty name should fail
        description: "This is a test"
      };

      await expect(api.create(invalidData as AutomationCreateRequest)).rejects.toThrow(ValidationError);
    });

    it('should reject data with id field', async () => {
      const invalidData = {
        id: "123", // id should not be present in create request
        name: "Test",
        description: "Test description"
      };

      await expect(api.create(invalidData as any)).rejects.toThrow(ValidationError);
    });
  });

  describe('update', () => {
    it('should update automation with valid data', async () => {
      const validData: AutomationUpdateRequest = {
        id: "one",
        name: "Updated Automation"
      };

      const result = await api.update(validData);
      expect(result).toBeDefined();
      if (result && validData.name) {
        expect(result.name).toBe(validData.name);
      }
    });

    it('should require id field', async () => {
      const invalidData = {
        name: "Updated Automation"
        // missing id
      };

      await expect(api.update(invalidData as AutomationUpdateRequest)).rejects.toThrow(ValidationError);
    });
  });

  describe('delete', () => {
    it('should delete automation with valid id', async () => {
      const validData: AutomationDeleteRequest = {
        id: "one"
      };

      const result = await api.delete(validData);
      expect(result).toBe(true);
    });

    it('should require id field', async () => {
      const invalidData = {};

      await expect(api.delete(invalidData as AutomationDeleteRequest)).rejects.toThrow(ValidationError);
    });
  });

  describe('read', () => {
    it('should read with no parameters', async () => {
      const result = await api.read();
      expect(result).toBeDefined();
    });

    it('should read with valid filter', async () => {
      const validData: AutomationReadRequest = {
        name: "Test Model"
      };

      const result = await api.read(validData);
      expect(result).toBeDefined();
    });

    it('should reject invalid filter data', async () => {
      const invalidData = {
        name: "" // empty name should fail validation
      };

      await expect(api.read(invalidData as AutomationReadRequest)).rejects.toThrow(ValidationError);
    });
  });
});

describe('ValidatedTransactionApi', () => {
  const dataSource = new MockTransactionDataSource();
  const api = new ValidatedTransactionApi(dataSource);

  describe('create', () => {
    it('should create transaction with valid data', async () => {
      const validData: TransactionCreateRequest = {
        automationId: "auto-123",
        timestamp: "2022-01-01T12:00:00Z",
        status: "pending",
        success: false,
        message: "Transaction created",
        type: "outgoing"
      };

      const result = await api.create(validData);
      expect(result).toBeDefined();
      expect(result.automationId).toBe(validData.automationId);
      expect(result.type).toBe(validData.type);
      expect(result.id).toBeDefined();
    });

    it('should throw ValidationError with invalid timestamp', async () => {
      const invalidData = {
        automationId: "auto-123",
        timestamp: "invalid-date",
        status: "pending",
        success: false,
        message: "Transaction created",
        type: "outgoing"
      };

      await expect(api.create(invalidData as TransactionCreateRequest)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError with invalid type', async () => {
      const invalidData = {
        automationId: "auto-123",
        timestamp: "2022-01-01T12:00:00Z",
        status: "pending",
        success: false,
        message: "Transaction created",
        type: "invalid-type"
      };

      await expect(api.create(invalidData as any)).rejects.toThrow(ValidationError);
    });
  });

  describe('update', () => {
    it('should update transaction with valid data', async () => {
      const validData: TransactionUpdateRequest = {
        id: "txn-1",
        status: "completed",
        success: true
      };

      const result = await api.update(validData);
      expect(result).toBeDefined();
      if (result) {
        if (validData.status) {
          expect(result.status).toBe(validData.status);
        }
        if (validData.success !== undefined) {
          expect(result.success).toBe(validData.success);
        }
      }
    });

    it('should require id field', async () => {
      const invalidData = {
        status: "completed"
        // missing id
      };

      await expect(api.update(invalidData as TransactionUpdateRequest)).rejects.toThrow(ValidationError);
    });
  });

  describe('delete', () => {
    it('should delete transaction with valid id', async () => {
      const validData: TransactionDeleteRequest = {
        id: "txn-1"
      };

      const result = await api.delete(validData);
      expect(result).toBe(true);
    });

    it('should require id field', async () => {
      const invalidData = {};

      await expect(api.delete(invalidData as TransactionDeleteRequest)).rejects.toThrow(ValidationError);
    });
  });

  describe('read', () => {
    it('should read with no parameters', async () => {
      const result = await api.read();
      expect(result).toBeDefined();
    });

    it('should read with valid filter', async () => {
      const validData: TransactionReadRequest = {
        automationId: "auto-1",
        type: "incoming"
      };

      const result = await api.read(validData);
      expect(result).toBeDefined();
    });

    it('should reject invalid timestamp in filter', async () => {
      const invalidData = {
        timestamp: "invalid-date"
      };

      await expect(api.read(invalidData as TransactionReadRequest)).rejects.toThrow(ValidationError);
    });
  });
});