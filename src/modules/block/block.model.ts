import mongoose, { Schema } from "mongoose";

export class BlockDto {
  _id?: mongoose.Types.ObjectId;
  hash?: string;
  parentHash?: string;
  number?: number;
  timestamp?: number;
  gasUsed?: string;
  createdAt?: Date;
}

const blockSchema = new Schema({
  hash: {
    type: String,
    required: false,
  },
  parentHash: {
    type: String,
    required: false,
  },
  number: {
    type: Number,
    required: false,
  },
  timestamp: {
    type: Number,
    required: false,
  },
  gasUsed: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blockModel = mongoose.model("Block", blockSchema);

export default blockModel;
