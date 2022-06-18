const path = require("path");
const outputPath = path.resolve(__dirname, "dist");

module.exports = {
	entry: {
		"main": path.resolve(__dirname, "src/main.js"),
	},
	output: {
		path: outputPath,
		publicPath: "/",
		filename: "[name].js"
	},
	devServer: {
		static: {
			directory: outputPath
		}
	},
	devtool: "source-map"
};