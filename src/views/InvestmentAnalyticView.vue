<script setup>
import NavBar from '../components/NavBar.vue';
import { store } from '../store/index.js';
import { onMounted, ref, computed } from "vue";
import LabService from '../service/labService.js'
import CryptoService from '../service/cryptoService.js'

const globalStore = store();

const btc = ref(0);
const ethereum = ref(0);
const usdc = ref(0);
const isLoading = ref(false);
const storedUsername = localStorage.getItem('username');

const getTransactions = async () => {
    isLoading.value = true;
    try {
        const response = await LabService.getTransactions(storedUsername); // Usar username del store
        globalStore.setTransactions(response.data); // Guardar las transacciones en el store
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        isLoading.value = false;
    }
};

console.log('tr',globalStore.$state.transaction.money)

const investmentAnalysis = computed(() => {
    const transactions = globalStore.$state.transaction;
    let totalInvested = 0;
    let totalSold = 0;
    let totalAssets = {
        btc: 0,
        eth: 0,
        usdc: 0,
    };

    transactions.forEach(tx => {
        if (tx.action === 'purchase') {
            totalInvested += tx.crypto_amount * btc.value.totalAsk; // Usar precio de compra
            totalAssets[tx.currency] += tx.crypto_amount;
        } else if (tx.action === 'sale') {
            totalSold += tx.crypto_amount * btc.value.totalBid; // Usar precio de venta
            totalAssets[tx.currency] -= tx.crypto_amount;
        }
    });

    const currentValue =
        totalAssets.btc * btc.value.totalBid +
        totalAssets.eth * ethereum.value.totalBid +
        totalAssets.usdc * usdc.value.totalBid;

    const netProfit = totalSold + currentValue - totalInvested;

    return {
        totalInvested,
        totalSold,
        netProfit,
        currentValue,
        totalAssets,
    };
});
const formatToPesos = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};


onMounted(async () => {
    isLoading.value = true;

    try {
        await Promise.all([
            CryptoService.getBitcoin().then(response => {
                btc.value = {
                    totalBid: response.data.totalBid,
                    totalAsk: response.data.totalAsk
                };
            }),
            CryptoService.getEtherum().then(response => {
                ethereum.value = {
                    totalBid: response.data.totalBid,
                    totalAsk: response.data.totalAsk
                };
            }),
            CryptoService.getUSDC().then(response => {
                usdc.value = {
                    totalBid: response.data.totalBid,
                    totalAsk: response.data.totalAsk
                };
            })
        ]);

        await getTransactions();
    } catch (error) {
        console.error("Error during initialization:", error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <NavBar></NavBar>

    <div v-if="isLoading">Loading...</div>
    <div v-else>
        <div class="my-5">
            <h2 class="text-center mb-4">Tus Criptomonedas</h2>
            <div class="row">
                <div v-for="(amount, crypto) in globalStore.$state.cryptoCant" :key="crypto"
                    class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-header bg-info text-white text-center">
                            <h5 class="m-0">{{ crypto.toUpperCase() }}</h5>
                        </div>
                        <div class="card-body text-center">
                            <p class="card-text fs-4">
                                <strong>{{ amount }}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h2>Análisis de Inversión</h2>
        <p>Total invertido: {{ formatToPesos(investmentAnalysis.totalInvested.toFixed(2)) }}</p>
        <p>Total vendido: {{ formatToPesos(investmentAnalysis.totalSold.toFixed(2)) }}</p>
        <p>
            Ganancia/Pérdida:
            <span
                :class="{ 'text-success': investmentAnalysis.netProfit > 0, 'text-danger': investmentAnalysis.netProfit < 0 }">
                {{ formatToPesos(investmentAnalysis.netProfit.toFixed(2)) }}
            </span>
        </p>
        <p>Valor actual de la inversión: {{ formatToPesos(investmentAnalysis.currentValue.toFixed(2)) }}</p>
    </div>
</template>

<style scoped>
.investment-analysis {
    font-family: Arial, sans-serif;
}

.card {
    border: 1px solid #ddd;
}

.card-title {
    font-size: 1.2rem;
    color: #6c757d;
}

.card-text {
    font-weight: bold;
    color: #007bff;
}

.table {
    border: 1px solid #ddd;
}

.table th,
.table td {
    text-align: center;
    vertical-align: middle;
}
</style>