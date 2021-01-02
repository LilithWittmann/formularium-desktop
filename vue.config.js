const WorkerPlugin = require('worker-plugin')

module.exports = {
    lintOnSave: true,
      configureWebpack: {
    plugins: [new WorkerPlugin()],

  },
    pluginOptions: {
    electronBuilder: {
        preload: { preload: 'src/preload.js' },
        chainWebpackRendererProcess: config => {
                config.module
                    .rule('node-loader')
                    .test(/\.node$/)
                    .use('node')
                    .loader('node-loader')
                config.resolve.alias.set(
                    'leveldown',
                    'leveldown/build/Release/leveldown.node'
                )
                return config
            },
        externals: ['keytar'],
    }
  },

  "transpileDependencies": [
    "vuetify"
  ]
};