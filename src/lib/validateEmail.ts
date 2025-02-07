type ValidateEmail = {
    isValid: boolean;
    message: string;
};

export const validateEmail = (email: string): ValidateEmail => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        return {
            isValid: true,
            message: "Valid email format",
        };
    } else {
        return {
            isValid: false,
            message: "Invalid email format",
        };
    }
};
