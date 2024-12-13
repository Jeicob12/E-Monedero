<script setup>
import router from '../router/router.js';
const storedUsername = localStorage.getItem('username');

const logout = () => {
    localStorage.removeItem('username');
    router.push({ name: "login" }).then(() => {
        window.location.reload(); 
    });
}

</script>

<template>

    <div class="container-fluid">
        <nav class="navbar navbar-expand-md navbar-light bg-lightborder-bottom
      shadow-sm p-3 mb-5 bg-body rounded">
            <div class="container-fluid">
                <router-link to="/home" class="h4 sintd">E-Monedero</router-link>
                <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#MenuNavegacion">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div id="MenuNavegacion" class="collapse navbar-collapse" aria-haspopup="true" aria-expanded="false">
                    <ul class="navbar-nav ms-3">
                        <li class="nav-item">
                            <router-link to="/purchase" class="nav-link">Comprar</router-link>
                        </li>
                         <li class="nav-item">
                            <router-link to="/sale" class="nav-link">Vender</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/historycal" class="nav-link">Historial</router-link>
                        </li>
                       <li class="nav-item dropdown">
                            <a href="#" class="nav-link dropdown-toggle" role="button"
                                data-bs-toggle="dropdown">Análisis</a>
                            <ul class="dropdown-menu text-center">
                                <li class="nav-item">
                                    <router-link to="/analityc" class="dropdown-item">Análisis actual</router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <ul class="navbar-nav ml-auto nav-flex-icons me-5">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle user" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                        aria-current="page" href="#">{{ storedUsername.toUpperCase() }}</a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#cerrarSesionMdl">Cerrar
                            sesion</a>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
    <div class="modal fade" id="cerrarSesionMdl" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">¿Deseas cerrar sesión?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-footer mx-5">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="logout">Cerrar sesión</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
a{
  text-decoration: none;
  font-weight: 700;
}
.sintd{
  text-decoration: none;
  color: black;
  font-weight: 700;
}
@media (max-width: 772px) {
  .user {
    margin-left: 2vw;
  }
}
</style>