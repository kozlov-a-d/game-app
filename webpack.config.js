var Encore = require('@symfony/webpack-encore');
var path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

Encore
    .setOutputPath('build/')
    .setPublicPath('/')
    .addEntry('app', './game/app.js')
    .enableSingleRuntimeChunk()
    .enableSassLoader()
    .copyFiles([
        { from: './game/assets/models', to: './assets/models/[path][name].[ext]' },
        { from: './game/assets/audio', to: './assets/audio/[path][name].[ext]' },
        { from: './game/assets/images', to: './assets/images/[path][name].[ext]' }
    ])
    
;

// var config;

Encore.addPlugin( new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    server: { baseDir: ['./'] }
}) );

module.exports = Encore.getWebpackConfig();