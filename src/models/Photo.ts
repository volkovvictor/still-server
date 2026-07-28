import { model, Schema, Document, Types } from "mongoose";

type PhotoType = 'preview' | 'portfolio' | 'user'

export interface IPhoto extends Document {
    src: string
    position: number
    userID?: Types.ObjectId
    photoshootID?: Types.ObjectId
    type: PhotoType

    isLiked?: boolean
    isPurchased?: boolean
    isAddedToCart?: boolean
}

const isRequired = (photo: IPhoto, type: PhotoType) => {
    return photo.type === type
}

const  photoSchema = new Schema<IPhoto>(
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

export const Photo = model<IPhoto>('Photo', photoSchema)