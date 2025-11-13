<template>
    <div class="flex flex-col bg-white border border-slate-300 rounded-xl overflow-hidden duration-200 hover:border-slate-700 focus-within:border-slate-700" :class="{ 'border-red-500!': !isValid, 'border-slate-300! opacity-50! pointer-events-none!': props.disabled }">
        <textarea class="h-36 p-4 whitespace-pre" spellcheck="false" autocomplete="off" autocorrect="off" :placeholder="placeholder" v-model="model" @blur="onBlur"></textarea>
        <div class="text-xs text-slate-600 text-right px-4 py-2 border-t border-slate-300">{{ fileCount }} Files</div>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';

    const placeholder = 'Example:\nIMG_001\nIMG_002\nIMG_003';
    const fileCount = ref(0);
    const isValid = ref(true);

    const model = defineModel();
    const emit = defineEmits(['file-list']);

    const props = defineProps({
        disabled: {
            type: Boolean,
            default: false,
        },
    });

    function getFileList() {
        const list = model.value.split('\n').map((line) => {
            return line
                .trim()
                .replace(/^[\s\-\d\.\)\(]+/, '')
                .replace(/\.[^.]+$/, '')
                .replace(/[^A-Za-z0-9_-]+$/g, '');
        });

        return list.filter((line) => line);
    }

    function onBlur() {
        const fileList = getFileList();
        model.value = fileList.join('\n');
        emit('file-list', fileList);
    }

    watch(
        () => model.value,
        () => {
            const fileList = getFileList();
            fileCount.value = fileList.length;
            isValid.value = !!fileList.length;
        },
    );

    defineExpose({
        valid: (value) => (isValid.value = value),
    });
</script>

<style scoped></style>
