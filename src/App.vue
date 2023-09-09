<template>
  <div>
    <input type="text" v-model="pkgname" />
    <div class="outputBox" v-if="!isLoading">
      <span v-for="r in result" class="versionBox" :key="r" @mouseenter="handleClick(r)">{{
        r
      }}</span>
    </div>
    <div v-else>Loading</div>
    <div>
      <div v-for="d in deps" :key="d.name">
        <span>{{ d.name }}</span
        ><span style="font-weight: lighter;">{{ d.version_requirement }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getDependencies, getVersions, type Dependency } from './api'

const isLoading = ref(false)
const result = ref([] as string[])
const pkgname = ref('numpy')
const deps = ref([] as Dependency[])
const python_version = ref('')

function handleClick(version: string) {
  getDependencies(pkgname.value, version).then((v) => {
    deps.value = v.deps
    python_version.value = v.python
  })
}

watch(
  pkgname,
  (pkgname) => {
    isLoading.value = true
    getVersions(pkgname)
      .then((v) => (result.value = v))
      .catch((e) => {
        result.value = []
        console.warn(e)
      })
      .finally(() => (isLoading.value = false))
  },
  { immediate: true }
)
</script>

<style scoped>
.outputBox {
  overflow-wrap: normal;
  max-width: 100vw;
  display: flex;
  flex-wrap: wrap;
}
.versionBox {
  text-align: center;
  margin: 0.2em;
  padding: 0 0.2em;
  min-width: 5em;
  border: 1px solid green;
  border-radius: 1em;
}
</style>
