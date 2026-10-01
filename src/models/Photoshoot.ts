import { model, Schema, Document, Types } from "mongoose";

export interface IPhotoshootInput {
    src: string
    position: number
    userID?: Types.ObjectId
    photoPublicId: string,
    date: Date,
    width: number,
    height: number,
    size: number,
}

interface IPhotoshootOutput extends IPhotoshootInput, Document {
    createdAt: Date,
    updatedAt: Date
}

const photoshootSchema = new Schema<IPhotoshootOutput>(
    {
        src: { type: String, required: true },
        position: { type: Number, required: true, min: 1 },
        userID: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        photoPublicId: { type: String },
        size: { type: Number, default: 1 }
    },
    {
        timestamps: true
    }
)

photoshootSchema.index({ date: -1, position: 1 });

export const Photoshoot = model<IPhotoshootOutput>('Photoshoot', photoshootSchema)