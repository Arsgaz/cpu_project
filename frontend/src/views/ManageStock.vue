<template>
    <section class="section">
      <div class="container">
        <!-- Заголовок страницы -->
        <h1 class="title">Manage Product Stock</h1>
  
        <!-- Проверка, если продукт не найден -->
        <div v-if="loading" class="notification is-info">Loading product data...</div>
        <div v-if="error" class="notification is-danger">Error: {{ error }}</div>
  
        <!-- Отображение информации о продукте -->
        <div v-if="product" class="card">
          <div class="card-content">
            <p class="title is-4">{{ product.Name }}</p>
            <div class="image-container">
              <img v-if="product.ImageURL" :src="product.ImageURL" alt="Product Image" class="product-image" />
            </div>
            <p class="subtitle is-6">Price: ${{ product.Price }}</p>
            <p class="subtitle is-6">Current Stock: {{ product.StockQuantity }}</p>
  
            <!-- Форма для изменения количества на складе -->
            <div class="field">
              <label class="label">Update Stock Quantity</label>
              <div class="control">
                <input
                  type="number"
                  v-model="newStock"
                  class="input"
                  :min="0"
                  :max="9999"
                  :placeholder="'Enter new stock quantity'"
                />
              </div>
            </div>
  
            <!-- Кнопка для сохранения изменений -->
            <div class="control">
              <button class="button is-primary" @click="updateStock">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ManageStock',
    data() {
      return {
        product: null, // Информация о продукте
        newStock: 0, // Новое количество товара
        loading: false, // Флаг для индикатора загрузки
        error: null, // Сообщение об ошибке
      };
    },
    created() {
      this.fetchProductData();
    },
    methods: {
      // Функция для получения данных о продукте
      async fetchProductData() {
        const productId = this.$route.params.id;
        this.loading = true;
        this.error = null;
  
        try {
          const response = await axios.get(`http://localhost:3000/products-with-stock/${productId}`);
          console.log(response.data);  
          this.product = response.data;
          this.newStock = this.product.StockQuantity; // Изначально показываем текущее количество
        } catch (err) {
          this.error = err.response?.data?.message || 'Failed to load product data';
        } finally {
          this.loading = false;
        }
      },
  
      // Функция для обновления количества товара
      async updateStock() {
        if (this.newStock < 0 || this.newStock > 9999) {
          alert('Please enter a valid stock quantity.');
          return;
        }
  
  
        try {
          const token = localStorage.getItem('token');
          await axios.put(
  `http://localhost:3000/update-stock`,
  {
    productId: this.$route.params.id,
    warehouseId: 1,               // пусть будет 1, раз он единственный
    quantity: this.newStock
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
          alert('Stock updated successfully!');
        } catch (err) {
          console.error(err);
          alert('Failed to update stock.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Стили для карточки продукта и элементов формы */
  .card {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .image-container {
    text-align: center;
    margin: 20px 0;
  }
  
  .product-image {
    width: 100%;
    height: auto;
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
  }
  
  .input {
    width: 100%;
    max-width: 200px;
  }
  
  .button {
    width: 100%;
    margin-top: 20px;
  }
  </style>
  