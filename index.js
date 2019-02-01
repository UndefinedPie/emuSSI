const fs = require("fs");
const path = require("path");
module.exports = (RenderTemplate, config) => {
	const virtualPathRegexp = new RegExp(`<!--#include virtual="\/${config.virtualPath}\/(.*?)" wait="yes"-->`, "gi");
	const ssiIncludes = RenderTemplate.match(virtualPathRegexp);
	if (Array.isArray(ssiIncludes)) {
		ssiIncludes.map(item => {
			let rbPath = item.split('"')[1].split("?")[0];
			let id = rbPath.split(`/${config.virtualPath}/`)[1];
			let fileName = path.join(__dirname).split("node_modules")[0] + rbPath;
			let ssiEmptyRegexp = new RegExp(`<!--# if expr="(.)SLOT_${id}(.*?)endif-->`, "gi");
			let ssiEmptyExpr = RenderTemplate.match(ssiEmptyRegexp);
			try {
				fs.accessSync(fileName, fs.constants.R_OK);
				RenderTemplate = RenderTemplate.replace(
					item,
					fs.readFileSync(fileName, "utf8")
				);
				if (ssiEmptyExpr[0]) {
					RenderTemplate = RenderTemplate.replace(ssiEmptyExpr[0], "");
				}
			} catch (err) {
				RenderTemplate = RenderTemplate.replace(item, "");
			}
		});
	}
	return RenderTemplate;
};
