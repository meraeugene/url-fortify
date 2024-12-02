import { Schema, model, models, Document } from "mongoose";

export interface URLScanRecordType extends Document {
  userId: string;
  lastURLScanDate: Date;
  totalURLScans: number;
  URLScanLimitPerMonth: number;
}

const URLScanRecordSchema = new Schema<URLScanRecordType>({
  userId: {
    type: String,
    required: true,
  },
  totalURLScans: {
    type: Number,
    required: true,
    default: 0,
  },
  lastURLScanDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  URLScanLimitPerMonth: {
    type: Number,
    required: true,
    default: 5,
  },
});

const URLScanRecord =
  models?.URLScanRecord ||
  model<URLScanRecordType>("URLScanRecord", URLScanRecordSchema);

export default URLScanRecord;
