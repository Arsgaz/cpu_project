import db from "../config/database.js";

export const createPayment = (orderId, paymentDate, result) => {
  console.log("Creating payment for OrderID:", orderId);  // Логируем перед запросом

  const insertPaymentQuery = `
    INSERT INTO payments (OrderID, PaymentDate, PaymentStatus)
    VALUES (?, ?, 'completed')
  `;
  db.query(insertPaymentQuery, [orderId, paymentDate], (err, res) => {
    if (err) {
      console.log("Error creating payment record:", err);
      return result(err, null);
    }

    console.log("Payment record created successfully");
    result(null, { message: 'Payment record created successfully' });
  });
};

export const updateOrderStatus = (orderId, status, paymentMethod, callback) => {
  const query = `UPDATE Orders SET status = ?, paymentMethod = ? WHERE orderId = ?`;
  const values = [status, paymentMethod, orderId];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};
