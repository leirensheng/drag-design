<template>
  <div class="left-panel">
    <div
      class="plugin-item"
      v-for="one in plugins"
      :key="one.title"
      @click="handleAdd(one)"
    >
      {{ one.title }}
    </div>
  </div>
</template>

<script>
import plugins from '@/components/plugins'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      plugins
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(['elementManager']),
    handleAdd(one) {
      this.elementManager({
        type: 'add',
        value: { ...one }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.left-panel {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
<style>
.plugin-item {
  user-select: none;
  position: relative;
  margin-bottom: 10px;
  background-color: rgb(245, 248, 251);
  width: 80px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
