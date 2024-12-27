import userModel from "../models/userModel";
import expressAsyncHandler from "express-async-handler";

export const loginMiddleware = expressAsyncHandler(async (req, res, next) => {
  try {
    console.log(req);
  } catch (error) {
    next(error);
  }
});
