# vue-sfc-split

Convert SFCs for use without build

## What it does

* Converts `.vue` files into `.js` and `.css` files
* Includes template into script
* Auto-attaches generated css file
* Preserves `scoped` styles
* Supports SCSS
* Maintains structure
* Rewrites imorts

## Installation & Usage

### Global
Install:
```bash
npm i -g vue-sfc-split
```
Run from project root:
```bash
vue-sfc-split
```

### Local (npm scripts)
Install:
```bash
npm i vue-sfc-split
```
Add npm script to `package.json`:
```json
"scripts": {
  "split": "vue-sfc-split"
},
```
Run from project root:
```bash
npm run split
```

## Options
`--ignore` patterns to ignore directories

`--noscope` ignore scoped css, and treat it like usual css

`--dest` destination folder

`--tab` this will be used to indent template entry in script

### --ignore
Comma separated list of glob patterns

`node_modules` is always ignored
```bash
vue-sfc-split --ignore=directory/*,directory-recursive/**
```

### --noscope
If this is specified scoped css will have no effect, all styles will be treated as unscoped
```bash
vue-sfc-split --noscope
```

### --dest
Where the output files will go

Default: `dest/`

Set this to an empty string to create `.js` and `.css` files next to original `.vue` files
```bash
vue-sfc-split --dest=""
```

## Scope
Scoped styles are processed similarly to [how vue does it](https://v3.vuejs.org/api/sfc-style.html#style-scoped)

Custom `data-scope-*` attribute will be added to scoped style selectors and template elements

Scope name is created based on file name and its path, keeping generated scope names predictable and non-duplicating

For example this in file `hello.vue`
```xml
<div>Hola</div>
<style scoped>
div {
  color: pink;
}
</style>
```
Will get converted to this
```xml
<div data-scope-hello>Hola</div>
<style scoped>
div[data-scope-hello] {
  color: pink;
}
</style>
```
This can be disabled by specifying `--noscope`

## Imports
In the output files all `.vue` imports will automatically be rewritten to target newly created `.js` files instead

## Style attachment
Generated `.css` files will be automatically attached from generated `.js` files in this manner:
```javascript
fetch('hello.css')
  .then(res => res.text())
  .then(style => document.head.insertAdjacentHTML('beforeend', '<style>'+style+'</style>'))
```

## I/O example
### Input
__hello.vue__:
```xml
<template>
   <div class="container">
      <h1>{{text}}</h1>
      <Two />
   </div>
</template>

<script>
import Two from './two.vue'

export default {
   name: 'One',
   components: { Two },
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
```
### Output
__hello.js__:
```javascript
import Two from './two.js'

export default {
  template: `
<div class="container" data-scope-hello>
   <h1>{{text}}</h1>
   <Two></Two>
</div>`,
   name: 'One',
   components: { Two },
   data() {
      return {
         text: 'Hello from component One'
      }
   },
}

// attach styles
fetch('hello.css').then(res => res.text()).then(style => document.head.insertAdjacentHTML('beforeend', '<style>'+style+'</style>'))
```
__hello.css__
```css
.container[data-scope-hello] {
   background: silver;
}
```



