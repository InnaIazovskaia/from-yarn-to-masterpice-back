import express from "express";
import notFoundError from "./middlewares/notFoundError.js";

const app = express();

export default app;

app.disable("x-powered-by");

app.use("/", notFoundError);
