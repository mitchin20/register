import { executeQuery } from "../db/database";
import { getUser } from "./getUser";
import { validateEmail } from "../lib/validateEmail";
import { validatePassword } from "../lib/validatePassword";
import bcrypt from "bcrypt";

type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export const createUser = async (user: User) => {
    try {
        const { firstName, lastName, email, password } = user;

        if (!firstName || !lastName || !email || !password) {
            throw new Error("Missing required fields");
        }

        // Validate email
        const validEmail = validateEmail(email);
        if (!validEmail.isValid) {
            throw new Error(validEmail.message);
        }

        // Validate password
        const validPassword = validatePassword(password);
        if (!validPassword.isValid) {
            throw new Error(validPassword.message);
        }

        // Validate user
        const existingUser = await getUser(email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        // Encrypt Password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create record
        const values = [firstName, lastName, email, hashedPassword];
        const query = `
            INSERT INTO "User" ("firstName", "lastName", "email", "password")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const result = await executeQuery(query, values);

        const newUser = result.rows[0];

        if (!newUser) {
            throw new Error("Error creating user");
        }

        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
