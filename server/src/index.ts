import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.route";
import connectDB from "./config/connectDB";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(PORT, () => {
    console.log(`Server initiated on PORT: ${PORT}`);
    connectDB();
});
