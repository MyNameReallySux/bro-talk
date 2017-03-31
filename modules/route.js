const Route = function(module, context, options){
	this.context = context
	this.module = module
	this.options = options
	_initialize()
}

_initialize = (function(){
	if(!this.item) this.item = Math.random()
}).bind(Route)

module.exports = Route