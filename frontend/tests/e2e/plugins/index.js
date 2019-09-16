// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

/* eslint-disable import/no-extraneous-dependencies, global-require, arrow-body-style */
const webpack = require('@cypress/webpack-preprocessor')

function getRuleForTypeScript (rules) {
  return rules.find(rule => `${rule.test}`.includes('ts'))
}

function removeBabelRule (rule) {
  const babelRuleIndex = rule.use.findIndex(
    item => item.loader === 'babel-loader'
  )
  if (babelRuleIndex === -1) {
    // eslint-disable-next-line no-console
    console.warn('Warning: babel-loader rule not found!')
  }
  rule.use.splice(babelRuleIndex, 1)
}

module.exports = (on, config) => {
  const webpackOptions = require('@vue/cli-service/webpack.config')

  // For whatever reason the rules for *.ts files contain additional
  // babel loader which messes up completely the possibility to do imports
  // using ES6 modules. The following code removes the babel loader rule
  removeBabelRule(getRuleForTypeScript(webpackOptions.module.rules))

  on(
    'file:preprocessor',
    webpack({
      webpackOptions,
      watchOptions: {}
    })
  )

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js'
  })
}
