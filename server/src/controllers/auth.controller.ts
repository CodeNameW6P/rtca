import { Request, Response } from "express";
import User from "../models/user.model";
import { genSalt, hash, compare } from "bcrypt";
import { generateJWT } from "../config/JWT";

export const signUp = async (req: Request, res: Response) => {
    try {
        const username = req.body.username.trim();
        const email = req.body.email.trim();
        const password = req.body.password.trim();

        if (!username || typeof username !== "string" || username.length === 0) {
            res.status(400).json({ message: "Username is required" });
            return;
        }
        if (!email || typeof email !== "string" || email.length === 0) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        if (!password || typeof password !== "string" || password.length === 0) {
            res.status(400).json({ message: "Password is required" });
            return;
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
        });

        if (newUser) {
            const token = generateJWT(newUser._id);
            res.cookie("jwt", token, {
                maxAge: 3 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.SERVER_STATE === "PRODUCTION" ? true : false,
            })
                .status(201)
                .json({
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profilePicture: newUser.profilePicture,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
                });
        } else {
            res.status(400).json({ message: "User creation failed" });
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

export const signIn = async (req: Request, res: Response) => {
    try {
        const email = req.body.email.trim();
        const password = req.body.password.trim();

        if (!email || typeof email !== "string" || email.length === 0) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        if (!password || typeof password !== "string" || password.length === 0) {
            res.status(400).json({ message: "Password is required" });
            return;
        }

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            res.status(400).json({ message: "Incorrect email or password" });
            return;
        }

        const isPasswordValid = compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Incorrect email or password" });
            return;
        }

        const token = generateJWT(existingUser._id);
        res.cookie("jwt", token, {
            maxAge: 3 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.SERVER_STATE === "PRODUCTION" ? true : false,
        })
            .status(200)
            .json({
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

export const signOut = (req: Request, res: Response) => {
    try {
        res.clearCookie("jwt").status(200).json({ message: "Signed out successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};
