const fs = require("fs");
const path = require("path");
const exports = (html, config) => {
	const virtualPathRegexp = new RegExp(
		`<!--#include virtual="/${config.virtualPath}/(.*?)" wait="yes"-->`,
		"gi"
	);
	const ssiIncludes = html.match(virtualPathRegexp);
	if (Array.isArray(ssiIncludes)) {
		ssiIncludes.map(item => {
			let rbPath = item.split('"')[1].split("?")[0];
			let id = rbPath.split(`/${config.virtualPath}/`)[1];
			let fileName = path.join(__dirname).split("node_modules")[0] + rbPath;
			let ssiEmptyRegexp = new RegExp(
				`<!--# if expr="(.)SLOT_${id}(.*?)endif-->`,
				"gi"
			);
			let ssiEmptyExpr = html.match(ssiEmptyRegexp);
			try {
				fs.accessSync(fileName, fs.constants.R_OK);
				html = html.replace(item, fs.readFileSync(fileName, "utf8"));
				if (ssiEmptyExpr[0]) {
					html = html.replace(ssiEmptyExpr[0], "");
				}
			} catch (err) {
				html = html.replace(item, "");
			}
		});
	}
	return html;
};

module.exports = exports;
