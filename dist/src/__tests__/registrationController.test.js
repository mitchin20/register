"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const registrationService_1 = require("../services/registrationService");
const registrationController_1 = require("../controllers/registrationController");
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
    it("should return 200 and success message when registration is successful", () => __awaiter(void 0, void 0, void 0, function* () {
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
        registrationService_1.createUser.mockResolvedValueOnce(mockUser);
        yield (0, registrationController_1.registrationController)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data: mockUser,
            success: true,
            message: "User created successfully",
            error: null,
        });
    }));
    it("should return 400 status if body is null", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: null,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        yield (0, registrationController_1.registrationController)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "No data provided",
            error: "Bad request",
        });
    }));
    it("should return 400 status if missing fields in body", () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, registrationController_1.registrationController)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "Missing required fields",
            error: "Bad request",
        });
    }));
    it("should return 500 status if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
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
        registrationService_1.createUser.mockResolvedValueOnce(null);
        yield (0, registrationController_1.registrationController)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "Error creating user",
            error: "Internal Server Error",
        });
    }));
    it("should return 500 status Internal error", () => __awaiter(void 0, void 0, void 0, function* () {
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
        registrationService_1.createUser.mockRejectedValueOnce(new Error("Database Error"));
        yield (0, registrationController_1.registrationController)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            data: null,
            success: false,
            message: "Internal Server Error",
            error: new Error("Database Error"),
        });
    }));
});
