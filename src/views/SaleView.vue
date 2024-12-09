<script setup>

import NavBar from '../components/NavBar.vue';
import LoadingPage from '../components/LoadingPage.vue';
import CryptoService from '../service/cryptoService.js'
import LabService from '../service/labService.js'
import { onMounted, ref } from "vue";

const isLoading = ref(false);


</script>


<template>
    <div>
        <NavBar></NavBar>
        <h2 class="my-3">Vender 🤑</h2>
        <div class="container">
            <LoadingPage v-if="isLoading === true"></LoadingPage>
            <form v-else-if="isLoading === false" @submit.prevent="">
                <select class="form-select text-center mb-3" v-model="coin" aria-label="Default select example"
                    required>
                    <option selected>Elije una moneda</option>
                    <option value="usdc">USDC</option>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                </select>
                <h6 class="text-center">Ingrese el monto que desea vender</h6>
                <div class="input-group mb-1">
                    <span class="input-group-text" v-if="coin !== 'Elije una moneda'"></span>
                    <span class="input-group-text" v-else>$</span>
                    <input type="number" step="0.0000000001" class="form-control" v-model="amount"
                        aria-label="Amount (to the nearest dollar)" placeholder="Ej: 0.00001">
                </div>
                <h6 class="text-center disponible" @click="maxDisponible" @keydown="maxDisponible">{{ disponibilidad }}
                </h6>
                <button type="button" class="btn btn-light border mt-3" data-bs-toggle="modal"
                    data-bs-target="#modalCompra" :disabled="isDisabled">
                    Buscar cotización
                </button>
            </form>
            <div v-else-if="respuesta === false">
                <h2 class="mt-3">❌ERROR❌</h2>
                <h2>Servidor no responde</h2>
            </div>
            <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Cotización</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- <h5>{{ coin.toUpperCase() }} {{ parseFloat(amount) }}</h5>
                            <h4>Precio final AR${{ cotizacionUsada }}</h4>
                            <h5 class="exchange">exchange: {{ exchangeUsed }}</h5> -->
                        </div>
                        <div class="modal-footer mx-5 ">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal"
                                @click="vender">Vender</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-show="ventaRealizada !== null">
            <div class="alert alert-success alertCompra mt-5 alert-dismissible fade show" role="alert"
                v-show="ventaRealizada">
                💸¡Venta exitosa!💸
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            <div class="alert alert-danger alertCompra mt-5 alert-dismissible fade show" role="alert"
                v-show="!ventaRealizada">
                ❌ERROR❌
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div> -->
    </div>
</template>