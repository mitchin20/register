import express from "express";
import { registrationController } from "../controllers/registrationController";

const router = express.Router();

router.post("/register", registrationController);

export default router;
