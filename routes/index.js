const router = require("express").Router()

var count = 0;

module.exports.config = {
	name: "About",
	title: "About Page"
}

module.exports.init = function(context, onFinished){
	var modules = context.modules || {}
	
	router.get('/', (req, res, next)=>{
		count++;
		next();
	})
	router.get('/', modules.mcache(5), (req, res, next)=>{	   
		res.send({
			message: `Success ${count}`
		});
	})
	onFinished(router)
}

module.exports = ()=>{
	this.config = {}
	this.init = ()=>{
		
	}
}