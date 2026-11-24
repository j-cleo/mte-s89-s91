<script setup>
import { watch, ref, onBeforeMount, reactive } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';
import api from '../api';

const notyf = new Notyf();

const router = useRouter();

const { getUserDetails, user } = useGlobalStore();

const email = ref("");
const password = ref("");
const isLoading = ref(false);

async function handleLogin() {
	try {
		let res = await api.post('/users/login', {
			email: email.value,
			password: password.value
		});

		if(res.data.access) {
			notyf.success("Login Successful!");

			localStorage.setItem("token", res.data.access);

			getUserDetails(res.data.access);

			email.value = "";
			password.value = "";

			router.push({ path: '/' });
		}
	} catch (e) {
		if(e.response.status === 401) {
			notyf.error(e.response.data.message);
		} else {
			console.error(e);
			notyf.error("Login Failed");
		}
	}
}

onBeforeMount(() => {
	if(user.token) {
		router.push({ path: '/' });
	}
});

</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="card-title text-center mb-4">Login</h3>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <p class="text-center mt-3 mb-0 small">
            Don't have an account? <router-link :to="{ name: 'Register' }">Register here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>