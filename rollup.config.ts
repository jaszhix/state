import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
// @ts-ignore
import pkg from './package.json';

const moduleVersion = 'v' + pkg.version;
const buildEnvironment = process.env.BUILD === 'development' ? 'development' : 'production';

// tslint:disable-next-line:no-default-export
export default {
  external: Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {})),
  input: 'src/index.ts',
  output: {
    banner: '/* ' + pkg.name + ' ' + moduleVersion + ' */',
    file: pkg.module,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    json({
      include: 'package.json',
      preferConst: true,
    }),
    replace({
      ENVIRONMENT: buildEnvironment,
      delimiters: ['<@', '@>'],
    }),
    typescript({
      verbosity: 2,
      clean: true,
      useTsconfigDeclarationDir: true
    }),
    filesize(),
  ],
  watch: {
    clearScreen: false,
  },
};