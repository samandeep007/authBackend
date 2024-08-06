import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    avatar: {
        type: String,
        required: true
    },

    refreshToken: String

}, {timestamps: true})