import express, { Application } from "express";
import morgan from "morgan";
import "express-async-errors";
import { PORT } from "./utils/secrets";
import router from "./routers/images";
import { errorHandler } from "./middlewares";

// Initialize the application
const app: Application = express();

// Parse incoming requests with JSON payload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));
app.use(express.static("storage"));

// Logging
const logger = morgan("tiny");
app.use(logger);

// Router
app.use(router);

// Error handler
app.use(errorHandler);

export default app;
