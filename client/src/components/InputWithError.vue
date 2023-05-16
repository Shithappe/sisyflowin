<script setup>
import { onMounted, ref } from 'vue';

defineProps({
    modelValue: [String, Number],
    placeholder: String,
    required: Boolean,
    type: {
        type: String,
        default: 'text',
    },
    errorTaget: {
        type: String,
        default: null,
    },
    errorMessage: {
        type: String,
        default: null,
    },
});

defineEmits(['update:modelValue']);

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <div>
        <input :type="type" ref="input" :required="required"
            class="block w-full rounded-lg border-none p-5 text-base transition duration-200 ease-in-out"
            :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
        <span>{{ errorMessage }}</span>
    </div>
</template>