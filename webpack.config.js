var distFolderPath = "dist",
    demoFolderPath = "demo",
    devFolderPath = "dev",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    Path = require('path'),
    dependencies = Object.keys(packageJson.dependencies);

module.exports = {

    debug: isProduction(false, true),

    devtool: isProduction('source-map', 'eval'),

    entry: getEntry(),

    output: getOutput(),

    resolve: {
        root: Path.resolve(__dirname),
        alias: {
           // 'browse-views': Path.join( __dirname, 'src/js/browse'),
            'html': Path.join(__dirname, 'src/html'),
            'config': Path.join(__dirname, 'src/config'),
            'nls': Path.join(__dirname, 'src/nls'),
            'common': Path.join(__dirname, 'src/js/common'),
            'utils': Path.join(__dirname, 'src/js/utils'),
            'models': Path.join(__dirname, 'src/js/models'),
            'browse': Path.join(__dirname, 'src/js/browse'),
            'node_modules': Path.join(__dirname, 'node_modules'),
            'dist': Path.join(__dirname, 'dist'),
            'bootstrap-table': Path.join(__dirname, 'node_modules/bootstrap-table/dist/bootstrap-table.min.js'),
             handlebars: Path.join(__dirname, 'node_modules/handlebars/dist/handlebars.js'),
            jquery: Path.join(__dirname, 'node_modules/jquery/dist/jquery'),
            'fenix-ui-filter': Path.join(__dirname, 'node_modules/fenix-ui-filter/src/js/index.js'),
           'fenix-ui-dashboard': Path.join(__dirname, 'node_modules/fenix-ui-dashboard/src/js/index.js')
           //'fenix-ui-chart-creator': Path.join(__dirname, 'node_modules/fenix-ui-chart-creator/src/js/index.js')
        }
    },

    externals: isProduction(dependencies, undefined),

    module: {
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader"},
            { test: /\.hbs$/,
                loader: 'handlebars-loader',
                query: {
                    helperDirs: [
                        Path.join(__dirname, 'src/html/helpers')
                    ]}},
          //  {test: /\.hbs$/, loader: "handlebars-loader"},
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

    plugins: clearArray([
        new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
        isProduction(new CleanWebpackPlugin([distFolderPath]), undefined),
        isProduction(new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        })),
        isDevelop(new HtmlWebpackPlugin({
            inject: "body",
            chunks: [getSection()],
            template: devFolderPath + "/" + getSection() + ".template.html"

        }))

    ])
};

function getEntry() {

    var entry = {},
        section = getSection(),
        sections = getSections() || [];

    if (sections.length === 0 ) {
        sections.push(section);
    }

    for (var i = 0 ; i<sections.length;i++ ) {
        entry[sections[i]] = ["./src/js/" + sections[i] + ".js"];
    }

    return entry;
}

function getOutput() {

    var output;

    switch (getEnvironment()) {

        case "production" :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: "[name]/" +packageJson.name + '.[name].[hash].min.js',
                chunkFilename: "[name]/" +'chunk-[id].' + packageJson.name + '.[name].[hash].min.js',
                libraryTarget: 'amd'
            };
            break;
        case "develop" :
            output = {
                path: Path.join(__dirname, devFolderPath),
                filename: "[name].js"
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

function isTest(valid, invalid) {

    return isEnvironment('develop') ? valid : invalid;
}

function isDemo(valid, invalid) {

    return isEnvironment('demo') ? valid : invalid;
}

function isEnvironment(env) {
    return getEnvironment() === env;
}

function getEnvironment() {
    return process.env.NODE_ENV;
}

// sections

function getSection() {
    return process.env.SECTION;
}

function getSections() {
    return (typeof process.env.SECTIONS!="undefined") ? process.env.SECTIONS.split(",") : undefined;
}