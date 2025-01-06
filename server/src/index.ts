import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import profileRouter from "./routes/profile.route";
import messageRouter from "./routes/message.route";
import connectDB from "./config/connectDB";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRouter);
app.use(profileRouter);
app.use(messageRouter);

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(PORT, () => {
    console.log(`Server initiated on PORT: ${PORT}`);
    connectDB();
});
