<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Edit Product</h1>
      <div class="box">
        <div class="field">
          <label class="label">Product Name</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Product name"
              v-model="productName"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Price</label>
          <div class="control">
            <input
              class="input"
              type="number"
              placeholder="Product price"
              v-model="productPrice"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Product description"
              v-model="productDescription"
            ></textarea>
          </div>
        </div>

        <div class="field">
          <label class="label">Image URL</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Product image URL"
              v-model="productImage"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Brand</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Product brand"
              v-model="productBrand"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Core Count</label>
          <div class="control">
            <input
              class="input"
              type="number"
              placeholder="Product core count"
              v-model="productCoreCount"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Clock Speed</label>
          <div class="control">
            <input
              class="input"
              type="number"
              placeholder="Product clock speed"
              v-model="productClockSpeed"
            />
          </div>
        </div>

        <div class="field is-grouped is-grouped-right">
          <p class="control">
            <button class="button is-info" @click="updateProduct">Update</button>
          </p>
          <p class="control">
            <router-link class="button is-light" to="/">Cancel</router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "EditProduct",
  data() {
    return {
      productName: "",
      productPrice: "",
      productDescription: "",
      productImage: "",
      productBrand: "",
      productCoreCount: "",
      productClockSpeed: "",
    };
  },
  created() {
    this.getProductById();
  },
  methods: {
    async getProductById() {
      try {
        const response = await axios.get(`http://localhost:3000/products/${this.$route.params.id}`);
        const product = response.data;
        this.productName = product.Name;
        this.productPrice = product.Price;
        this.productDescription = product.Description || ''; // Заполняем поле Description
        this.productImage = product.ImageURL || ''; // Заполняем поле ImageURL
        this.productBrand = product.Brand || ''; // Заполняем поле Brand
        this.productCoreCount = product.CoreCount || ''; // Заполняем поле Core Count
        this.productClockSpeed = product.ClockSpeed || ''; // Заполняем поле Clock Speed
      } catch (err) {
        console.log(err);
      }
    },
    async updateProduct() {
      const token = localStorage.getItem("token"); // Получаем токен из localStorage

      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        // Отправка запроса с токеном в заголовке и новыми данными
        await axios.put(
          `http://localhost:3000/products/${this.$route.params.id}`,
          {
            Name: this.productName,
            Price: this.productPrice,
            Description: this.productDescription,
            ImageURL: this.productImage,
            Brand: this.productBrand,
            CoreCount: this.productCoreCount,
            ClockSpeed: this.productClockSpeed,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Передаем токен в заголовке
            },
          }
        );
        this.$router.push("/"); // Перенаправляем на главную страницу после обновления
      } catch (err) {
        console.log("Error updating product:", err);
      }
    },
  },
};
</script>

<style>
</style>
