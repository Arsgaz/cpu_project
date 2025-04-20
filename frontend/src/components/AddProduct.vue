<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Add New Product</h1>
        <div class="box">
          <!-- Product Name -->
          <div class="field">
            <label class="label">Product Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Enter product name"
                v-model="productName"
              />
            </div>
          </div>
  
          <!-- Product Price -->
          <div class="field">
            <label class="label">Price</label>
            <div class="control">
              <input
                class="input"
                type="number"
                placeholder="Enter price"
                v-model="productPrice"
              />
            </div>
          </div>
  
          <!-- Product Description -->
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea
                class="textarea"
                placeholder="Enter product description"
                v-model="productDescription"
              ></textarea>
            </div>
          </div>
  
          <!-- Product Image URL -->
          <div class="field">
            <label class="label">Image URL</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Enter image URL"
                v-model="productImageURL"
              />
            </div>
          </div>
  
          <!-- Product Core Count -->
          <div class="field">
            <label class="label">Core Count</label>
            <div class="control">
              <input
                class="input"
                type="number"
                placeholder="Enter core count"
                v-model="productCoreCount"
              />
            </div>
          </div>
  
          <!-- Product Brand -->
          <div class="field">
            <label class="label">Brand</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Enter brand"
                v-model="productBrand"
              />
            </div>
          </div>
  
          <!-- Product Clock Speed -->
          <div class="field">
            <label class="label">Clock Speed</label>
            <div class="control">
              <input
                class="input"
                type="number"
                placeholder="Enter clock speed"
                v-model="productClockSpeed"
              />
            </div>
          </div>
  
          <!-- Submit and Cancel buttons -->
          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-primary" @click="saveProduct">Save Product</button>
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
    name: "CreateProduct",
    data() {
      return {
        productName: "",
        productPrice: "",
        productDescription: "", // Новое поле
        productImageURL: "", // Новое поле
        productCoreCount: "", // Новое поле
        productBrand: "", // Новое поле
        productClockSpeed: "", // Новое поле
      };
    },
    methods: {
      async saveProduct() {
        try {
          const newProduct = {
            Name: this.productName,
            Price: this.productPrice,
            Description: this.productDescription, // Отправляем Description
            ImageURL: this.productImageURL, // Отправляем ImageURL
            CoreCount: this.productCoreCount, // Отправляем CoreCount
            Brand: this.productBrand, // Отправляем Brand
            ClockSpeed: this.productClockSpeed, // Отправляем ClockSpeed
          };
  
          // Отправка POST запроса на сервер
          await axios.post("http://localhost:3000/products", newProduct);
  
          // Очистка формы после успешного добавления
          this.productName = "";
          this.productPrice = "";
          this.productDescription = "";
          this.productImageURL = "";
          this.productCoreCount = "";
          this.productBrand = "";
          this.productClockSpeed = "";
  
          // Перенаправление на главную страницу
          this.$router.push("/");
        } catch (err) {
          console.log(err);
        }
      },
    },
  };
  </script>
  
  <style>
  </style>
  