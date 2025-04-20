import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
 
import App from './App.vue'
import './assets/styles.css'
import Create from './components/AddProduct.vue'
import Edit from './components/EditProduct.vue'
import Index from './components/ProductList.vue'
import ProductDetail from './views/ProductDetail.vue'
import UserRegister from './views/UserRegister.vue'
import UserLogin from './views/UserLogin.vue'
import AdminRegister from './views/AdminRegister.vue'
import UserMenu from './views/UserMenu.vue'
import EditUser from './views/EditUser.vue'
import EditAdmin from './views/EditAdmin.vue'
 
 
const routes = [
  {
    name: 'Create',
    path: '/create',
    component: Create
  },
  {
    name: 'Edit',
    path: '/edit/:id',
    component: Edit
  },
  {
    name: 'Index',
    path: '/',
    component: Index
  },
  {
    name: 'ProductDetail',
    path: '/products/:id',
    component: ProductDetail
  },
  {
    name: "UserRegister",
    path: "/register",
    component: UserRegister
  },
  {
    name: "UserLogin",
    path: "/login",
    component: UserLogin
  },
  {
    name: "AdminRegister",
    path: "/admin-register",
    component: AdminRegister
  },
  {
    path: '/user-management',
      name: 'UserMenu',
      component: UserMenu,
      meta: {
        requiresAuth: true, 
        requiresAdmin: true,
      },
  }, 
  {
    path: '/users/edit/:id',
    name: 'EditUser',
    component: EditUser
  },
  {
    path: "/admins/edit/:id",
    name: "EditAdmin",
    component: EditAdmin
  }
  
];
 
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
 
createApp(App).use(router)
  .mount('#app')