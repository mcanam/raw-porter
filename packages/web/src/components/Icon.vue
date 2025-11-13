<template>
    <span v-html="svg"></span>
</template>

<script setup>
    import feather from 'feather-icons';
    import { onMounted, ref, watch } from 'vue';

    const svg = ref('');

    const props = defineProps({
        icon: String,
        width: [String, Number],
        height: [String, Number],
        stroke: [String, Number],
    });

    function getIcon() {
        const { icon, width, height, stroke } = props;
        const attrs = {};

        if (width) attrs['width'] = parseFloat(width);
        if (height) attrs['height'] = parseFloat(height);
        if (stroke) attrs['stroke-width'] = parseFloat(stroke);

        svg.value = feather.icons[icon]?.toSvg(attrs) || '';
    }

    watch(() => props, getIcon);
    onMounted(getIcon);
</script>
