const { babel } = require("@rollup/plugin-babel");

module.exports = {
	input: "./src/index.js",
	output: {
		file: "./dist/vue.js",
		name: "Vue", // 在全局添加Vue，这样就可以 new Vue()
		format: "umd", // esm cjs iife umd
		sourcemap: true,
	},
	plugins: [
		babel({
      presets: ["@babel/preset-env"],
			exclude: "node_modules/**",
			babelHelpers: "bundled",
		}),
	],
};
