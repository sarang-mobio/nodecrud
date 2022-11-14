import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';

/**
 * User Schema
 */
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            required: true
        },
        posts: [
            {
                postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
            }
        ]
    },
    { timestamps: true }
);

/**
 * Pre Save Middleware
 */
userSchema.pre<User>('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(user.password, 10);

    user.password = hash;

    next();
});

/**
 * Check For Valid Password
 *
 * @param password
 * @returns
 */
userSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
    const user = this;

    return await bcrypt.compare(password, user.password);
}

export default model<User>('User', userSchema);