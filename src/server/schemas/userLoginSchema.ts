import { Joi } from "express-validation";
import { UserCredentials } from "../controllers/types.js";

const userLoginSchema = {
  body: Joi.object<UserCredentials>({
    username: Joi.string().required().messages({
      "string.empty": "Username is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required",
    }),
  }),
};

export default userLoginSchema;
