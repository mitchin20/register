"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
const validatePassword = (password) => {
    // Password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and to have a length of 8 to 20 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    if (passwordRegex.test(password)) {
        return {
            isValid: true,
            message: "Valid password format",
        };
    }
    else {
        return {
            isValid: false,
            message: "Password must be at least 8 characters long and include at least one letter and one number.",
        };
    }
};
exports.validatePassword = validatePassword;
