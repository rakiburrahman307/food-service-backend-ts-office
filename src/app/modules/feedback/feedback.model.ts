import mongoose, { Schema, Document } from 'mongoose';
import { IFeedback } from './feedback.interface';

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    shopId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    ratings: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true }
);
const FeedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default FeedbackModel;
