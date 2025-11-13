<template>
    <header class="fixed top-0 left-0 z-100 w-full flex items-center gap-3 p-5 border-b border-slate-300 bg-white/50 backdrop-blur-xs">
        <Logo class="w-10 h-10" />

        <div class="flex flex-col">
            <h1 class="text-xl font-semibold">Raw Porter</h1>
            <p class="text-xs text-slate-500">Simple raw file finder</p>
        </div>

        <span class="text-xs text-slate-500 ml-auto">Version {{ version }}</span>
    </header>
</template>

<script setup>
    import Logo from '@/components/Logo.vue';
    import { onMounted, ref } from 'vue';

    const version = ref('');

    onMounted(async () => {
        version.value = (await window?.api?.appVersion()) || '';
    });
</script>

<style scoped></style>
