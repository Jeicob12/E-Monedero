<script setup>
import NavBar from '../components/NavBar.vue';
import PricesTable from '../components/PricesTable.vue'
import { store } from '../store/index.js';

const globalStore = store();

</script>


<template>
    <NavBar></NavBar>
    <h1 class="my-5 bold text-center">¡Bienvenido/a {{ globalStore.getProfile.username.toUpperCase()}} !</h1>
    <PricesTable ></PricesTable>
    <!-- <div class="my-5">
      <CargandoPantalla></CargandoPantalla>
    </div> -->
</template>
