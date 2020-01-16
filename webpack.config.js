var Encore = require('@symfony/webpack-encore');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

Encore
    .setOutputPath('build/')
    .setPublicPath('/')
    .addEntry('index', './src/index.ts')
    .enableSingleRuntimeChunk()
    .enableSassLoader()
    .enableTypeScriptLoader()
    .copyFiles([
        { from: './src/assets/models', to: './assets/models/[path][name].[ext]' },
        { from: './src/assets/audio', to: './assets/audio/[path][name].[ext]' },
        { from: './src/assets/images', to: './assets/images/[path][name].[ext]' }
    ])
    
;

Encore.addPlugin( new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    server: { baseDir: ['./'] }
}) );

var config = Encore.getWebpackConfig();

// config.mode = "production";

module.exports = config;