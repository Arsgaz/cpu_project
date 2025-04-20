<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Edit User</h1>
  
        <div class="box">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="User name" v-model="user.name" />
            </div>
          </div>
  
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" placeholder="User email" v-model="user.Email" />
            </div>
          </div>
  
          <div class="field">
            <label class="label">Phone</label>
            <div class="control">
              <input class="input" type="text" placeholder="User phone" v-model="user.phone" />
            </div>
          </div>
  
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input class="input" type="password" placeholder="New password" v-model="user.password" />
            </div>
          </div>
  
          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-info" @click="updateUser">Update</button>
            </p>
            <p class="control">
              <router-link class="button is-light" to="/users">Cancel</router-link>
            </p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "EditUser",
    data() {
      return {
        user: {
          name: "",
          Email: "",
          phone: "",
          password: ""
        }
      };
    },
    created() {
      this.fetchUser();
    },
    methods: {
      async fetchUser() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/users/${this.$route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.user.name = response.data.name;
          this.user.Email = response.data.Email;
          this.user.phone = response.data.Phone;
        } catch (err) {
          console.log(err.response ? err.response.data : err);
          alert("Failed to load user data.");
        }
      },
      async updateUser() {
        try {
          const token = localStorage.getItem('token');
          const payload = {
            name: this.user.name,
            Email: this.user.Email,
            phone: this.user.phone
          };
  
          if (this.user.password.trim() !== "") {
            payload.password = this.user.password;
          }
  
          await axios.put(`http://localhost:3000/users/${this.$route.params.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.$router.push("/users");
        } catch (err) {
          console.log(err.response ? err.response.data : err);
          alert(err.response?.data?.message || "Failed to update user.");
        }
      }
    }
  };
  </script>
  
  <style>
  /* базовые стили можно подогнать под UserMenu */
  </style>
  