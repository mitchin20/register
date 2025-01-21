require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import limiter from "./lib/rateLimit";
import cors from "cors";
import routes from "./routes";

// Create an Express app
const app = express();

// Set a port
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Allow origins
const allowedOrigins = ["XXXXXXXXXXXXXXXXXXXXX", "XXXXXXXXXXXXXXXXXXXXX"];

// Middleware to parse JSON
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
);

// Routes
app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("Application is healthy!");
});

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running...");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(404).send("Page is not found");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
