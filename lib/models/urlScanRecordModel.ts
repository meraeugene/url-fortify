import { Schema, model, models, Document } from "mongoose";

export interface IURLScanRecord extends Document {
  userId: string;
  maxLookupsUsed: number;
  lastURLScanDate: Date;
  maxLookups: number;
}

const URLScanRecordSchema = new Schema<IURLScanRecord>({
  userId: {
    type: String,
    required: true,
  },
  maxLookups: {
    type: Number,
    required: true,
    default: 5,
  },
  maxLookupsUsed: {
    type: Number,
    required: true,
    default: 0,
  },
  lastURLScanDate: {
    type: Date,
  },
});

const URLScanRecord =
  models?.URLScanRecord ||
  model<IURLScanRecord>("URLScanRecord", URLScanRecordSchema);

export default URLScanRecord;
