<template>
    <section class="section">
      <div class="container">
        <h1 class="title">Edit Admin</h1>
  
        <div class="box">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Admin name"
                v-model="admin.name"
              />
            </div>
          </div>
  
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input
                class="input"
                type="email"
                placeholder="Admin email"
                v-model="admin.Email"
              />
            </div>
          </div>
  
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input
                class="input"
                type="password"
                placeholder="New password"
                v-model="admin.password"
              />
            </div>
          </div>
  
          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-info" @click="updateAdmin">Update</button>
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
    name: "EditAdmin",
    data() {
      return {
        admin: {
          name: "",
          Email: "",
          password: ""
        }
      };
    },
    created() {
      this.fetchAdmin();
    },
    methods: {
      async fetchAdmin() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/admins/${this.$route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.admin.name = response.data.name;
          this.admin.Email = response.data.Email;
        } catch (err) {
          console.log(err.response ? err.response.data : err);
          alert("Failed to load admin data.");
        }
      },
      async updateAdmin() {
        try {
          const token = localStorage.getItem('token');
          const payload = {
            name: this.admin.name,
            Email: this.admin.Email,
          };
  
          if (this.admin.password.trim() !== "") {
            payload.password = this.admin.password;
          }
  
          await axios.put(`http://localhost:3000/admins/${this.$route.params.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.$router.push("/users");
        } catch (err) {
          console.log(err.response ? err.response.data : err);
          alert(err.response?.data?.message || "Failed to update admin.");
        }
      }
    }
  };
  </script>
  
  <style>
  /* Можешь добавить сюда свои стили, как для UserMenu */
  </style>
  