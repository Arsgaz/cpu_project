import db from "../config/database.js";

// Функция для создания записи об оплате
export const createPayment = (orderId, paymentMethod, result) => {
  const paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Текущая дата и время
  const insertPaymentQuery = `
    INSERT INTO payments (OrderID, PaymentDate, PaymentStatus, PaymentMethod)
    VALUES (?, ?, 'pending', ?)
  `;
  db.query(insertPaymentQuery, [orderId, paymentDate, paymentMethod], (err, res) => {
    if (err) {
      console.log("Error creating payment record:", err);
      return result(err, null);
    }

    console.log("Payment record created successfully");
    result(null, { message: 'Payment record created successfully' });
  });
};

// Функция для обновления статуса оплаты на "completed"
export const updatePaymentStatus = (paymentId, result) => {
    const updatePaymentStatusQuery = `
      UPDATE payments SET PaymentStatus = 'completed' WHERE PaymentID = ?
    `;
    db.query(updatePaymentStatusQuery, [paymentId], (err, res) => {
      if (err) {
        console.log("Error updating payment status:", err);
        return result(err, null);
      }
  
      console.log("Payment status updated to 'completed'");
      result(null, { message: 'Payment status updated to completed' });
    });
  };