import { model, Schema, Document, Types } from "mongoose";

export type PhotoType = 'preview' | 'portfolio' | 'user'

export interface IPhotoInput {
    src: string
    position: number
    userID?: Types.ObjectId
    photoshootID?: Types.ObjectId
    type: PhotoType

    isLiked?: boolean
    isPurchased?: boolean
    isAddedToCart?: boolean
}

interface IPhotoOutput extends IPhotoInput, Document {
    createdAt: Date,
    updatedAt: Date
}

const isRequired = (photo: IPhotoOutput, type: PhotoType) => {
    return photo.type === type
}

const  photoSchema = new Schema<IPhotoOutput>(
    {
        src: { type: String, required: true },
        position: { type: Number, required: true },
        userID: { type: Schema.Types.ObjectId, required: function (this) {
            return isRequired(this, 'user')
        }},
        photoshootID: { type: Schema.Types.ObjectId, required: function (this) {
            return isRequired(this, 'portfolio')
        }},
        type: { type: String, required: true, enum: ['preview', 'portfolio', 'user'] },

        isLiked: { type: Boolean, default: false, required: function(this) {
            return isRequired(this, 'user')
        } },
        isPurchased: { type: Boolean, default: false, required: function(this) {
            return isRequired(this, 'user')
        } },
        isAddedToCart: { type: Boolean, default: false, required: function(this) {
            return isRequired(this, 'user')
        } },
    },
    {
        timestamps: true,
    }
)

photoSchema.index({ type: 1, position: 1})
photoSchema.index({ userID: 1 })
photoSchema.index({ photoshootID: 1 })

export const Photo = model<IPhotoOutput>('Photo', photoSchema)