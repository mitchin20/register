import { createUser } from "../services/registrationService";
import { registrationController } from "../controllers/registrationController";

jest.mock("../services/registrationService");

describe("Registration Controller", () => {
    const mockUser = {
        id: 1,
        firstName: "john",
        lastName: "smith",
        email: "john.smith@example.com",
        role: "BASIC",
        isActive: false,
    };

    it("should return 200 and success message when registration is successful", async () => {
        const req = {
            body: {
                firstName: "john",
                lastName: "smith",
                email: "john.smith@example.com",
                password: "StrongPassword123!",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (createUser as jest.Mock).mockResolvedValueOnce(mockUser);

        await registrationController(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data: mockUser,
            success: true,
            message: "User created successfully",
            error: null,
        });
    });

    it("should return 400 status if body is null", async () => {
        const req = {
            body: null,
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await registrationController(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "No data provided",
            error: "Bad request",
        });
    });

    it("should return 400 status if missing fields in body", async () => {
        const req = {
            body: {
                firstName: "john",
                lastName: "smith",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await registrationController(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "Missing required fields",
            error: "Bad request",
        });
    });

    it("should return 500 status if user already exists", async () => {
        const req = {
            body: {
                firstName: "john",
                lastName: "smith",
                email: "john.smith@example.com",
                password: "StrongPassword123!",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (createUser as jest.Mock).mockResolvedValueOnce(null);

        await registrationController(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "Error creating user",
            error: "Internal Server Error",
        });
    });

    it("should return 500 status Internal error", async () => {
        const req = {
            body: {
                firstName: "john",
                lastName: "smith",
                email: "john.smith@example.com",
                password: "StrongPassword123!",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (createUser as jest.Mock).mockRejectedValueOnce(
            new Error("Database Error")
        );

        await registrationController(req as any, res as any);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "Internal Server Error",
            error: new Error("Database Error"),
        });
    });
});
