import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";

dotenv.config();

const PORT = process.env.PORT || 5500;

const app = express();

dbConnect();

app.listen(PORT, () => {
  console.log(`Server is up and listening on PORT ${PORT}`);
});
