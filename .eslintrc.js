module.exports = {
	extends: ["eslint:recommended", "prettier"],
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": ["error", { useTabs: true }]
	},
	env: {
		node: true,
		amd: true,
		es6: true
	}
};
