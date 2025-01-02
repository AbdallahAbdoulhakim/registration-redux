import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { createWriteStream } from "fs";
import morgan from "morgan";
import cors from "cors";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const logWs = createWriteStream("./logs/access.log");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

const PORT = process.env.PORT || 5500;
const SERVER_URL = process.env.SERVER_URL || 5500;

const app = express();

dbConnect();

app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_SIGNATURE));

app.use(morgan("combined", { stream: logWs }));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the API Server" });
});

app.use(authRouter);
app.use("/api/user", userRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, SERVER_URL, () => {
  console.log(`Server is up at ${SERVER_URL} and listening on PORT ${PORT}`);
});
