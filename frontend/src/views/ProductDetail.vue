<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Product Details</h1>

      <div v-if="isEditing">
        <!-- Форма редактирования -->
      </div>

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
              <p><strong>Stock Quantity:</strong> {{ productStockQuantity }} units</p> <!-- Количество на складе -->
            </div>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item" v-if="canEdit">
              <button class="button is-info is-small" @click="startEditing">Edit</button>
            </p>
            <p class="card-footer-item" v-else>
              <button 
                v-if="!isAdmin && isLoggedIn" 
                class="button is-primary is-small" 
                @click="addProductToCart"
              >
                Add to Cart
              </button>
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
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router'; // для получения параметров маршрута

export default {
  name: "ProductDetail",
  setup() {
    const route = useRoute(); // доступ к параметрам маршрута
    const addToCart = inject('addToCart'); // Получаем функцию добавления в корзину

    // Реактивные данные
    const isEditing = ref(false);
    const productName = ref("");
    const productPrice = ref("");
    const productDescription = ref("");
    const productImage = ref("");
    const productBrand = ref("");
    const productCoreCount = ref("");
    const productClockSpeed = ref("");
    const productStockQuantity = ref(0); // Количество на складе
    const canEdit = ref(false);

    // Загрузка данных о продукте с количеством на складе
    const getProductWithStockById = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products-with-stock/${route.params.id}`);
        const product = response.data;
        productName.value = product.Name;
        productPrice.value = product.Price;
        productDescription.value = product.Description;
        productImage.value = product.ImageURL;
        productBrand.value = product.Brand;
        productCoreCount.value = product.CoreCount;
        productClockSpeed.value = product.ClockSpeed;
        productStockQuantity.value = product.StockQuantity || 0; // Заполняем количество на складе
      } catch (err) {
        console.log(err);
      }
    };

    // Добавление товара в корзину
    const addProductToCart = async () => {
      const product = {
        id: route.params.id,
        name: productName.value,
        price: productPrice.value,
        image: productImage.value,
      };
      if (addToCart) {
        addToCart(product);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to add items to the cart.");
        return;
      }

      try {
        await axios.post("http://localhost:3000/cart/add", {
          productId: route.params.id,
          quantity: 1
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Product added to cart!");
      } catch (err) {
        console.log(err);
        alert("Failed to add product to cart.");
      }
    };

    // Проверка роли пользователя
    const checkUserRole = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const decodedToken = JSON.parse(atob(parts[1]));
            if (decodedToken.role === 'Admin' || decodedToken.role === 'Manager') {
              canEdit.value = true;
            }
          }
        } catch (err) {
          console.error("Error decoding token", err);
        }
      }
    };

    // Переводим страницу в режим редактирования
    const startEditing = () => {
      isEditing.value = true;
    };

    // Отменить редактирование
    const cancelEdit = () => {
      isEditing.value = false;
      getProductWithStockById(); // Перезагружаем данные, чтобы отменить изменения
    };

    // Обновление продукта
    const updateProduct = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        await axios.put(`http://localhost:3000/products-with-stock/${route.params.id}`, {
          Name: productName.value,
          Price: productPrice.value,
          Description: productDescription.value,
          ImageURL: productImage.value,
          Brand: productBrand.value,
          CoreCount: productCoreCount.value,
          ClockSpeed: productClockSpeed.value,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        isEditing.value = false;
      } catch (err) {
        console.log("Error updating product:", err);
      }
    };

    // При монтировании
    onMounted(() => {
      getProductWithStockById();
      checkUserRole();
    });

    return {
      isEditing,
      productName,
      productPrice,
      productDescription,
      productImage,
      productBrand,
      productCoreCount,
      productClockSpeed,
      productStockQuantity, // Возвращаем количество на складе
      canEdit,
      addProductToCart,
      startEditing,
      cancelEdit,
      updateProduct,
    };
  }
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

