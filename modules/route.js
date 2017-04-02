const path = require("path")

const Strings = {
	errors: {
		override: {
			router: "New 'Route' instance must override 'router' method!"
		}
	}
}

class Route {
	constructor(file_path, context, imports){
		this.module = require(file_path)
		this.imports = imports
		
		if(this.module.router === undefined) throw new Error(Strings.errors.override.router)
		else this.router = this.module.router
		
		this.context = this._initContext(file_path, context)
		
		let router = require("express").Router()
		
		this.route = this.module.router(router, context, imports)	
	}
	
	_initContext(file_path, context){	
		const route_name = this._getRouteName(file_path)
		var default_context = {
			meta_title 			: context.name + " | " + route_name,
			meta_description 	: `This is the ${route_name} page! It needs a custom description!`,
			directory			: path.dirname(file_path),
			file_name			: path.basename(file_path, "js"),
			route_name			: route_name,
			route_url			: this._getParentRoute(context.dirs.route, file_path)
		}
		const custom_context = this.module.context
		const route_context = Object.assign({}, default_context, custom_context)
		
		return Object.assign({}, { app: context }, { route: route_context })
	}
	
	_getRouteName(file_path){
		var name = path.basename(file_path, ".js");
		name = name.toString()
		name = name.capitalize()
		return name
	}
	
	_getParentRoute(root, file_path){
		var name = path.basename(file_path, ".js");
		let dir, route
		if(name == "index"){
			dir = path.dirname(file_path);
			route = `${dir.split("routes")[1]}`;
		} else {
			dir = path.dirname(file_path);
			route = `${dir.split("routes")[1]}/${name}`;
		}
		if(route == "") route = "/";
		return `${route}`
	}
}

module.exports = Route
