import mongoose, { Document, Schema } from 'mongoose';

export interface IWatchlist extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique combination of userId and movieId
WatchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
