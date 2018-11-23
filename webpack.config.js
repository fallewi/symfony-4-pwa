// let path = require('path');
let Encore = require('@symfony/webpack-encore');
// let OfflinePlugin = require(path.resolve(process.cwd(), 'node_modules', 'offline-plugin'));
let OfflinePlugin = require('offline-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

Encore
// directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each 'page' of your app
     * (including one that's included on every page - e.g. 'app')
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if you JavaScript imports CSS.
     */
    .addEntry('app', './assets/js/app.js')
    // .addEntry('page1', './assets/js/page1.js')

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filename (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // enables Sass/SCSS support
    //.enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you're having problems with a jQuery plugin
    // .autoProvidejQuery()
    .addPlugin(new UglifyJsPlugin())
    .addPlugin(new OfflinePlugin({
        appShell: '/',
        strategy: 'changed',
        responseStrategy: 'network-first',
        publicPath: '/build/',
        ServiceWorker: {
            cacheName: 'ServiceWorkerSymfony4',
            events: !Encore.isProduction(),
            minify: !Encore.isProduction(),
            entry: './assets/js/sw.js',
            output: './../sw.js'
        },
        externals: [
            '/',
            '/favicon.ico',
            '/offline',
            '/test'
        ],
        excludes: [
            '**/.*',
            '**/*.map',
            '**/*.gz',
            '**/not-cached*'
        ],
        cacheMaps: [
            {
                match: function(requestUrl) {
                    console.log(requestUrl);
                    return new URL('/', location);
                },
                requestTypes: ['navigate']
            }
        ],
        caches: {
            main: [':rest:'],
            additional: [':externals:']
        },
        AppCache: null
    }))
;

module.exports = Encore.getWebpackConfig();