#!/usr/bin/env node

// Simple demonstration of the Zod validation functionality
// This script shows how to use the validation system

import { 
  AutomationCreateRequestSchema, 
  TransactionCreateRequestSchema,
  validateData,
  validateDataWithError,
  ValidationError
} from './src/validation/index.js';

console.log('🔍 Zod Validation Demo\n');

// Test 1: Valid automation create request
console.log('✅ Test 1: Valid automation create request');
const validAutomation = {
  name: "Email Campaign",
  description: "Automated email marketing campaign"
};

const result1 = validateData(AutomationCreateRequestSchema, validAutomation);
console.log('Result:', result1);
console.log();

// Test 2: Invalid automation create request
console.log('❌ Test 2: Invalid automation create request (missing description)');
const invalidAutomation = {
  name: "Email Campaign"
  // missing description
};

const result2 = validateData(AutomationCreateRequestSchema, invalidAutomation);
console.log('Result:', result2);
console.log();

// Test 3: Valid transaction create request
console.log('✅ Test 3: Valid transaction create request');
const validTransaction = {
  automationId: "auto-123",
  timestamp: "2024-01-01T12:00:00Z",
  status: "pending",
  success: false,
  message: "Transaction initiated",
  type: "outgoing"
};

const result3 = validateData(TransactionCreateRequestSchema, validTransaction);
console.log('Result:', result3);
console.log();

// Test 4: Invalid transaction (bad timestamp)
console.log('❌ Test 4: Invalid transaction (bad timestamp format)');
const invalidTransaction = {
  automationId: "auto-123",
  timestamp: "not-a-date",
  status: "pending",
  success: false,
  message: "Transaction initiated",
  type: "outgoing"
};

const result4 = validateData(TransactionCreateRequestSchema, invalidTransaction);
console.log('Result:', result4);
console.log();

// Test 5: ValidationError demonstration
console.log('💥 Test 5: ValidationError demonstration');
try {
  validateDataWithError(AutomationCreateRequestSchema, { name: "" });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Caught ValidationError:', error.message);
    console.log('Error details:', error.errors);
  }
}

console.log('\n🎉 Validation demo completed!');