import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      compact: true,
      file: 'dist/fbs.bundle.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/fbs.bundle.min.js',
      format: 'es',
      plugins: [terser()]
    }
  ],
  plugins: [
    resolve(), // read node_modules
    commonjs() // convert cjs modules to ES6
  ]
}
