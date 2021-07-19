<template>
  <div class="container">
    <slot class="slot-content"></slot>
  </div>
</template>

<script>
export default {
  name: 'Container',
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.container {
    padding: 20px;
  border: 2px dotted rgb(211, 209, 209);
  min-height: 250px;
//   .slot-content {
//     min-height: 20px;
//   }
}
</style>
