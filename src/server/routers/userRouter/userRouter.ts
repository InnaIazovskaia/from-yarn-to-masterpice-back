import express from "express";
import { validate } from "express-validation";
import { userLogin } from "../../controllers/userControllers.js";
import userLoginShema from "../../schemas/userLoginShema.js";
import paths from "../paths.js";

const userRouter = express.Router();

const { loginPath } = paths;

userRouter.post(
  loginPath,
  validate(userLoginShema, {}, { abortEarly: false }),
  userLogin
);

export default userRouter;
