import { type NextFunction, type Request, type Response } from "express";
import notFoundError from "./notFoundError";

describe("Given a notFoundError middleware", () => {
  describe("When it receives a response", () => {
    test("Then it should call its next method", () => {
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      notFoundError(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
