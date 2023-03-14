import express from "express";
import { validate } from "express-validation";
import { userLogin, userRegister } from "../../controllers/userControllers.js";
import userLoginSchema from "../../schemas/userLoginSchema.js";
import userRegisterSchema from "../../schemas/userRegisterSchema.js";
import paths from "../paths.js";

const userRouter = express.Router();

const { loginPath, registerPath } = paths;

userRouter.post(
  loginPath,
  validate(userLoginSchema, {}, { abortEarly: false }),
  userLogin
);

userRouter.post(
  registerPath,
  validate(userRegisterSchema, {}, { abortEarly: false }),
  userRegister
);

export default userRouter;
