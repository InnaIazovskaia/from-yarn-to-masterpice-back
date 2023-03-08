import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../database/models/User.js";
import { TokenPayload, UserCredentials } from "./types.js";
import {
  notFoundUserError,
  wrongUserPasswordError,
} from "../../utils/errors.js";

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

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error: unknown) {
    next(error);
  }
};
