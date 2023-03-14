import { Joi } from "express-validation";
import { UserRegisterCredentials } from "../controllers/types.js";

const userRegisterSchema = {
  body: Joi.object<UserRegisterCredentials>({
    username: Joi.string().required().messages({
      "string.empty": "Username is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required",
    }),
    email: Joi.string().required().messages({
      "string.empty": "Email is required",
    }),
  }),
};

export default userRegisterSchema;
