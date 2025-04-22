// Import function from Product Model
import { getProducts, getProductById, insertProduct, updateProductById, deleteProductById, updateStockQuantity, getProductWithStockById } from "../models/productModel.js";
 
// Получить все продукты
export const showProducts = (req, res) => {
    getProducts((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);  // Возвращаем результат с ценой
        }
    });
}
 
// Get Single Product 
export const showProductById = (req, res) => {
    getProductById(req.params.id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}
 
// Create New Product
export const createProduct = (req, res) => {
    const data = req.body;
    insertProduct(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}
 
// Update Product
export const updateProduct = (req, res) => {
    const data  = req.body;
    const id    = req.params.id;
    updateProductById(data, id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}
 
// Delete Product
export const deleteProduct = (req, res) => {
    const id = req.params.id;
    deleteProductById(id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Контроллер для обновления количества товара на складе
export const updateStock = (req, res) => {
    const { productId, warehouseId, quantity } = req.body;
  
    // Проверка на наличие всех необходимых данных
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // Если warehouseId не указан, используем значение по умолчанию (1)
    const warehouseIdToUse = warehouseId || 1;
  
    // Обновление количества товара на складе
    updateStockQuantity(productId, warehouseIdToUse, quantity, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating stock", error: err });
      }
  
      return res.status(200).json(result);
    });
  };

  export const showProductStockOnly = (req, res) => {
    getProductStockOnlyById(req.params.id, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}
export const showProductWithStock = (req, res) => {
    getProductWithStockById(req.params.id, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}