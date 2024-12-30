import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateParameters,
  validateString,
  validateOneOfParameters,
} from "../utils/validate.js";

export const createUser = expressAsyncHandler(async (req, res, next) => {
  try {
    validateParameters(req.body, [
      "username",
      "firstname",
      "lastname",
      "email",
      "password",
    ]);

    const { username, firstname, lastname, email, password } = req.body;

    validateUsername(username);
    validateEmail(email);
    validatePassword(password);
    validateString({ firstname });
    validateString({ lastname });

    const newUser = await userModel.create({
      username: username.toLowerCase(),
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email,
      password,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        username: newUser.username,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        roles: newUser.roles,
        isActive: newUser.isActive,
      },
      message: "User created successfully!",
    });
  } catch (error) {
    if (error?.cause?.message === "request params error") {
      res.status(400);
    }
    next(error);
  }
});

export const loginUser = expressAsyncHandler(async (req, res, next) => {
  try {
    validateParameters(req.body, ["user", "password"]);

    const { user, password } = req.body;

    const foundUser = await userModel.findOne({
      $or: [{ username: user }, { email: user }],
    });

    if (!foundUser) {
      res.status(401);
      throw new Error("Invalid credentials!");
    }

    const validated = await bcrypt.compare(password, foundUser.password);

    if (!validated) {
      res.status(401);
      throw new Error("Invalid credentials!");
    }

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          id: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", refreshToken, {
      maxAge: 12 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: false,
      signed: true,
    });

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.status(200).json({ success: true, accessToken: accessToken });
  } catch (error) {
    next(error);
  }
});

export const checkAvailable = expressAsyncHandler(async (req, res, next) => {
  try {
    const obj = validateOneOfParameters(req.query, ["email", "username"]);

    const foundEmail = await userModel.findOne(obj);

    if (foundEmail) {
      res.status(409);
      throw new Error(
        `${Object.keys(obj)[0]} \(${Object.values(obj)[0]}\) already exist!`
      );
    }

    res.sendStatus(204);
  } catch (error) {
    if (error?.cause?.message === "request params error") {
      res.status(400);
    }
    next(error);
  }
});
