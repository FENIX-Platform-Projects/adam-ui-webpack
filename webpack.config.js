var distFolderPath = "dist",
    devFolderPath = "dev",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    Path = require('path'),
    sections = getSections();

module.exports = sections.map(function (section) {

    var entry = {};
    entry[section] = ["./src/js/" + section + ".js"];

    return {

        debug: isProduction(false, true),

        devtool: isProduction('source-map', 'eval'),

        entry: entry,

        output: getOutput(section),

        resolve: {
            root: Path.resolve(__dirname),
            alias: {
                'bootstrap-table': Path.join(__dirname, 'node_modules/bootstrap-table/dist/bootstrap-table.min.js'),
                'handlebars': Path.join(__dirname, 'node_modules/handlebars/dist/handlebars.js'),
                'jquery': Path.join(__dirname, 'node_modules/jquery/dist/jquery'),
                'jQuery.print': Path.join(__dirname, 'node_modules/jQuery.print/jQuery.print.js'),
                'html2canvas': Path.join(__dirname, 'node_modules/html2canvas/dist/html2canvas.js'),
                'html': Path.join(__dirname, 'src/html'),
                'css': Path.join(__dirname, 'src/css'),
                'config': Path.join(__dirname, 'src/config'),
                'nls': Path.join(__dirname, 'src/nls'),
                'common': Path.join(__dirname, 'src/js/common'),
                'utils': Path.join(__dirname, 'src/js/utils'),
                'models': Path.join(__dirname, 'src/js/models'),
                'browse': Path.join(__dirname, 'src/js/browse'),
                'compare': Path.join(__dirname, 'src/js/compare'),
                'priority': Path.join(__dirname, 'src/js/priority'),
                'partner-matrix':Path.join(__dirname, 'src/js/partner-matrix'),
                'comp-advantage':Path.join(__dirname, 'src/js/comp-advantage'),
                'projects':Path.join(__dirname, 'src/js/projects'),
                'partner-profiles':Path.join(__dirname, 'src/js/partner-profiles'),
                'node_modules': Path.join(__dirname, 'node_modules'),
                'fenix-ui-chart-creator': Path.join(__dirname, 'node_modules/fenix-ui-chart-creator/src/js/index.js'),
                //'fenix-ui-table-creator': Path.join(__dirname, 'node_modules/fenix-ui-table-creator/src/js/index.js'),
                //'fenix-ui-map-creator': Path.join(__dirname, 'node_modules/fenix-ui-map-creator/src/js/index.js'),
                //'fenix-ui-pivotator-utils':  Path.join(__dirname, 'node_modules/fenix-ui-pivotator-utils/src/js/index.js')
                //'fenix-ui-dashboard': Path.join(__dirname, 'node_modules/fenix-ui-dashboard/src/js/index.js'),
                'jvenn': Path.join(__dirname, 'node_modules/jvenn/src/jvenn.min.js')
                //'fenix-ui-table-creator': Path.join(__dirname, 'node_modules/fenix-ui-table-creator/src/js/index.js')
                //'fenix-ui-chart-creator': Path.join(__dirname, 'node_modules/fenix-ui-chart-creator/src/js/index.js')
              }
        },

        module: {
            noParse: [Path.join(__dirname, 'node_modules/html2canvas/dist/html2canvas.js'),
                      Path.join(__dirname, 'node_modules/chokidar/lib/fsevents-handler.js'),
                      Path.join(__dirname, 'node_modules/html-webpack-plugin/CHANGELOG.md'),
                      Path.join(__dirname, 'node_modules/html-webpack-plugin/index.js')],
            loaders: [
               isProduction(
                    {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
                    {test: /\.css$/, loader: "style-loader!css-loader"}
                ),
               /* {
                    test: /\.scss$/,
                    loaders: ["style-loader", "css-loader", "sass-loader?config=otherSassLoaderConfig"]
                },*/
                { test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    query: {
                        helperDirs: [
                            Path.join(__dirname, 'src/html/helpers')
                        ]}},
                {test: /\.json/, loader: "json-loader"},
                {test: /\.png$/, loader: "url-loader?limit=100000"},
                {test: /\.jpg$/, loader: "file-loader?name=[name].[ext]&limit=100000"},
                {test: /\.svg/, loader: "file-loader?name=[name].[ext]&limit=100000"},
                {test: /\.gif/, loader: "file-loader?name=[name].[ext]&limit=100000"},

                //Bootstrap loader
                {test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery'},
                {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
                {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
                {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
                {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"}
            ]
        },
        node: {
            fs: "empty"
        },
        plugins: clearArray([
            new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
            isProduction(new CleanWebpackPlugin([distFolderPath]), undefined),
            isProduction(new webpack.optimize.UglifyJsPlugin({
               compress: {warnings: false},
               output: {comments: false}
            })),
            isProduction(new ExtractTextPlugin(section + "/" + packageJson.name + "." + section + '.min.css')),
            isDevelop(new HtmlWebpackPlugin({
                inject: "body",
                chunks: [section],
                template: devFolderPath + "/" + section + ".template.html"
            }))
        ])
    }
});

function getOutput(section) {

    var output;


    switch (getEnvironment()) {


        case "production" :
            output = {
                path: Path.join(__dirname, distFolderPath),
                publicPath: 'http://fenixrepo.fao.org/adam/',
                filename: "[name]/" + packageJson.name + '.[name].min.js',
                chunkFilename: "[name]/" + section+'-chunk-[id].' + packageJson.name + '.[name].min.js'
            };
            break;
        case "develop" :
            output = {
                path: Path.join(__dirname, devFolderPath),
                filename: "[name].js",
                chunkFilename: "[name]/" + section+'-chunk-[id].' + packageJson.name + '.[name].min.js'
            };
            break;
        default :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: "index.js"
            };
            break;
    }

    return output;
}

// utils

function clearArray(array) {

    var result = [];

    array.forEach(function (s) {
        s ? result.push(s) : null;
    });

    return result;

}

function isProduction(valid, invalid) {

    return isEnvironment('production') ? valid : invalid;
}

function isDevelop(valid, invalid) {

    return isEnvironment('develop') ? valid : invalid;
}

function isEnvironment(env) {
    return getEnvironment() === env;
}

function getEnvironment() {
    return process.env.NODE_ENV;
}

// sections

function getSections() {
    return (typeof process.env.SECTIONS != "undefined") ? process.env.SECTIONS.split(",") : undefined;
}