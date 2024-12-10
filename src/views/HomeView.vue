<script setup>
import NavBar from '../components/NavBar.vue';
import LoadingPage from '../components/LoadingPage.vue';
import PricesTable from '../components/PricesTable.vue'
const storedUsername = localStorage.getItem('username');

</script>


<template>
    <NavBar></NavBar>
    <h1 class="my-5 bold text-center">¡Bienvenido/a {{ storedUsername.toUpperCase()}} !</h1>
    <PricesTable ></PricesTable>

</template>
