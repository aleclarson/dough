#!/usr/bin/env node

//
// migrate.js
//
//   This script reorganizes the umbrella repository to work
//   better without Grunt as an intermediary. It also removes
//   the plugins I don't currently use. Then, it changes the
//   entry module to import every plugin alphabetically.
//   This script should be used every time we want to sync
//   with the upstream repository.
//

const path = require('path')
const fs = require('fsx')

const unwantedFiles = [
  'app.js',
  'bower.json',
  'Contributing.md',
  'documentation.md',
  'Gruntfile.js',
  'jquery.md',
  'polyfill.js',
  'src/export.js',
  'umbrella.js',
  'umbrella.min.js',
]
const unwantedDirs = [
  'test',
  'docs',
]
const unusedPlugins = [
  'ajax',
  'fn.ajax',
  'fn.parseJson',
  'handle',
  'param',
  'serialize',
  'uri',
]

unwantedFiles.forEach(fs.removeFile)
unwantedDirs.forEach(fs.removeDir)
unusedPlugins.forEach(name => fs.removeDir('src/plugins/' + name))

// Create some directories.
;[ 'plugins', 'spec', 'docs' ].forEach(fs.writeDir)

// Collect the plugin names.
let plugins = []

// Combine some plugins.
const combined = {
  array: ['array', 'each', 'filter', 'map'],
  access: ['attr', 'data', 'pairs', 'size'],
  classes: ['addclass', 'hasclass', 'is', 'not', 'removeclass', 'toggleclass'],
  content: ['after', 'append', 'before', 'clone', 'empty', 'html', 'prepend', 'remove', 'replace', 'text', 'wrap'],
  events: ['off', 'on', 'trigger'],
  internal: ['adjacent', 'args', 'eacharg', 'generate', 'isInPage', 'select', 'slice', 'str', 'unique'],
  traversal: ['children', 'closest', 'find', 'first', 'last', 'parent', 'siblings'],
}

Object.keys(combined).forEach(name => {
  const modules = []
  const tests = []
  const docs = []

  combined[name].forEach(name => {
    const dir = 'src/plugins/' + name
    modules.push(fs.readFile(`${dir}/${name}.js`))

    const test = `${dir}/test.js`
    if (fs.isFile(test)) {
      tests.push(fs.readFile(test))
    }

    const readme = `${dir}/readme.md`
    if (fs.isFile(readme)) {
      docs.push(fs.readFile(readme))
    }

    fs.removeDir(dir)
  })

  const dir = `src/plugins/${name}`
  fs.writeDir(dir)
  fs.writeFile(`${dir}/${name}.js`, modules.join('\n\n'))
  fs.writeFile(`${dir}/test.js`, tests.join('\n\n'))
  fs.writeFile(`${dir}/readme.md`, docs.join('\n\n---\n'))
})

// Import the core module into every plugin.
const coreImport = `const u = require('./core');`

// Explode each plugin.
fs.readDir('src/plugins').forEach(name => {
  const dir = `src/plugins/${name}`
  plugins.push(name)

  const readme = `${dir}/readme.md`
  if (fs.isFile(readme)) {
    fs.rename(readme, `docs/${name}.md`)
  }

  const test = `${dir}/test.js`
  if (fs.isFile(test)) {
    fs.rename(test, `spec/${name}.js`)
  }

  const input = fs.readFile(`${dir}/${name}.js`)
  const output = ['', coreImport, '', input]
  fs.writeFile(`plugins/${name}.js`, output.join('\n'))

  fs.removeDir(dir)
})

// Import every plugin from the entry module.
plugins = plugins.map(name => `require('./plugins/${name}');`)
plugins.unshift('')
plugins.push('', `module.exports = require('./plugins/core');`, '')

// Export the Umbrella constructor.
fs.writeFile(fs.readFile('src/umbrella.js') + '\n\n' + 'module.exports = u;\n')

// Create the core module.
fs.rename('src/umbrella.js', 'plugins/core.js')
fs.rename('src/readme.md', 'docs/index.md')
fs.rename('src/test.js', 'spec/index.js')

// Create the entry module.
fs.writeFile('index.js', plugins.join('\n'))

// Remove the 'src' directory
fs.removeDir('src')

