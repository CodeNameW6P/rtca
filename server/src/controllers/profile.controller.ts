import { Response } from "express";
import User from "../models/user.model";

export const getProfile = async (req: any, res: Response) => {
    try {
        const existingUser = await User.findOne({ _id: req.userData._id });
        if (!existingUser) {
            res.status(404).json({ message: "Couldn't find user" });
            return;
        }

        res.status(200).json({
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            profilePicture: existingUser.profilePicture,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const username = req.body.username.trim();
        const profilePicture = req.body.profilePicture.trim();

        if (!username || typeof username !== "string" || username.length === 0) {
            res.status(400).json({ message: "Username is required" });
            return;
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.userData._id },
            {
                username: username,
                profilePicture: profilePicture,
            },
            {
                new: true,
            }
        );

        if (!updatedUser) {
            res.status(400).json({ message: "Couldn't edit user or user doesn't exist" });
            return;
        }

        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            profilePicture: updatedUser.profilePicture,
            updatedAt: updatedUser.updatedAt,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};
