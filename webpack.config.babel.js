import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    mode: 'development',
    entry: {
        bundle:[
            'regenerator-runtime/runtime',
            path.resolve(__dirname)
        ],
        tests:[
            path.resolve(__dirname,'index.spec.js')
        ]
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js','.jsx']
    },
    plugins:[
        new HtmlWebpackPlugin()
    ],
    module: {
        rules: [{
            test: /\.jsx?/,
            loader:'babel-loader'
        }, {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }]
    }
}