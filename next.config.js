const path = require('path')

module.exports = {
    env: {
      NEXT_APP_ENV: 'development',
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
  }