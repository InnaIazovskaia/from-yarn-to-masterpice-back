import "./loadEnvironment.js";
import debug from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";

const log = debug("knitting:root");

const port = process.env.PORT ?? 4000;
const connectionString = process.env.MONGODB_CONNECTION_URL!;

try {
  await startServer(+port);
  log(
    chalk.greenBright.bold(`Server is listening on http://localhost:${port}`)
  );

  await connectDatabase(connectionString);
  log(chalk.blueBright.bold("Database connected"));
} catch (error) {
  log(chalk.red.bold(`Error: ${(error as Error).message}`));
}
