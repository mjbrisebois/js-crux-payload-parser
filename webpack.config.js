const webpack			= require('webpack');
const TerserPlugin		= require('terser-webpack-plugin');

const WEBPACK_MODE		= process.env.WEBPACK_MODE || "production";
const FILENAME			= process.env.FILENAME || "crux-payload-parser.prod.js";


module.exports = {
    target: "web",
    mode: WEBPACK_MODE,
    entry: [ "./src/browser.js" ],
    resolve: {
	mainFields: ["main"],
    },
    output: {
	filename:	FILENAME,
	globalObject:	"this",
	library: {
	    "name":	"CruxPayloadParser",
	    "type":	"umd",
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
