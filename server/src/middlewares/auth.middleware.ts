import { Response, NextFunction } from "express";
import { verifyJWT } from "../config/JWT";
import User from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ message: "Unauthorized (Token wasn't provided)" });
            return;
        }

        const verifiedToken = verifyJWT(token) as JwtPayload;
        if (!verifiedToken) {
            res.status(401).json({ message: "Unauthorized (Token isn't valid)" });
            return;
        }

        const existingUser = await User.findOne({ _id: verifiedToken._id });
        if (!existingUser) {
            res.status(404).json({ message: "Couldn't find user" });
            return;
        }

        req.userData = {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            profilePicture: existingUser.profilePicture,
            createdAt: existingUser.createdAt,
            updatedAt: existingUser.updatedAt,
        };

        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        res.status(500).json({ message: "Internal error occured" });
    }
};
