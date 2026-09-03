import { model, Schema, Document, Types } from "mongoose";

export type PhotoType = 'preview' | 'portfolio' | 'account'

export interface IPhotoInput {
    src: string
    position: number,
    size: number,
    photoPublicId: string,
    userID?: Types.ObjectId
    photoshootID?: Types.ObjectId
    type: PhotoType
    width: number,
    height: number,

    isLiked?: boolean
    isPurchased?: boolean
    isAddedToCart?: boolean
}

export interface IPhotoOutput extends IPhotoInput, Document {
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
        size: { type: Number, default: 1 },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        userID: { type: Schema.Types.ObjectId, required: function (this) {
            return isRequired(this, 'account')
        }},
        photoshootID: { type: Schema.Types.ObjectId, required: function (this) {
            return isRequired(this, 'portfolio')
        }},
        photoPublicId: { type: String },
        type: { type: String, required: true, enum: ['preview', 'portfolio', 'account'] },

        isLiked: { type: Boolean, default: false, required: function(this) {
            return isRequired(this, 'account')
        } },
        isPurchased: { type: Boolean, default: false, required: function(this) {
            return isRequired(this, 'account')
        } },
        isAddedToCart: { type: Boolean, default: false, required: function(this) {
            return isRequired(this, 'account')
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