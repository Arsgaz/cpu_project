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

// Получить пользователя по ID
export const getUserById = (id, result) => {
    db.query("SELECT UserID AS id, FullName AS name, Email, Phone FROM users WHERE UserID = ?", [id], (err, res) => {
        if (err) {
            console.log("Error while fetching user by ID", err);
            result(err, null);
        } else if (res.length === 0) {
            result({ message: "User not found" }, null);
        } else {
            result(null, res[0]);
        }
    });
}

// Обновить пользователя
export const updateUser = (id, data, result) => {
    db.query(
        "UPDATE users SET FullName = ?, Email = ?, Password = ?, Phone = ? WHERE UserID = ?",
        [data.name, data.email, data.password, data.phone, id],
        (err, res) => {
            if (err) {
                console.log("Error while updating user", err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
}

// Удалить пользователя
export const deleteUser = (id, result) => {
    db.query("DELETE FROM users WHERE UserID = ?", [id], (err, res) => {
        if (err) {
            console.log("Error while deleting user", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}

// Получить администратора по ID
export const getAdminById = (id, result) => {
    db.query("SELECT AdminID AS id, FullName AS name, Email FROM admins WHERE AdminID = ?", [id], (err, res) => {
        if (err) {
            console.log("Error while fetching admin by ID", err);
            result(err, null);
        } else if (res.length === 0) {
            result({ message: "Admin not found" }, null);
        } else {
            result(null, res[0]);
        }
    });
}

// Обновить администратора
export const updateAdmin = (id, data, result) => {
    db.query(
        "UPDATE admins SET FullName = ?, Email = ?, Password = ? WHERE AdminID = ?",
        [data.name, data.email, data.password, data.phone, id],
        (err, res) => {
            if (err) {
                console.log("Error while updating admin", err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
}

// Удалить администратора
export const deleteAdmin = (id, result) => {
    db.query("DELETE FROM admins WHERE AdminID = ?", [id], (err, res) => {
        if (err) {
            console.log("Error while deleting admin", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
}