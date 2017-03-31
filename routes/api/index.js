const router = require("express").Router()
const db = require("mongoose-simpledb").db

var count = 0;

module.exports.init = function(context, onFinished){
	var modules = context.modules || {}
	var Page = db.Page

	router.get('/', modules.mcache(5), (req, res, next)=>{	 
		res.send({ message: "/api route successful"});
	})
	onFinished(router)
}