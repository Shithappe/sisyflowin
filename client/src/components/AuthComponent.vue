<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios';
import Cookies from 'cookies-js';
import InputWithError from './InputWithError.vue';

const ApiUrl = import.meta.env.VITE_API_URL;

onMounted(() => {
    if (Cookies.get('token')) {
        axios.get(`http://${ApiUrl}/api/user/checkToken`, { headers: { Authorization: Cookies.get('token') }})
        .then(response => {
            console.log('true token');
            // redirect
        })
        .catch(error => {
            console.log(error.response.data);
        })
    }
});

const isLogin = ref(true);

const FormLogin = reactive({
    email: '',
    password: ''
});

const FormRegister = reactive({
    username: '',
    email: '',
    password: ''
});

const handleLoginSubmit = async () => {
    axios.post(`http://${ApiUrl}/api/user/login`, FormLogin)
        .then(response => {
            Cookies.set('token', response.data.token);
        })
        .catch(error => {
            console.log(error.response.data);
        })
};

const handleRegisterSubmit = async () => {
    axios.post(`http://${ApiUrl}/api/user/register`, FormLogin)
        .then(response => {
            Cookies.set('token', response.data.token);
        })
        .catch(error => {
            console.log(error.response.data);
        })
};

</script>

<template>
    <main>
        <div v-if="isLogin">
            <h2>Login</h2>
            <form @submit.prevent="handleLoginSubmit">
                <InputWithError v-model="FormLogin.email" type="text" placeholder="Email" />
                <input type="password" v-model="FormLogin.password" placeholder="password" />
                <button type="submit">Login</button>

                <div>
                    <button @click="isLogin = false">Haven'y account?</button>
                    <button>Remember password</button>
                </div>
            </form>
        </div>

        <div v-else>
            <h2>Register</h2>
            <form @submit.prevent="handleRegisterSubmit">
                <InputWithError v-model="FormRegister.username" type="text" placeholder="Username" />
                <InputWithError v-model="FormRegister.email" type="text" placeholder="Email" />

                <input type="password" v-model="FormRegister.password" placeholder="Password" />
                <input type="password" v-model="FormRegister.password" placeholder="Comfirme password" />
                <button type="submit">Register</button>

                <div>
                    <button @click="isLogin = false">Haven'y account?</button>
                    <button>Remember password</button>
                </div>
            </form>

            <button @click="isLogin = true">Have account?</button>
        </div>


    </main>
</template>



<style scoped>
main {
    border: 2px solid white;
    width: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

}
</style>