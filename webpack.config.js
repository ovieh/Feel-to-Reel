const path = require('path');
// webpack.config.js 
const Dotenv = require('dotenv-webpack');


module.exports = {
  entry: './public/assets/js/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public/assets/js/'),
  },
  plugins: [
    new Dotenv({
      path: './.env', // Path to .env file (this is the default) 
      safe: true // load .env.example (defaults to "false" which does not use dotenv-safe) 
    })
  ]
};