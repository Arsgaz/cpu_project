<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Your Cart</h1>

      <div v-if="cart.length > 0">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.ProductID">
              <td><img :src="item.ImageURL" alt="Product Image" style="width: 50px; height: 50px;" /></td>
              <td>{{ item.Name || 'Unknown Product' }}</td>
              <td>${{ item.Price ? parseFloat(item.Price).toFixed(2) : '0.00' }}</td>
              <td>{{ item.Quantity || 0 }}</td>
              <td>
                ${{ item.Quantity && item.Price 
                  ? (parseFloat(item.Price) * parseInt(item.Quantity)).toFixed(2) 
                  : '0.00' 
                }}
              </td>
              <td>
                <button class="button is-small is-success" @click="increaseQuantity(item)">+</button>
                <button class="button is-small is-warning" @click="decreaseQuantity(item)">-</button>
                <button class="button is-small is-danger" @click="removeItem(item)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="notification is-info has-text-centered">
          <strong>Total: ${{ totalPrice.toFixed(2) }}</strong>
        </div>

        <div class="has-text-centered">
          <router-link to="/order">
            <button class="button is-primary is-medium" @click="saveCartForOrder">Proceed to Checkout</button>
          </router-link>
        </div>
      </div>

      <div v-else class="notification is-warning has-text-centered">
        Your cart is empty!
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: "ShoppingCart",
  data() {
    return {
      cart: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => {
        const price = parseFloat(item.Price) || 0;
        const quantity = parseInt(item.Quantity) || 0;
        return total + (price * quantity);
      }, 0);
    },
  },
  created() {
    this.loadCart();
  },
  methods: {
    async loadCart() {
  try {
    const response = await axios.get('http://localhost:3000/cart', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // Фильтруем товары с Quantity > 0
    this.cart = response.data.filter(item => item.Quantity > 0);
    console.log('Loaded cart:', this.cart);
  } catch (error) {
    console.error('Error loading cart:', error);
  }
},


    async addToCart(productId) {
      try {
        await axios.post('http://localhost:3000/cart/add', { productId, quantity: 1 }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.loadCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },

    async removeItem(item) {
      try {
        await axios.post('http://localhost:3000/cart/remove', { productId: item.ProductID }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.loadCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    },

    async increaseQuantity(item) {
      await this.addToCart(item.ProductID);
    },

    async decreaseQuantity(item) {
  try {
    await axios.post('http://localhost:3000/cart/add', { productId: item.ProductID, quantity: -1 }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    await this.loadCart();  // перезагружаем и фильтруем уже здесь
  } catch (error) {
    console.error('Error decreasing quantity:', error);
  }
},


    async checkout() {
      try {
        await axios.post('http://localhost:3000/checkout', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Order placed!');
        this.loadCart();
      } catch (error) {
        console.error('Error during checkout:', error);
      }
    },

  },
};
</script>

<style scoped>
.table img {
  border-radius: 8px;
  object-fit: cover;
}
.button {
  margin: 2px;
}
.notification {
  margin-top: 20px;
}
</style>
