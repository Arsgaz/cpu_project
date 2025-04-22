// models/cart.js
import db from "../config/database.js";

// Получение корзины для текущего пользователя
export const getCart = (userID, result) => {
    const query = `
        SELECT o.OrderID, od.OrderDetailID, od.ProductID, od.Quantity, p.Name, p.ImageURL, pp.Price
        FROM orders o
        LEFT JOIN orderdetails od ON o.OrderID = od.OrderID
        LEFT JOIN products p ON od.ProductID = p.ProductID
        LEFT JOIN productprices pp ON p.ProductID = pp.ProductID
        WHERE o.UserID = ? AND o.Status = 'in_cart'
    `;
    db.query(query, [userID], (err, results) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    });
};
// Добавление товара в корзину
export const addProductToCart = (userID, productId, quantity, result) => {
  // Получаем текущий заказ пользователя
  const queryOrder = `
      SELECT OrderID FROM orders WHERE UserID = ? AND Status = 'in_cart'
  `;
  db.query(queryOrder, [userID], (err, orderResults) => {
      if (err) {
          console.log(err);
          result(err, null);
      } else {
          if (orderResults.length > 0) {
              // Если заказ уже существует, проверяем, есть ли товар в корзине
              const orderId = orderResults[0].OrderID;
              const queryDetail = `
                  SELECT OrderDetailID FROM orderdetails WHERE OrderID = ? AND ProductID = ?
              `;
              db.query(queryDetail, [orderId, productId], (err2, detailResults) => {
                  if (err2) {
                      console.log(err2);
                      result(err2, null);
                  } else {
                      if (detailResults.length > 0) {
                          // Если товар уже есть в корзине, увеличиваем его количество
                          const orderDetailId = detailResults[0].OrderDetailID;
                          const updateQuantityQuery = `
                              UPDATE orderdetails SET Quantity = Quantity + ? WHERE OrderDetailID = ?
                          `;
                          db.query(updateQuantityQuery, [quantity, orderDetailId], (err3, updateResults) => {
                              if (err3) {
                                  console.log(err3);
                                  result(err3, null);
                              } else {
                                  result(null, { message: 'Product quantity updated' });
                              }
                          });
                      } else {
                          // Если товара нет в корзине, добавляем новый товар
                          const insertDetailQuery = `
                              INSERT INTO orderdetails (OrderID, ProductID, Quantity) 
                              VALUES (?, ?, ?)
                          `;
                          db.query(insertDetailQuery, [orderId, productId, quantity], (err3, insertResults) => {
                              if (err3) {
                                  console.log(err3);
                                  result(err3, null);
                              } else {
                                  result(null, { message: 'Product added to cart' });
                              }
                          });
                      }
                  }
              });
          } else {
              // Если корзина не существует, создаем новый заказ и добавляем товар
              const insertOrderQuery = `
                  INSERT INTO orders (UserID, Status) VALUES (?, 'in_cart')
              `;
              db.query(insertOrderQuery, [userID], (err2, insertOrderResults) => {
                  if (err2) {
                      console.log(err2);
                      result(err2, null);
                  } else {
                      const newOrderId = insertOrderResults.insertId;
                      const insertDetailQuery = `
                          INSERT INTO orderdetails (OrderID, ProductID, Quantity)
                          VALUES (?, ?, ?)
                      `;
                      db.query(insertDetailQuery, [newOrderId, productId, quantity], (err3, insertDetailResults) => {
                          if (err3) {
                              console.log(err3);
                              result(err3, null);
                          } else {
                              result(null, { message: 'Product added to cart' });
                          }
                      });
                  }
              });
          }
      }
  });
};

// Удаление товара из корзины
export const removeProductFromCart = (userID, productId, result) => {
  // Получаем текущий заказ пользователя
  const queryOrder = `
      SELECT OrderID FROM orders WHERE UserID = ? AND Status = 'in_cart'
  `;
  db.query(queryOrder, [userID], (err, orderResults) => {
      if (err) {
          console.log(err);
          result(err, null);
      } else {
          if (orderResults.length > 0) {
              // Если заказ существует, удаляем товар из корзины
              const orderId = orderResults[0].OrderID;
              const deleteQuery = `
                  DELETE FROM orderdetails WHERE OrderID = ? AND ProductID = ?
              `;
              db.query(deleteQuery, [orderId, productId], (err2, deleteResults) => {
                  if (err2) {
                      console.log(err2);
                      result(err2, null);
                  } else {
                      result(null, { message: 'Product removed from cart' });
                  }
              });
          } else {
              result({ message: 'No active cart found' }, null);
          }
      }
  });
};

// Оформление заказа (переход в статус "completed")
export const checkoutCart = (userID, result) => {
  const queryOrder = `
      SELECT OrderID FROM orders WHERE UserID = ? AND Status = 'in_cart'
  `;
  db.query(queryOrder, [userID], (err, orderResults) => {
      if (err) {
          console.log(err);
          result(err, null);
      } else {
          if (orderResults.length > 0) {
              const orderId = orderResults[0].OrderID;
              const updateStatusQuery = `
                  UPDATE orders SET Status = 'completed' WHERE OrderID = ?
              `;
              db.query(updateStatusQuery, [orderId], (err2, updateResults) => {
                  if (err2) {
                      console.log(err2);
                      result(err2, null);
                  } else {
                      result(null, { message: 'Order completed' });
                  }
              });
          } else {
              result({ message: 'No active cart found' }, null);
          }
      }
  });
};