// orderModel.js
import db from "../config/database.js";

// Функция для создания нового заказа (в корзине)
export const createOrder = (orderId, userId, items, result) => {
  // Создаем новый заказ с сгенерированным OrderID и статусом "in_cart"
  const insertOrderQuery = `
    INSERT INTO orders (OrderID, UserID, Status)
    VALUES (?, ?, 'in_cart')
  `;
  
  db.query(insertOrderQuery, [orderId, userId], (err, res) => {
    if (err) {
      console.log("Error creating order:", err);
      return result(err, null);
    }

    // Теперь вставляем товары в таблицу orderdetails
    items.forEach(item => {
      const insertItemQuery = `
        INSERT INTO orderdetails (OrderID, ProductID, Quantity)
        VALUES (?, ?, ?)
      `;
      db.query(insertItemQuery, [orderId, item.ProductID, item.Quantity], (err2, res2) => {
        if (err2) {
          console.log("Error inserting item:", err2);
          return result(err2, null);
        }
      });
    });

    result(null, { message: 'Order created successfully and placed in cart' });
  });
};

// Обновление статуса заказа на "confirmed" и уменьшение количества товара в Stock
export const updateOrderAndStock = (orderId, items, result) => {
    console.log('Received items:', items);
    console.log('Received orderId:', orderId);
    const updateOrderQuery = "UPDATE orders SET Status = 'confirmed' WHERE OrderID = ?";
const updateStockQuery = "UPDATE Stock SET StockQuantity = StockQuantity - ? WHERE ProductID = ? AND WarehouseID = 1";  // Используем фиксированный WarehouseID = 1

// Начинаем транзакцию
db.beginTransaction(function(err) {
  if (err) {
    console.log("Error starting transaction:", err);
    return result(err, null);
  }

  // Обновляем заказ
  db.query(updateOrderQuery, [orderId], (err, res) => {
    if (err) {
      return db.rollback(() => {
        console.log("Error updating order status:", err);
        return result(err, null);
      });
    }

    // Обновляем склад для каждого товара
    items.forEach(item => {
      db.query(updateStockQuery, [item.Quantity, item.ProductID], (err2, res2) => {
        if (err2) {
          return db.rollback(() => {
            console.log("Error updating stock:", err2);
            return result(err2, null);
          });
        }
      });
    });

    // Если все запросы прошли успешно, подтверждаем транзакцию
    db.commit(function(err3) {
      if (err3) {
        return db.rollback(() => {
          console.log("Error committing transaction:", err3);
          return result(err3, null);
        });
      }

      console.log("Order confirmed and stock updated successfully");
      result(null, { message: 'Order confirmed and stock updated successfully' });
    });
  });
});
  };
// Получение заказов пользователя
export const getOrdersByUserId = (userId, result) => {
  const query = `
    SELECT o.OrderID, o.UserID, o.Status, o.OrderDate, p.PaymentStatus
    FROM orders o
    LEFT JOIN payments p ON o.OrderID = p.OrderID
    WHERE o.UserID = ?
    ORDER BY o.OrderDate DESC
  `;
  
  db.query(query, [userId], (err, res) => {
    if (err) {
      console.log("Error fetching orders:", err);
      return result(err, null);
    }
    result(null, res);
  });
};

export const getOrderDetailsWithProducts = (orderId, result) => {
  const query = `
    SELECT o.Status, od.OrderID, od.ProductID, od.Quantity,
           p.Name, p.Brand, p.CoreCount, p.ClockSpeed, p.Description, p.ImageURL, pp.Price,
           o.UserID, o.OrderDate
    FROM orderdetails od
    JOIN products p ON od.ProductID = p.ProductID
    LEFT JOIN productprices pp ON p.ProductID = pp.ProductID
    JOIN orders o ON od.OrderID = o.OrderID
    WHERE od.OrderID = ?
  `;
  db.query(query, [orderId], (err, res) => {
    if (err) {
      console.log("Error fetching order details with products:", err);
      return result(err, null);
    }
    result(null, res);
  });
};


export const getAllOrdersFromDb = (result) => {
  const query = `
    SELECT o.OrderID, o.UserID, o.Status, o.OrderDate, p.PaymentStatus
    FROM orders o
    LEFT JOIN payments p ON o.OrderID = p.OrderID
    ORDER BY o.OrderDate DESC
  `;
  
  db.query(query, (err, res) => {
    if (err) {
      console.log("Error fetching all orders:", err);
      return result(err, null);
    }
    result(null, res);
  });
};


// Обновление статуса заказа
export const updateOrderStatus = (orderId, paymentMethod, result) => {
  const updateOrderStatusQuery = `
    UPDATE orders
    SET Status = 'paid', PaymentMethod = ?
    WHERE OrderID = ?
  `;
  db.query(updateOrderStatusQuery, [paymentMethod, orderId], (err, res) => {
    if (err) {
      console.log("Error updating order status:", err);
      return result(err, null);
    }

    console.log("Order status updated to 'paid'");
    result(null, { message: 'Order status updated to paid' });
  });
};

// Обновление статуса и даты заказа
export const updateOrderStatusAndDate = (orderId, status, orderDate, result) => {
  const updateOrderQuery = `
    UPDATE orders
    SET Status = ?, OrderDate = ?
    WHERE OrderID = ?
  `;

  db.query(updateOrderQuery, [status, orderDate, orderId], (err, res) => {
    if (err) {
      console.log("Error updating order status and date:", err);
      return result(err, null);
    }

    console.log("Order status and date updated successfully");
    result(null, { message: 'Order status and date updated successfully' });
  });
};