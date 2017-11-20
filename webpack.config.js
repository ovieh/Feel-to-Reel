const path = require('path');
// webpack.config.js 
const Dotenv = require('dotenv-webpack');
const ASSET_PATH = process.env.ASSET_PATH || '/';


module.exports = {
  entry: './public/assets/js/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ASSET_PATH
  },
  plugins: [
    new Dotenv({
      path: './.env', // Path to .env file (this is the default) 
      safe: true // load .env.example (defaults to "false" which does not use dotenv-safe) 
    })
  ]
};