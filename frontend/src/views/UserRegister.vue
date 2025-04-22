<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Register</h1>
      <div class="box">
        <!-- Форма регистрации -->
        <div class="field">
          <label class="label">Full Name</label>
          <div class="control">
            <input class="input" type="text" v-model="form.FullName" placeholder="Your full name">
          </div>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" v-model="form.Email" placeholder="Enter your email">
          </div>
        </div>

        <div class="field">
          <label class="label">Phone</label>
          <div class="control">
            <input class="input" type="text" v-model="form.Phone" placeholder="Your phone number">
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" v-model="form.Password" placeholder="Enter your password">
          </div>
        </div>

        <!-- Адрес пользователя -->
        <h3 class="title is-5 mt-4">Address</h3>

        <div class="field">
          <label class="label">Country</label>
          <div class="control">
            <input class="input" type="text" v-model="form.Address.Country" placeholder="Country">
          </div>
        </div>

        <div class="field">
          <label class="label">Region</label>
          <div class="control">
            <input class="input" type="text" v-model="form.Address.Region" placeholder="Region">
          </div>
        </div>

        <div class="field">
          <label class="label">City</label>
          <div class="control">
            <input class="input" type="text" v-model="form.Address.City" placeholder="City">
          </div>
        </div>

        <div class="field">
          <label class="label">Street</label>
          <div class="control">
            <input class="input" type="text" v-model="form.Address.Street" placeholder="Street">
          </div>
        </div>

        <div class="field">
          <label class="label">Postal Code</label>
          <div class="control">
            <input class="input" type="text" v-model="form.Address.PostalCode" placeholder="Postal Code">
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-primary" @click="register">Register</button>
          </div>
        </div>

        <!-- Сообщение об ошибке -->
        <div v-if="errorMessage" class="notification is-danger mt-3">
          {{ errorMessage }}
        </div>

        <!-- Сообщение об успешной регистрации -->
        <div v-if="successMessage" class="notification is-success mt-3">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: "UserRegister",
  data() {
    return {
      form: {
        FullName: '',
        Email: '',
        Phone: '',
        Password: '',
        Address: {
          Country: '',
          Region: '',
          City: '',
          Street: '',
          PostalCode: ''
        }
      },
      errorMessage: '', // Хранение сообщения об ошибке
      successMessage: '' // Хранение сообщения об успешной регистрации
    };
  },
  methods: {
    async register() {
      // Сбросить сообщения перед проверкой
      this.errorMessage = '';
      this.successMessage = '';

      // Проверка на пустые поля
      if (!this.form.FullName || !this.form.Email || !this.form.Phone || !this.form.Password || !this.form.Address.Country || !this.form.Address.City || !this.form.Address.Street) {
        this.errorMessage = 'Please fill in all fields.';
        return;
      }

      try {
        await axios.post('http://localhost:3000/registerUser', this.form);
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.$router.push('/login'); // После успешной регистрации перебрасываем на страницу логина
        }, 2000); // Ждем 2 секунды, чтобы пользователь увидел уведомление
      } catch (err) {
        console.error(err.response ? err.response.data : err);
        this.errorMessage = err.response?.data?.message || 'Registration failed. Please check your input.';
      }
    }
  }
}
</script>

<style scoped>
.box {
  max-width: 400px;
  margin: 0 auto;
}

.notification {
  padding: 10px;
  font-size: 14px;
}
</style>
