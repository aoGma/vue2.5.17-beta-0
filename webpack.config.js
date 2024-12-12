const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './examples/test/index.js', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist2'), // 输出目录
    filename: 'bundle.js', // 输出文件名
    publicPath: '/' // 用于开发服务器的虚拟路径
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      vue: path.resolve(__dirname, './dist/vue.js')
    }
  },
  devtool: 'inline-source-map', // 提供源码映射，方便调试
  devServer: {
    contentBase: path.resolve(__dirname, 'dist2'), // 静态文件目录
    port: 5001, // 开发服务器端口
    open: true, // 自动打开浏览器
    publicPath: '/' // 与 output.publicPath 保持一致
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/test/index.html',
      filename: 'index.html',
      inject: 'body'
    })
  ]
}
