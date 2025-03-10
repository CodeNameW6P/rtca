import { Response } from "express";
import Message from "../models/message.model";
import cloudinary from "../config/cloudinary";
import Chat from "../models/chat.model";
import { io } from "../config/socket.io";

export const getMessages = async (req: any, res: Response) => {
    try {
        const messages = await Message.find({ chat: req.params._id })
            .populate("sender", "-password")
            .sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};

export const sendMessage = async (req: any, res: Response) => {
    try {
        const text = req.body.text.trim();
        const file = req.body.file;

        const senderID = req.userData._id;
        const chatID = req.params._id;

        let fileURL;
        if (file) {
            const uploadResponse = await cloudinary.uploader.upload(file);
            fileURL = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            sender: senderID,
            chat: chatID,
            text: text,
            file: fileURL,
        });

        if (!newMessage) {
            res.status(400).json("Couldn't create a message");
            return;
        }

        const updatedChat = await Chat.findOneAndUpdate({ _id: chatID }, { lastMessage: newMessage._id });

        if (!updatedChat) {
            res.status(400).json("Couldn't update last message");
            return;
        }

        const newPopulatedMessage = await Message.findOne({ _id: newMessage._id }).populate("sender", "-password");

        io.emit("newMessage", newPopulatedMessage);

        res.status(200).json(newPopulatedMessage);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};
