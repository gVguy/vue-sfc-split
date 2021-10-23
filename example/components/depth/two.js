export default {
  template: `
<div data-scope-components-depth-two>
   <h1>{{text}}</h1>
   I have two style blocks:<br>
   one scoped, that makes my background pink<br>
   and the other is not,<br>
   it makes all headers' <code>font-family</code> <code>sans-serif</code>
</div>`,
   name: 'DeeperTwo',
   data() {
      return {
         text: 'Hello from a level deeper Component!'
      }
   },
}

// attach styles
fetch('components/depth/two.css').then(res => res.text()).then(style => document.head.insertAdjacentHTML('beforeend', '<style>'+style+'</style>'))