<template>
   <div>
      <h1>{{text}}</h1>
      I have two style blocks:<br>
      one scoped, that makes my background pink<br>
      and the other is not,<br>
      it makes all headers' <code>font-family</code> <code>sans-serif</code>
   </div>
</template>

<script>

export default {
   name: 'DeeperTwo',
   data() {
      return {
         text: 'Hello from a level deeper Component!'
      }
   },
}
</script>

<style scoped>
div {
   background: pink;
}
</style>

<style>
h1 {
   font-family: sans-serif;
}
</style>
