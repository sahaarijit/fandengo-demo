import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  poster: string;
  genres: string[];
  mpaaRating: string; // G, PG, PG-13, R, NR
  rating: number; // 0-5
  releaseYear: number;
  duration: number; // in minutes
  cast: string[];
  director: string;
  trailerUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    poster: {
      type: String,
      required: [true, 'Poster URL is required'],
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one genre is required',
      },
    },
    mpaaRating: {
      type: String,
      required: [true, 'MPAA rating is required'],
      enum: {
        values: ['G', 'PG', 'PG-13', 'R', 'NR'],
        message: 'MPAA rating must be G, PG, PG-13, R, or NR',
      },
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
      min: [1900, 'Release year must be 1900 or later'],
      max: [new Date().getFullYear() + 2, 'Release year cannot be more than 2 years in the future'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    cast: {
      type: [String],
      required: [true, 'Cast is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one cast member is required',
      },
    },
    director: {
      type: String,
      required: [true, 'Director is required'],
      trim: true,
    },
    trailerUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for search and filtering
MovieSchema.index({ title: 'text' });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ mpaaRating: 1 });
MovieSchema.index({ releaseYear: 1 });
MovieSchema.index({ rating: -1 });

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
