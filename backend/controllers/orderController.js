// orderController.js
import { createOrder, updateOrderAndStock, getOrdersByUserId, getOrderDetailsWithProducts, getAllOrdersFromDb, updateOrderStatusAndDate } from  "../models/orderModel.js";
import { createPayment, updateOrderStatus } from "../models/paymentModel.js";

export const confirmOrder = (req, res) => {
    const { orderId, items, userId } = req.body;
  
    // Проверка на наличие всех обязательных данных
    if (!orderId || !items || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    createOrder(orderId, userId, items, (err, result) => {
      if (err) {
        console.error("Error creating order:", err);  // Добавляем вывод ошибки
        return res.status(500).json({ message: "Error creating order", error: err });
      }
    
      updateOrderAndStock(orderId, items, (err2, result2) => {
        if (err2) {
          console.error("Error updating order and stock:", err2);  // Логирование ошибки
          return res.status(500).json({ message: "Error updating order and stock", error: err2 });
        }
    
        res.status(201).json(result2);
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

  export const getAllOrders = (req, res) => {
    getAllOrdersFromDb((err, orders) => {  // Получаем все заказы
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
  
      // Добавляем в ответ статус заказа
      if (Array.isArray(data) && data.length > 0) {
        const orderStatus = data[0].Status; // Статус заказа
        return res.json({ orderStatus, products: data });
      } else {
        return res.json([]);
      }
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

export const processPayment = (req, res) => {
  const { orderId, paymentMethod } = req.body;

  console.log("=== PROCESS PAYMENT ===");
  console.log("Order ID:", orderId);
  console.log("Payment Method received:", paymentMethod);

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  const paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Получаем текущую дату

  // Сначала обновляем статус заказа на 'paid' в таблице orders
  updateOrderStatus(orderId, "Paid", paymentMethod, (err, result) => {
    if (err) {
      console.error("Error updating order status:", err);
    return res.status(500).json({ message: "Failed to update order status" });
    }

    // Затем создаем запись об оплате в таблице payments
    createPayment(orderId, paymentDate, (err2, paymentResult) => {
      if (err2) {
        return res.status(500).json({ message: "Error creating payment record", error: err2 });
      }

      res.status(200).json({ message: 'Payment processed successfully' });
    });
  });
};

// Обновление статуса и даты заказа
export const updateOrderStatusAndDateController = (req, res) => {
  const { orderId, status, orderDate } = req.body;

  // Проверка на наличие всех обязательных данных
  if (!orderId || !status || !orderDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  updateOrderStatusAndDate(orderId, status, orderDate, (err, result) => {
    if (err) {
      console.error("Error updating order status and date:", err);
      return res.status(500).json({ message: "Error updating order status and date", error: err });
    }

    res.status(200).json(result);
  });
};