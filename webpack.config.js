module.exports = {
  devtool: 'inline-source-map',
  entry: {
    p4: './static/js/src/main.js'
  },
  output: {
    path: __dirname + '/static/bin',
    filename: '[name].js'
  },
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
