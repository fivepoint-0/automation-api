import { describe, it, expect } from "bun:test";
import { 
  AutomationCreateRequestSchema,
  AutomationUpdateRequestSchema,
  AutomationDeleteRequestSchema,
  AutomationReadRequestSchema,
  AutomationSchema
} from "@/validation/automation-schemas";
import { validateData, validateDataWithError, ValidationError } from "@/validation/validation-utils";

describe('Automation Validation Schemas', () => {
  describe('AutomationSchema', () => {
    it('should validate a valid automation object', () => {
      const validAutomation = {
        id: "123",
        name: "Test Automation",
        description: "This is a test automation"
      };

      const result = validateData(AutomationSchema, validAutomation);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validAutomation);
      }
    });

    it('should reject automation with missing required fields', () => {
      const invalidAutomation = {
        id: "123"
        // missing name and description
      };

      const result = validateData(AutomationSchema, invalidAutomation);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('name: Required');
        expect(result.errors).toContain('description: Required');
      }
    });

    it('should reject automation with empty strings', () => {
      const invalidAutomation = {
        id: "",
        name: "",
        description: ""
      };

      const result = validateData(AutomationSchema, invalidAutomation);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some(e => e.includes('ID is required'))).toBe(true);
        expect(result.errors.some(e => e.includes('Name is required'))).toBe(true);
        expect(result.errors.some(e => e.includes('Description is required'))).toBe(true);
      }
    });
  });

  describe('AutomationCreateRequestSchema', () => {
    it('should validate a valid create request', () => {
      const validCreateRequest = {
        name: "New Automation",
        description: "This is a new automation"
      };

      const result = validateData(AutomationCreateRequestSchema, validCreateRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validCreateRequest);
      }
    });

    it('should reject create request with id field', () => {
      const invalidCreateRequest = {
        id: "123", // id should not be present
        name: "New Automation",
        description: "This is a new automation"
      };

      const result = validateData(AutomationCreateRequestSchema, invalidCreateRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('AutomationUpdateRequestSchema', () => {
    it('should validate a valid update request', () => {
      const validUpdateRequest = {
        id: "123",
        name: "Updated Automation"
      };

      const result = validateData(AutomationUpdateRequestSchema, validUpdateRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUpdateRequest);
      }
    });

    it('should require id field', () => {
      const invalidUpdateRequest = {
        name: "Updated Automation"
        // missing id
      };

      const result = validateData(AutomationUpdateRequestSchema, invalidUpdateRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('id: Required');
      }
    });

    it('should allow partial updates', () => {
      const validPartialUpdate = {
        id: "123",
        description: "Updated description only"
      };

      const result = validateData(AutomationUpdateRequestSchema, validPartialUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('AutomationDeleteRequestSchema', () => {
    it('should validate a valid delete request', () => {
      const validDeleteRequest = {
        id: "123"
      };

      const result = validateData(AutomationDeleteRequestSchema, validDeleteRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validDeleteRequest);
      }
    });

    it('should require id field', () => {
      const invalidDeleteRequest = {};

      const result = validateData(AutomationDeleteRequestSchema, invalidDeleteRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('id: Required');
      }
    });
  });

  describe('AutomationReadRequestSchema', () => {
    it('should validate an empty read request', () => {
      const validReadRequest = {};

      const result = validateData(AutomationReadRequestSchema, validReadRequest);
      expect(result.success).toBe(true);
    });

    it('should validate a partial read request', () => {
      const validReadRequest = {
        name: "Test Automation"
      };

      const result = validateData(AutomationReadRequestSchema, validReadRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validReadRequest);
      }
    });

    it('should validate a full read request', () => {
      const validReadRequest = {
        id: "123",
        name: "Test Automation",
        description: "This is a test"
      };

      const result = validateData(AutomationReadRequestSchema, validReadRequest);
      expect(result.success).toBe(true);
    });
  });
});

describe('Validation Utilities', () => {
  describe('validateDataWithError', () => {
    it('should return validated data for valid input', () => {
      const validData = {
        name: "Test",
        description: "Test description"
      };

      const result = validateDataWithError(AutomationCreateRequestSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should throw ValidationError for invalid input', () => {
      const invalidData = {
        name: "" // empty name should fail validation
      };

      expect(() => {
        validateDataWithError(AutomationCreateRequestSchema, invalidData);
      }).toThrow(ValidationError);
    });
  });
});