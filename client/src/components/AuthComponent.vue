<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios';
import Cookies from 'cookies-js';
import InputWithError from './InputWithError.vue';


onMounted(() => {
      if (Cookies.get('token')) { // check token and redirect 
        console.log(Cookies.get('token'));
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

const handleSubmit = async () => {
    axios.post('http://localhost:8000/api/user/login', FormLogin)
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

        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <InputWithError v-model="FormLogin.email" type="text" placeholder="Email" />
            <input type="password" v-model="FormLogin.password" placeholder="password" />
            <button type="submit">Login</button>
        </form>

        <div>

        </div>

    </main>
</template>



<style scoped>
main{
    border: 2px solid white;
    width: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
}

form{
    display: flex;
    flex-direction: column;
    gap: 1rem;

}
</style>