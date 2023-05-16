<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios';
import Cookies from 'cookies-js';
import InputWithError from './InputWithError.vue';

const ApiUrl = import.meta.env.VITE_API_URL;

onMounted(() => {
    if (Cookies.get('token')) {
        axios.get(`http://${ApiUrl}/api/user/checkToken`, { headers: { Authorization: Cookies.get('token') } })
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

const errorList = reactive({
    username: null,
    firstname: null,
    lastname: null,
    email: null,
    password: null
});
const FormLogin = reactive({
    email: '',
    password: ''
});

const FormRegister = reactive({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirm: ''
});

const Formated = (obj) => {
    for (let key in obj) {
        obj[key] = obj[key].trim();
    }
}
const clearError = () => {
    for (let key in errorList) {
        errorList[key] = null;
    }
}

const passVisibility = ref('password');
const changePassVisibility = () => {
    passVisibility.value = 'text'
    setTimeout(() => {
        passVisibility.value = 'password'
    }, 2000)
}

const handleLoginSubmit = async () => {

    Formated(FormLogin);
    clearError();

    axios.post(`http://${ApiUrl}/api/user/login`, FormLogin)
        .then(response => {
            Cookies.set('token', response.data.token);
            // redirect
        })
        .catch(error => {
            // console.log(error.response.data);
            errorList[error.response.data.errorTarget] = error.response.data.errorMessage;
            // console.log(errorList);
        })
};

const handleRegisterSubmit = async () => {

    Formated(FormRegister);
    clearError();

    axios.post(`http://${ApiUrl}/api/user/register`, FormRegister)
        .then(response => {
            Cookies.set('token', response.data.token);
            console.log('reg is okey');
        })
        .catch(error => {
            console.log(error.response.data);
            errorList[error.response.data.errorTarget] = error.response.data.errorMessage;
            console.log(errorList);
        })
};

</script>

<template>
    <main>
        <div v-if="isLogin">
            <h2>Login</h2>
            <form @submit.prevent="handleLoginSubmit">
                <InputWithError v-model="FormLogin.email" type="email" required placeholder="Email" :errorMessage="errorList.email" />
                <InputWithError v-model="FormLogin.password" type="password" required placeholder="Password" :errorMessage="errorList.password" />
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
                <InputWithError v-model="FormRegister.username" type="text" placeholder="Username" :errorMessage="errorList.username" />
                <div>
                    <InputWithError v-model="FormRegister.firstname" type="text" placeholder="Firstname" :errorMessage="errorList.firstname" />
                    <InputWithError v-model="FormRegister.lastname" type="text" placeholder="Lastname" :errorMessage="errorList.lastname" />
                </div>
                <InputWithError v-model="FormRegister.email" type="text" placeholder="Email" :errorMessage="errorList.email" />

                <div>
                    <input :type="passVisibility" v-model="FormRegister.password" placeholder="Password" :errorMessage="errorList.password" />
                    <button type="button" @click="changePassVisibility">show</button>
                </div>
                <input type="password" v-model="FormRegister.confirm" placeholder="Confirm password" :errorMessage="errorList.confirm" />
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