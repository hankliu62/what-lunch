<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  top: number;
  left: number;
  fontSize: number;
}>();

const style = computed(() => {
  return {
    top: `${props.top}px`,
    left: `${props.left}px`,
    fontSize: `${props.fontSize}px`,
    color: `rgba(0, 0, 0, ${Math.random()})`,
  };
});
</script>

<template>
  <span class="flicker-font" :style="style">
    <slot />
  </span>
</template>

<style lang="less" scoped>
.flicker-font {
  position: absolute;
}
</style>
