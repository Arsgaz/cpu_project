// controllers/userController.js
import { getAllUsers, getAllAdmins, getUserById, updateUser, deleteUser, getAdminById, updateAdmin, deleteAdmin } from "../models/userModel.js";


// Получить всех пользователей
export const fetchUsers = (req, res) => {
    getAllUsers((err, results) => {
        if (err) {
            res.status(500).json({ message: "Failed to load users" });
        } else {
            res.json(results);
        }
    });
}

// Получить всех администраторов
export const fetchAdmins = (req, res) => {
    getAllAdmins((err, results) => {
        if (err) {
            res.status(500).json({ message: "Failed to load admins" });
        } else {
            res.json(results);
        }
    });
}

// Получить пользователя по ID
export const fetchUserById = (req, res) => {
    const id = req.params.id;
    getUserById(id, (err, user) => {
        if (err) {
            res.status(500).json({ message: "Failed to load user data" });
        } else if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json(user);
        }
    });
}

// Обновить пользователя
export const updateUserById = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    updateUser(id, data, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Failed to update user" });
        } else {
            res.json({ message: "User updated successfully" });
        }
    });
}

// Удалить пользователя
export const deleteUserById = (req, res) => {
    const id = req.params.id;
    deleteUser(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to delete user" });
        res.json({ message: "User deleted successfully" });
    });
}

// Получить администратора по ID
export const fetchAdminById = (req, res) => {
    const id = req.params.id;
    getAdminById(id, (err, admin) => {
        if (err) {
            res.status(404).json({ message: err.message || "Admin not found" });
        } else {
            res.json(admin);
        }
    });
}

// Обновить пользователя
export const updateAdminById = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    updateAdmin(id, data, (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to update admin" });
        res.json({ message: "Admin updated successfully" });
    });
}


// Удалить пользователя
export const deleteAdminById = (req, res) => {
    const id = req.params.id;
    deleteAdmin(id, (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to delete admin" });
        res.json({ message: "Admin deleted successfully" });
    });
}
