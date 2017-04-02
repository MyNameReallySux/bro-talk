const db = require("mongoose-simpledb").db

var count = 0;

module.exports.options = {
	passed_context: "route"
}

module.exports.router = function(router, context, imports){
	router.get('/', imports.mcache(5), (req, res, next)=>{	 
		res.send({ message: "/api route successful"});
	})
	return router
}