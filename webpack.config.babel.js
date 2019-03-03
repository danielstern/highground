import path from 'path';

export default {
    mode: 'development',
    entry: {
        tests:[
            path.resolve(__dirname,'index.spec.js')
        ],
        main:[
            path.resolve(__dirname,'index.js')
        ]
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    externals: {
        React:'react',
        ReactDOM:'react-dom',
    },
    devServer:{
        open:true,
        inline:true
    },
    resolve: {
        extensions: ['.js','.jsx']
    },
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