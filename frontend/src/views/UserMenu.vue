<template>
    <section class="section">
      <div class="container">
        <h1 class="title">User Management</h1>
        
        <!-- Ссылки на страницы пользователей -->
        <div class="tabs">
          <ul>
            <li :class="{ 'is-active': activeTab === 'users' }">
              <a @click="switchTab('users')">Users</a>
            </li>
            <li :class="{ 'is-active': activeTab === 'admins' }">
              <a @click="switchTab('admins')">Admins</a>
            </li>
          </ul>
        </div>
  
        <!-- Таблица с пользователями -->
        <div v-if="activeTab === 'users'">
          <h2 class="subtitle">Users</h2>
          <table class="table is-bordered is-striped is-hoverable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.Email }}</td>
                <td>
                  <button class="button is-info" @click="editUser(user)">Edit</button>
                  <button class="button is-danger" @click="deleteUser(user.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Таблица с администраторами -->
        <div v-if="activeTab === 'admins'">
          <h2 class="subtitle">Admins</h2>
          <table class="table is-bordered is-striped is-hoverable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="admin in admins" :key="admin.id">
                <td>{{ admin.name }}</td>
                <td>{{ admin.Email }}</td>
                <td>
                  <button class="button is-info" @click="editAdmin(admin)">Edit</button>
                  <button class="button is-danger" @click="deleteUser(admin.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserMenu',
    data() {
      return {
        activeTab: 'users', // текущая вкладка (users или admins)
        users: [], // список обычных пользователей
        admins: [], // список администраторов
      };
    },
    created() {
      this.getUsers(); // Загружаем пользователей при создании компонента
      this.getAdmins(); // Загружаем администраторов
    },
    methods: {
      // Получение списка пользователей
      async getUsers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Users data:', response.data); // Добавляем вывод для отладки
    this.users = response.data;
  } catch (err) {
    console.log(err.response ? err.response.data : err);
    alert(err.response?.data?.message || 'Failed to load users');
  }
},

async getAdmins() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/admins', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Admins data:', response.data); // Добавляем вывод для отладки
    this.admins = response.data;
  } catch (err) {
    console.log(err.response ? err.response.data : err);
    alert(err.response?.data?.message || 'Failed to load admins');
  }
},

  
      // Переключение между вкладками
      switchTab(tab) {
        this.activeTab = tab;
      },
  
      // Редактирование пользователя
      editUser(user) {
        this.$router.push({ name: 'EditUser', params: { id: user.id } }); // Перенаправляем на страницу редактирования
      },
      editAdmin(admin) {
        this.$router.push({ name: 'EditAdmin', params: { id: admin.id } });
      },
  
      // Удаление пользователя или администратора
      async deleteUser(id) {
        const type = this.activeTab === 'users' ? 'user' : 'admin';
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
          try {
            const token = localStorage.getItem('token');
            const url = this.activeTab === 'users'
              ? `http://localhost:3000/users/${id}`
              : `http://localhost:3000/admins/${id}`;

            await axios.delete(url, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (this.activeTab === 'users') {
              this.getUsers();
            } else {
              this.getAdmins();
            }
          } catch (err) {
            console.log(err.response ? err.response.data : err);
            alert(err.response?.data?.message || `Failed to delete ${type}`);
          }
        }
      }
    },
  };
  </script>
  
  <style>
  /* Стили для таблицы и кнопок */
  .table th, .table td {
    text-align: center;
  }
  
  .button {
    margin-right: 10px;
  }
  </style>
  