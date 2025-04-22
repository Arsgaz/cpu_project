<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order Details</h1>

      <div v-if="loading">
        <p>Loading order details...</p>
      </div>

      <div v-else-if="error">
        <p class="has-text-danger">{{ error }}</p>
      </div>

      <div v-else>
        <h3 class="subtitle">Products</h3>
        <div v-if="products.length === 0">
          <p>No products found for this order.</p>
        </div>

        <table class="table is-fullwidth is-striped" v-else>
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Clock Speed</th>
              <th>Core Count</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.ProductID">
              <td>{{ product.Name }}</td>
              <td>{{ product.Brand }}</td>
              <td>{{ product.ClockSpeed }} GHz</td>
              <td>{{ product.CoreCount }}</td>
              <td>{{ product.Price }} $</td>
              <td>{{ product.Quantity }}</td>
            </tr>
          </tbody>
        </table>

        <p class="is-size-5 has-text-weight-bold mt-4">
          Total: {{ totalAmount }} $
        </p>

        <hr />

        <!-- Проверка статуса заказа -->
        <div v-if="orderStatus === 'Paid'">
          <p class="has-text-success is-size-5">Payment Completed. Thank you!</p>
        </div>
        <div v-else>
          <!-- Этот блок показывается, если оплата ещё не завершена -->
          <h3 class="subtitle">Payment Method</h3>
          <div class="field">
            <label class="label">Select Payment Method</label>
            <div class="control">
              <div class="select">
                <select v-model="selectedPaymentMethod">
                  <option disabled value="">Please select a payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Crypto">Cryptocurrency</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <button
            class="button is-primary mt-4"
            :disabled="!selectedPaymentMethod || isProcessing"
            @click="processPayment"
          >
            {{ isProcessing ? "Processing..." : "Pay Now" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "OrderDetail",
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      selectedPaymentMethod: "",
      paymentStatus: "", // статус платежа
      isProcessing: false,
      orderStatus: "", // статус заказа
    };
  },
  computed: {
    totalAmount() {
      return this.products.reduce(
        (total, item) => total + item.Price * item.Quantity,
        0
      );
    },
  },
  created() {
    this.fetchOrderDetails();
  },
  methods: {
    async fetchOrderDetails() {
      const token = localStorage.getItem("token");
      const orderID = this.$route.params.id;

      if (!token) {
        this.error = "User not logged in.";
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/orders/${orderID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Обработка данных ответа
        this.products = Array.isArray(response.data.products) ? response.data.products : [];
        this.orderStatus = response.data.orderStatus;  // Статус заказа из ответа
      } catch (err) {
        console.error("Error fetching order details:", err);
        this.error = "Could not load order details.";
      } finally {
        this.loading = false;
      }
    },
    async processPayment() {
      const token = localStorage.getItem("token");
      const orderID = this.$route.params.id;

      if (!token) {
        this.error = "User not logged in.";
        return;
      }

      if (!orderID) {
        this.error = "Order ID is required.";
        return;
      }

      try {
        this.isProcessing = true;
        await axios.post(
          `http://localhost:3000/orders/pay/${orderID}`,
          {
            orderId: orderID,  // Передаем orderId
            paymentMethod: this.selectedPaymentMethod,  // Передаем метод оплаты
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Payment processed successfully.");
        this.orderStatus = "Paid";  // Обновляем статус заказа
      } catch (err) {
        console.error("Error processing payment:", err);
        this.error = "Payment failed.";
      } finally {
        this.isProcessing = false;
      }
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}

.subtitle {
  margin-bottom: 10px;
}

hr {
  margin: 20px 0;
}

select {
  width: 100%;
}
</style>
