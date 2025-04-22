<template>
  <section class="section">
    <div class="container">
      <h1 class="title">My Orders</h1>

      <div v-if="orders.length === 0">
        <p>You have no orders yet.</p>
        <router-link class="button is-primary mt-4" to="/">Go to Catalog</router-link>
      </div>

      <div v-else>
        <div
          class="box"
          v-for="order in orders"
          :key="order.OrderID"
        >
          <h2 class="subtitle">Order #{{ order.OrderID }}</h2>

          <p><strong>Status:</strong> 
            <span :class="statusClass(order.Status)">{{ order.Status }}</span>
          </p>

          <p><strong>Payment:</strong> 
            <span :class="paymentClass(order.PaymentStatus)">
              {{ order.PaymentStatus || 'Not Paid' }}
            </span>
          </p>

          <p><strong>Date:</strong> {{ formatDate(order.OrderDate) }}</p>

          <div class="field is-grouped is-grouped-right mt-3">
            <p class="control">
              <button
                class="button is-light"
                @click="viewOrderDetails(order.OrderID)"
              >
                View Details
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "MyOrders",
  data() {
    return {
      orders: [],
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("User not logged in.");
    return;
  }

  try {
    const response = await axios.get("http://localhost:3000/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched orders:", response.data);  // Логирование ответа от сервера
    this.orders = response.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
},

    viewOrderDetails(orderID) {
      this.$router.push({ name: "OrderDetail", params: { id: orderID } });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    // Функция для присвоения класса статусу заказа
    statusClass(status) {
      switch (status) {
        case 'Paid':
          return 'has-text-success';  // Зеленый цвет для оплаченных заказов
        case 'pending':
          return 'has-text-warning';  // Желтый для ожидающих
        case 'shipped':
          return 'has-text-info';     // Голубой для отправленных
        default:
          return 'has-text-grey';     // Серая для всех остальных
      }
    },
    // Функция для присвоения класса статусу оплаты
    paymentClass(paymentStatus) {
      switch (paymentStatus) {
        case 'completed':
          return 'has-text-success';  // Зеленый цвет для завершенной оплаты
        case 'pending':
          return 'has-text-warning';  // Желтый для ожидающих оплату
        case 'failed':
          return 'has-text-danger';   // Красный для неудачных оплат
        default:
          return 'has-text-grey';     // Серая для остальных случаев
      }
    },
  },
};
</script>

<style scoped>
.box {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.subtitle {
  margin-bottom: 10px;
}

p {
  margin-bottom: 5px;
}

button.is-light {
  min-width: 150px;
}
</style>
