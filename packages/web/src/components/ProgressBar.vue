<template>
    <div class="w-full flex flex-col gap-2">
        <p class="text-[10px] text-slate-500">Processing {{ props.value }} of {{ props.total }} files</p>
        <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full duration-200" :style="{ width: barWidth }"></div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        value: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        },
    });

    const barWidth = computed(() => {
        return `${(props.value / props.total) * 100}%`;
    });
</script>

<style scoped></style>
