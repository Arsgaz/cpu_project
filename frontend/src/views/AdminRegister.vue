<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Admin Register</h1>
      <div class="box">
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
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" v-model="form.Password" placeholder="Enter your password">
          </div>
        </div>

        <div class="field">
          <label class="label">Role</label>
          <div class="control">
            <!-- Выпадающий список для выбора роли -->
            <div class="select">
              <select v-model="form.Role">
                <option value="Admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-primary" @click="registerAdmin">Register</button>
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

        <!-- Сообщение об успешной регистрации -->
        <div v-if="successMessage" class="notification is-success mt-3">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminRegister",
  data() {
    return {
      form: {
        FullName: "",
        Email: "",
        Password: "",
        Role: "Admin", // Устанавливаем значение по умолчанию как "Admin"
      },
      errorMessage: "", // Хранение сообщения об ошибке
      successMessage: "" // Хранение сообщения об успешной регистрации
    };
  },
  methods: {
    async registerAdmin() {
      // Сбросить сообщения перед проверкой
      this.errorMessage = '';
      this.successMessage = '';

      // Проверка на пустые поля
      if (!this.form.FullName || !this.form.Email || !this.form.Password) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/registerAdmin",
          this.form
        );
        
        // Вместо деструктуризации используем response напрямую
        this.successMessage = response.data.message || "Registration successful! Redirecting to login...";

        setTimeout(() => {
          this.$router.push("/login"); // После успешной регистрации перебрасываем на страницу логина
        }, 2000); // Ждем 2 секунды, чтобы пользователь увидел уведомление

      } catch (err) {
        console.log(err.response ? err.response.data : err);
        this.errorMessage = err.response?.data?.message || "Error registering admin. Please check your input.";
      }
    },

    goToCatalog() {
      this.$router.push('/');  // Перенаправляем на каталог (или на нужную страницу)
    }
  },
};
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
