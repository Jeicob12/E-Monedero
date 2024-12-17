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

    amount.value = '';
    type.value = '';

    Swal.fire({
      icon: 'success',
      title: 'Transacción exitosa',
      text: `Has vendido ${amount.value} ${selectedCryptoCode.toUpperCase()} y obtenido ${formatToPesos(totalMoneyObtained)} en dinero.`,
    }).then(() => {
      // Recargar la página después de que el usuario haga clic en "OK"
      window.location.reload();
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

const formatToPesos = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
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
    <div class="header text-center py-4">
      <h2 class="text-white">Vender Criptomonedas</h2>
    </div>

    <LoadingPage class="text-center" v-if="isLoading"></LoadingPage>

    <div class="container" v-else>
      <!-- Cantidades de Criptomonedas -->
      <div class="my-5">
        <h2 class="text-center mb-4">Tus Criptomonedas</h2>
        <div class="row">
          <div v-for="(amount, crypto) in globalStore.$state.cryptoCant" :key="crypto"
            class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4">
            <div class="card shadow-sm">
              <div class="card-header bg-info text-white text-center">
                <h5 class="m-0">{{ crypto.toUpperCase() }}</h5>
              </div>
              <div class="card-body text-center">
                <p class="card-text fs-4">
                  <strong>{{ amount }}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de Venta -->
      <form @submit.prevent="">
        <div class="mb-4">
          <label for="crypto-select" class="form-label">Selecciona una moneda</label>
          <select id="crypto-select" class="form-select text-center" v-model="type" required>
            <option value="" disabled>Selecciona una moneda</option>
            <option value="usdc">USDC</option>
            <option value="btc">Bitcoin</option>
            <option value="eth">Ethereum</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="amount" class="form-label">Ingresa el monto que deseas vender</label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input id="amount" type="number" v-model="amount" step="0.00000001" min="0" class="form-control"
              placeholder="Ej: 0.00001" />
          </div>
        </div>

        <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#modalCompra">
          Buscar Cotización
        </button>
      </form>

      <!-- Modal de Confirmación -->
      <div class="modal fade" id="modalCompra" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="exampleModalLabel">Confirmar Venta</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="text-center">
                ¿Estás seguro de que deseas vender
                <strong>{{ amount }}</strong>
                <strong>{{ type.toUpperCase() }}</strong>?
              </p>
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

<style scoped>
.header {
  background: linear-gradient(45deg, #17a2b8, #007bff);
  color: white;
}

.card-header {
  font-size: 1.2rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #0056b3;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #003f88;
}

.modal-content {
  border-radius: 10px;
}

.modal-header {
  border-bottom: none;
}

.modal-footer {
  border-top: none;
}
</style>