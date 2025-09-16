import { z } from 'zod'

// Transaction type enum
export const TransactionTypeSchema = z.enum(['incoming', 'outgoing'])

// Base Transaction schema
export const TransactionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  automationId: z.string().min(1, 'Automation ID is required'),
  timestamp: z.string().datetime('Invalid timestamp format'),
  status: z.string().min(1, 'Status is required'),
  success: z.boolean(),
  message: z.string().min(1, 'Message is required'),
  type: TransactionTypeSchema
})

// Transaction request schemas
export const TransactionCreateRequestSchema = TransactionSchema.omit({ id: true })

export const TransactionUpdateRequestSchema = z.object({
  id: z.string().min(1, 'ID is required')
}).and(
  TransactionSchema.omit({ id: true }).partial()
)

export const TransactionDeleteRequestSchema = TransactionSchema.pick({ id: true })

export const TransactionReadRequestSchema = TransactionSchema.partial()

// Type exports for compatibility
export type TransactionSchemaType = z.infer<typeof TransactionSchema>
export type TransactionCreateRequestSchemaType = z.infer<typeof TransactionCreateRequestSchema>
export type TransactionUpdateRequestSchemaType = z.infer<typeof TransactionUpdateRequestSchema>
export type TransactionDeleteRequestSchemaType = z.infer<typeof TransactionDeleteRequestSchema>
export type TransactionReadRequestSchemaType = z.infer<typeof TransactionReadRequestSchema>