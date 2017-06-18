import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import scss from 'rollup-plugin-scss'

export default {
  format: 'iife',
  sourceMap: process.env.NODE_ENV === 'production' ? false : 'inline',
  useStrict: false,
  plugins: [
    commonjs(),
    resolve({ jsnext: true }),
    scss(),
    buble({
      jsx: 'h',
      exclude: ['node_modules/**'],
    }),
    uglify(),
  ],
  onwarn: function (message) {
    if (/Use of `eval` \(in .*\/node_modules\/firebase\/.*\) is strongly discouraged/.test(message)) {
      return
    }
  },
}
