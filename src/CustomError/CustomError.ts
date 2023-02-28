class CustomError extends Error {
  code: string;

  constructor(
    public publicMessage: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export default CustomError;
