import express from "express";
import { showProducts, showProductById, createProduct, updateProduct, deleteProduct, updateStock, showProductWithStock } from "../controllers/product.js";
import { registerUser, registerAdmin, login, fetchUserWithAddress } from "../controllers/authController.js";
import { 
    fetchUsers, fetchAdmins, fetchUserById, updateUserById, deleteUserById, 
    fetchAdminById, updateAdminById, deleteAdminById
} from "../controllers/userController.js";
import { getCart, addProductToCart, removeProductFromCart, checkout } from "../controllers/cartController.js";
import { confirmOrder, getMyOrders, getOrderDetails } from "../controllers/orderController.js"  // Подключаем контроллер подтверждения заказа
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";  // Подключаем middleware


const router = express.Router();

router.get("/profile/:id", fetchUserWithAddress);

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

// Маршрут для обновления количества товара на складе
router.put("/update-stock", verifyToken, verifyAdmin, updateStock);
router.get("/products-with-stock/:id", showProductWithStock);

// Запросы для получения списка пользователей и админов (тоже защищенные для админа )
router.get('/users', verifyToken, verifyAdmin, fetchUsers);
router.get('/admins', verifyToken, verifyAdmin, fetchAdmins);

// Пользователи (по одному id, под защитой)
router.get('/users/:id', verifyToken, verifyAdmin, fetchUserById);
router.put('/users/:id', verifyToken, verifyAdmin, updateUserById);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUserById);

// Администраторы (по одному id, под защитой)
router.get('/admins/:id', verifyToken, verifyAdmin, fetchAdminById);
router.put('/admins/:id', verifyToken, verifyAdmin, updateAdminById);
router.delete('/admins/:id', verifyToken, verifyAdmin, deleteAdminById);


// Получение корзины
router.get("/cart", verifyToken, getCart);

// Добавление товара в корзину
router.post("/cart/add", verifyToken, addProductToCart);

// Удаление товара из корзины
router.post("/cart/remove", verifyToken, removeProductFromCart);

// Оформление заказа
router.post("/checkout", verifyToken, checkout);

// Маршрут для подтверждения и получения заказа
router.post("/confirm-order", verifyToken, confirmOrder);
router.get("/orders/my", verifyToken, getMyOrders);
router.get("/orders/:id", verifyToken, getOrderDetails);




export default router;
