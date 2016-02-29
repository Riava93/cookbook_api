'use strict';

const webpack = require('webpack');
const APP = __dirname;

module.exports = {
	content: APP,

	entry: {
		'server/public/js/bundle': './client/src/app.js'
	},

	output: {
		path: APP,
		filename: '[name].js'
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['react', 'es2015'],
					plugins: ['react-html-attrs']
				}
			},

			{
				test: /\.scss$/,
				loader: 'style!css!sass'
			}
		]
	},

	resolve: {
		extensions: ['', '.js', '.scss'],
		modulesDirectory: ['node_modules']
	}
};
