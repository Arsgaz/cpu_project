import express from "express";
import { showProducts, showProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.js";
import { registerUser, registerAdmin, login } from "../controllers/authController.js";
import { fetchUsers, fetchAdmins } from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";  // Подключаем middleware


const router = express.Router();

// Регистрация и логин
router.post("/registerUser", registerUser);  // Регистрация пользователя
router.post("/registerAdmin", registerAdmin);  // Регистрация администратора
router.post("/login", login);  // Логин

// Продукты (открытые для всех)
router.get("/products", showProducts);
router.get("/products/:id", showProductById);

// Продукты (защищенные для администраторов)
router.post("/products", verifyToken, verifyAdmin, createProduct);
router.put("/products/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/products/:id", verifyToken, verifyAdmin, deleteProduct);

// Запросы для получения списка пользователей и админов (тоже защищенные для админа )
router.get('/users', verifyToken, verifyAdmin, fetchUsers);
router.get('/admins', verifyToken, verifyAdmin, fetchAdmins);

export default router;
