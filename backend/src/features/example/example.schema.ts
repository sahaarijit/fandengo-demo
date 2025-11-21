import { z } from 'zod'

export const createExampleSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
  quantity: z
    .number({
      required_error: 'Quantity is required',
    })
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
  isActive: z.boolean().optional().default(true),
})

export const updateExampleSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(500).trim().optional(),
  quantity: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export const exampleIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid example ID format'),
})

export type CreateExampleDto = z.infer<typeof createExampleSchema>
export type UpdateExampleDto = z.infer<typeof updateExampleSchema>
export type ExampleIdParams = z.infer<typeof exampleIdSchema>
