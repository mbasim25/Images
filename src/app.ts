import express, { Application } from "express";
import morgan from "morgan";
import { PORT } from "./utils/secrets";
import router from "./routers/images";

// Initialize the application
const app: Application = express();

// Parse incoming requests with JSON payload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Logging
const logger = morgan("tiny");
app.use(logger);

// Router
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

export default app;
