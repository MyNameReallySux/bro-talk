const memoryCache = require("memory-cache");

module.exports = function(duration){
	return (req, res, next)=>{
		let key = '__brotalk__' + req.originalUrl || req.url
		let cachedBody = memoryCache.get(key)
		if (cachedBody) {
			res.send(cachedBody)
		 	return
		} else {
		 	res.sendResponse = res.send
		 	res.send = (body) => {
			memoryCache.put(key, body, duration * 1000);
			res.sendResponse(body)
		  }
		  next()
		}
	}
}