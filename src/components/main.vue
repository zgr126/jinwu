<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

defineProps<{ msg: string }>()

const count = ref(0)
let toPath = ()=>{
  router.push({ path: '/start' })
}
</script>

<template>
  <button @click="toPath">start</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
