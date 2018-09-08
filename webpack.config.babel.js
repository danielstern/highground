import path from 'path';

export default {
    mode: 'development',
    entry: {
        bundle:path.resolve(__dirname),
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js',
        publicPath: '/',
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