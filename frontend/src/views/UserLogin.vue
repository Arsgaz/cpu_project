<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Login</h1>
      <div class="box">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" v-model="form.Email" placeholder="Enter your email">
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" v-model="form.Password" placeholder="Enter your password">
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-primary" @click="login">Login</button>
          </div>
        </div>

        <!-- Кнопка Back to catalog -->
        <div class="field">
          <div class="control">
            <button class="button is-link" @click="goToCatalog">Back to catalog</button>
          </div>
        </div>

        <!-- Сообщение об ошибке -->
        <div v-if="errorMessage" class="notification is-danger mt-3">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: "UserLogin",
  data() {
    return {
      form: {
        Email: '',
        Password: ''
      },
      errorMessage: '' // Хранение сообщения об ошибке
    };
  },
  methods: {
    async login() {
  this.errorMessage = ''; // Сброс ошибки перед новым запросом
  try {
    const response = await axios.post('http://localhost:3000/login', {
      Email: this.form.Email,
      Password: this.form.Password
    });

    const { token, userID, role } = response.data;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userID);
      localStorage.setItem('role', role);

      this.$router.push('/');  // Перенаправляем на главную или в профиль
    } else {
      this.errorMessage = 'Login failed: Token not received.';
    }

  } catch (err) {
    console.error(err.response ? err.response.data : err);
    this.errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
  }
},

    goToCatalog() {
      this.$router.push('/');  // Перенаправление на каталог (или на нужный путь)
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
