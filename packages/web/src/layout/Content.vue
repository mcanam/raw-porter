<template>
    <main class="h-screen flex flex-col gap-4 px-5 pt-27 pb-32 overflow-y-auto">
        <h2 class="text-lg font-semibold">Configuration</h2>

        <div class="flex flex-col gap-2">
            <p class="text-sm">Source Folder <span class="text-xs text-slate-400">(Select the folder where your RAW files are stored)</span></p>
            <FolderPicker placeholder="Select source folder" ref="source" @select="onSelectSource($event)" :disabled="isProcessFiles" />
        </div>

        <div class="flex flex-col gap-2">
            <p class="text-sm">Destination Folder <span class="text-xs text-slate-400">(Choose where the found RAW files should go)</span></p>
            <FolderPicker placeholder="Select destination folder" ref="destination" @select="onSelectDestination($event)" :disabled="isProcessFiles" />
        </div>

        <div class="flex flex-col gap-2">
            <p class="text-sm">Raw File Type <span class="text-xs text-slate-400">(Select the type of RAW file to search for)</span></p>
            <Select placeholder="Select raw type" :items="rawTypes" ref="type" @select="onSelectType($event)" :disabled="isProcessFiles" />
        </div>

        <div class="flex flex-col gap-2">
            <p class="text-sm">Filename List <span class="text-xs text-slate-400">(List of filenames to match, extensions are optional)</span></p>
            <FileListInput ref="fileList" @file-list="onFileList($event)" :disabled="isProcessFiles" />
        </div>

        <h2 class="text-lg font-semibold">Result Log</h2>
        <ProgressLog :logs="progressLogs" />

        <div class="fixed left-0 bottom-0 z-10 w-full p-5 flex items-center justify-between gap-4 border-t border-slate-300 bg-white">
            <Button v-if="!isProcessFiles" icon="copy" text="Copy" bg-color="bg-blue-800" @click="onSubmit('copy')" />
            <span v-if="!isProcessFiles" class="text-sm font-semibold">OR</span>
            <Button v-if="!isProcessFiles" icon="share" text="Move" @click="onSubmit('move')" />

            <ProgressBar v-if="isProcessFiles" :value="progressBarValue" :total="progressBarTotal" />
            <Button v-if="isProcessFiles" icon="x-circle" text="Cancel" bg-color="bg-red-500" @click="onCancel" />
        </div>

        <Alert ref="alert" />
    </main>
</template>

<script setup>
    import { ref, useTemplateRef, onMounted } from 'vue';
    import FolderPicker from '@/components/FolderPicker.vue';
    import Select from '@/components/Select.vue';
    import FileListInput from '@/components/FileListInput.vue';
    import ProgressLog from '@/components/ProgressLog.vue';
    import Button from '@/components/Button.vue';
    import Alert from '@/components/Alert.vue';
    import ProgressBar from '@/components/ProgressBar.vue';

    const sourceRef = useTemplateRef('source');
    const destinationRef = useTemplateRef('destination');
    const typeRef = useTemplateRef('type');
    const fileListRef = useTemplateRef('fileList');
    const alertRef = useTemplateRef('alert');
    const isProcessFiles = ref(false);
    const progressBarValue = ref(0);
    const progressBarTotal = ref(0);
    const progressLogs = ref([]);

    const rawTypes = [
        {
            text: 'Canon (.CR3)',
            value: 'CR3',
        },
        {
            text: 'Nikon (.NEF)',
            value: 'NEF',
        },
        {
            text: 'Sony (.ARW)',
            value: 'ARW',
        },
        {
            text: 'Adobe (.DNG)',
            value: 'DNG',
        },
        {
            text: 'Fujifilm (.RAF)',
            value: 'RAF',
        },
        {
            text: 'Panasonic (.RW2)',
            value: 'RW2',
        },
    ];

    const payload = {
        source: '',
        destination: '',
        type: '',
        fileList: [],
        mode: '',
    };

    function validatePayload() {
        const results = [];

        Object.entries(payload).forEach(([key, value]) => {
            const isValid = Array.isArray(value) ? value.length : value.trim();

            switch (key) {
                case 'source':
                    sourceRef.value.valid(isValid);
                    break;
                case 'destination':
                    destinationRef.value.valid(isValid);
                    break;
                case 'type':
                    typeRef.value.valid(isValid);
                    break;
                case 'fileList':
                    fileListRef.value.valid(isValid);
                    break;
            }

            results.push(isValid);
        });

        return results.every((res) => res);
    }

    function onSelectSource(value) {
        payload.source = value;
    }

    function onSelectDestination(value) {
        payload.destination = value;
    }

    function onSelectType(value) {
        payload.type = value;
    }

    function onFileList(value) {
        payload.fileList = value;
    }

    async function onCancel() {
        await window.api.processFiles(payload);
        isProcessFiles.value = false;
    }

    async function onSubmit(mode) {
        payload.mode = mode;
        const isValid = validatePayload();

        if (!isValid) {
            alertRef.value.show({
                title: 'Whoops!',
                message: "You missed a few things. Let's fill those in and try again!",
                buttonText: 'Ok',
            });

            return; // stop execution
        }

        isProcessFiles.value = true;
        progressBarTotal.value = payload.fileList.length;
        progressLogs.value = [];

        await window.api.processFiles(payload);
    }

    function onLog(data) {
        if (data.status === 'fatal-error') {
            alertRef.value.show({
                title: 'Oops... something went wrong!',
                message: data.message,
                buttonText: 'Ok',
            });

            isProcessFiles.value = false;
            progressLogs.value = [];

            return; // stop execution
        }

        progressBarValue.value = data.index + 1;
        progressLogs.value.push(data);

        if (progressBarValue.value === progressBarTotal.value) {
            alertRef.value.show({
                title: 'Done!',
                message: 'All files have been processed. Check the result log for details.',
                buttonText: 'Ok',
            });

            isProcessFiles.value = false;
        }
    }

    onMounted(() => window.api.onLog(onLog));
</script>

<style scoped></style>
