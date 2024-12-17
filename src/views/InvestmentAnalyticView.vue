<script setup>
import NavBar from '../components/NavBar.vue';
import { store } from '../store/index.js';
import { onMounted, ref, computed } from "vue";
import LabService from '../service/labService.js'
import CryptoService from '../service/cryptoService.js'
import LoadingPage from '../components/LoadingPage.vue';


const globalStore = store();

const btc = ref(0);
const ethereum = ref(0);
const usdc = ref(0);
const isLoading = ref(false);
const storedUsername = localStorage.getItem('username');

const getTransactions = async () => {
    isLoading.value = true;
    try {
        const response = await LabService.getTransactions(storedUsername);
        globalStore.setTransactions(response.data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        isLoading.value = false;
    }
};


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

        const parseCryptoAmount = Number(tx.crypto_amount);
        const parseMoney = Number(tx.money);
        console.log('tx', tx)

        console.log(parseCryptoAmount)
        console.log(parseMoney)

        if (tx.action === 'purchase') {
            totalInvested += parseMoney;
            totalAssets[tx.crypto_code] += parseCryptoAmount;
        } else if (tx.action === 'sale') {
            totalSold += parseMoney; 
            totalAssets[tx.crypto_code] -= parseCryptoAmount;
        }
    });

    console.log('totalInvested', totalInvested)
    console.log('totalSold', totalSold)
    console.log('totalAssets', totalAssets)

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

    <LoadingPage class="text-center" v-if="isLoading"></LoadingPage>

    <div v-else>
        <div class="my-5">
            <h2 class="text-center mb-4">
                <i class="fas fa-coins me-2 text-warning"></i> 
                Tus Criptomonedas
            </h2>
            <div class="row g-4">
                <div 
                    v-for="(amount, crypto) in globalStore.$state.cryptoCant" 
                    :key="crypto"
                    class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div class="card shadow border-0">
                        <div class="card-header text-white text-center" :class="getCryptoCardClass(crypto)">
                            <h5 class="m-0">
                                <i class="fas fa-chart-pie me-2"></i>{{ crypto.toUpperCase() }}
                            </h5>
                        </div>
                        <div class="card-body text-center">
                            <p class="card-text fs-4 fw-bold text-primary">
                                {{ amount }}
                            </p>
                            <p class="text-muted small">Cantidad disponible</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-5 p-4 bg-light rounded shadow">
            <h2 class="text-center">
                <i class="fas fa-chart-line me-2 text-success"></i>
                Análisis de Inversión
            </h2>
            <div class="row mt-4">
                <div class="col-12 col-md-4 text-center">
                    <p class="fs-5 fw-bold text-info">Total invertido</p>
                    <p class="fs-4 text-primary">{{ formatToPesos(investmentAnalysis.totalInvested) }}</p>
                </div>
                <div class="col-12 col-md-4 text-center">
                    <p class="fs-5 fw-bold text-warning">Total vendido</p>
                    <p class="fs-4 text-danger">{{ formatToPesos(investmentAnalysis.totalSold) }}</p>
                </div>
                <div class="col-12 col-md-4 text-center">
                    <p class="fs-5 fw-bold text-success">Valor actual</p>
                    <p class="fs-4 text-success">{{ formatToPesos(investmentAnalysis.currentValue) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        getCryptoCardClass(crypto) {
            const cryptoColors = {
                BTC: 'bg-warning',
                ETH: 'bg-primary',
                ADA: 'bg-success',
                XRP: 'bg-danger',
                default: 'bg-secondary',
            };
            return cryptoColors[crypto.toUpperCase()] || cryptoColors.default;
        },
        formatToPesos(value) {
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
            }).format(value);
        },
    },
};
</script>

<style scoped>
.card {
    border-radius: 12px;
    transition: transform 0.2s ease-in-out;
}
.card:hover {
    transform: scale(1.05);
}
.card-header {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}
.bg-light {
    background-color: #f8f9fa !important;
}
</style>  