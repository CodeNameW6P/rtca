import { Response } from "express";
import Message from "../models/message.model";
import cloudinary from "../config/cloudinary";

export const getMessages = async (req: any, res: Response) => {
    try {
        const senderID = req.user.id;
        const receiverID = req.params.id;

        const messages = await Message.find({
            $or: [
                { sender: senderID, receiver: receiverID },
                { sender: receiverID, receiver: senderID },
            ],
        });

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

        const senderID = req.user.id;
        const receiverID = req.params.id;

        let fileURL;
        if (file) {
            const uploadResponse = await cloudinary.uploader.upload(file);
            fileURL = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            sender: senderID,
            receiver: receiverID,
            text: text,
            file: fileURL,
        });

        res.status(200).json(newMessage);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};
