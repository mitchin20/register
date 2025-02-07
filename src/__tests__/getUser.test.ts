import { getUser } from "../services/getUser";
import { executeQuery } from "../db/database";

jest.mock("../db/database");

describe("getUser Service", () => {
    it("should return user data", async () => {
        const mockUser = {
            id: 1,
            firstName: "john",
            lastName: "smith",
            email: "john.smith@example.com",
            role: "BASIC",
            isActive: false,
        };

        const values = ["john.smith@example.com"];

        (executeQuery as jest.Mock).mockResolvedValue({ rows: [mockUser] });

        // call the service
        const user = await getUser("john.smith@example.com");

        expect(user).toEqual(mockUser);
        expect(executeQuery).toHaveBeenCalledWith(expect.any(String), values);
    });

    it("should return undefined if no user is found", async () => {
        (executeQuery as jest.Mock).mockResolvedValue({ rows: [] });

        const user = await getUser("nonexistent@example.com");

        expect(user).toBeUndefined();
    });

    it("should handle database errors", async () => {
        const mockError = new Error("Database error");
        (executeQuery as jest.Mock).mockRejectedValue(mockError);

        await expect(getUser("john.smith@example.com")).rejects.toThrow(
            "Database error"
        );
    });
});
