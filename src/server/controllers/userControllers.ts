import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../database/models/User.js";

import {
  TokenPayload,
  UserCredentials,
  UserRegisterCredentials,
} from "./types.js";
import {
  notFoundUserError,
  wrongUserPasswordError,
  userAlreadyExistsError,
} from "../../utils/errors.js";
import CustomError from "../../CustomError/CustomError.js";

const secret = process.env.JWT_SECRET!;
const salt = +process.env.SALT!;

export const userLogin = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      next(notFoundUserError);

      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      next(wrongUserPasswordError);

      return;
    }

    const jwtPayload: TokenPayload = {
      username,
      id: user._id.toString(),
    };

    const token = jwt.sign(jwtPayload, secret, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};

export const userRegister = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ message: `The user ${username} has been created` });
  } catch (error: unknown) {
    if ((error as Error).message.includes("duplicate")) {
      next(userAlreadyExistsError);

      return;
    }

    const customError = new CustomError(
      "There was a problem creating the user",
      500,
      (error as Error).message
    );

    next(customError);
  }
};
