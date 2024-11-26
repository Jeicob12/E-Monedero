<script setup>
import Button from 'primevue/button';
import router from '../router/router.js';
import InputText from 'primevue/Inputtext';
import { onMounted, ref } from "vue";

import CryptoService from '../service/cryptoService.js'

const btc = ref(0);
const etherum = ref(0);
const usdc = ref(0);

// const btcService = CryptoService();

// const getBtcValue = async () => {

//     const btc = await  CryptoService.getBitcoin();
//     console.log(btc)
// }

// CryptoService.getBitcoin()
//     .then(response => console.log(response.data))
//     .catch(error => console.error(error));


// CryptoService.getEtherum()
//     .then(response => console.log(response.data))
//     .catch(error => console.error(error));

// CryptoService.getUSDC()
//     .then(response => console.log(response.data))
//     .catch(error => console.error(error));


const goToHome = () => {
    router.push({ name: "home" });
};

onMounted(() => {
    CryptoService.getBitcoin()
        .then(response => { btc.value = response.data.totalBid })
    console.log(btc)
    CryptoService.getEtherum()
        .then(response => { etherum.value = response.data.totalBid })
    console.log(etherum)
    CryptoService.getUSDC()
        .then(response => { usdc.value = response.data.totalBid })
    console.log(usdc)
});
</script>

<template>


    <div class="grid">

        <div class="col-4 TE">
            <span>BTC: $ {{ btc }} </span>
        </div>
        <div class="col-4 TE">
            <span>Etherum: $ {{ etherum }} </span>
        </div>
        <div class="col-4 TE">
            <span>Usdc: $ {{ usdc }} </span>
        </div>
    </div>


    <div class="container ">
        <div class="row">
            <div class="col-6 bg shadow-sm p-3 mt-2 bg-body rounded d-none d-lg-block"></div>
            <div class="col-lg-6">
                <div class="login-form fade-in-text">
                    <form class="shadow p-3 mb-5 bg-body rounded m-3" @submit="alerta">
                        <h1 class="bd my-4 mx-5">E-Monedero</h1>
                        <div class="form-group">
                            <label for="username" class="h5 mb-3">Usuario:</label>
                            <InputText id="username" type="text" placeholder="Usuario" />
                        </div>
                        <div class="form-group">
                            <label for="Contraseña" class="h5 mb-3">Contraseña:</label>
                            <InputText id="username" type="text" placeholder="Contraseña" />
                        </div>
                        <button type="submit" class="btn btn-secondary w-100">Login</button>
                        <div class="my-3">
                            <span>¿No tienes cuenta? <a href="#">Registrate</a></span><br>
                            <span>¿Olvidaste la contraseña? <a href="#">Recupera tu contraseña</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>