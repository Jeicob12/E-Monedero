<script setup>
import LoadingPage from '../components/LoadingPage.vue';
import CryptoService from '../service/cryptoService.js'
import { onMounted, ref } from "vue";


const btc = ref(0);
const ethereum = ref(0);
const usdc = ref(0);
const isLoading = ref(true);

const formatToPesos = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS', 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};


onMounted(() => {
    isLoading.value = true;
    CryptoService.getBitcoin()
        .then(response => { btc.value = response.data; })
    CryptoService.getEtherum()
        .then(response => { ethereum.value = response.data })
    CryptoService.getUSDC()
        .then(response => { usdc.value = response.data })
    isLoading.value = false;
});
</script>


<template>
    <div class="d-flex flex-column align-items-center my-5">
        <LoadingPage v-if="isLoading"></LoadingPage>

        <div v-else class="content-container">
            <div class="row text-center">
                <!-- Bitcoin -->
                <div class="col-12 col-lg-4 mb-4">
                    <div class="shadow-sm p-4 bg-white rounded">
                        <img src="../assets/btc.png" class="rounded-circle img-fluid mx-auto d-block"
                            alt="Logo de Bitcoin" style="max-width: 150px;">
                        <div class="mt-3">
                            <h2 class="my-2">Bitcoin</h2>
                            <div class="row">
                                <div class="col-6 my-3 shadow-sm p-3 bg-body rounded">
                                    <h3>Comprar</h3>
                                    <h4 class="text-success">{{ formatToPesos(btc.totalAsk) }}</h4>
                                </div>
                                <div class="col-6 my-3 shadow-sm p-3 bg-body rounded">
                                    <h3>Vender</h3>
                                    <h4 class="text-danger">{{ formatToPesos(btc.totalBid) }}</h4>
                                </div>
                            </div>
                            <h5>Cotización: <a href="https://argenbtc.com/" target="_blank">ARGENBTC</a></h5>
                        </div>
                    </div>
                </div>

                <!-- Ethereum -->
                <div class="col-12 col-lg-4 mb-4">
                    <div class="shadow-sm p-4 bg-white rounded">
                        <img src="../assets/logo-ethereum.png" class="rounded-circle img-fluid mx-auto d-block"
                            alt="Logo de Ethereum" style="max-width: 150px;">
                        <div class="mt-3">
                            <h2 class="my-2">Ethereum</h2>
                            <div class="row">
                                <div class="col-6 my-3 shadow-sm p-3 bg-body rounded">
                                    <h3>Comprar</h3>
                                    <h4 class="text-success">{{ formatToPesos(ethereum.totalAsk) }}</h4>
                                </div>
                                <div class="col-6 my-3 shadow-sm p-3 bg-body rounded">
                                    <h3>Vender</h3>
                                    <h4 class="text-danger">{{ formatToPesos(ethereum.totalBid) }}</h4>
                                </div>
                            </div>
                            <h5>Cotización: <a href="https://www.satoshitango.com/" target="_blank">Satoshi Tango</a>
                            </h5>
                        </div>
                    </div>
                </div>

                <!-- USDC -->
                <div class="col-12 col-lg-4 mb-4">
                    <div class="shadow-sm p-4 bg-white rounded">
                        <img src="../assets/usdc-logo.png" class="rounded-circle img-fluid mx-auto d-block"
                            alt="Logo de USDC" style="max-width: 150px;">
                        <div class="mt-3">
                            <h2 class="my-2">USDC</h2>
                            <div class="row">
                                <div class="col-6 my-3 shadow-sm p-3 bg-body rounded">
                                    <h3>Comprar</h3>
                                    <h4 class="text-success">{{ formatToPesos(usdc.totalAsk) }}</h4>
                                </div>
                                <div class="col-6 my-3 shadow-sm p-3 bg-body rounded">
                                    <h3>Vender</h3>
                                    <h4 class="text-danger">{{ formatToPesos(usdc.totalBid) }}</h4>
                                </div>
                            </div>
                            <h5>Cotización: <a href="https://www.lemon.me/" target="_blank">Lemon Cash</a></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content-container {
    max-width: 1200px;
    width: 100%;
}
</style>