<script setup>
import NavBar from '../components/NavBar.vue';
import CryptoService from '../service/cryptoService.js'
import LabService from '../service/labService.js'
import { onMounted, ref, resolveDirective } from "vue";
import { store } from '../store/index.js';
import Swal from 'sweetalert2';


const globalStore = store();



const valueCrypto = ref(0);
const cryptoType = ref('');
const isValidPurchase = ref(null);
const amount = ref(0);
const type = ref('');



const formatToMoneyString = (value) => {
    return parseFloat(value).toFixed(2); // Asegura siempre dos decimales en formato string
};

const handlerSubmit = (value) => {

    const type = value.target[0].value;
    const amount = value.target[1].value;
    let money = 0;
    console.log("type", type)

    if (type == 'btc') {

        cryptoType.value = type;

        CryptoService.getBitcoin()
            .then(response => {
                money = formatToMoneyString(parseFloat(amount) * response.data.totalBid);
                valueCrypto.value = money;

                console.log("money", money)

            })
    }
    if (type == 'eth') {
        cryptoType.value = type;
        CryptoService.getEtherum()
            .then(response => {
                money = formatToMoneyString(parseFloat(amount) * response.data.totalBid);
                valueCrypto.value = money;
            })
    }
    if (type == 'usdc') {
        cryptoType.value = type;
        CryptoService.getUSDC()
            .then(response => {
                money = formatToMoneyString(parseFloat(amount) * response.data.totalBid);
                valueCrypto.value = money;
            })
    }
}

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

const clearForm = () => {
    cryptoType.value = "";
    valueCrypto.value = "";
    globalStore.setPurchaseAction("", "", "");

    const form = document.querySelector("form");
    if (form) {
        form.reset();
    }
};


const purchaseCrypto = async () => {
    try {
        console.log('tr', type.value, amount.value, valueCrypto.value);

        const storedUsername = localStorage.getItem('username');
        const data = {
            user_id: storedUsername,
            action: 'purchase',
            crypto_code: type.value,
            crypto_amount: amount.value,
            money: valueCrypto.value,
            datetime: Date.now()
        };

        await LabService.createTransactions(data);

        globalStore.setPurchaseAction(data);

        Swal.fire({
            title: '¡Compra exitosa!',
            text: `Has comprado ${amount.value} ${formatCryptoName(type.value)} por un total de ${formatToPesos(valueCrypto.value)}.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
        });

        clearForm();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Ooops... No se pudo realizar la compra.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
        });
    }
};



</script>
<template>
    <NavBar></NavBar>
    <div>
      <div class="header text-center py-4">
        <h2 class="text-white">Comprar Crypto</h2>
      </div>
      <div class="container my-5">
        <form @submit.prevent="handlerSubmit" class="p-4 shadow-sm rounded bg-light">
          <div class="mb-4">
            <label for="type" class="form-label">Seleccione una moneda</label>
            <select
              class="form-select text-center"
              name="type"
              v-model="type"
              id="type"
              placeholder="Seleccione una moneda"
              required
            >
              <option value="" disabled selected>Selecciona una opción</option>
              <option value="usdc">💵 USDC</option>
              <option value="btc">🪙 Bitcoin</option>
              <option value="eth">🔗 Ethereum</option>
            </select>
          </div>
  
          <div class="mb-4">
            <label for="amount" class="form-label">Ingrese el monto que desea comprar</label>
            <div class="input-group">
              <span class="input-group-text bg-primary text-white">$</span>
              <input
                type="number"
                v-model="amount"
                step="0.00000000001"
                min="0"
                class="form-control"
                placeholder="Ej: 0.00001"
              />
            </div>
          </div>
  
          <button
            type="submit"
            class="btn btn-primary w-100 py-2"
            data-bs-toggle="modal"
            data-bs-target="#modalCompra"
          >
            Buscar cotización
          </button>
        </form>
  
        <!-- Modal -->
        <div
          class="modal fade"
          id="modalCompra"
          tabindex="-1"
          aria-labelledby="Comprar"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="exampleModalLabel">Cotización</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <p class="mb-2">
                  <strong>Crypto a cotizar:</strong> {{ formatCryptoName(cryptoType) }}
                </p>
                <p>
                  <strong>Precio final (ARS):</strong> {{ formatToPesos(valueCrypto) }}
                </p>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-success"
                  data-bs-dismiss="modal"
                  @click="purchaseCrypto"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Alerts -->
      <div v-if="isValidPurchase !== null" class="container mt-5">
        <div
          class="alert alert-success text-center"
          v-show="isValidPurchase"
        >
          ¡Compra exitosa!
          <button
            type="button"
            class="btn-close"
            @click="isValidPurchase = null"
            aria-label="Close"
          ></button>
        </div>
        <div
          class="alert alert-danger text-center"
          v-show="isValidPurchase === false"
        >
          Ooops.... No se pudo realizar la compra
          <button
            type="button"
            class="btn-close"
            @click="isValidPurchase = null"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .header {
    background: linear-gradient(45deg, #007bff, #6610f2);
    color: white;
  }
  
  .form-select,
  .input-group-text {
    font-size: 1rem;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  
  .modal-content {
    border-radius: 10px;
  }
  
  .alert {
    border-radius: 10px;
  }
  
  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>
  