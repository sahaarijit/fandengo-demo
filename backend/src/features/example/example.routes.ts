import { Router } from 'express'
import { ExampleController } from './example.controller'
import { validate } from '../../shared/middleware/validation.middleware'
import {
  createExampleSchema,
  updateExampleSchema,
  exampleIdSchema,
} from './example.schema'

const router = Router()
const exampleController = new ExampleController()

// GET /api/examples - Get all examples
router.get('/', exampleController.getAll)

// GET /api/examples/:id - Get example by ID
router.get('/:id', validate(exampleIdSchema, 'params'), exampleController.getById)

// POST /api/examples - Create new example
router.post('/', validate(createExampleSchema), exampleController.create)

// PUT /api/examples/:id - Update example
router.put(
  '/:id',
  validate(exampleIdSchema, 'params'),
  validate(updateExampleSchema),
  exampleController.update
)

// DELETE /api/examples/:id - Delete example (soft delete)
router.delete('/:id', validate(exampleIdSchema, 'params'), exampleController.delete)

export default router
