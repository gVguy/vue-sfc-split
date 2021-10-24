<template>
</template>

<script>

export default {
   name: 'Two',
   template: `<div class="container">
      <h1>{{text}}</h1>
      I have template defined inside script<br>
      with <code>template: \` ... \`</code><br>
      <span>This span is colored purple with scoped styles</span><br>
      <br>
      I also have a div with class <code>.container</code><br>
      But its color is gold, because my scoped styles said so<br>
      <br>
      My styles are also in SCSS by the way
   </div>`
   data() {
      return {
         text: 'Hello from component Two!'
      }
   },
}
</script>

<style scoped lang="scss">
.container {
   background: gold;
   h1 {
      color: white;
      &:hover {
         background: black;
      }
   }
}
span {
   color: purple;
}
</style>
