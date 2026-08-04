import { model, Schema, Document, Types } from "mongoose";

export interface IPhotoshootInput {
    previewSrc: string
    position: number
    userID?: Types.ObjectId
    date: Date
}

interface IPhotoshootOutput extends IPhotoshootInput, Document {
    createdAt: Date,
    updatedAt: Date
}

const photoshootSchema = new Schema<IPhotoshootOutput>(
    {
        previewSrc: { type: String, required: true },
        position: { type: Number, required: true, min: 1 },
        userID: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date }
    },
    {
        timestamps: true
    }
)

photoshootSchema.index({ date: -1, position: 1 });

export const Photoshoot = model<IPhotoshootOutput>('Photoshoot', photoshootSchema)