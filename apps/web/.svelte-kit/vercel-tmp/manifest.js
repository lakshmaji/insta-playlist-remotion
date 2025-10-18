export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.C_bV-u2w.js",app:"_app/immutable/entry/app.B0Pzu6LM.js",imports:["_app/immutable/entry/start.C_bV-u2w.js","_app/immutable/chunks/WSwo01ig.js","_app/immutable/chunks/BYdoWPA9.js","_app/immutable/chunks/79o8AcDu.js","_app/immutable/chunks/CxwLerF_.js","_app/immutable/chunks/o-I0iiF6.js","_app/immutable/entry/app.B0Pzu6LM.js","_app/immutable/chunks/79o8AcDu.js","_app/immutable/chunks/CxwLerF_.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/BYdoWPA9.js","_app/immutable/chunks/o-I0iiF6.js","_app/immutable/chunks/bt7INzFy.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
