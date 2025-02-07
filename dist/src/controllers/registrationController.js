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
exports.registrationController = void 0;
const registrationService_1 = require("../services/registrationService");
const registrationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!body.firstName ||
            !body.lastName ||
            !body.email ||
            !body.password) {
            res.status(400).json({
                data: null,
                success: false,
                message: "Missing required fields",
                error: "Bad request",
            });
            return;
        }
        const user = yield (0, registrationService_1.createUser)(body);
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
    }
    catch (error) {
        console.error("Error in registration process:", error);
        res.status(500).json({
            data: null,
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
});
exports.registrationController = registrationController;
