<script setup>

import NavBar from '../components/NavBar.vue';
import LoadingPage from '../components/LoadingPage.vue';
import LabService from '../service/labService.js'
import CryptoService from '../service/cryptoService.js'
import Swal from 'sweetalert2';

import { onMounted, ref, computed } from "vue";

import { store } from '../store/index.js';

const globalStore = store();
const isLoading = ref(true);
const storedUsername = localStorage.getItem('username');
const type = ref('');
const amount = ref(0);
const btc = ref(0);
const ethereum = ref(0);
const usdc = ref(0);

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
console.log('lala', globalStore.$state)

const sellCrypto = async () => {
    try {
        const amountToSell = parseFloat(amount.value);
        const selectedCryptoCode = type.value;

        if (isNaN(amountToSell) || amountToSell <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad a vender no es válida.',
            });
            return;
        }

        const disponible = { btc: 0, eth: 0, usdc: 0 };

        globalStore.$state.transaction.forEach((transaction) => {
            const { action, crypto_code, crypto_amount } = transaction;
            const amount = parseFloat(crypto_amount);

            if (action === "purchase") {
                disponible[crypto_code] += amount;
            } else if (action === "sale") {
                disponible[crypto_code] -= amount;
            }
        });

        const availableCrypto = disponible[selectedCryptoCode];
        if (amountToSell > availableCrypto) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No puedes vender más de lo que tienes. Tienes disponible ${availableCrypto.toFixed(8)} ${selectedCryptoCode.toUpperCase()}.`,
            });
            return;
        }

        let cryptoValue;
        if (selectedCryptoCode === 'btc') {
            cryptoValue = btc.value;
        } else if (selectedCryptoCode === 'eth') {
            cryptoValue = ethereum.value;
        } else if (selectedCryptoCode === 'usdc') {
            cryptoValue = usdc.value;
        }

        if (!cryptoValue) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Valor de la criptomoneda no disponible.',
            });
            return;
        }

        const totalMoneyObtained = parseFloat((amountToSell * cryptoValue).toFixed(2)); 

        if (isNaN(totalMoneyObtained) || totalMoneyObtained <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El monto calculado para la venta no es válido.',
            });
            return;
        }

        const storedUsername = localStorage.getItem('username');
        const data = {
            user_id: storedUsername,
            action: 'sale',
            crypto_code: selectedCryptoCode,
            crypto_amount: amount.value,
            money: totalMoneyObtained.toString(),
            datetime: Date.now(),
        };

        await LabService.createTransactions(data);

        Swal.fire({
            icon: 'success',
            title: 'Transacción exitosa',
            text: `Has vendido ${amount.value} ${selectedCryptoCode.toUpperCase()} y obtenido ${totalMoneyObtained} en dinero.`,
        });
    } catch (error) {
        console.error('Error al procesar la venta:', error); 
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un problema al procesar la venta: ${error.message || error}`,
        });
    }
};

onMounted(() => {
    CryptoService.getBitcoin().then(response => { btc.value = response.data.totalBid; }),
        CryptoService.getEtherum().then(response => { ethereum.value = response.data.totalBid; }),
        CryptoService.getUSDC().then(response => { usdc.value = response.data.totalBid; })
    getTransactions();
});
</script>


<template>
    <div>
        <NavBar></NavBar>
        <h2 class="my-3 text-center">Vender</h2>

        <LoadingPage class="text-center" v-if="isLoading"></LoadingPage>
        <div class="container" v-else>
            <div class="container my-4">
                <h2 class="text-center mb-4">Cantidades de Criptomonedas</h2>
                <div class="row">
                    <div v-for="(amount, crypto) in globalStore.$state.cryptoCant" :key="crypto"
                        class="col-12 col-sm-6 col-md-4 col-lg-4 mb-3 text-center">
                        <div class="card text-center shadow">
                            <div class="card-header bg-primary text-white">
                                <h5 class="m-0">{{ crypto.toUpperCase() }}</h5>
                            </div>
                            <div class="card-body">
                                <p class="card-text fs-4">
                                    <strong>{{ amount }}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form @submit.prevent="">
                <select class="form-select text-center mb-3" v-model="type" placeholder="Seleccione una moneda"
                    required>
                    <option value="" disabled>Seleccione una moneda</option>
                    <option value="usdc">USDC</option>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                </select>

                <h6 class="text-center">Ingrese el monto que desea vender</h6>
                <div class="input-group mb-3">
                    <span class="input-group-text">$</span>
                    <input type="number" v-model="amount" step="0.00000001" min="0" class="form-control"
                        placeholder="Ej: 0.00001" />
                </div>
                <button type="button" class="btn btn-light border" data-bs-toggle="modal" data-bs-target="#modalCompra">
                    Buscar cotización
                </button>
            </form>

            <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Cotización</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Estás seguro de que deseas vender {{ amount }} {{ type.toUpperCase() }}?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="button" class="btn btn-success" @click="sellCrypto" data-bs-dismiss="modal">
                                Confirmar Venta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>