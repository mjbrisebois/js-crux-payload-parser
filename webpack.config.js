const webpack			= require('webpack');
const TerserPlugin		= require('terser-webpack-plugin');

module.exports = {
    target: "web",
    // mode: "development",
    mode: "production",
    entry: [ "./src/browser.js" ],
    resolve: {
	mainFields: ["main"],
    },
    output: {
	filename: "crux-payload-parser.bundled.js",
	globalObject: "this",
	library: {
	    "name": "CruxPayloadParser",
	    "type": "umd",
	},
    },
    stats: {
	colors: true
    },
    devtool: "source-map",
    optimization: {
	minimizer: [
	    new TerserPlugin({
		terserOptions: {
		    keep_classnames: true,
		},
	    }),
	],
    },
};
