import mongoose, { Document, Schema } from 'mongoose';

export interface ITheater extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  distance?: number; // Distance in miles (optional, for display)
  createdAt: Date;
  updatedAt: Date;
}

const TheaterSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true,
      maxlength: [200, 'Theater name cannot exceed 200 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [2, 'State must be 2 characters'],
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
    },
    distance: {
      type: Number,
      min: [0, 'Distance cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

export const Theater = mongoose.model<ITheater>('Theater', TheaterSchema);
