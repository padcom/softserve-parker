const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/styles/common/*.scss')]
    }
  },
  devServer: {
    proxy: {
      '/login': { target: 'http://localhost:3000/login' },
      '/logout': { target: 'http://localhost:3000/logout' },
      '/signup': { target: 'http://localhost:3000/signup' },
      '/confirm-registration': { target: 'http://localhost:3000/confirm-registration' },
      '/graphql': { target: 'http://localhost:3000/graphql' }
    }
  }
}
