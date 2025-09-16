import { z } from 'zod'

// Base Automation schema
export const AutomationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required')
})

// Automation request schemas
export const AutomationCreateRequestSchema = AutomationSchema.omit({ id: true })

export const AutomationUpdateRequestSchema = z.object({
  id: z.string().min(1, 'ID is required')
}).and(
  AutomationSchema.omit({ id: true }).partial()
)

export const AutomationDeleteRequestSchema = AutomationSchema.pick({ id: true })

export const AutomationReadRequestSchema = AutomationSchema.partial()

// Type exports for compatibility
export type AutomationSchemaType = z.infer<typeof AutomationSchema>
export type AutomationCreateRequestSchemaType = z.infer<typeof AutomationCreateRequestSchema>
export type AutomationUpdateRequestSchemaType = z.infer<typeof AutomationUpdateRequestSchema>
export type AutomationDeleteRequestSchemaType = z.infer<typeof AutomationDeleteRequestSchema>
export type AutomationReadRequestSchemaType = z.infer<typeof AutomationReadRequestSchema>