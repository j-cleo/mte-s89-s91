<script setup>
import { watch, ref, onBeforeMount } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global.js';
import api from '../api.js';

const email = ref('');
const username = ref('');
const password = ref('');
const confirmPass = ref('');
const isLoading = ref(false);

const notyf = new Notyf();

const router = useRouter();

const { user } = useGlobalStore();

async function handleRegister(){
	try {
		let response = await api.post('/users/register', {
            email: email.value,
            username: username.value,
            password: password.value
        });

        if(response.status === 201) {
        	notyf.success(response.data.message);

        	email.value = "";
          username.value = "";
        	password.value = "";
        	confirmPass.value = "";

        	router.push({ path: '/login' });
        } else {
        	notyf.error("Registration Failed")
        }
	} catch (e) {
		console.log(e);
		notyf.error("Registration Failed")
	}
}

onBeforeMount(() => {
    if(user.token){
        router.push({path: '/'})
    }
});

</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="card-title text-center mb-4">Create an Account</h3>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Username</label>
              <input v-model="username" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input v-model="confirmPass" type="password" class="form-control" required />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              {{ isLoading ? 'Registering...' : 'Register' }}
            </button>
          </form>

          <p class="text-center mt-3 mb-0 small">
            Already have an account? <router-link :to="{ name: 'Login' }">Login here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>