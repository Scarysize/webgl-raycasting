const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname)
  },
  devServer: {
    contentBase: path.resolve(__dirname),
    host: '0.0.0.0'
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
            plugins: [
              ['transform-react-jsx', {pragma: 'h'}],
              'transform-object-rest-spread'
            ],
            presets: ['env']
          }
        }
      }
    ]
  }
};
