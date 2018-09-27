var path = require('path')
var webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
  entry: './src/core/index.js',
  output: {
    filename: 'bee.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          //'eslint-loader'
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    //new UglifyJSPlugin()
  ]
}
