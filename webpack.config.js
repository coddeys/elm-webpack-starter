const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const Dashboard = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entryPath = path.join(__dirname, 'src/index.js');
const outputPath = path.join(__dirname, 'dist');

const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';
const outputFilename = TARGET_ENV === 'production' ? '[name]-[hash].js' : '[name].js';

const devHost = '0.0.0.0';
const devPort = '8080';

console.log('WEBPACK GO!');

const commonConfig = {
  output: {
    path: outputPath,
    filename: `${outputFilename}`
  },

  resolve: {
    extensions: ['.js', '.elm']
  },

  module: {
    rules: [
      {
        test: /Styles\.elm$/,
        use: [
          'style-loader',
          'css-loader',
          'elm-css-webpack-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/static/index.html',
      inject: 'body',
      filename: 'index.html'
    })
  ]
};

const devConfig = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    entryPath
  ],

  devServer: {
    historyApiFallback: true,
    contentBase: './src',
    host: devHost,
    port: devPort,
    stats: 'errors-only'
  },

  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/, /Styles\.elm/],
        use: [
          'elm-hot-loader',
          'elm-webpack-loader'
        ]
      }
    ]
  },

  plugins: [
    new Dashboard()
  ]
};

const prodConfig = {
  entry: entryPath,

  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/, /Styles\.elm/],
        use: 'elm-webpack-loader'
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/static/img',
        to: 'static/img'
      }
      // {
      //   from: 'src/favicon.ico'
      // }
    ]),

    new webpack.optimize.OccurrenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compressor: { warnings: false }
    })
  ]
};

if (TARGET_ENV === 'development') {
  console.log('Serving locally...');

  module.exports = merge(commonConfig, devConfig);
} else if (TARGET_ENV === 'production') {
  console.log('Building for production...');

  module.exports = merge(commonConfig, prodConfig);
}
