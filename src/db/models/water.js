import { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      //type: Date,
      type: String,
      required: true,
    },
    currentDailyNorm: {
      type: Number,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterCollection = model('water', waterSchema);
