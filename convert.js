#!/usr/bin/env node

const glob = require('glob')
const fs = require('fs')
const compiler = require('vue-template-compiler')
const sass = require('node-sass')
const postcss = require('postcss')
const path = require('path')
const minimist = require('minimist')
const htmlparser = require('node-html-parser')


// options

const args = minimist(process.argv.slice(2))
const opts = {
  tab: '  ',
  ignore: ['node_modules/**'],
  noscope: false,
  dest: 'dist/',
}

opts.tab = args.tab != undefined ? args.tab : opts.tab
opts.ignore = args.ignore ? opts.ignore.concat(args.ignore.split(',')) : opts.ignore
opts.dest = args.dest
            ? args.dest.slice(-1) != '/'
              ? args.dest+'/'
              : args.dest
            : opts.dest
opts.noscope = args.noscope ? true : false



const files = glob.sync('**/*.vue', { ignore: opts.ignore })


files.forEach(file => {

  const pathParse = path.parse(file)

  const scopeSelectors = []

  let warnings = []

	fs.readFile(file, 'utf8', async (err, content) => {

    if (err) return console.error(err)


    // parse

    const parsed = compiler.parseComponent(content)


    // extract


    // script & style

    let script = parsed.script ? parsed.script.content.trim() : ''
    let styles = '' // styles will be filled later

    // template

    let template = ''
    if (parsed.template && parsed.template.content.trim()) {
      template = parsed.template.content.trim()
    }
    else if (script) {
      // there is no template block, but there is script
      // maybe template is in js
      const match = script.match(/(.|\n)*template:\s*([\`'"])/m)
      if (match) {
        // template is in js
        // extract it
        template = script.replace(match[0], '')
        const quote = match[0].slice(-1)
        let regex = new RegExp('(?<!\\\\)\\'+quote+'(.|\\n)*','m')
        template = template.replace(regex, '')

        // remove template from script (it will get injected back later)
        regex = new RegExp('template:\\s*'+quote+'(.|\\n)*(?<!\\\\)'+quote+',?\\s*', 'm')
        script = script.replace(regex, '')
      }
    }


    // process


    // styles

    if (parsed.styles && parsed.styles.length) {

      for (let parsedStyle of parsed.styles) {
        let style = parsedStyle.content.trim()

        if (parsedStyle.lang && parsedStyle.lang == 'scss') {
          // scss -> css
          style = sass.renderSync({
            data: style,
            outputStyle: 'expanded'
          }).css.toString()
        }


        if (parsedStyle.scoped && template && !opts.noscope) {
          // scoped

          // generate scope name from filename
          const scope = file
            .replace(/\.vue$/, '')
            .replace(/[\/.]/g, '-')


          // add scope to css selectors
          style = await postcss().use(root => {
            root.walkRules(rule => {
              scopeSelectors.push(rule.selector)
              const selectors = rule.selector.match(/(^|[\.#\s])[\w\-]+/g)
              selectors.forEach(s => {
                rule.selector = rule.selector.replace(s, s+'[data-scope-'+scope+']')
              })
            })
          }).process(style, { from: undefined }).then(result => result.css)


          // add scope to template items

          const html = htmlparser.parse(template)

          scopeSelectors.forEach(selector => {
            // only add scope attribute to elements that are styled from scoped css
            const els = html.querySelectorAll(selector)

            for (let el of els) {
              for (let a of Object.keys(el.attributes)) {
                if (a.includes('data-scope-')) {
                  el.removeAttribute(a)
                }
              }
              el.setAttribute('data-scope-'+scope, '')
            }

          })

          template = html.toString()

          // remove ="" for prettiness
          const regex = new RegExp('(data-scope-'+scope+')=""','g')
          template = template.replace(regex, '$1')

        } else if (!template && !opts.noscope) {
          warnings.push('scoped style, but no template')
        }

        // join all styles
        styles += style + '\n'

      }

      if (script) {
        // add style attachment to script
        script += '\n\n// attach styles\nfetch(\''+pathParse.dir+'/'+pathParse.name+'.css\').then(res => res.text()).then(style => document.head.insertAdjacentHTML(\'beforeend\', \'<style>\'+style+\'</style>\'))'
      }

    } else {
      warnings.push('no style')
    }


    // template -> script

    if (template && script) {

      // backslash any unbackslashed occurancies of `
      template = template.trim().replace(/(?<!\\)`/g, '\`')

      const templateString = 'template: `\n' + template + '`,'

      const match = script.match(/(export\sdefault\s*\{)/)
      if (match) {
        // there is a default export, append template to it
        script = script.replace(
          match[0], match[0] + '\n' + opts.tab + templateString
        )
      } else {
        warnings.push('can\'t find default export')
      }

    } else {
      warnings.push('no script or template')
    }


    // rewrite imports
    if (script) {
      script = script.replace(/import(.*)\.vue(['"])/g, 'import$1.js$2')
    }


    // write files

    const dir = opts.dest + pathParse.dir
    const outPath = dir + '/' + pathParse.name

    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) return console.log(err)

        if (script) {
          fs.writeFile(outPath+'.js', script, err => {
            if (err) return console.log(err)
          })
        }

        if (styles) {
          fs.writeFile(outPath+'.css', styles, err => {
            if (err) return console.log(err)
          })
        }
    })


    // log warnings

    if (warnings.length) {
      warnings.forEach(w => console.log('\x1b[33m%s\x1b[0m', 'WARN! '+file+' : '+ w))
    }



  })
})


