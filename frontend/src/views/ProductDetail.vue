<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Product Details</h1>

      <!-- Если в режиме редактирования, показываем форму редактирования -->
      <div v-if="isEditing">
        <div class="box">
          <h2 class="subtitle">Edit Product</h2>
          <div class="field">
            <label class="label">Product Name</label>
            <div class="control">
              <input class="input" type="text" v-model="productName" />
            </div>
          </div>

          <div class="field">
            <label class="label">Price</label>
            <div class="control">
              <input class="input" type="number" v-model="productPrice" />
            </div>
          </div>

          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea" v-model="productDescription"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">Image URL</label>
            <div class="control">
              <input class="input" type="text" v-model="productImage" />
            </div>
          </div>

          <div class="field">
            <label class="label">Brand</label>
            <div class="control">
              <input class="input" type="text" v-model="productBrand" />
            </div>
          </div>

          <div class="field">
            <label class="label">Core Count</label>
            <div class="control">
              <input class="input" type="number" v-model="productCoreCount" />
            </div>
          </div>

          <div class="field">
            <label class="label">Clock Speed</label>
            <div class="control">
              <input class="input" type="number" v-model="productClockSpeed" />
            </div>
          </div>

          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-info" @click="updateProduct">Save Changes</button>
            </p>
            <p class="control">
              <button class="button is-light" @click="cancelEdit">Cancel</button>
            </p>
          </div>
        </div>
      </div>

      <!-- Если не в режиме редактирования, показываем просто данные продукта -->
      <div v-else>
        <div class="card">
          <div class="card-image">
            <figure class="image is-3by4">
              <img :src="productImage" alt="Product Image" />
            </figure>
          </div>
          <div class="card-content">
            <div class="content">
              <p><strong>Name:</strong> {{ productName }}</p>
              <p><strong>Price:</strong> {{ productPrice }} $</p>
              <p><strong>Description:</strong> {{ productDescription }}</p>
              <p><strong>Brand:</strong> {{ productBrand }}</p>
              <p><strong>Core Count:</strong> {{ productCoreCount }}</p>
              <p><strong>Clock Speed:</strong> {{ productClockSpeed }} GHz</p>
            </div>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item" v-if="canEdit">
              <button class="button is-info is-small" @click="startEditing">Edit</button>
            </p>
            <p class="card-footer-item">
              <router-link class="button is-light is-small" to="/">Back to Catalog</router-link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductDetail",
  data() {
    return {
      isEditing: false, // Переменная для отслеживания режима редактирования
      productName: "",
      productPrice: "",
      productDescription: "",
      productImage: "",
      productBrand: "",
      productCoreCount: "",
      productClockSpeed: "",
      canEdit: false, // Флаг для проверки, может ли пользователь редактировать
    };
  },
  created() {
    this.getProductById();
    this.checkUserRole(); // Проверка роли пользователя
  },
  methods: {
  // Загрузка данных о продукте
  async getProductById() {
    try {
      const response = await axios.get(`http://localhost:3000/products/${this.$route.params.id}`);
      const product = response.data;
      this.productName = product.Name;
      this.productPrice = product.Price;
      this.productDescription = product.Description;
      this.productImage = product.ImageURL;
      this.productBrand = product.Brand;
      this.productCoreCount = product.CoreCount;
      this.productClockSpeed = product.ClockSpeed;
    } catch (err) {
      console.log(err);
    }
  },

  // Переводим страницу в режим редактирования
  startEditing() {
    this.isEditing = true;
  },

  // Отменить редактирование
  cancelEdit() {
    this.isEditing = false;
    this.getProductById(); // Перезагружаем данные, чтобы отменить изменения
  },

  // Обновление продукта
  async updateProduct() {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage

    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      // Отправка запроса с токеном в заголовке
      await axios.put(`http://localhost:3000/products/${this.$route.params.id}`, {
        Name: this.productName,
        Price: this.productPrice,
        Description: this.productDescription,
        ImageURL: this.productImage,
        Brand: this.productBrand,
        CoreCount: this.productCoreCount,
        ClockSpeed: this.productClockSpeed,
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Передаем токен в заголовке
        }
      });
      this.isEditing = false; // Выход из режима редактирования
    } catch (err) {
      console.log("Error updating product:", err);
    }
  },

  // Проверка роли пользователя
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
          if (decodedToken.role === 'Admin' || decodedToken.role === 'Manager') {
            this.canEdit = true; // Разрешаем редактировать, если пользователь Admin или Manager
          }
        }
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }
  },
},
};
</script>

<style scoped>
/* Стили для карточки с продуктом */
.card {
  margin-bottom: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
.card-image {
  display: flex;
  justify-content: center; /* Центрирует по горизонтали */
  align-items: center; /* Центрирует по вертикали */
}

.card-image figure {
  max-height: 250px;
  width: 250px;
  overflow: hidden;
}

.card-footer {
  padding-top: 20px;
  text-align: center;
}

.card-footer-item {
  margin-right: 15px;
}

.card-footer-item .button {
  padding: 10px 20px;
  font-size: 16px;
  min-width: 180px;
}
.card-content {
  text-align: center; /* Выравнивание текста по центру */
}

/* Стили для режима редактирования */
.box {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.field {
  margin-bottom: 15px;
}

.input,
.textarea {
  width: 100%;
  max-width: 600px;
}

/* Кнопки */
button.is-info {
  margin-right: 10px;
}

button.is-light {
  margin-left: 10px;
}
</style>
