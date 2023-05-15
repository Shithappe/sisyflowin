<script setup>
import { onMounted, ref } from 'vue';

defineProps({
    modelValue: [String, Number],
    placeholder: String,
    type: {
        type: String,
        default: 'text',
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
    <input
        :type="type"
        ref="input"
        class="block w-full rounded-lg border-none bg-urctrl-light-gray p-5 text-base transition duration-200 ease-in-out focus:ring-urctrl-blue"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
</template>