<style lang="scss" scoped></style>

<script setup>
import { ref, toRaw, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const typeCode = ref(404);
const descText = ref('');
const router = useRouter();

const init = () => {
  const { query = {} } = toRaw(router.currentRoute.value) || {};
  const { type, desc } = query;
  typeCode.value = type;
  descText.value = desc || '';
};

onBeforeMount((_) => {
  init();
});
</script>

<template>
  <Exception :type="typeCode" :desc="descText" />
</template>
