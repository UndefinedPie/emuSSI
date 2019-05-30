const fs = require("fs");
const path = require("path");
const exports = (html, config) => {
	const { virtualPath, expr } = config;

	if (!virtualPath && !expr) return;

	const ssiIncludes = html.match(/<!--(.*?)#(.*?)include(.*?)-->/gi);

	if (Array.isArray(ssiIncludes)) {
		ssiIncludes.forEach(ssiInc => {
			const virtualRegExp = new RegExp(
				`virtual=("|')${virtualPath}(.*?)?(.*?)("|')`,
				`gi`
			);

			const ssiIncMatch = ssiInc.match(virtualRegExp);
			const ssiIncName = Array.isArray(ssiIncMatch) && ssiIncMatch[2];
			const ssiIncPath = virtualPath && ssiIncName && virtualPath + virtualPath;
			const fileName =
				path.join(__dirname).split("node_modules")[0] + ssiIncPath;
			const ssiExpr = new RegExp(
				`<!--# if expr="${expr.replace("${ID}", fileName)}(.*?)endif-->`,
				`gi`
			);
			const ssiExprMatch = html.match(ssiExpr);

			try {
				fs.accessSync(fileName, fs.constants.R_OK);
				html = html.replace(ssiInc, fs.readFileSync(fileName, "utf8"));
				if (ssiExprMatch && ssiExprMatch[0]) {
					html = html.replace(ssiExprMatch[0], "");
				}
			} catch (err) {
				html = html.replace(ssiInc, "");
			}
		});
	}
	return html;
};

module.exports = exports;
