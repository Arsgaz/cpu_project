<template>
  <section class="section">
    <div class="container">
      <!-- Кнопки для регистрации и логина -->
      <div class="level">
        <div class="level-left">
          <h1 class="title">Product Catalog</h1>
        </div>
        <div class="level-right">
          <!-- Кнопка для добавления нового продукта только для администратора -->
          <router-link v-if="isAdmin" :to="{ name: 'Create' }" class="button is-primary">
            + Add New Product
          </router-link>

          <!-- Кнопка для управления пользователями только для администратора -->
          <router-link v-if="isAdmin" to="/user-management" class="button is-info ml-2">
            User Menu
          </router-link>

          <!-- Кнопка для регистрации администратора всегда видна, если не залогинен -->
          <router-link v-if="!isLoggedIn" to="/admin-register" class="button is-link ml-2">Register Admin</router-link>
          
          <!-- Кнопка для регистрации всегда видна, если не залогинен -->
          <router-link v-if="!isLoggedIn" to="/register" class="button is-link ml-2">Register</router-link>

          <!-- Кнопка для логина всегда видна, если не залогинен -->
          <router-link v-if="!isLoggedIn" to="/login" class="button is-link ml-2">Login</router-link>

          <!-- Кнопка для выхода из системы, если пользователь авторизован -->
          <button v-if="isLoggedIn" class="button is-danger ml-2" @click="logout">Log out</button>
        </div>
      </div>

      <div class="columns is-multiline">
        <div
          class="column is-one-quarter"
          v-for="item in items"
          :key="item.ProductID"
        >
          <router-link
            :to="{ name: 'ProductDetail', params: { id: item.ProductID } }"
            class="card-link"
          >
            <div class="card is-clickable">
              <div class="card-content">
                <p class="title is-5">{{ item.Name }}</p>
                <div class="image-container">
                  <img
                    v-if="item.ImageURL"
                    :src="item.ImageURL"
                    alt="Product Image"
                    class="product-image"
                  />
                </div>
                <p class="subtitle is-6">💰 {{ item.Price }} $</p>
              </div>
            </div>
          </router-link>

          <div class="card-buttons" v-if="isAdmin">
            <router-link
              :to="{ name: 'Edit', params: { id: item.ProductID } }"
              class="button is-info is-fullwidth mb-2"
            >
              Edit
            </router-link>
            <a
              class="button is-danger is-fullwidth"
              @click="deleteProduct(item.ProductID)"
            >
              Delete
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="items.length === 0"
        class="notification is-warning has-text-centered"
      >
        No products available. Click <strong>"Add New Product"</strong> to create one!
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductListView",
  data() {
    return {
      items: [],
      isAdmin: false, // флаг для проверки роли
      isLoggedIn: false, // флаг для проверки, что пользователь авторизован
    };
  },
  created() {
    this.getProducts();
    this.checkUserRole(); // Проверка роли пользователя
    this.checkLoginStatus(); // Проверка, авторизован ли пользователь
  },
  methods: {
    async getProducts() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.items = response.data;
      } catch (err) {
        console.log(err.response ? err.response.data : err);
        alert(err.response?.data?.message || "Failed to load products");
      }
    },
    async deleteProduct(id) {
      if (confirm("Are you sure you want to delete this product?")) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:3000/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.getProducts();  // Обновляем список после удаления
        } catch (err) {
          console.log(err.response ? err.response.data : err);
          alert(err.response?.data?.message || "Failed to delete product");
        }
      }
    },
    checkUserRole() {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Проверяем, состоит ли токен из 3 частей
          const parts = token.split('.');
          if (parts.length === 3) {
            const decodedToken = JSON.parse(atob(parts[1]));
            console.log("Decoded Token:", decodedToken);
            // Проверяем роль пользователя
            if (decodedToken.role === 'Admin') {
              this.isAdmin = true;
            }
          } else {
            console.error("Invalid token format");
          }
        } catch (err) {
          console.error("Error decoding token", err);
        }
      } else {
        console.warn("No token found");
      }
    },
    checkLoginStatus() {
      const token = localStorage.getItem("token");
      this.isLoggedIn = !!token; // Если токен существует, пользователь авторизован
    },
    logout() {
      localStorage.removeItem("token"); // Удаляем токен из локального хранилища
      this.isLoggedIn = false; // Обновляем статус авторизации
      this.$router.push("/login"); // Перенаправляем на страницу логина
    }
  },
};
</script>

<style>
/* Стили для кнопки "Log out" и других элементов */
.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Стили карточек продуктов */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Стили изображений */
.image-container {
  text-align: center;
  margin: 10px 0;
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

/* Обрамление блока кнопок */
.card-buttons {
  margin-top: 8px;
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  background: transparent;
}

.ml-2 {
  margin-left: 10px;
}
</style>
