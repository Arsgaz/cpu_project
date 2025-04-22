// controllers/cartController.js
import * as cartModel from "../models/cartModel.js";

export const getCart = (req, res) => {
    const userId = req.user.userID; // Используем userID, а не id
    console.log("UserID from token:", userId);  // Логируем userId
    cartModel.getCart(userId, (err, cartItems) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.json(cartItems);
    });
};

export const addProductToCart = (req, res) => {
    const userId = req.user.userID;  // Пользователь из токена
    console.log("UserID from token:", userId);

    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        return res.status(400).json({ error: 'ProductId and quantity are required' });
    }

    cartModel.addProductToCart(userId, productId, quantity, (err, result) => {
        if (err) {
            console.error("Error updating cart:", err);
            return res.status(500).json({ error: 'Server error while updating cart' });
        }
        res.json(result);
    });
};

export const removeProductFromCart = (req, res) => {
    const userId = req.user.userID; // Используем userID, а не id
    const { productId } = req.body;
    
    cartModel.removeProductFromCart(userId, productId, (err, message) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.json(message);
    });
};

export const checkout = (req, res) => {
    const userId = req.user.userID; // Используем userID, а не id
    
    cartModel.checkoutCart(userId, (err, message) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.json(message);
    });
};