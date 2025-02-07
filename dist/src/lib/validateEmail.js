"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        return {
            isValid: true,
            message: "Valid email format",
        };
    }
    else {
        return {
            isValid: false,
            message: "Invalid email format",
        };
    }
};
exports.validateEmail = validateEmail;
