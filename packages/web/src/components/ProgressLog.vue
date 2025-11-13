<template>
    <div class="flex flex-col bg-white border border-slate-300 rounded-xl min-h-52 overflow-hidden">
        <div v-if="props.logs.length" class="flex justify-end gap-4 text-xs text-slate-600 font-medium px-4 py-2 border-b border-slate-300">
            <span class="text-teal-600">{{ foundCount }} Found</span>
            <span class="text-red-500">{{ notFoundCount }} Not Found</span>
        </div>

        <div class="grow p-4 flex flex-col gap-2 overflow-auto">
            <div v-if="!props.logs.length" class="w-full h-full flex flex-col items-center justify-center gap-1">
                <span class="text-slate-600 font-medium">No results yet</span>
                <span class="text-xs text-slate-400">Set the config then click Copy or Move to find RAW files.</span>
            </div>

            <div v-if="props.logs.length" v-for="log in logs" class="flex items-center justify-between pb-2 border-b border-slate-200">
                <span class="text-sm font-medium">{{ log.fileName }}</span>

                <div class="flex items-center gap-1 px-3 py-2 rounded-full" :class="getItemColor(log)">
                    <Icon :icon="getItemIcon(log)" width="16" height="16" />
                    <span class="text-xs">{{ ucFirst(log.status) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import Icon from './Icon.vue';

    const props = defineProps({
        logs: {
            type: Array,
            default: [],
        },
    });

    const foundCount = computed(() => {
        return props.logs.filter((log) => log.status === 'copied' || log.status === 'moved').length;
    });

    const notFoundCount = computed(() => {
        return props.logs.filter((log) => log.status === 'not found' || log.status === 'error').length;
    });

    function getItemColor(log) {
        return {
            'bg-teal-50 text-teal-600': log.status === 'copied' || log.status === 'moved',
            'bg-red-50 text-red-500': log.status === 'not found' || log.status === 'error',
        };
    }

    function getItemIcon(log) {
        return log.status === 'copied' || log.status === 'moved' ? 'check-circle' : 'x-circle';
    }

    function ucFirst(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
</script>

<style scoped></style>
