import { executeQuery } from "../db/database";

export const getUser = async (email: string) => {
    try {
        const values = [email];
        const query = `
            SELECT "id", "firstName", "lastName", "email", "role", "isActive" 
            FROM "User"
            WHERE "email" = $1;
        `;

        const result = await executeQuery(query, values);

        return result.rows[0];
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
};
