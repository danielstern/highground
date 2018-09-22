import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
    entry: 'index.js',
    dest:'dist/bundle.js',
    format:'umd',
    output:{
        name:'highground'
    },
    external:[
        // 'react',
        // 'react-dom'
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        postcss({
           extensions: [ '.css' ],
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
    ],
}