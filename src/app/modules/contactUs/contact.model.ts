import mongoose, { Schema } from 'mongoose';
import { IHelpContact } from './contact.interface';

// Create the schema
const helpContactSchema = new Schema<IHelpContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false}
  },
  { timestamps: true }
);

const Help = mongoose.model<IHelpContact>('Help', helpContactSchema);

export default Help;
