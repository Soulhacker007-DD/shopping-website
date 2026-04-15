import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage {
    role: "user" | "model";
    content: string;
    timestamp: Date;
}

export interface IChat extends Document {
    userId: string;
    messages: IMessage[];
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    role: { type: String, enum: ["user", "model"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new Schema<IChat>({
    userId: { type: String, required: true, index: true },
    messages: [MessageSchema],
}, { timestamps: true });

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
