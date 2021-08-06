import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.js',
  output: [
    {
      file: 'fbscheme.js',
      format: 'iife',
      globals: { 'loglevel': 'log' },
      name: 'FizzBuzzScheme',
      plugins: [nodeResolve()]
    }
  ]
}
