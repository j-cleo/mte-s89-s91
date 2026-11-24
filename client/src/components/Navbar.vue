<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';

const globalStore = useGlobalStore();
const router = useRouter();

const isLoggedIn = computed(() => Boolean(globalStore.user.token));

const { user } = useGlobalStore();

function logout() {
  localStorage.removeItem('token');
  globalStore.getUserDetails(null);
  router.push('/login');
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <router-link class="navbar-brand fw-bold" :to="{ name: 'Home' }" >Facegram</router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item me-3 text-light small">
              Welcome, {{ user.username }}!
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm" @click="logout">
                Logout
              </button>
            </li>
        </ul>
      </div>
    </div>
  </nav>
</template>