const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const utils = require('./utils')

var webpackConfig = {
  entry: utils.getEntry('src/**/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]-[hash:5].js',
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.jsx', '.json', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loaders: ['babel-loader'],
        // loaders: ['babel-loader', 'eslint-loader'],
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /.s[c|a]ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          { loader: 'sass-loader' }
        ],
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join('img', '[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join('media', '[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join('fonts', '[name].[ext]')
        }
      }
    ]
  },
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    compress: true,
    // 配置控制台打印
    stats: {
      hash: false,
      assets: false,
      version: false,
      modules: false
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}

// 在不同的页面中插入对应的js文件
var htmls = utils.getEntry('src/**/index.html')
var pages = Object.keys(htmls)
pages.forEach(filename => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${filename}/index.html`,
      template: htmls[filename],
      inject: true,
      chunks: [filename]
    })
  )
})

module.exports = webpackConfig
