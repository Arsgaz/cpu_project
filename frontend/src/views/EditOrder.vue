<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Edit Order #{{ orderId }}</h1>
  
        <div v-if="order">
          <!-- Order ID -->
          <div class="field">
            <label class="label">Order ID</label>
            <div class="control">
              <input class="input" type="text" v-model="order.OrderID" disabled>
            </div>
          </div>
  
          <!-- User ID -->
          <div class="field">
            <label class="label">User ID</label>
            <div class="control">
              <input class="input" type="text" v-model="order.UserID" disabled>
            </div>
          </div>
  
          <!-- Order Status -->
          <div class="field">
            <label class="label">Status</label>
            <div class="control">
              <div class="select">
                <select v-model="order.Status">
                  <option>in_cart</option>
                  <option>pending</option>
                  <option>Paid</option>
                  <option>shipped</option>
                  <option>completed</option>
                  <option>cancelled</option>
                </select>
              </div>
            </div>
          </div>
  
          <!-- Order Date -->
          <div class="field">
            <label class="label">Order Date</label>
            <div class="control">
              <input class="input" type="datetime-local" v-model="formattedDate">
            </div>
          </div>
  
          <!-- Ordered Products -->
          <div class="field" v-if="order.Products && order.Products.length">
            <label class="label">Products</label>
            <ul>
              <li v-for="product in order.Products" :key="product.ProductID">
                Product ID: {{ product.ProductID }} — Quantity: {{ product.Quantity }}
              </li>
            </ul>
          </div>
  
          <!-- Save & Cancel -->
          <div class="field">
            <button class="button is-success" @click="updateOrderStatusAndDate">Save Changes</button>
            <router-link to="/" class="button is-light">Cancel</router-link>
          </div>
        </div>
  
        <div v-else>
          <p>Loading order data...</p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'EditOrder',
    data() {
      return {
        orderId: this.$route.params.id,
        order: null,
      };
    },
    computed: {
      formattedDate: {
        get() {
          return this.order?.OrderDate
            ? new Date(this.order.OrderDate).toISOString().slice(0, 16)
            : '';
        },
        set(value) {
          this.order.OrderDate = new Date(value).toISOString();
        }
      }
    },
    async created() {
      await this.fetchOrder();
    },
    methods: {
        async fetchOrder() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/orders/${this.orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Ответ от сервера:', response.data);

    const data = response.data;

    if (data && data.products?.length > 0) {
      const firstProduct = data.products[0];

      this.order = {
        OrderID: firstProduct.OrderID || '',
        UserID: firstProduct.UserID || '',
        Status: data.orderStatus || '',
        OrderDate: firstProduct.OrderDate || '',
        Products: data.products
      };
    } else {
      alert('Order not found or no products in order.');
      this.order = null;
    }

    console.log('Установлен order:', this.order);

  } catch (err) {
    console.error(err.response ? err.response.data : err);
    alert('Failed to fetch order details.');
  }
},


async updateOrderStatusAndDate() {
  try {
    const token = localStorage.getItem('token');
    const status = this.order.Status;  // Убедитесь, что это значение не undefined
    const formattedDate = this.formattedDate;

    console.log("Sending status and date update:");
    console.log("Status:", status);
    console.log("Formatted Date:", formattedDate);
    
    await axios.put(`http://localhost:3000/orders/${this.orderId}/status-and-date`, 
      { 
        orderId: this.orderId, 
        status: status, 
        orderDate: formattedDate 
      }, 
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      
    alert('Order status and date updated successfully!');
    this.$router.push('/');
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    alert('Failed to update order status and date.');
  }
}

    }
  };
  </script>
  
  <style>
  .field {
    margin-bottom: 20px;
  }
  </style>
  