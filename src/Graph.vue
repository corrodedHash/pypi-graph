<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ForceGraph } from './forceGraph'
const x = ref(ForceGraph({ nodes: [{ id: 1 }, { id: 2 }], links: [{ source: 1, target: 2 }] }))
const bla = ref(null as null | HTMLDivElement)
console.dir(x.value)
onMounted(() => {
  console.dir(bla.value)

  bla.value?.appendChild(x.value)
})
</script>

<template>
  <div>
    <div ref="bla" class="graphBox"></div>
  </div>
</template>

<style scoped>
.graphBox {
  border: 1px solid black;
  width: fit-content;
}
</style>
