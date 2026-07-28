import { model, Schema, Document } from "mongoose";

interface IUser extends Document {
    fullname: string
    login: string
    role: 'admin' | 'user'
}

const userSchema = new Schema<IUser>(
    {
        fullname: { type: String, required: true },
        login: { type: String, required: true, unique: true },
        role: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

export const User = model<IUser>('User', userSchema)