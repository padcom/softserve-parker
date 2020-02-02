const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [ path.resolve(__dirname, 'src/styles/common/*.scss') ],
    },
    moment: {
      locales: [ 'en' ],
    },
  },
  devServer: {
    proxy: {
      '/login': { target: 'http://localhost:3000/login' },
      '/logout': { target: 'http://localhost:3000/logout' },
      '/signup': { target: 'http://localhost:3000/signup' },
      '/confirm-registration': { target: 'http://localhost:3000/confirm-registration' },
      '/graphql': { target: 'http://localhost:3000/graphql' },
      '/': { target: 'http://localhost:3000/' },
    },
  },
  // pwa: {
  //   name: 'Parker',
  //   themeColor: '#4DBA87',
  //   msTileColor: '#000000',
  //   appleMobileWebAppCapable: 'yes',
  //   appleMobileWebAppStatusBarStyle: 'black',
  //   iconPaths: {
  //     favicon32: 'img/icons/favicon-32x32.png',
  //     favicon16: 'img/icons/favicon-16x16.png',
  //     appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
  //     maskIcon: 'img/icons/safari-pinned-tab.svg',
  //     msTileImage: 'img/icons/msapplication-icon-144x144.png'
  //   }
  // },
}
