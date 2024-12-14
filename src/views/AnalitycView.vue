<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { Chart, registerables } from "chart.js";
import { Doughnut } from "vue-chartjs";
import NavBar from '../components/NavBar.vue';
import { store } from '../store/index.js';
import LabService from '../service/labService.js';

Chart.register(...registerables);

const globalStore = store();
const storedUsername = localStorage.getItem('username');
const cryptoColors = {
    btc: '#F7931A', 
    eth: '#627EEA', 
    usdc: '#FF0000' 
};

const getTransactions = async () => {
    try {
        const response = await LabService.getTransactions(storedUsername);
        globalStore.setTransactions(response.data);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
};

const formatToPesos = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const formatCryptoName = (type) => {
    const cryptoNames = {
        btc: 'Bitcoin',
        eth: 'Ethereum',
        usdc: 'USD Coin'
    };
    return cryptoNames[type.toLowerCase()] || type;
};

const groupedTransactions = computed(() => {
    const grouped = {};

    globalStore.$state.transaction.forEach((transaction) => {
        const { crypto_code, crypto_amount, money, action } = transaction;

        const validCryptoAmount = parseFloat(crypto_amount) || 0;
        const validMoney = parseFloat(money) || 0;

        if (!grouped[crypto_code]) {
            grouped[crypto_code] = {
                totalAmount: 0,
                totalPrice: 0
            };
        }

        if (action === "purchase") {
            grouped[crypto_code].totalAmount += validCryptoAmount;
            grouped[crypto_code].totalPrice += validMoney;
        } else if (action === "sale") {
            grouped[crypto_code].totalAmount -= validCryptoAmount;
            grouped[crypto_code].totalPrice -= validMoney;
        }
    });
    

    return grouped;
});
const chartData = ref({
    labels: [],
    datasets: [
        {
            label: 'Precio Total por Cripto',
            data: [],
            backgroundColor: []
        }
    ]
});

const updateChartData = () => {
    const labels = [];
    const data = [];
    const backgroundColors = [];

    Object.entries(groupedTransactions.value).forEach(([crypto, group]) => {
        labels.push(formatCryptoName(crypto));
        data.push(group.totalPrice);

        const color = cryptoColors[crypto.toLowerCase()] || `hsl(${Math.random() * 360}, 70%, 70%)`;
        backgroundColors.push(color);
    });

    chartData.value = {
        labels,
        datasets: [
            {
                label: 'Precio Total por Cripto',
                data,
                backgroundColor: backgroundColors
            }
        ]
    };
};

const totalPrice = computed(() => {
    return Object.values(groupedTransactions.value).reduce((total, group) => {
        return total + group.totalPrice;
    }, 0);
});

watch(groupedTransactions, updateChartData, { immediate: true });

onMounted(() => {
    getTransactions();
});
</script>

<template>
    <NavBar></NavBar>

    <div class="table-container">
    <h2 class="table-title">Resumen Agrupado por Compras</h2>
    <table class="summary-table">
        <thead>
            <tr>
                <th>Crypto</th>
                <th>Total Cantidad</th>
                <th>Precio Total</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(group, crypto) in groupedTransactions" :key="crypto">
                <td>{{ formatCryptoName(crypto) }}</td>
                <td>{{ group.totalAmount }}</td>
                <td>{{ formatToPesos(group.totalPrice) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2" class="footer-label">Dinero Total</td>
                <td>{{ formatToPesos(totalPrice) }}</td>
            </tr>
        </tfoot>
    </table>
</div>

    <div class="chart-container">
        <h2 class="chart-title">Gráfico de Precio Total por Cripto</h2>
        <Doughnut :data="chartData"></Doughnut>
    </div>
</template>

<style scoped>
.table-container, .chart-container {
    margin: 20px auto;
    padding: 20px;
    max-width: 800px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}

.table-title, .chart-title {
    text-align: center;
    font-family: 'Arial', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #333;
}

.summary-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Arial', sans-serif;
}

.summary-table th, .summary-table td {
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
}

.summary-table tbody tr:nth-child(even) {
    background-color: #f2f2f2;
}

.summary-table tbody tr:hover {
    background-color: #ddd;
}

.chart-container {
    text-align: center;
}
</style>
