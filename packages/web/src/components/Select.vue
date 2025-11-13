<template>
    <div class="relative select-container">
        <div class="flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-xl cursor-pointer duration-200 hover:border-slate-700" :class="{ 'border-red-500!': !isValid, 'border-slate-300! opacity-50! pointer-events-none!': props.disabled }" @click="onToggle">
            <input class="w-full pr-4 pointer-events-none" type="text" :placeholder="props.placeholder" readonly :value="displayText" />
            <Icon icon="chevron-down" class="duration-200" :class="{ 'rotate-180': isOpen }" />
        </div>

        <Transition name="slide-fade">
            <div v-if="isOpen" class="absolute z-10 w-full left-0 top-full mt-2 bg-white border border-slate-300 rounded-xl shadow-lg overflow-hidden">
                <div class="flex flex-col p-2">
                    <div v-for="(item, index) in items" :key="index" class="flex items-center justify-between p-2 rounded-lg cursor-pointer duration-200 hover:bg-slate-200" @click="onSelect(item, index)">
                        <span>{{ item?.text }}</span>
                        <Icon v-if="selectedIndex === index" icon="check" width="20" height="20" />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
    import { onMounted, ref, Transition } from 'vue';
    import Icon from './Icon.vue';

    const isOpen = ref(false);
    const selectedIndex = ref(null);
    const displayText = ref('');
    const isValid = ref(true);

    const emit = defineEmits(['select']);
    const props = defineProps({
        items: {
            type: Array,
            default: [],
        },
        placeholder: {
            type: String,
            default: 'Please select',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    });

    function onToggle() {
        isOpen.value = !isOpen.value;
    }

    function onSelect(item, index) {
        isOpen.value = false;
        if (selectedIndex.value === index) return;

        selectedIndex.value = index;
        displayText.value = item.text;
        isValid.value = true;

        emit('select', item.value);
    }

    onMounted(() => {
        window.addEventListener('click', (event) => {
            if (!isOpen.value) return;
            const elem = event.target.closest('.select-container');
            if (!elem) isOpen.value = false;
        });
    });

    defineExpose({
        valid: (value) => (isValid.value = value),
    });
</script>

<style scoped>
    .slide-fade-enter-active {
        transition: all 0.2s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateY(-20px);
        opacity: 0;
    }
</style>
