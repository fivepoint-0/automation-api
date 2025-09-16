import { z } from 'zod'

/**
 * Generic validation result type
 */
export type ValidationResult<T> = {
  success: true
  data: T
} | {
  success: false
  errors: string[]
}

/**
 * Validates data against a Zod schema and returns a structured result
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return {
      success: false,
      errors: ['Unknown validation error']
    }
  }
}

/**
 * Validates data against a Zod schema and throws on failure
 */
export function validateDataStrict<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(`Validation failed: ${errors.join(', ')}`)
    this.name = 'ValidationError'
  }
}

/**
 * Validates data and throws ValidationError on failure
 */
export function validateDataWithError<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = validateData(schema, data)
  if (!result.success) {
    throw new ValidationError(result.errors)
  }
  return result.data
}