import { type NextFunction, type Response, type Request } from "express";
import debug from "debug";

import type CustomError from "../../CustomError/CustomError.js";
import { ValidationError } from "express-validation";

const log = debug("knitting:server:middlewares");

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    const validationErrors = error.details
      .body!.map((joiError) => joiError.message)
      .join("\n");

    error.publicMessage = validationErrors;
  }

  log(`Error: ${error.message}`);

  const errorCode = error.statusCode ?? 500;
  const publicMessage = error.publicMessage ?? "Something went wrong";

  res.status(errorCode).json({ error: true, message: publicMessage });
};

export default generalError;
