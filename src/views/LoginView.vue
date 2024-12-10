<script setup>
import router from '../router/router.js';
import { onMounted, ref, reactive } from "vue";
import { store } from '../store/index.js';

import CryptoService from '../service/cryptoService.js'

const btc = ref(0);
const ethereum = ref(0);
const usdc = ref(0);
const globalStore = store();
const username = ref('');
const password = ref('');
const errors = reactive({
    username: '',
    password: ''
});

const login = () => {
    errors.username = '';
    errors.password = '';

    if (!username.value.trim()) {
        errors.username = '*El campo Usuario es obligatorio.*';
    }
    if (!password.value.trim()) {
        errors.password = '*El campo Contraseña es obligatorio.*';
    }

    if (errors.username || errors.password) {
        return;
    }

    localStorage.setItem('username', username.value);

    globalStore.setProfile({
        username: username.value,
        password: password.value
    });

    router.push({ name: "home" });
};

const formatToPesos = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS', 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};


onMounted(() => {
    CryptoService.getBitcoin()
        .then(response => { btc.value = response.data.totalBid; })
    CryptoService.getEtherum()
        .then(response => { ethereum.value = response.data.totalBid })
    CryptoService.getUSDC()
        .then(response => { usdc.value = response.data.totalBid })
});
</script>

<template>

    <div class="container-fluid min-vh-100 d-flex flex-column justify-content align-items-center bg-light">
        <div class="row">
            <div class="col-4">
                <h5 class="card-title text-primary fw-bold">
                    <i class="pi pi-bitcoin text-primary me-2"></i> BTC
                </h5>
                <p class="card-text fs-5">Precio:
                    <span class="fw-semibold text-dark">{{ formatToPesos(btc) }}</span>
                </p>
            </div>
            <div class="col-4">
                <h5 class="card-title text-warning fw-bold">
                    <i class="pi pi-dollar text-warning me-2"></i> Ethereum
                </h5>
                <p class="card-text fs-5">Precio:
                    <span class="fw-semibold text-dark">{{ formatToPesos(ethereum) }}</span>
                </p>
            </div>
            <div class="col-4">
                <h5 class="card-title text-warning fw-bold">
                    <i class="pi pi-credit-card text-success me-2"></i> USDC
                </h5>
                <p class="card-text fs-5">Precio:
                    <br>
                    <span class="fw-semibold text-dark">{{ formatToPesos(usdc) }}</span>
                </p>
            </div>
        </div>
        <!-- Sección de Login -->
        <div class="row justify-content-center">
            <div class="col-lg-12 col-md-6">
                <div class="login-form bg-white shadow-lg p-5 rounded-lg position-relative">
                    <h1 class="text-center text-primary fw-bold mb-4">E-Monedero</h1>
                    <p class="text-center text-muted mb-4">¡Gestiona tus criptomonedas de forma segura y sencilla!</p>
                    <form @submit.prevent="login">
                        <div class="form-group mb-4">
                            <label for="username" class="form-label fw-semibold">Usuario: </label>
                            <input id="username" type="text" class="form-control form-control-lg"
                                placeholder="Ingresa tu usuario" v-model="username"><br>
                            <span v-if="errors.username" class="text-danger">{{ errors.username }}</span>
                        </div>
                        <div class="form-group mb-4">
                            <label for="password" class="form-label fw-semibold">Contraseña: </label>
                            <input id="password" type="password" class="form-control form-control-lg"
                                placeholder="Ingresa tu contraseña" v-model="password"> <br>
                            <span v-if="errors.password" class="text-danger">{{ errors.password }}</span>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg w-100 mb-4 fw-bold">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<style>
body {
    background: linear-gradient(to right, #f7f9fc, #e9f5ff);
    font-family: 'Roboto', sans-serif;
}

 .card:hover {
    transform: translateY(-5px);
    transition: 0.3s;
}

.login-form {
    background: #fff;
    border: 1px solid #ddd;
}

.login-form h1 {
    font-family: 'Poppins', sans-serif;
    letter-spacing: 1px;
}  
</style>