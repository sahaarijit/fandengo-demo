import mongoose, { Document, Schema } from 'mongoose'

export interface IExample extends Document {
  name: string
  description: string
  quantity: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ExampleSchema = new Schema<IExample>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
ExampleSchema.index({ name: 1 })
ExampleSchema.index({ isActive: 1 })
ExampleSchema.index({ createdAt: -1 })

export const Example = mongoose.model<IExample>('Example', ExampleSchema)
