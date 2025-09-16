import { describe, it, expect } from "bun:test";
import { 
  TransactionCreateRequestSchema,
  TransactionUpdateRequestSchema,
  TransactionDeleteRequestSchema,
  TransactionReadRequestSchema,
  TransactionSchema,
  TransactionTypeSchema
} from "@/validation/transaction-schemas";
import { validateData, validateDataWithError, ValidationError } from "@/validation/validation-utils";

describe('Transaction Validation Schemas', () => {
  describe('TransactionTypeSchema', () => {
    it('should validate valid transaction types', () => {
      expect(validateData(TransactionTypeSchema, 'incoming').success).toBe(true);
      expect(validateData(TransactionTypeSchema, 'outgoing').success).toBe(true);
    });

    it('should reject invalid transaction types', () => {
      const result = validateData(TransactionTypeSchema, 'invalid');
      expect(result.success).toBe(false);
    });
  });

  describe('TransactionSchema', () => {
    it('should validate a valid transaction object', () => {
      const validTransaction = {
        id: "456",
        automationId: "123",
        timestamp: "2022-01-01T00:00:00Z",
        status: "success",
        success: true,
        message: "Transaction completed successfully",
        type: "incoming" as const
      };

      const result = validateData(TransactionSchema, validTransaction);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validTransaction);
      }
    });

    it('should reject transaction with missing required fields', () => {
      const invalidTransaction = {
        id: "456"
        // missing other required fields
      };

      const result = validateData(TransactionSchema, invalidTransaction);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some(e => e.includes('Automation ID is required'))).toBe(true);
        expect(result.errors.some(e => e.includes('Invalid timestamp format'))).toBe(true);
        expect(result.errors.some(e => e.includes('Status is required'))).toBe(true);
        expect(result.errors.some(e => e.includes('Message is required'))).toBe(true);
      }
    });

    it('should reject transaction with invalid timestamp', () => {
      const invalidTransaction = {
        id: "456",
        automationId: "123",
        timestamp: "invalid-date",
        status: "success",
        success: true,
        message: "Transaction completed",
        type: "incoming" as const
      };

      const result = validateData(TransactionSchema, invalidTransaction);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some(e => e.includes('Invalid timestamp format'))).toBe(true);
      }
    });

    it('should reject transaction with invalid type', () => {
      const invalidTransaction = {
        id: "456",
        automationId: "123",
        timestamp: "2022-01-01T00:00:00Z",
        status: "success",
        success: true,
        message: "Transaction completed",
        type: "invalid"
      };

      const result = validateData(TransactionSchema, invalidTransaction);
      expect(result.success).toBe(false);
    });
  });

  describe('TransactionCreateRequestSchema', () => {
    it('should validate a valid create request', () => {
      const validCreateRequest = {
        automationId: "123",
        timestamp: "2022-01-01T00:00:00Z",
        status: "success",
        success: true,
        message: "Transaction completed successfully",
        type: "incoming" as const
      };

      const result = validateData(TransactionCreateRequestSchema, validCreateRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validCreateRequest);
      }
    });

    it('should reject create request with id field', () => {
      const invalidCreateRequest = {
        id: "456", // id should not be present
        automationId: "123",
        timestamp: "2022-01-01T00:00:00Z",
        status: "success",
        success: true,
        message: "Transaction completed",
        type: "incoming" as const
      };

      const result = validateData(TransactionCreateRequestSchema, invalidCreateRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('TransactionUpdateRequestSchema', () => {
    it('should validate a valid update request', () => {
      const validUpdateRequest = {
        id: "456",
        status: "updated",
        message: "Transaction updated"
      };

      const result = validateData(TransactionUpdateRequestSchema, validUpdateRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUpdateRequest);
      }
    });

    it('should require id field', () => {
      const invalidUpdateRequest = {
        status: "updated"
        // missing id
      };

      const result = validateData(TransactionUpdateRequestSchema, invalidUpdateRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('id: Required');
      }
    });

    it('should allow partial updates', () => {
      const validPartialUpdate = {
        id: "456",
        success: false
      };

      const result = validateData(TransactionUpdateRequestSchema, validPartialUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate timestamp format in updates', () => {
      const invalidUpdateRequest = {
        id: "456",
        timestamp: "invalid-date"
      };

      const result = validateData(TransactionUpdateRequestSchema, invalidUpdateRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some(e => e.includes('Invalid timestamp format'))).toBe(true);
      }
    });
  });

  describe('TransactionDeleteRequestSchema', () => {
    it('should validate a valid delete request', () => {
      const validDeleteRequest = {
        id: "456"
      };

      const result = validateData(TransactionDeleteRequestSchema, validDeleteRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validDeleteRequest);
      }
    });

    it('should require id field', () => {
      const invalidDeleteRequest = {};

      const result = validateData(TransactionDeleteRequestSchema, invalidDeleteRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('id: Required');
      }
    });
  });

  describe('TransactionReadRequestSchema', () => {
    it('should validate an empty read request', () => {
      const validReadRequest = {};

      const result = validateData(TransactionReadRequestSchema, validReadRequest);
      expect(result.success).toBe(true);
    });

    it('should validate a partial read request', () => {
      const validReadRequest = {
        automationId: "123",
        type: "incoming" as const
      };

      const result = validateData(TransactionReadRequestSchema, validReadRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validReadRequest);
      }
    });

    it('should validate a full read request', () => {
      const validReadRequest = {
        id: "456",
        automationId: "123",
        timestamp: "2022-01-01T00:00:00Z",
        status: "success",
        success: true,
        message: "Transaction completed",
        type: "incoming" as const
      };

      const result = validateData(TransactionReadRequestSchema, validReadRequest);
      expect(result.success).toBe(true);
    });

    it('should reject read request with invalid timestamp', () => {
      const invalidReadRequest = {
        timestamp: "invalid-date"
      };

      const result = validateData(TransactionReadRequestSchema, invalidReadRequest);
      expect(result.success).toBe(false);
    });
  });
});