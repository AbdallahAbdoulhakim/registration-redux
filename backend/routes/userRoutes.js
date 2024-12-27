import express from "express";
import { checkAvailable } from "../controller/userControl.js";

const router = express.Router();

router.get("/check", checkAvailable);

export default router;
