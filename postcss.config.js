module.exports = {
	plugins: [
		require('autoprefixer')({
			grid: true,
			flex: true
		}),
		require('precss'),
		require('postcss-preset-env'),
	]
}