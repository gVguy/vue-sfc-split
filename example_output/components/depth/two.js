import Two from '../two.js'

export default {
  template: `
<div data-scope-example_input-components-depth-two>
   <h1>{{text}}</h1>
   I have two style blocks:<br>
   one scoped, that makes my background pink<br>
   and the other is not,<br>
   it makes all headers' <code>font-family</code> <code>sans-serif</code><br><br>
   I also host this comonent that is level higher than me:
   <Two></Two>
</div>`,
   name: 'DeeperTwo',
   components: { Two }
   data() {
      return {
         text: 'Hello from a level deeper Component!'
      }
   },
}

// attach styles
fetch('example_input/components/depth/two.css').then(res => res.text()).then(style => document.head.insertAdjacentHTML('beforeend', '<style>'+style+'</style>'))