import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcrypt";
import connectDatabase from "../../../database/connectDatabase";
import app from "../../index";
import User from "../../../database/models/User";
import {
  UserCredentials,
  UserRegisterCredentials,
} from "../../controllers/types";

let server: MongoMemoryServer;

const salt = +process.env.SALT!;

const mockUser: UserCredentials = {
  username: "Marta",
  password: "123456789",
};

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

beforeEach(async () => {
  const hashedPassword = await bcrypt.hash(mockUser.password, salt);

  await User.create({
    username: mockUser.username,
    password: hashedPassword,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a POST 'user/login' endpoint", () => {
  const loginUrl = "/user/login";
  const messageProperty = "message";

  describe("When it receives a POST request with username 'Marta' and password '123456789'", () => {
    test("Then it should respond with status code 200 and a token", async () => {
      const tokenProperty = "token";
      const expectedStatusCode = 200;

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(tokenProperty);
    });
  });

  describe("When it receives a request with username 'Carl' and the username not registered in the database", () => {
    test("Then it should responde with status code 401 and error message 'Wrong credentials'", async () => {
      const mockUser: UserCredentials = {
        username: "Carl",
        password: "123456789",
      };
      const expectedErrorMessage = "Wrong credentials";
      const expectedStatusCode = 401;

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });

  describe("When it receives a request with username 'Marta' and wrong password '9874651321'", () => {
    test("Then it should responde with status code 401 and error message 'Wrong credentials'", async () => {
      const mockUser: UserCredentials = {
        username: "Marta",
        password: "9874651321",
      };
      const expectedErrorMessage = "Wrong credentials";
      const expectedStatusCode = 401;

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });

  describe("When it receives a request with empty username", () => {
    test("Then it should respond with status code 400 and error message 'Username is required'", async () => {
      const mockUser: UserCredentials = {
        username: "",
        password: "12345678910",
      };
      const expectedErrorMessage = "Username is required";
      const expectedStatusCode = 400;

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });

  describe("When it receives a request with username 'Marta' and empty password", () => {
    test("Then it should respond with status code 400 and error message 'Password is required'", async () => {
      const mockUser: UserCredentials = {
        username: "Marta",
        password: "",
      };
      const expectedErrorMessage = "Password is required";
      const expectedStatusCode = 400;

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });
});

describe("Given a POST 'user/register' endpoint", () => {
  const registerUrl = "/user/register";
  const messageProperty = "message";

  describe("When it receives a POST request with username 'Lili' password 'password' amd email 'lili@mail.com'", () => {
    test("Then it should respond with status code 201 and message 'The user Lili has been created'", async () => {
      const mockUserCredentials: UserRegisterCredentials = {
        username: "Lili",
        email: "lili@mail.com",
        password: "password",
      };
      const expectedMessage = "The user Lili has been created";
      const expectedStatusCode = 201;

      const response = await request(app)
        .post(registerUrl)
        .send(mockUserCredentials)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(messageProperty, expectedMessage);
    });
  });

  describe("When it reseves a POST rwquest with username 'Marta' password '123456789' and email 'marta@mail.com' and the username already exists in database", () => {
    test("Then it should responde with status code 409 and error message 'The username is already in use'", async () => {
      const mockUserCredentials: UserRegisterCredentials = {
        username: "Marta",
        email: "marta@mail.com",
        password: "123456789",
      };
      const expectedErrorMessage = "The username is already in use";
      const expectedStatusCode = 409;

      const response = await request(app)
        .post(registerUrl)
        .send(mockUserCredentials)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });

  describe("When it receives a POST request with empty username", () => {
    test("Then it should respond with status code 400 and error message 'Username is required'", async () => {
      const mockUserCredentials: UserRegisterCredentials = {
        username: "",
        email: "marta@mail.com",
        password: "123456789",
      };
      const expectedErrorMessage = "Username is required";
      const expectedStatusCode = 400;

      const response = await request(app)
        .post(registerUrl)
        .send(mockUserCredentials)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });

  describe("When it receives a POST request with empty password", () => {
    test("Then it should respond with status code 400 and error message 'Password is required'", async () => {
      const mockUserCredentials: UserRegisterCredentials = {
        username: "Marta",
        email: "marta@mail.com",
        password: "",
      };
      const expectedErrorMessage = "Password is required";
      const expectedStatusCode = 400;

      const response = await request(app)
        .post(registerUrl)
        .send(mockUserCredentials)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });

  describe("When it receives a POST request with empty emaol", () => {
    test("Then it should respond with status code 400 and error message 'Email is required'", async () => {
      const mockUserCredentials: UserRegisterCredentials = {
        username: "Marta",
        email: "",
        password: "password",
      };
      const expectedErrorMessage = "Email is required";
      const expectedStatusCode = 400;

      const response = await request(app)
        .post(registerUrl)
        .send(mockUserCredentials)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(
        messageProperty,
        expectedErrorMessage
      );
    });
  });
});
