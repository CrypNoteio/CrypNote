const path = require('path')
// const webpack = require("webpack");
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  lintOnSave: false,
  publicPath: '/',
  assetsDir: 'static',
  outputDir: "dist", 
  filenameHashing: false,
  productionSourceMap:false,
  devServer: {
    open: false,
    host: 'localhost',
    port: 8081,
    https: false,
    hotOnly: false,
    before: app => {}
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
        return {
            plugins: [new CompressionPlugin({
                test: /\.js$|\.html$|\.css/,
                threshold: 10240,
                deleteOriginalAssets: false
            })]
        }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        path.resolve(__dirname, './src/assets/style/*.scss')      
      ]
    }
  }
}
