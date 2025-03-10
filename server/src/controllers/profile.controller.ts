import { Response } from "express";
import User from "../models/user.model";
import cloudinary from "../config/cloudinary";

export const getProfile = async (req: any, res: Response) => {
    try {
        const existingUser = await User.findOne({ _id: req.userData._id }).select("-password");
        if (!existingUser) {
            res.status(404).json({ message: "Couldn't find user" });
            return;
        }

        res.status(200).json(existingUser);
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
        const profilePicture = req.body.profilePicture;

        if (!username || typeof username !== "string" || username.length === 0) {
            res.status(400).json({ message: "Username is required" });
            return;
        }
        if (!profilePicture) {
            res.status(400).json({ message: "Profile picure is required" });
            return;
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.userData._id },
            {
                username: username,
                profilePicture: uploadResponse.secure_url,
            },
            {
                new: true,
            }
        );

        if (!updatedUser) {
            res.status(400).json({ message: "Couldn't update user or user doesn't exist" });
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

export const findUsers = async (req: any, res: Response) => {
    try {
        const query = req.query.query;

        const existingUsers = await User.find({
            _id: { $ne: req.userData._id },
            $or: [{ username: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
        });
        if (!existingUsers) {
            res.status(400).json({ message: "You did something wrong" });
            return;
        }
        res.status(200).json(existingUsers);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};
