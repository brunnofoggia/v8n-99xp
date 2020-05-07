import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import { version } from './package.json';

const globals = {
  'v8n': 'v8n',
};

const now = new Date();
const year = now.getFullYear();

const banner = `/**
* @license
* v8n 99xp
* ----------------------------------
* v${version}
*
* Copyright (c)${year} Bruno Foggia, 99xp.
* Distributed under MIT license
*
* https://v8n.99xp.org
*/\n\n`;

const footer = '';

export default [
  {
    input: 'src/v8n-99xp.js',
    external: ['v8n'],
    output: [
      {
        file: 'lib/v8n-99xp.js',
        format: 'umd',
        name: 'v8nx',
        exports: 'named',
        sourcemap: true,
        globals,
        banner,
        footer
      },
      {
        file: 'lib/v8n-99xp.esm.js',
        format: 'es'
      }
    ],
    plugins: [
      eslint({ exclude: ['package.json'] }),
      json(),
      babel()
    ]
  },
  {
    input: 'src/v8n-99xp.js',
    external: ['v8n'],
    output: [
      {
        file: 'lib/v8n-99xp.min.js',
        format: 'umd',
        name: 'v8nx',
        exports: 'named',
        sourcemap: true,
        globals,
        banner,
        footer
      }
    ],
    plugins: [
      json(),
      babel(),
      terser({ output: { comments: /@license/ }})
    ]
  }
]