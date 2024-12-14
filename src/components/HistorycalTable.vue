<script setup>
import LabService from '../service/labService.js'
import LoadingPage from '../components/LoadingPage.vue';
import CryptoService from '../service/cryptoService.js'
import Swal from 'sweetalert2';

import { store } from '../store/index.js';
import { onMounted, ref } from "vue";


const isLoading = ref(true);
const globalStore = store();
const storedUsername = localStorage.getItem('username');
const type = ref('');
const amount = ref(0);
const price = ref('');
const action = ref('')
const currentTransactionId = ref(null);

const getTransactions = async () => {
    isLoading.value = true;

    try {
        const response = await LabService.getTransactions(storedUsername);
        globalStore.setTransactions(response.data);
        console.log(response.data)
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        isLoading.value = false;
    }
};

console.log('globalStore', globalStore.$state)
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
}

const formatTransaction = (type) => {
    const transactionName = {
        purchase: 'Compra',
        sale: 'Venta',
    };

    return transactionName[type.toLowerCase()] || type;
}

const openModal = () => {
    document.getElementById('editTransactionModal').style.display = 'flex';
};

const closeModal = () => {
    document.getElementById('editTransactionModal').style.display = 'none';
};

const calculatePrice = async (cryptoCode, cryptoAmount) => {
    try {
        let rate = 0;

        switch (cryptoCode) {
            case "btc":
                const btcResponse = await CryptoService.getBitcoin();
                rate = btcResponse.data.totalBid;
                break;
            case "eth":
                const ethResponse = await CryptoService.getEtherum();
                rate = ethResponse.data.totalBid;
                break;
            case "usdc":
                const usdcResponse = await CryptoService.getUSDC();
                rate = usdcResponse.data.totalBid;
                break;
            default:
                console.error("Código de criptomoneda no reconocido:", cryptoCode);
                return;
        }

        price.value = cryptoAmount * rate;
    } catch (error) {
        console.error("Error al calcular el precio:", error);
        alert("Hubo un error al calcular el precio de la criptomoneda.");
    }
};

const updateTransaction = async (transactionId) => {
    try {
        currentTransactionId.value = transactionId;
        if (!transactionId) {
            alert("El ID de la transacción no es válido.");
            return;
        }

        // Validar que las transacciones estén definidas y sean un arreglo
        if (!Array.isArray(globalStore.$state.transaction)) {
            console.error("Las transacciones no están definidas o no son un arreglo.");
            return;
        }

        // Buscar la transacción
        const transaction = globalStore.$state.transaction.find(t => t._id === transactionId);

        console.log("transaction", transaction)

        // Validar si la transacción existe
        if (!transaction) {
            alert(`No se encontró ninguna transacción con el ID ${transactionId}.`);
            return;
        }

        // Asignar valores al modelo del modal
        type.value = transaction.crypto_code;
        amount.value = transaction.crypto_amount;
        price.value = transaction.money;
        action.value = transaction.action;
        // Abrir el modal
        openModal();

        // Calcular automáticamente el precio según la moneda
        await calculatePrice(transaction.crypto_code, transaction.crypto_amount);
    } catch (error) {
        console.error("Error al cargar la transacción para edición:", error);
        alert("Hubo un error al cargar los datos de la transacción.");
    }
};


const saveTransaction = async (transactionId) => {
    const updatedData = {
        crypto_code: type.value,
        crypto_amount: parseFloat(amount.value),
        money: parseFloat(price.value),
        action: action.value,
    };

    if (!updatedData.crypto_code || isNaN(updatedData.crypto_amount) || updatedData.crypto_amount <= 0) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    try {
        await LabService.updateTransactions(transactionId, updatedData);

        alert("Transacción actualizada con éxito.");

        closeModal();
        getTransactions(); // Recarga la lista de transacciones
    } catch (error) {
        console.error("Error al actualizar la transacción:", error);
        alert("Hubo un error al intentar actualizar la transacción.");
    }
};

const deleteTransaction = async (transactionId) => {
    try {
        if (!transactionId) {
            Swal.fire('Error', 'El ID de la transacción no es válido.', 'error');
            return;
        }

        const confirmDelete = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar',
        });

        if (!confirmDelete.isConfirmed) return;

        await LabService.deleteTransactions(transactionId);

        await Swal.fire('Eliminado', 'La transacción ha sido eliminada con éxito.', 'success');
        getTransactions();
    } catch (error) {
        console.error("Error al eliminar la transacción:", error);
        Swal.fire('Error', 'Hubo un error al intentar eliminar la transacción.', 'error');
    }
};
onMounted(() => {
    getTransactions();
});


</script>


<template>
    <LoadingPage v-if="isLoading"></LoadingPage>

    <div v-else class="content-container">
        <div v-if="!globalStore.$state.transaction || globalStore.$state.transaction.length === 0"
            class="error-container">
            <h1 class="error-title">Oops, parece que no hay nada aquí.</h1>
            <h2 class="error-subtitle">No se encontraron registros en el historial.</h2>
        </div>

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
                    <tr v-for="transaction in globalStore.$state.transaction" :key="transaction._id">
                        <td>{{ transaction.user_id }}</td>
                        <td>{{ formatCryptoName(transaction.crypto_code) }}</td>
                        <td>{{ transaction.crypto_amount }}</td>
                        <td>{{ formatTransaction(transaction.action) }}</td>
                        <td>{{ formatToPesos(transaction.money) }}</td>
                        <td>{{ transaction.datetime }}</td>
                        <td>
                            <button class="action-button edit-button"
                                @click="updateTransaction(transaction._id)">Modificar</button>
                            <button class="action-button delete-button"
                                @click="deleteTransaction(transaction._id)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="editTransactionModal" class="custom-modal">
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h2>Editar Transacción</h2>
                    <button class="close-modal" @click="closeModal()">&times;</button>
                </div>
                <div class="custom-modal-body">
                    <form id="editTransactionForm">
                        <label for="storedUsername">Usuario</label>
                        <input type="text" id="user_id" class="custom-input" placeholder="Usuario" disabled>

                        <label for="crypto">Criptomoneda</label>
                        <select id="crypto" v-model="type" class="custom-select" @change="updatePrice">
                            <option value="btc">Bitcoin</option>
                            <option value="eth">Ethereum</option>
                            <option value="usdc">USDC</option>
                        </select>

                        <label for="amount">Cantidad</label>
                        <input type="number" id="amount" v-model="amount" class="custom-input" placeholder="Cantidad"
                            @input="updatePrice">

                        <label for="money">Precio</label>
                        <input type="number" id="money" v-model="price" class="custom-input" placeholder="Precio">

                        <label for="action">Movimiento</label>
                        <input type="text" id="action" v-model="action" class="custom-input" placeholder="Movimiento">
                    </form>
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-button" @click="saveTransaction(transaction._id)">Guardar Cambios</button>
                    <button class="custom-button" @click="closeModal()">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f9f9f9;
    padding: 20px;
}

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

.edit-button {
    background-color: #007bff;
    color: white;
}

.delete-button {
    background-color: #dc3545;
    color: white;
}

.custom-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.custom-modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
}

.custom-modal-header,
.custom-modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.custom-modal-body {
    margin: 20px 0;
}

.custom-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.custom-button {
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.custom-button:hover {
    background: #0056b3;
}

.close-modal {
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #000;
}
</style>
