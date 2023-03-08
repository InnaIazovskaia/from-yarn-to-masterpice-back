import cors from "cors";
import express from "express";
import morgan from "morgan";
import notFoundError from "./middlewares/notFoundError.js";
import generalError from "./middlewares/generalError.js";
import paths from "./routers/paths.js";
import userRouter from "./routers/userRouter/userRouter.js";
import corsOptions from "./cors/corsOptions.js";

const { userPath } = paths;

const app = express();

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use(userPath, userRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
