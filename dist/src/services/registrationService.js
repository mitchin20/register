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
exports.createUser = void 0;
const database_1 = require("../db/database");
const getUser_1 = require("./getUser");
const validateEmail_1 = require("../lib/validateEmail");
const validatePassword_1 = require("../lib/validatePassword");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = user;
        if (!firstName || !lastName || !email || !password) {
            throw new Error("Missing required fields");
        }
        // Validate email
        const validEmail = (0, validateEmail_1.validateEmail)(email);
        if (!validEmail.isValid) {
            throw new Error(validEmail.message);
        }
        // Validate password
        const validPassword = (0, validatePassword_1.validatePassword)(password);
        if (!validPassword.isValid) {
            throw new Error(validPassword.message);
        }
        // Validate user
        const existingUser = yield (0, getUser_1.getUser)(email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        // Encrypt Password
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_1.default.hashSync(password, salt);
        // Create record
        const values = [firstName, lastName, email, hashedPassword];
        const query = `
            INSERT INTO "User" ("firstName", "lastName", "email", "password")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = yield (0, database_1.executeQuery)(query, values);
        const newUser = result.rows[0];
        if (!newUser) {
            throw new Error("Error creating user");
        }
        return newUser;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
});
exports.createUser = createUser;
