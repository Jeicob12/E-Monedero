<script setup>
import NavBar from '../components/NavBar.vue';




</script>
<template>
    <NavBar></NavBar>
    <div>
        <h2 class="my-3">Comprar 💲</h2>
        <div class="container">
            <form @submit.prevent="">
                <select class="form-select text-center mb-3" aria-label="Default select example" required>
                    <option selected>Elije una moneda</option>
                    <option value="usdc">USDC</option>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                </select>
                <h6 class="text-center">Ingrese el monto que desea comprar</h6>
                <div class="input-group mb-3">
                    <span class="input-group-text"></span>
                    <span class="input-group-text">$</span>
                    <input type="number" step="0.0000000001" class="form-control"
                        aria-label="Amount (to the nearest dollar)" placeholder="Ej: 0.00001">
                </div>
                <button type="button" class="btn btn-light border" data-bs-toggle="modal" data-bs-target="#modalCompra">
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
                            <!-- <h5>{{coin.toUpperCase()}} {{parseFloat(amount)}}</h5> -->
                            <!-- <h4>Precio final AR${{cotizacionUsada}}</h4> -->
                            <!-- <h5 class="exchange">exchange: {{exchangeUsed}}</h5> -->
                        </div>
                        <div class="modal-footer mx-5 ">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal"
                                @click="comprar">Comprar</button>
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
.container{
  width: 50%;
  margin: 0 25%;
}
.exchange{
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