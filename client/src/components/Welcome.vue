<script setup>
import { onMounted } from 'vue';
import Cookies from 'cookies-js';
import AuthComponent from './AuthComponent.vue';

onMounted(() => {
      console.log('Component mounted');
      console.log(Cookies.get('token'));
    });
</script>

<template>
    <main>
        <h1>Welcome</h1>
        <AuthComponent/>
    </main>
</template>



<style>

</style>