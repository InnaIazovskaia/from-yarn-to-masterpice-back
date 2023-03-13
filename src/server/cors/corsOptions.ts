import { CorsOptions } from "cors";
import CustomError from "../../CustomError/CustomError.js";

const allowedOrigins: string[] = [
  process.env.ALLOWED_ORIGIN_LOCAL!,
  process.env.ALLOWED_ORIGIN_PROD!,
  process.env.ALLOWED_ORIGIN_DEV!,
];

const corsOptions: CorsOptions = {
  origin(origin: string, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);

      return;
    }

    callback(
      new CustomError(
        "Not allowed by CORS",
        400,
        `${origin} not allowed by CORS`
      )
    );
  },
};

export default corsOptions;
