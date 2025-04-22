<template>
  <div id="app" class="container is-max-desktop">
    <router-view />
  </div>
</template>
 
<script>
import { reactive, provide } from 'vue';
export default {
  name: "App",
  setup() {
    // Создаём реактивный объект для корзины
    const cart = reactive({ items: [] });

    // Загружаем корзину из localStorage
    const loadCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        cart.items = JSON.parse(storedCart);
      }
    };
    // Добавление товара в корзину
    const addToCart = (product) => {
      const existing = cart.items.find(item => item.ProductID === product.ProductID);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart.items));
    };
    // Обеспечиваем доступ к этим данным для дочерних компонентов
    provide('cart', cart);
    provide('addToCart', addToCart);
    provide('loadCart', loadCart);

    // Загружаем корзину при загрузке компонента
    loadCart();

    return {
      cart,
      addToCart,
      loadCart,
    };
  },
};
</script>
 
<style>
/* import style bulma */
@import "~bulma/css/bulma.css";
</style>