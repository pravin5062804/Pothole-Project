import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedByName: {
      type: String,
      default: 'System',
    },
    note: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the issue'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['pothole', 'garbage', 'drainage', 'streetlight', 'water', 'other'],
      default: 'other',
      index: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    severityWeight: {
      type: Number,
      default: 2, // low: 1, medium: 2, high: 3, critical: 4
    },
    photos: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    ward: {
      type: String,
      trim: true,
      default: 'Ward A',
    },
    aiClassification: {
      label: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
      reasoning: { type: String, default: '' },
      processedAt: { type: Date },
    },
    needsManualReview: {
      type: Boolean,
      default: false,
    },
    recurrenceCount: {
      type: Number,
      default: 1,
    },
    duplicateReportIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue',
      },
    ],
    priorityScore: {
      type: Number,
      default: 10,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'reported',
        'verified',
        'assigned',
        'in_progress',
        'pending_confirmation',
        'resolved',
        'reopened',
      ],
      default: 'reported',
      index: true,
    },
    disputedResolution: {
      type: Boolean,
      default: false,
    },
    reporters: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        reportedAt: { type: Date, default: Date.now },
      },
    ],
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedCrewName: {
      type: String,
      default: '',
    },
    resolutionEvidence: [
      {
        url: { type: String },
        public_id: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolutionSubmittedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    confirmationWindowExpiresAt: {
      type: Date,
    },
    timeline: [timelineEventSchema],
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial queries
issueSchema.index({ location: '2dsphere' });

// Auto-generate ticketId before saving if not present
issueSchema.pre('save', function (next) {
  if (!this.ticketId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.ticketId = `CR-${new Date().getFullYear()}-${randomSuffix}`;
  }

  // Update severity weight
  const weights = { low: 1, medium: 2, high: 3, critical: 4 };
  this.severityWeight = weights[this.severity] || 2;

  // Auto-calculate priorityScore if not customized
  if (this.isModified('severity') || this.isModified('recurrenceCount') || !this.priorityScore) {
    this.priorityScore = Number((this.severityWeight * this.recurrenceCount * 10).toFixed(1));
  }

  if (typeof next === 'function') next();
});

export const Issue = mongoose.model('Issue', issueSchema);
