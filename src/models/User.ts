import { model, Schema, Document } from "mongoose";

type Role = 'admin' | 'user'

export interface IUserInput {
    fullname: string
    email: string
    role: Role
    password: string
    refreshToken: string | null
}
export interface IUserOutput extends IUserInput, Document {
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new Schema<IUserOutput>(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        refreshToken: {
            type: String,
            select: false,
            default: null
        },
    },
    {
        timestamps: true
    }
)

export const User = model<IUserOutput>('User', userSchema)