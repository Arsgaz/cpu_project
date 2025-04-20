// controllers/userController.js
import { getAllUsers, getAllAdmins } from "../models/userModel.js";

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
