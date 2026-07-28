import { model, Schema, Document, Types } from "mongoose";

interface IPhotoshoot extends Document {
    previewSrc: string
    position: number
    userID: Types.ObjectId
    date: Date
}

const photoshootSchema = new Schema<IPhotoshoot>(
    {
        previewSrc: { type: String, required: true },
        position: { type: Number, required: true, min: 1 },
        userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date }
    },
    {
        timestamps: true
    }
)

photoshootSchema.index({ date: -1, position: 1 });

export const Photoshoot = model<IPhotoshoot>('Photoshoot', photoshootSchema)