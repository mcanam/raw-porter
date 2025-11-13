<template>
    <div class="flex p-1 bg-white border border-slate-300 rounded-xl duration-200 hover:border-slate-700" :class="{ 'border-red-500!': !isValid, 'border-slate-300! opacity-50! pointer-events-none!': props.disabled }">
        <input class="w-full px-3" type="text" :placeholder="props.placeholder" readonly :value="path" />
        <Button icon="folder" text="Browse" @click="onBrowse" />
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import Button from './Button.vue';

    const path = ref('');
    const isValid = ref(true);
    const emit = defineEmits(['select']);

    const props = defineProps({
        placeholder: {
            type: String,
            default: 'Please select',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    });

    async function onBrowse() {
        const result = (await window.api.selectFolder()) || '';

        if (!result) {
            !path.value && (isValid.value = false);
            return;
        }

        path.value = result;
        isValid.value = true;

        emit('select', result);
    }

    defineExpose({
        valid: (value) => (isValid.value = value),
    });
</script>

<style scoped></style>
