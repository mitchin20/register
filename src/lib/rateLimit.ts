import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // Limit each IP to 30 requests per `window` (here, per 15 minutes)
    message: "Too many requests from this IP, please try again later.",
});

export default limiter;
