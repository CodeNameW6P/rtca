import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { CorsOptions } from "cors";
import authRouter from "./routes/auth.route";
import profileRouter from "./routes/profile.route";
import messageRouter from "./routes/message.route";
import chatRouter from "./routes/chat.route";
import connectDB from "./config/connectDB";
import { app, server } from "./config/socket.io";

const PORT = process.env.PORT || 8080;

const corsOptions: CorsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(authRouter);
app.use(profileRouter);
app.use(messageRouter);
app.use(chatRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("hello");
});

server.listen(PORT, () => {
    console.log(`Server initiated on PORT: ${PORT}`);
    connectDB();
});
