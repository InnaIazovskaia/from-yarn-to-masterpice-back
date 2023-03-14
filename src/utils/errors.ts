import CustomError from "../CustomError/CustomError.js";

export const notFoundUserError = new CustomError(
  "Wrong credentials",
  401,
  "User not found"
);

export const wrongUserPasswordError = new CustomError(
  "Wrong credentials",
  401,
  "Wrong password"
);

export const userAlreadyExistsError = new CustomError(
  "The username is already in use",
  409,
  "The user already exists"
);
