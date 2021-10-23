import Two from './two.js'
import DeeperTwo from './depth/two.js'

export default {
  template: `
<div class="container" data-scope-components-one>
   <h1>{{text}}</h1>
   I have class <code>.container</code><br>
   with a silver background defined in scoped styles<br>
   <br>
   I also host two other components:
   <Two></Two>
   <DeeperTwo></DeeperTwo>
</div>`,
   name: 'One',
   components: { Two, DeeperTwo },
   data() {
      return {
         text: 'Hello from component One'
      }
   },
}

// attach styles
fetch('components/one.css').then(res => res.text()).then(style => document.head.insertAdjacentHTML('beforeend', '<style>'+style+'</style>'))