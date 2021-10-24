<template>
   <div class="container">
      <h1>{{text}}</h1>
      I have class <code>.container</code><br>
      with a silver background defined in scoped styles<br>
      <br>
      I also host two other components:
      <Two />
      <DeeperTwo />
   </div>
</template>

<script>

import Two from '@/two.vue'
import DeeperTwo from '@/depth/two.vue'

export default {
   name: 'One',
   components: { Two, DeeperTwo },
   data() {
      return {
         text: 'Hello from component One'
      }
   },
}
</script>

<style scoped>
.container {
   background: silver;
}
</style>
