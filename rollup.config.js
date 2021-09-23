import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/fbs.js',
  output: {
    compact: true,
    file: 'dist/bundle.js',
    format: 'es'
  },
  plugins: [
    resolve(), // read node_modules
    commonjs() // convert cjs modules to ES6
  ]
}
