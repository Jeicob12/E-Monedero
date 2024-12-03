<script setup>
import { cryptoClient } from '../service/client.js';
import CryptoService from '../service/cryptoService.js'
import { onMounted, ref } from "vue";


const btc = ref(0);
const ethereum = ref(0);
const usdc = ref(0);

const formatToPesos = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS', // Código correcto para pesos argentinos
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};


onMounted(() => {
    CryptoService.getBitcoin()
    .then(response => { 
        btc.value = response.data;
        console.log('Valor de Bitcoin (totalBid):', response.data); // Mostrar el valor por consola
    })
    CryptoService.getEtherum()
        .then(response => { ethereum.value = response.data })
    CryptoService.getUSDC()
        .then(response => { usdc.value = response.data })
});
</script>


<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-lg-4">
                <img src="../assets/btc.png" class="rounded" alt="Logo de bitcoin">
                <div class="row  mt-3">
                    <div class="col-12 col-xl-12">
                        <h2 class="my-2">Bitcoin</h2>
                    </div>
                    <div class="col-12 col-xl-6 my-3 shadow-sm p-1 mb-5 bg-body rounded">
                        <h3>Comprar</h3>
                        <h4>{{ formatToPesos(btc.totalAsk) }}</h4>
                    </div>
                    <div class="col-12 col-xl-6 my-3 shadow-sm p-1 mb-5 bg-body rounded">
                        <h3>Vender</h3>
                        <h4>{{ formatToPesos(btc.totalBid) }}</h4>
                    </div>
                    <h5>Cotización: <a href="https://argenbtc.com/">ARGENBTC</a></h5>
                </div>
            </div>
            <div class="col-12 col-lg-4">
                <img src="../assets/logo-ethereum.png" class="rounded" alt="Logo de Ethereum">
                <div class="row  mt-3">
                    <div class="col-12 col-xl-12">
                        <h2 class="my-2">Ethereum</h2>
                    </div>
                    <div class="col-12 col-xl-6 my-3 shadow-sm p-1 mb-5 bg-body rounded">
                        <h3>Comprar</h3>
                        <h4>{{ formatToPesos(ethereum.totalAsk) }}</h4>
                    </div>
                    <div class="col-12 col-xl-6 my-3 shadow-sm p-1 mb-5 bg-body rounded">
                        <h3>Vender</h3>
                        <h4>{{ formatToPesos(ethereum.totalBid) }}</h4>
                    </div>
                    <h5>Cotización: <a href="https://www.satoshitango.com/">Satoshi Tango</a></h5>
                </div>
            </div>
            <div class="col-12 col-lg-4">
                <img src="../assets/usdc-logo.png" class="rounded" alt="Logo de Usdc">
                <div class="row  mt-3">
                    <div class="col-12 col-xl-12">
                        <h2 class="my-2">USDC</h2>
                    </div>
                    <div class="col-12 col-xl-6 my-3 shadow-sm p-1 mb-5 bg-body rounded">
                        <h3>Comprar</h3>
                        <h4>{{ formatToPesos(usdc.totalAsk) }}</h4>
                    </div>
                    <div class="col-12 col-xl-6 my-3 shadow-sm p-1 mb-5 bg-body rounded">
                        <h3>Vender</h3>
                        <h4>{{ formatToPesos(usdc.totalBid) }}</h4>
                    </div>
                    <h5>Cotización: <a href="https://www.lemon.me/">Lemon Cash</a></h5>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
img {
    height: 20vw;
}

h5 {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: solid lightgrey;
}
</style>