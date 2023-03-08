import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError.js";

const notFoundError = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError("Endpoint not found", 404, "Path not found");

  next(error);
};

export default notFoundError;
