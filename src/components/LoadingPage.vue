<template>
  <div class="loading-container">
    <div class="spinner-border load text-center" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <h2 class="mt-3">Cargando</h2>
  </div>
</template>

<script setup>
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Centra el contenido en el viewport */
}

.load {
  width: 10rem;
  height: 10rem;
}

.first {
  width: 0.75rem;
  height: 0.75rem;
}

.second {
  width: 1.25rem;
  height: 1.25rem;
}

.third {
  width: 1.75rem;
  height: 1.75rem;
}

.fourth {
  width: 2.25rem;
  height: 2.25rem;
}
</style>