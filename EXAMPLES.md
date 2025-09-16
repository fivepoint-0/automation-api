# Usage Examples

Here are practical examples of how to use the new Zod validation system in your automation API.

## Basic Validation Examples

```typescript
import { 
  AutomationCreateRequestSchema, 
  TransactionCreateRequestSchema,
  validateData,
  ValidationError 
} from '@/validation';

// Example 1: Validate automation creation data
const automationData = {
  name: "My Automation",
  description: "Processes incoming webhooks"
};

const result = validateData(AutomationCreateRequestSchema, automationData);
if (result.success) {
  console.log('✅ Valid data:', result.data);
  // result.data is fully typed and validated
} else {
  console.log('❌ Validation errors:', result.errors);
  // ["name: Name is required", "description: Description is required"]
}

// Example 2: Validate transaction data
const transactionData = {
  automationId: "auto-123",
  timestamp: "2024-01-01T12:00:00Z",
  status: "completed",
  success: true,
  message: "Successfully processed",
  type: "incoming" as const
};

const txResult = validateData(TransactionCreateRequestSchema, transactionData);
```

## Using Validated API Classes

```typescript
import { ValidatedAutomationApi, ValidatedTransactionApi } from '@/api';
import { ValidationError } from '@/validation';

// Initialize with your data source
const automationApi = new ValidatedAutomationApi(dataSource);
const transactionApi = new ValidatedTransactionApi(dataSource);

// Example: Create automation with validation
async function createAutomation() {
  try {
    const automation = await automationApi.create({
      name: "Website Monitor",
      description: "Monitors website uptime and sends alerts"
    });
    console.log('Created automation:', automation);
    return automation;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:', error.errors);
      // Handle validation errors
    } else {
      console.error('Other error:', error);
      // Handle other types of errors
    }
  }
}

// Example: Update automation
async function updateAutomation(id: string) {
  try {
    const updated = await automationApi.update({
      id,
      name: "Updated Website Monitor",
      // description is optional in updates
    });
    console.log('Updated automation:', updated);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Invalid update data:', error.errors);
    }
  }
}

// Example: Create transaction
async function createTransaction() {
  try {
    const transaction = await transactionApi.create({
      automationId: "auto-123",
      timestamp: new Date().toISOString(),
      status: "processing",
      success: false,
      message: "Starting automation execution",
      type: "incoming"
    });
    console.log('Created transaction:', transaction);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Invalid transaction data:', error.errors);
    }
  }
}

// Example: Read with filters
async function findTransactions() {
  try {
    const transactions = await transactionApi.read({
      automationId: "auto-123",
      type: "incoming",
      success: true
    });
    console.log('Found transactions:', transactions);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Invalid filter criteria:', error.errors);
    }
  }
}
```

## Common Validation Patterns

```typescript
// Pattern 1: Validate user input from API endpoints
app.post('/automations', async (req, res) => {
  const result = validateData(AutomationCreateRequestSchema, req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.errors
    });
  }
  
  // Use result.data (validated and typed)
  const automation = await automationApi.create(result.data);
  res.json(automation);
});

// Pattern 2: Validate configuration objects
function configureAutomation(config: unknown) {
  try {
    const validConfig = validateDataWithError(AutomationUpdateRequestSchema, config);
    // validConfig is now typed and validated
    return processConfig(validConfig);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(`Invalid configuration: ${error.errors.join(', ')}`);
    }
    throw error;
  }
}

// Pattern 3: Validate data from external sources
async function processWebhookData(webhookPayload: unknown) {
  const transactionResult = validateData(TransactionCreateRequestSchema, webhookPayload);
  
  if (transactionResult.success) {
    await transactionApi.create(transactionResult.data);
  } else {
    console.warn('Invalid webhook data:', transactionResult.errors);
    // Maybe store in error log or retry queue
  }
}
```

## Error Handling Best Practices

```typescript
// Comprehensive error handling
async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ValidationError) {
      // Log validation errors for debugging
      console.error('Validation Error:', {
        message: error.message,
        errors: error.errors,
        timestamp: new Date().toISOString()
      });
      
      // Could send to error tracking service
      // errorTracker.captureValidationError(error);
      
      return null;
    } else {
      // Re-throw non-validation errors
      throw error;
    }
  }
}

// Usage
const automation = await safeApiCall(() => 
  automationApi.create({
    name: "Test",
    description: "Test automation"
  })
);

if (automation) {
  console.log('Success:', automation);
} else {
  console.log('Failed due to validation errors');
}
```

## Migration Example

```typescript
// Before: Using basic API classes
import { AutomationApi } from '@/api';

const api = new AutomationApi(dataSource);

// No validation - could fail with runtime errors
await api.create({
  name: "", // This would cause issues later
  description: "Test"
});

// After: Using validated API classes
import { ValidatedAutomationApi } from '@/api';
import { ValidationError } from '@/validation';

const validatedApi = new ValidatedAutomationApi(dataSource);

try {
  await validatedApi.create({
    name: "", // This will be caught immediately
    description: "Test"
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Caught validation error:', error.errors);
    // ["name: Name is required"]
  }
}
```

This validation system helps catch data issues early and provides clear, actionable error messages to help developers fix problems quickly.