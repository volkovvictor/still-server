import { model, Schema, Document } from "mongoose";

export interface IUserInput {
    fullname: string
    login: string
    role: 'admin' | 'user'
}
interface IUserOutput extends IUserInput, Document {
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new Schema<IUserOutput>(
    {
        fullname: { type: String, required: true },
        login: { type: String, required: true, unique: true },
        role: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

export const User = model<IUserOutput>('User', userSchema)