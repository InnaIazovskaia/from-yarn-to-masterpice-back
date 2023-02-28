import "./loadEnvironment.js";
import debug from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";

const log = debug("knitting:root");

const port = process.env.PORT ?? 4000;

try {
  await startServer(+port);
  log(chalk.green.bold(`Server is listening on http://localhost:${port}`));
} catch (error) {
  log(chalk.red.bold(`Error: ${(error as Error).message}`));
}
