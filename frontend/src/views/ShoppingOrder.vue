<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order Confirmation</h1>

      <div v-if="cart.length > 0">
        <h2 class="subtitle">Your Order:</h2>
        <ul>
          <li v-for="item in cart" :key="item.ProductID">
            {{ item.Name }} x {{ item.Quantity }} — ${{ (item.Price && item.Quantity) ? (item.Price * item.Quantity).toFixed(2) : '0.00' }}
          </li>
        </ul>

        <div class="notification is-info has-text-centered mt-4">
          <strong>Total: ${{ totalPrice.toFixed(2) }}</strong>
        </div>

        <div class="box mt-5">
          <h2 class="subtitle">Your Details:</h2>

          <div class="field">
            <label class="label">Full Name</label>
            <p>{{ userData.FullName }}</p>
          </div>

          <div class="field">
            <label class="label">Email</label>
            <p>{{ userData.Email }}</p>
          </div>

          <div class="field">
            <label class="label">Phone</label>
            <p>{{ userData.Phone }}</p>
          </div>

          <div class="field">
            <label class="label">Country</label>
            <p>{{ userAddress.Country }}</p>
          </div>

          <div class="field">
            <label class="label">Region</label>
            <p>{{ userAddress.Region }}</p>
          </div>

          <div class="field">
            <label class="label">City</label>
            <p>{{ userAddress.City }}</p>
          </div>

          <div class="field">
            <label class="label">Street</label>
            <p>{{ userAddress.Street }}</p>
          </div>

          <div class="field">
            <label class="label">Postal Code</label>
            <p>{{ userAddress.PostalCode }}</p>
          </div>

          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-primary" @click="submitOrder">Submit Order</button>
            </p>
          </div>
        </div>
      </div>

      <div v-else class="notification is-warning has-text-centered">
        Your cart is empty! <router-link to="/">Go back to catalog</router-link>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: "ShoppingOrder",
  data() {
    return {
      cart: [],
      userData: {
        FullName: '',
        Email: '',
        Phone: ''
      },
      userAddress: {
        Country: '',
        Region: '',
        City: '',
        Street: '',
        PostalCode: ''
      }
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => {
        const price = parseFloat(item.Price) || 0;
        const quantity = parseInt(item.Quantity) || 0;
        return total + (price * quantity);
      }, 0);
    }
  },
  created() {
    this.loadCart();
    this.loadUserData();
  },
  methods: {
    async loadCart() {
      try {
        const response = await axios.get('http://localhost:3000/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.cart = response.data.filter(item => item.Quantity > 0);
        console.log('Loaded cart:', this.cart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    },

    async loadUserData() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return alert('User is not logged in.');

        const response = await axios.get(`http://localhost:3000/profile/${userId}`);
        this.userData = response.data.user;
        this.userAddress = response.data.address;
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },

    async submitOrder() {
  if (this.cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  try {
    const orderId = this.generateOrderId();
    const userId = localStorage.getItem('userId');  // Получаем userId из localStorage
    const token = localStorage.getItem('token');  // Получаем токен авторизации
    console.log('Token from localStorage:', token); 

    const items = this.cart.map(item => ({
      ProductID: item.ProductID,
      Quantity: item.Quantity,
      WarehouseID: item.WarehouseID
    }));

    // Отправляем запрос с токеном в заголовках
    await axios.post('http://localhost:3000/confirm-order', {
      orderId,
      items,
      userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`  // Добавляем токен в заголовок
      }
    });

    alert(`Thank you for your order!`);
    localStorage.removeItem('cartForOrder');
    this.$router.push('/');
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('There was an error with your order. Please try again later.');
  }
},

generateOrderId() {
  // Генерация числового ID для заказа на основе времени
  return Math.floor(Date.now() / 1000);  // Возвращаем число в секундах
}
  }
};
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}
.mt-5 {
  margin-top: 3rem;
}
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
