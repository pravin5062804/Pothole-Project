import mongoose from 'mongoose';

const confirmationVoteSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    voterName: {
      type: String,
      default: 'Anonymous Citizen',
    },
    vote: {
      type: String,
      enum: ['confirm', 'dispute'],
      required: [true, 'Vote type must be confirm or dispute'],
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
    photo: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple votes by the same authenticated user on the same issue
confirmationVoteSchema.index({ issueId: 1, userId: 1 }, { unique: true, sparse: true });

export const ConfirmationVote = mongoose.model('ConfirmationVote', confirmationVoteSchema);
