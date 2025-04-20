// import connection
import db from "../config/database.js";
 
// Get All Products
export const getProducts = (result) => {
    db.query(`
        SELECT p.ProductID, p.Name, pp.Price, p.ImageURL
        FROM products p
        LEFT JOIN productprices pp ON p.ProductID = pp.ProductID
    `, (err, results) => {             
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);  // Отправляем объединённые данные
        }
    });   
}
 
// Get Single Product
export const getProductById = (id, result) => {
    const query = `
        SELECT p.ProductID, p.Name, p.Brand, p.CoreCount, p.ClockSpeed, p.Description, p.ImageURL, pp.Price
        FROM products p
        LEFT JOIN productprices pp ON p.ProductID = pp.ProductID
        WHERE p.ProductID = ?
    `;
    db.query(query, [id], (err, results) => {             
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results[0]); // вернёт первый найденный продукт
        }
    });   
}

 
export const insertProduct = (data, result) => {
    db.query("INSERT INTO products (Name, Description, ImageURL, Brand, CoreCount, ClockSpeed) VALUES (?, ?, ?, ?, ?, ?)", 
    [data.Name, data.Description, data.ImageURL, data.Brand, data.CoreCount, data.ClockSpeed], 
    (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            const newProductId = res.insertId;
            db.query(
                "INSERT INTO productprices (ProductID, Price) VALUES (?, ?)",
                [newProductId, data.Price],
                (err2, res2) => {
                    if (err2) {
                        console.log(err2);
                        result(err2, null);
                    } else {
                        result(null, { id: newProductId, priceInsert: res2 });
                    }
                }
            );
        }
    });
}
 
// Update Product to Database (обновляем все данные продукта)
export const updateProductById = (data, id, result) => {
    // Обновляем все данные продукта в таблице `products`
    const query = `
        UPDATE products
        SET Name = ?, Description = ?, ImageURL = ?, Brand = ?, CoreCount = ?, ClockSpeed = ?
        WHERE ProductID = ?
    `;
    
    db.query(query, [
        data.Name,
        data.Description,
        data.ImageURL,
        data.Brand,
        data.CoreCount,
        data.ClockSpeed,
        id
    ], (err, results1) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            // Если обновление данных продукта прошло успешно, обновляем цену в таблице `productprices`
            db.query("UPDATE productprices SET Price = ? WHERE ProductID = ?", [data.Price, id], (err2, results2) => {
                if (err2) {
                    console.log(err2);
                    result(err2, null);
                } else {
                    result(null, { nameUpdate: results1, priceUpdate: results2 });
                }
            });
        }
    });
}
 
// Delete Product to Database
export const deleteProductById = (id, result) => {
    db.query("DELETE FROM Products WHERE ProductID = ?", [id], (err, results) => {             
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    });   
}