import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError";
import generalError from "./generalError";

describe("Given the generalError middleware", () => {
  const req = {} as Request;
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue({}),
  };
  const next = jest.fn() as NextFunction;

  describe("When it receives a response and an error with status code 400 and error message 'Bad request'", () => {
    const statusCode = 400;
    const errorPublicMessage = "Bad request";

    const error = new CustomError(
      errorPublicMessage,
      statusCode,
      "Error: bad request"
    );

    test("Then it should call status method of received response with 400", () => {
      generalError(error, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call json method of the received response with error with message property 'Bad request'", () => {
      const expectedError = { error: true, message: error.publicMessage };

      generalError(error, req, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a response", () => {
    const statusCode = 500;
    const error = {} as CustomError;

    test("Then it should call status method of the received response with 500", () => {
      generalError(error, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call json method of the received response with error with message property 'Something went wrong'", () => {
      const errorMessage = "Something went wrong";
      const expectedError = {
        error: true,
        message: errorMessage,
      };

      generalError(error, req, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
