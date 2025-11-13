<template>
    <button class="grow gap-2 px-4 py-2.5 rounded-lg duration-200 hover:opacity-80 active:scale-95" :class="[props.bgColor, props.textColor]" :disabled="props.disabled">
        <Icon v-if="props.icon" :icon="props.icon" width="18" height="18" />
        <span class="text-sm font-medium">{{ props.text }}</span>
    </button>
</template>

<script setup>
    import Icon from './Icon.vue';

    const props = defineProps({
        disabled: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: 'Button',
        },
        bgColor: {
            type: String,
            default: 'bg-slate-800',
        },
        textColor: {
            type: String,
            default: 'text-white',
        },
    });
</script>

<style scoped></style>
