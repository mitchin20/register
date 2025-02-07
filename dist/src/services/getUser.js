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
exports.getUser = void 0;
const database_1 = require("../db/database");
const getUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const values = [email];
        const query = `
            SELECT "id", "firstName", "lastName", "email", "role", "isActive" 
            FROM "User"
            WHERE "email" = $1;
        `;
        const result = yield (0, database_1.executeQuery)(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
});
exports.getUser = getUser;
