import mongoose, { Document, Schema } from 'mongoose';

export interface IShowtime extends Document {
  _id: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  theaterId: mongoose.Types.ObjectId;
  date: Date;
  time: string; // Format: "HH:MM" (24-hour format)
  createdAt: Date;
  updatedAt: Date;
}

const ShowtimeSchema: Schema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie ID is required'],
    },
    theaterId: {
      type: Schema.Types.ObjectId,
      ref: 'Theater',
      required: [true, 'Theater ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format (24-hour)'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for querying
ShowtimeSchema.index({ movieId: 1, date: 1 });
ShowtimeSchema.index({ theaterId: 1 });

export const Showtime = mongoose.model<IShowtime>('Showtime', ShowtimeSchema);
