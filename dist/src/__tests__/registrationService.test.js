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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUser_1 = require("../services/getUser");
const database_1 = require("../db/database");
const validateEmail_1 = require("../lib/validateEmail");
const validatePassword_1 = require("../lib/validatePassword");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registrationService_1 = require("../services/registrationService");
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
    it("should create a new record successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        getUser_1.getUser.mockResolvedValueOnce(null);
        validateEmail_1.validateEmail.mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        validatePassword_1.validatePassword.mockReturnValueOnce({
            isValid: true,
            message: "Password valid",
        });
        bcrypt_1.default.genSaltSync.mockReturnValueOnce("$2b$10$saltsalt");
        bcrypt_1.default.hashSync.mockReturnValueOnce("mockHash");
        // Database response
        database_1.executeQuery.mockResolvedValueOnce({
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
        const newUser = yield (0, registrationService_1.createUser)(mockUser);
        expect(newUser).toHaveProperty("id");
        expect(newUser.firstName).toBe(mockUser.firstName);
        expect(database_1.executeQuery).toHaveBeenCalled();
        expect(validateEmail_1.validateEmail).toHaveBeenCalledWith(mockUser.email);
        expect(validatePassword_1.validatePassword).toHaveBeenCalledWith(mockUser.password);
        expect(getUser_1.getUser).toHaveBeenCalledWith(mockUser.email);
    }));
    it("should throw an error if email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        validateEmail_1.validateEmail.mockReturnValueOnce({
            isValid: false,
            message: "Email invalid",
        });
        yield expect((0, registrationService_1.createUser)(mockUser)).rejects.toThrow("Email invalid");
        expect(validateEmail_1.validateEmail).toHaveBeenCalledWith(mockUser.email);
    }));
    it("should throw an error if password is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        validateEmail_1.validateEmail.mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        validatePassword_1.validatePassword.mockReturnValueOnce({
            isValid: false,
            message: "Password invalid",
        });
        yield expect((0, registrationService_1.createUser)(mockUser2)).rejects.toThrow("Password invalid");
        expect(validatePassword_1.validatePassword).toHaveBeenCalledWith(mockUser2.password);
    }));
    it("should throw an error if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        validateEmail_1.validateEmail.mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        validatePassword_1.validatePassword.mockReturnValueOnce({
            isValid: true,
            message: "Password valid",
        });
        getUser_1.getUser.mockResolvedValueOnce({
            id: 1,
            firstName: "john",
            lastName: "smith",
            email: "john.smith@example.com",
            role: "BASIC",
            isActive: false,
        });
        yield expect((0, registrationService_1.createUser)(mockUser)).rejects.toThrow("User already exists");
        expect(getUser_1.getUser).toHaveBeenCalledWith(mockUser.email);
    }));
    it("should throw an error if database query fails", () => __awaiter(void 0, void 0, void 0, function* () {
        validateEmail_1.validateEmail.mockReturnValueOnce({
            isValid: true,
            message: "Email valid",
        });
        validatePassword_1.validatePassword.mockReturnValueOnce({
            isValid: true,
            message: "Password valid",
        });
        getUser_1.getUser.mockResolvedValueOnce(null);
        database_1.executeQuery.mockRejectedValueOnce(new Error("Database error"));
        yield expect((0, registrationService_1.createUser)(mockUser)).rejects.toThrow("Database error");
        expect(database_1.executeQuery).toHaveBeenCalled();
    }));
});
