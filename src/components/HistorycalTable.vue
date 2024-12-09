<script setup>
import LabService from '../service/labService.js'
import LoadingPage from '../components/LoadingPage.vue';

import { store } from '../store/index.js';
import { onMounted, ref } from "vue";


const isLoading = ref(true);


const globalStore = store();

const getTransactions = async () => {
    isLoading.value = true;

    try {
        const response = await LabService.getTransactions(globalStore.getProfile.username);
        globalStore.setTransactions(response.data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    getTransactions();
});


</script>


<template>
    <LoadingPage v-if="isLoading"></LoadingPage>
    

    <div v-else class="content-container">
        <!-- Mensaje de error si no hay transacciones -->
        <div v-if="!globalStore.$state.transaction || globalStore.$state.transaction.length === 0" class="error-container">
            <h1 class="error-title">Oops, parece que no hay nada aquí.</h1>
            <h2 class="error-subtitle">No se encontraron registros en el historial.</h2>
        </div>

        <!-- Tabla de transacciones si existen -->
        <div v-else class="table-container">
            <h1 class="table-title">Historial de Transacciones</h1>
            <table class="transaction-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Crypto</th>
                        <th>Cantidad</th>
                        <th>Movimiento</th>
                        <th>Precio</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transaction in globalStore.$state.transaction" :key="transaction.id">
                        <td>{{ transaction.user_id }}</td>
                        <td>{{ transaction.crypto_code }}</td>
                        <td>{{ transaction.crypto_amount }}</td>
                        <td>{{ transaction.action }}</td>
                        <td>{{ transaction.money }}</td>
                        <td>{{ transaction.datetime }}</td>
                        <td>
                            <button class="action-button">Ver</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
/* Contenedor principal */
.content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f9f9f9;
    padding: 20px;
}

/* Mensaje de error */
.error-container {
    text-align: center;
    color: #444;
}

.error-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.error-subtitle {
    font-size: 1.2rem;
    color: #777;
}

/* Contenedor de tabla */
.table-container {
    width: 100%;
    max-width: 1200px;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}

/* Tabla */
.transaction-table {
    width: 100%;
    border-collapse: collapse;
}

.transaction-table th,
.transaction-table td {
    text-align: center;
    padding: 12px 10px;
    border: 1px solid #ddd;
}

.transaction-table th {
    background-color: #f3f3f3;
    font-weight: bold;
}

.transaction-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

.transaction-table tbody tr:hover {
    background-color: #f1f1f1;
}

/* Botón de acción */
.action-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.action-button:hover {
    background-color: #45a049;
}
</style>