// orderController.js
import { createOrder, updateOrderAndStock, getOrdersByUserId, getOrderDetailsWithProducts } from  "../models/orderModel.js";
import { createPayment, updatePaymentStatus } from "../models/paymentModel.js";

export const confirmOrder = (req, res) => {
    const { orderId, items, userId } = req.body;
  
    // Проверка на наличие всех обязательных данных
    if (!orderId || !items || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Создаем заказ с состоянием in_cart
    createOrder(orderId, userId, items, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error creating order", error: err });
      }
  
      // После создания заказа обновляем его статус и количество товара
      updateOrderAndStock(orderId, items, (err2, result2) => {
        if (err2) {
          return res.status(500).json({ message: "Error updating order and stock", error: err2 });
        }
        
        return res.status(201).json(result2);
      });
    });
  };
  export const getMyOrders = (req, res) => {
    const userId = req.user.userID;  // предполагается, что verifyToken уже достал UserID
  
    getOrdersByUserId(userId, (err, orders) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching orders", error: err });
      }
  
      res.json(orders);
    });
  };

  export const getOrderDetails = (req, res) => {
    const orderId = req.params.id;
  
    getOrderDetailsWithProducts(orderId, (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch order details", error: err });
      }
  
      res.json(Array.isArray(data) ? data : []);
    });
  };
  
  // Подтверждение и создание записи об оплате
export const confirmOrderAndPayment = (req, res) => {
  const { orderId, paymentMethod } = req.body;

  // Сначала подтверждаем заказ (если это ещё не сделано)
  updateOrderAndStock(orderId, req.body.items, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error confirming order and updating stock" });
    }

    // Создаем запись об оплате
    createPayment(orderId, paymentMethod, (err, paymentResult) => {
      if (err) {
        return res.status(500).json({ message: "Error creating payment record" });
      }

      res.status(200).json({ message: 'Order confirmed and payment initiated' });
    });
  });
};

// Обновление статуса оплаты после успешной оплаты
export const updatePayment = (req, res) => {
  const { paymentId } = req.body;

  updatePaymentStatus(paymentId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating payment status" });
    }

    res.status(200).json({ message: 'Payment completed' });
  });
};
  