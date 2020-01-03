var Encore = require('@symfony/webpack-encore');
var path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

Encore
    .setOutputPath('build/')
    .setPublicPath('/')
    .addEntry('app', './game/app.js')
    // .enableSingleRuntimeChunk()
    .enableSassLoader()
    .copyFiles( [{ from: './game/audio', to: './audio/[path][name].[ext]' } ])
    
;

// var config;

Encore.addPlugin( new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    server: { baseDir: ['./'] }
}) );

module.exports = Encore.getWebpackConfig();