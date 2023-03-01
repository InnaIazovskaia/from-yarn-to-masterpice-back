import { type NextFunction, type Response, type Request } from "express";
import debug from "debug";

import type CustomError from "../../CustomError/CustomError.js";

const log = debug("knitting:server:middlewares");

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  log(`Error: ${error.message}`);

  const errorCode = error.statusCode ?? 500;
  const errorMessage = error.publicMessage ?? "Something went wrong";

  res.status(errorCode).json({ error: true, message: errorMessage });
};

export default generalError;
