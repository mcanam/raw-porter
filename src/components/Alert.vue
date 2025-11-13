<template>
    <Transition name="fade">
        <div v-if="isShow" class="fixed top-0 left-0 z-9999 w-full h-full flex items-center justify-center bg-slate-900/50">
            <div class="w-[80%] p-4 flex flex-col gap-2 bg-white rounded-2xl overflow-hidden">
                <h2 class="text-lg font-semibold">{{ data?.title }}</h2>
                <p class="text-sm text-slate-500 mb-3">{{ data?.message }}</p>
                <Button class="self-end" :text="data?.buttonText" @click="hide" />
            </div>
        </div>
    </Transition>
</template>

<script setup>
    import { ref, Transition } from 'vue';
    import Button from './Button.vue';

    const isShow = ref(false);
    const data = ref(null);

    function show(payload) {
        isShow.value = true;
        data.value = payload;
    }

    function hide() {
        isShow.value = false;
        data.value = null;
    }

    defineExpose({
        show,
        hide,
    });
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.25s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
