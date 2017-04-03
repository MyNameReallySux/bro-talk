
var count = 0;

module.exports.context = {
	name: "About",
	title: "About Page",
	description: "This is the about page",
	route_url: "/arbitrary"
}

module.exports.router = function(router, context, imports){	
	router.get('/', (req, res, next)=>{
		count++;
		next();
	})
	router.get('/', modules.mcache(5), (req, res, next)=>{	   
		res.send({
			message: `Success ${count}`
		});
	})
	return router
}