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
const getUser_1 = require("../services/getUser");
const database_1 = require("../db/database");
jest.mock("../db/database");
describe("getUser Service", () => {
    it("should return user data", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            id: 1,
            firstName: "john",
            lastName: "smith",
            email: "john.smith@example.com",
            role: "BASIC",
            isActive: false,
        };
        const values = ["john.smith@example.com"];
        database_1.executeQuery.mockResolvedValue({ rows: [mockUser] });
        // call the service
        const user = yield (0, getUser_1.getUser)("john.smith@example.com");
        expect(user).toEqual(mockUser);
        expect(database_1.executeQuery).toHaveBeenCalledWith(expect.any(String), values);
    }));
    it("should return undefined if no user is found", () => __awaiter(void 0, void 0, void 0, function* () {
        database_1.executeQuery.mockResolvedValue({ rows: [] });
        const user = yield (0, getUser_1.getUser)("nonexistent@example.com");
        expect(user).toBeUndefined();
    }));
    it("should handle database errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error("Database error");
        database_1.executeQuery.mockRejectedValue(mockError);
        yield expect((0, getUser_1.getUser)("john.smith@example.com")).rejects.toThrow("Database error");
    }));
});
