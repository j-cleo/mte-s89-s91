import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api';

export const useGlobalStore = defineStore('global',() => {
	
	let user = reactive({
		token: localStorage.getItem('token'),
		email: null,
		isAdmin: null,
		username: null
	})

	async function getUserDetails(token){
	  	
		if(!token) {
			user.token = null;
		  	user.email = null;
		  	user.isAdmin = null;
		  	user.username = null;

        	return;
    	}

        let { data } = await api.get('/users/details');
		user.token = token;
        user.email = data.user.email;
        user.isAdmin = data.user.isAdmin;
        user.username = data.user.username;
	}

	return {
		user,
		getUserDetails
	}
})