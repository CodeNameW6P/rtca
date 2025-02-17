import { Response } from "express";
import Chat from "../models/chat.model";

export const createChat = async (req: any, res: Response) => {
    try {
        const name = req.body.name;
        const isGroupChat = req.body.isGroupChat;
        const users = req.body.users;
        const groupAdmin = req.body.groupAdmin;

        if (!isGroupChat) {
            const existingChat = await Chat.findOne({
                isGroupChat: false,
                users: { $all: users, $size: users.length },
            }).populate("users", "-password");

            if (existingChat) {
                res.status(200).json(existingChat);
                return;
            }
        }

        const newChat = await Chat.create({
            name: name,
            isGroupChat: isGroupChat,
            users: users,
            groupAdmin: groupAdmin,
        });

        if (newChat) {
            const populatedChat = await Chat.findOne({ _id: newChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate("lastMessage");

            res.status(200).json(populatedChat);
        } else {
            res.status(400).json({ message: "Chat creation failed and it's definitely not my fault ^^;" });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};

export const getChats = async (req: any, res: Response) => {
    try {
        const chats = await Chat.find({ users: { $in: [req.params._id] } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("lastMessage");

        res.status(200).json(chats);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};

export const updateChat = async (req: any, res: Response) => {
    try {
        const _id = req.body._id;
        const name = req.body.name;
        const users = req.body.users;

        const updatedChat = await Chat.findOneAndUpdate({ _id: _id }, { name: name, users: users }, { new: true })
            .populate("users", "-password")
            .populate("lastMessage")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(400).json({ message: "Couldn't update chat or chat doesn't exist" });
            return;
        }

        res.status(200).json(updatedChat);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};

export const deleteChat = async (req: any, res: Response) => {
    try {
        const deletedChat = await Chat.findOneAndDelete({ _id: req.params._id });

        if (!deletedChat) {
            res.status(400).json({ message: "Couldn't delete chat or chat doesn't exist" });
            return;
        }

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};
