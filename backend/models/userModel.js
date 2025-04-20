import db from "../config/database.js";

// Получить всех пользователей
export const getAllUsers = (result) => {
    db.query("SELECT UserID AS id, FullName AS name, Email FROM users", (err, res) => {
        if (err) {
            console.log("Error while fetching users", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

// Получить всех администраторов
export const getAllAdmins = (result) => {
    db.query("SELECT AdminID AS id, FullName AS name, Email FROM admins", (err, res) => {
        if (err) {
            console.log("Error while fetching admins", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}
