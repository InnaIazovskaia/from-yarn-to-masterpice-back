import CustomError from "./CustomError";

describe("Given the CustomError class", () => {
  describe("When it is instantiated with message 'Page not fount'", () => {
    test("Then it should return an error object instance of Error wth those properties and values", () => {
      const expectedError = {
        message: "Error",
        statusCode: 404,
        publicMessage: "Page not found",
      };

      const newCustomError = new CustomError(
        expectedError.publicMessage,
        expectedError.statusCode,
        expectedError.message
      );

      expect(newCustomError).toHaveProperty("message", expectedError.message);
      expect(newCustomError).toHaveProperty(
        "statusCode",
        expectedError.statusCode
      );
      expect(newCustomError).toHaveProperty(
        "publicMessage",
        expectedError.publicMessage
      );

      expect(newCustomError).toBeInstanceOf(Error);
    });
  });
});
