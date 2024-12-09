<script setup>
import NavBar from '../components/NavBar.vue';
import CryptoService from '../service/cryptoService.js'
import LabService from '../service/labService.js'
import { onMounted, ref } from "vue";
import { store } from '../store/index.js';


const globalStore = store();



const valueCrypto = ref(0);
const cryptoType = ref('');


const handlerSubmit = (value) => {

    const type = value.target[0].value;
    const amount = value.target[1].value;
    let money = 0;
    console.log("type",type)

    if (type == 'btc') {

        cryptoType.value = type;

        CryptoService.getBitcoin()
            .then(response => {
                money = parseFloat(amount) * response.data.totalBid
                valueCrypto.value = money;
                globalStore.setPurchaseAction(cryptoType, amount, money)
                console.log("money",money)

            })
    }
    if (type == 'eth') {
        cryptoType.value = type;
        CryptoService.getEtherum()
            .then(response => {
                money = parseFloat(amount) * response.data.totalBid
                valueCrypto.value = money;
                globalStore.setPurchaseAction(cryptoType, amount, money)
            })
    }
    if (type == 'usdc') {
        cryptoType.value = type;
        CryptoService.getUSDC()
            .then(response => {
                money = parseFloat(amount) * response.data.totalBid
                valueCrypto.value = money;
                globalStore.setPurchaseAction(cryptoType, amount, money)
            })
    }
}

const formatToPesos = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS', // Código correcto para pesos argentinos
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


const purchaseCrypto = async () => {
    LabService.createTransactions("purchase", globalStore.purchaseAction.crypto_code,
        globalStore.purchaseAction.crypto_amount, globalStore.purchaseAction.money)
        .then(response => console.log(response.data))
}


</script>
<template>
    <NavBar></NavBar>
    <div>
        <h2 class="my-3">Comprar 💲</h2>
        <div class="container">
            <form @submit.prevent="handlerSubmit">
                <select class="form-select text-center mb-3" name="type" id="type" placeholder="Seleccione una moneda"
                    required>
                    <option value=""></option>
                    <option value="usdc">USDC</option>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                </select>
                <h6 class="text-center">Ingrese el monto que desea comprar</h6>
                <div class="input-group mb-3">
                    <span class="input-group-text"></span>
                    <span class="input-group-text">$</span>
                    <input type="text" class="form-control" placeholder="Ej: 0.00001">
                </div>
                <button type="submit" class="btn btn-light border" data-bs-toggle="modal" data-bs-target="#modalCompra">
                    Buscar cotización
                </button>
            </form>
            <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="Comprar" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Cotización</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h5>Crypto a cotizar: {{ formatCryptoName(cryptoType) }}</h5>
                            <h5>Precio final ARS {{ formatToPesos(valueCrypto) }} </h5>
                            <!-- <h5 class="exchange">exchange: {{exchangeUsed}}</h5> -->
                        </div>
                        <div class="modal-footer mx-5 ">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal"
                                @click="purchaseCrypto">Comprar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-show="compraRealizada !== null">
            <div class="alert alert-success alertCompra mt-5 alert-dismissible fade show" role="alert"
                v-show="compraRealizada">
                💸¡Compra exitosa!💸
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <div class="alert alert-danger alertCompra mt-5 alert-dismissible fade show" role="alert"
                v-show="!compraRealizada">
                ❌ERROR❌
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div> -->
    </div>
</template>

<style scoped>
.container {
    width: 50%;
    margin: 0 25%;
}

.exchange {
    color: rgb(189, 189, 189);
}

/*Esconder flechas input[type=number]*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}
</style>