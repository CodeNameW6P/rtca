import { sign } from "jsonwebtoken";

export const generateJWT = (id: number) => {
    const token = sign({ id: id }, process.env.JWT_KEY as string, {
        expiresIn: "3m",
    });

    return token;
};
