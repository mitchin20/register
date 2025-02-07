import { getUser } from "../services/getUser";
import { executeQuery } from "../db/database";
import { validateEmail } from "../lib/validateEmail";
import { validatePassword } from "../lib/validatePassword";
import bcrypt from "bcrypt";
import { createUser } from "../services/registrationService";

jest.mock("../services/getUser");
jest.mock("../db/database");
jest.mock("../lib/validateEmail");
jest.mock("../lib/validatePassword");
jest.mock("bcrypt");

describe("createUser Service", () => {
    const mockUser = {
        firstName: "john",
        lastName: "smith",
        email: "john.smith@example.com",
        password: "StrongPassword123!",
    };

    const mockUser2 = {
        firstName: "john",
        lastName: "smith",
        email: "john.smith@example.com",
        password: "weakpassword",
    };

    it("should create a new record successfully", async () => {
        (getUser as jest.Mock).mockResolvedValueOnce(null);
        (validateEmail as jest.Mock).mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        (validatePassword as jest.Mock).mockReturnValueOnce({
            isValid: true,
            message: "Password valid",
        });
        (bcrypt.genSaltSync as jest.Mock).mockReturnValueOnce(
            "$2b$10$saltsalt"
        );
        (bcrypt.hashSync as jest.Mock).mockReturnValueOnce("mockHash");

        // Database response
        (executeQuery as jest.Mock).mockResolvedValueOnce({
            rows: [
                {
                    id: 1,
                    firstName: "john",
                    lastName: "smith",
                    email: "john.smith@example.com",
                    role: "BASIC",
                    isActive: false,
                },
            ],
        });

        const newUser = await createUser(mockUser);

        expect(newUser).toHaveProperty("id");
        expect(newUser.firstName).toBe(mockUser.firstName);

        expect(executeQuery).toHaveBeenCalled();
        expect(validateEmail).toHaveBeenCalledWith(mockUser.email);
        expect(validatePassword).toHaveBeenCalledWith(mockUser.password);

        expect(getUser).toHaveBeenCalledWith(mockUser.email);
    });

    it("should throw an error if email is invalid", async () => {
        (validateEmail as jest.Mock).mockReturnValueOnce({
            isValid: false,
            message: "Email invalid",
        });

        await expect(createUser(mockUser)).rejects.toThrow("Email invalid");

        expect(validateEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it("should throw an error if password is invalid", async () => {
        (validateEmail as jest.Mock).mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        (validatePassword as jest.Mock).mockReturnValueOnce({
            isValid: false,
            message: "Password invalid",
        });

        await expect(createUser(mockUser2)).rejects.toThrow("Password invalid");

        expect(validatePassword).toHaveBeenCalledWith(mockUser2.password);
    });

    it("should throw an error if user already exists", async () => {
        (validateEmail as jest.Mock).mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        (validatePassword as jest.Mock).mockReturnValueOnce({
            isValid: true,
            message: "Password valid",
        });

        (getUser as jest.Mock).mockResolvedValueOnce({
            id: 1,
            firstName: "john",
            lastName: "smith",
            email: "john.smith@example.com",
            role: "BASIC",
            isActive: false,
        });

        await expect(createUser(mockUser)).rejects.toThrow(
            "User already exists"
        );

        expect(getUser).toHaveBeenCalledWith(mockUser.email);
    });

    it("should throw an error if database query fails", async () => {
        (validateEmail as jest.Mock).mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        (validatePassword as jest.Mock).mockReturnValueOnce({
            isValid: true,
            message: "Password valid",
        });

        (getUser as jest.Mock).mockResolvedValueOnce(null);

        (executeQuery as jest.Mock).mockRejectedValueOnce(
            new Error("Database error")
        );

        await expect(createUser(mockUser)).rejects.toThrow("Database error");

        expect(executeQuery).toHaveBeenCalled();
    });
});
