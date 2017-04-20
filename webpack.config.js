const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname)
  },
  devServer: {
    contentBase: path.resolve(__dirname)
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.glsl$/,
        use: {
          loader: 'webpack-glsl-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['transform-object-rest-spread'],
            presets: ['env']
          }
        }
      }
    ]
  }
};
