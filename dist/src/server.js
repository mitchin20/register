"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const rateLimit_1 = __importDefault(require("./lib/rateLimit"));
const routes_1 = __importDefault(require("./routes"));
// Create an Express app
const app = (0, express_1.default)();
// Set a port
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
// Allow origins
const allowedOrigins = ["XXXXXXXXXXXXXXXXXXXXX", "XXXXXXXXXXXXXXXXXXXXX"];
// Middleware to parse JSON
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(rateLimit_1.default);
app.use((0, morgan_1.default)(":method :url :status :res[content-length] - :response-time ms"));
// Routes
app.get("/health", (req, res) => {
    res.status(200).send("Application is healthy!");
});
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("Server is running...");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send("Page is not found");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
