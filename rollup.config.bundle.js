import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'iife',
  moduleName: 'greedy-cubes',
  plugins: [
    commonjs({
      include: 'node_modules/**',
    }),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ],
  dest: 'dist/index.js'
}
