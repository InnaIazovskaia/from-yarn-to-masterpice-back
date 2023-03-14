import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../CustomError/CustomError";
import User from "../../database/models/User";
import { UserCredentials, UserRegisterCredentials } from "./types";
import { userLogin, userRegister } from "./userControllers";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnValue({}),
};
const next = jest.fn() as NextFunction;

describe("Given a userLogin controller", () => {
  const req = {} as Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >;

  const mockUser: UserCredentials = {
    username: "sunny",
    password: "sunnypassword",
  };

  const expectedErrorPublicMessage = "Wrong credentials";

  describe("When it receives a next function and a request with username 'sunny' and the user is not registered in the database", () => {
    test("Then it should call received next function with error with status code 401 and the public message 'Wrong credentials' and the message 'User bot found'", async () => {
      const expectedErrorStatusCode = 401;
      const expectedErrorMessage = "User not found";

      const expectedError = new CustomError(
        expectedErrorPublicMessage,
        expectedErrorStatusCode,
        expectedErrorMessage
      );

      req.body = mockUser;

      User.findOne = jest.fn().mockResolvedValue(null);

      await userLogin(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a next function and a request with username 'sunny' and password 'sunnypassword' but password don't match with password in the database", () => {
    test("Then it should call received next function with error with status code 401 and the public message 'Wrong credentials' and the message 'Wrong password'", async () => {
      const expectedErrorStatusCode = 401;
      const expectedErrorMessage = "Wrong password";

      const expectedError = new CustomError(
        expectedErrorPublicMessage,
        expectedErrorStatusCode,
        expectedErrorMessage
      );

      req.body = mockUser;

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userLogin(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receves a request with username 'sunny' and password 'sunnypassword'", () => {
    test("Then it should call jsom method of the received response with a token and status method with status code 200", async () => {
      const expectedErrorStatusCode = 200;
      const token = "testtoken";
      const id = new mongoose.Types.ObjectId();
      req.body = mockUser;

      User.findOne = jest.fn().mockResolvedValue({ ...mockUser, _id: id });

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      jwt.sign = jest.fn().mockReturnValue(token);

      await userLogin(req, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ token });
      expect(res.status).toHaveBeenCalledWith(expectedErrorStatusCode);
    });
  });

  describe("When it receives a request with username 'sunny' and password 'sunnypassword' and User.findOne rejects", () => {
    test("Then it should call received next function with the thrown error", async () => {
      req.body = mockUser;
      const error = new Error("Some error");

      User.findOne = jest.fn().mockRejectedValue(error);

      await userLogin(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a userRegister controller", () => {
  const req = {} as Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >;

  const mockUser = {
    username: "Marta",
    password: "123456789",
    email: "marta@mail.com",
  };
  const hashedPassword = "askdhgiahbviaowehg";

  describe("When it receives a request with username 'Marta', password '123456789' and email 'marta@mail.com'", () => {
    test("Then it should call json method of the received response with message 'The user Marta has been created' and method status with code 201", async () => {
      const expectedStatusCode = 201;
      const expectedMessage = { message: "The user Marta has been created" };
      req.body = mockUser;

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn().mockResolvedValue(mockUser);

      await userRegister(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with username 'Marta', password '123456789' and email 'marta@mail.com' and the username already exista in database", () => {
    test("Then it should call received next function with error with status code 409 and the public message 'The username is already in use' and the message 'The user already exists'", async () => {
      const duplicateError = new Error("duplicate");

      const expectedErrorPublicMessage = "The username is already in use";
      const expectedErrorStatusCode = 409;
      const expectedErrorMessage = "The user already exists";

      const expectedError = new CustomError(
        expectedErrorPublicMessage,
        expectedErrorStatusCode,
        expectedErrorMessage
      );

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn().mockRejectedValue(duplicateError);

      await userRegister(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request without username", () => {
    test("Then it shold call received next function with public message 'There was a problem creating the user', status code 500 and message 'The user couldn't be created'", async () => {
      const mockUserWithoutUsername = {
        ...mockUser,
        username: "",
      };

      const expectedErrorPublicMessage =
        "There was a problem creating the user";
      const expectedErrorStatusCode = 500;
      const expectedErrorMessage = "The user couldn't be created";

      const expectedError = new CustomError(
        expectedErrorPublicMessage,
        expectedErrorStatusCode,
        expectedErrorMessage
      );

      const error = new Error(expectedErrorMessage);

      req.body = mockUserWithoutUsername;
      User.create = jest.fn().mockRejectedValue(error);

      await userRegister(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
