var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('/')
    // public path used by the web server to access the output path
    .setPublicPath('/build/')
    .addEntry('app', './src/app.js')
    .enableSingleRuntimeChunk()

    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you use Sass/SCSS files
    //.enableSassLoader()

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();