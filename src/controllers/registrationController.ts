import { Request, Response } from "express";
import { createUser } from "../services/registrationService";

export const registrationController = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            res.status(400).json({
                data: null,
                success: false,
                message: "No data provided",
                error: "Bad request",
            });
            return;
        }

        if (
            !body.firstName ||
            !body.lastName ||
            !body.email ||
            !body.password
        ) {
            res.status(400).json({
                data: null,
                success: false,
                message: "Missing required fields",
                error: "Bad request",
            });
            return;
        }

        const user = await createUser(body);

        if (!user) {
            res.status(500).json({
                data: null,
                success: false,
                message: "Error creating user",
                error: "Internal Server Error",
            });
            return;
        }

        res.status(200).json({
            data: user,
            success: true,
            message: "User created successfully",
            error: null,
        });
    } catch (error) {
        console.error("Error in registration process:", error);
        res.status(500).json({
            data: null,
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};
