import { ObjectId } from "mongoose";
import { sign, verify } from "jsonwebtoken";

export const generateJWT = (_id: ObjectId) => {
    const token = sign({ _id: _id }, process.env.JWT_KEY as string, {
        expiresIn: "3m",
    });
    return token;
};

export const verifyJWT = (token: string) => {
    const verifiedToken = verify(token, process.env.JWT_KEY as string);
    return verifiedToken;
};
