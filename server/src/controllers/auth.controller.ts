import { Request, Response } from "express";
import User from "../models/user.model";
import { genSalt, hash, compare } from "bcrypt";
import { generateJWT } from "../config/JWT";
import { z } from "zod";

const signUpSchema = z.object({
    username: z.string().trim().nonempty("Name can't be empty").min(2, "Name must contain at least 2 characters"),
    email: z.string().trim().nonempty("Email can't be empty").email("Please enter a valid email"),
    password: z
        .string()
        .trim()
        .nonempty("Password can't be empty")
        .min(3, "Password must contain at least 3 characters"),
});

export const signUp = async (req: Request, res: Response) => {
    try {
        const validationResult = signUpSchema.safeParse(req.body);

        if (!validationResult.success) {
            res.status(400).json({ message: validationResult.error.format() });
            return;
        }

        const { username, email, password } = validationResult.data;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = await genSalt(8);
        const hashedPassword = await hash(password, salt);

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
        });

        if (newUser) {
            const token = generateJWT(newUser._id);
            res.cookie("jwt", token, {
                maxAge: 30 * 60 * 1000,
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

const signInSchema = z.object({
    email: z.string().trim().nonempty("Email can't be empty").email("Please enter a valid email"),
    password: z
        .string()
        .trim()
        .nonempty("Password can't be empty")
        .min(3, "Password must contain at least 3 characters"),
});

export const signIn = async (req: Request, res: Response) => {
    try {
        const validationResult = signInSchema.safeParse(req.body);

        if (!validationResult.success) {
            res.status(400).json({ message: validationResult.error.format() });
            return;
        }

        const { email, password } = validationResult.data;

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            res.status(400).json({ message: "Incorrect email or password" });
            return;
        }

        const isPasswordValid = await compare(password, existingUser.password);
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
