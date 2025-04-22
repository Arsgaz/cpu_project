import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js"; 
import { registerUserWithAddress } from "../models/userModel.js"; 

// Регистрация пользователя с адресом
export const registerUser = (req, res) => {
  const { FullName, Email, Phone, Password, Address } = req.body;

  db.query("SELECT * FROM users WHERE Email = ? OR Phone = ?", [Email, Phone], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(Password, salt);

    const userData = { FullName, Email, Phone, Password: hashedPassword };
    const addressData = Address;

    registerUserWithAddress(userData, addressData, (err2, result) => {
      if (err2) {
        return res.status(500).json({ message: "Error registering user" });
      }

      res.status(201).json({ 
        message: "User registered successfully", 
        userID: result.userID, 
        addressID: result.addressID 
      });
    });
  });
};

// Получить пользователя и его адрес
export const fetchUserWithAddress = (req, res) => {
  const userId = req.params.id;

  const userQuery = "SELECT UserID, FullName, Email, Phone FROM users WHERE UserID = ?";
  const addressQuery = "SELECT Country, Region, City, Street, PostalCode FROM addresses WHERE UserID = ?";

  db.query(userQuery, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];

    db.query(addressQuery, [userId], (err2, addressResults) => {
      if (err2) return res.status(500).json({ message: "Server error" });

      const address = addressResults.length > 0 ? addressResults[0] : {};

      res.status(200).json({
        user,
        address
      });
    });
  });
};

// Регистрация администратора
export const registerAdmin = (req, res) => {
  const { FullName, Email, Password, Role } = req.body;

  db.query("SELECT * FROM admins WHERE Email = ?", [Email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(Password, salt);

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

  db.query("SELECT * FROM users WHERE Email = ?", [Email], (err, userResults) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (userResults.length > 0) {
      const user = userResults[0];
      bcrypt.compare(Password, user.PasswordHash, (err, match) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!match) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
          { userID: user.UserID, role: "user" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          token,
          userID: user.UserID,
          role: "user"
        });
      });
    } else {
      db.query("SELECT * FROM admins WHERE Email = ?", [Email], (err2, adminResults) => {
        if (err2) return res.status(500).json({ message: "Server error" });

        if (adminResults.length > 0) {
          const admin = adminResults[0];
          bcrypt.compare(Password, admin.PasswordHash, (err, match) => {
            if (err) return res.status(500).json({ message: "Server error" });
            if (!match) return res.status(400).json({ message: "Invalid password" });

            const token = jwt.sign(
              { userID: admin.AdminID, role: admin.Role },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            res.status(200).json({
              token,
              userID: admin.AdminID,
              role: admin.Role
            });
          });
        } else {
          res.status(400).json({ message: "User not found" });
        }
      });
    }
  });
};
