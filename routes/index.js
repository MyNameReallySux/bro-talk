
var count = 0;

module.exports.context = {
	name: "About",
	title: "About Page",
	route_url: "/arbitrary"
}

module.exports.router = function(router, context, modules){	
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