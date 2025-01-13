import mongoose, {Schema, Document} from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
    _id: mongoose.Schema.Types.ObjectId,
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
    
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        trim: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        length: 6
    },
    verifyCode: {
        type: String,
        required: [true, 'Please provide a verify code']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Please provide a verify code expiry']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;