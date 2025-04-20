import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js"; // Подключение к базе данных

// Регистрация пользователя
export const registerUser = (req, res) => {
  const { FullName, Email, Phone, Password } = req.body;

  // Проверяем, существует ли уже такой пользователь
  db.query("SELECT * FROM users WHERE Email = ? OR Phone = ?", [Email, Phone], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Хешируем пароль
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(Password, salt);

    // Сохраняем нового пользователя в БД
    db.query(
      "INSERT INTO users (FullName, Email, Phone, PasswordHash, RegistrationDate) VALUES (?, ?, ?, ?, NOW())",
      [FullName, Email, Phone, hashedPassword],
      (err2, result) => {
        if (err2) {
          return res.status(500).json({ message: "Error registering user" });
        }

        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
};

// Регистрация администратора
export const registerAdmin = (req, res) => {
  const { FullName, Email, Password, Role } = req.body;

  // Проверяем, существует ли уже такой администратор
  db.query("SELECT * FROM admins WHERE Email = ?", [Email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Хешируем пароль
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(Password, salt);

    // Сохраняем нового администратора в БД
    db.query(
      "INSERT INTO admins (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)",
      [FullName, Email, hashedPassword, Role],
      (err2, result) => {
        if (err2) {
          return res.status(500).json({ message: "Error registering admin" });
        }

        res.status(201).json({ message: "Admin registered successfully" });
      }
    );
  });
};

// Логин пользователя или администратора
export const login = (req, res) => {
  const { Email, Password } = req.body;

  // Сначала проверяем, есть ли такой пользователь
  db.query("SELECT * FROM users WHERE Email = ?", [Email], (err, userResults) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    // Если пользователя не нашли, проверяем админов
    if (userResults.length > 0) {
      const user = userResults[0];
      bcrypt.compare(Password, user.PasswordHash, (err, match) => {
        if (!match) {
          return res.status(400).json({ message: "Invalid password" });
        }

        // Генерация JWT токена
        const token = jwt.sign(
          { userID: user.UserID, role: "user" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ token });
      });
    } else {
      // Если пользователь не найден, ищем админа
      db.query("SELECT * FROM admins WHERE Email = ?", [Email], (err2, adminResults) => {
        if (err2) {
          return res.status(500).json({ message: "Server error" });
        }

        if (adminResults.length > 0) {
          const admin = adminResults[0];
          bcrypt.compare(Password, admin.PasswordHash, (err, match) => {
            if (!match) {
              return res.status(400).json({ message: "Invalid password" });
            }

            // Генерация JWT токена для администратора
            const token = jwt.sign(
              { userID: admin.AdminID, role: admin.Role },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            res.status(200).json({ token });
          });
        } else {
          res.status(400).json({ message: "User not found" });
        }
      });
    }
  });
};