if (typeof module === "object" && module.exports) { // CommonJS
	require("krunch-cache").KrunchCacheSW();
} else {
	importScripts("krunch+cache_init.js");
}
