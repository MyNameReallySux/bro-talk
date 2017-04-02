const fs = require("fs")
const path = require("path")
const extend = require('extend')
const router = require("express").Router()

const Route = require("./route")

const mcache = require(`${path.dirname(require.main.filename)}/modules/mcache`)

/**
 * Module itself accepts no parameters. Must run the {@link init init} function
 * immediatly after to configure app.
 */
module.exports = (()=>{
	/**
	 * Initializes the application context, initializes all
	 * routes within designated `routes` folder.
	 * {@link _initialize initialize}
	 * @access public
	 * @param	{Object}   app 		| express app object
	 * @param	{Object}   package  | package.json                   
	 */
	this.init = ((app, package, options)=>{
		this.app = app
		this.package = package
		this.options = options
		_initialize(app, package)
	}).bind(this)
	
	/**
	 * Event hook, meant to be overridden by user. This function runs after the
	 * context is initialized, but before the routes are initialized.
	 * @access public              
	 */
	this.onCreate = (()=>{}).bind(this)
	
	/**
	 * Event hook, meant to be overridden by user. This function runs before any 
	 * other functions.
	 * @access public              
	 */
	this.onBeforeCreate = (()=>{}).bind(this)
	
	/**
	 * Event hook, meant to be overridden by user. This function runs after all
	 * initialization is complete. Note, you will most likely not be able to send 
	 * anything to the client after this stage.
	 * @access public              
	 */
	this.onAfterCreate = (()=>{}).bind(this)
	
	/**
	 * Initialization script run on app creation. Triggers all other initialization
	 * functions. 
	 * @access private
	 * @param	{Object}   req  | node.js request object
	 * @param	{Object}   res  | node.js response object
	 * @param	{Function} next | jump to next express middleware               
	 */
	_initialize = ((app, package)=>{
		this.onBeforeCreate()
		this.context = _initAppContext(app, package)
		this.imports = _initImports()
		this.settings = _initSettings()
		this.onCreate()
		this.routes = _initDirectory(this.context.dirs.route)
		this.onAfterCreate()	
	}).bind(this),
		
	/**
	 * Initialization script run on app creation. Triggers all other initialization
	 * functions.
	 * @access private
	 * @param	{Object} app 	  | express app object
 	 * @param	{Object} package  | package.json    
 	 * @returns {Object} returns the 'AppContext' object, containing information
 	 *                   about the app such as names, directories, etc.
	 */
	_initAppContext = (()=>{
		var app = this.app
		var package = this.package
		var options = this.options

		_defaultAppContext = {
			name: package.name,
			developer: package.author,
			version: package.version,
			urls: {
				homepage: package.homepage,
				bugs: package.bugs.url
			},
			dirs: {
				route: app.get("routes") || "routes",
				root: path.dirname(require.main.filename),
			}
		}
	
		var context = extend(options, _defaultAppContext)
		return context
	}).bind(this)
	
	_initImports = (()=>{
		return {
			mcache: mcache
		}
	}).bind(this)
	
	_initSettings = (()=>{
		return {
			cache_duration: 5,
			mcache_duration: 5,
		}
	}).bind(this)
	
	/**
	 * Initialization specific directory. Each directory will create a route matching
	 * the file system nesting. For example, `/${context.dirs.routes}/api/user.js`
	 * will handle routes `/api/user`, including routes with additional parameters.
	 * @access private
 	 * @param	{String} directory  | Absolute directory path.
	 */
	_initDirectory = ((directory)=>{		
		const files = fs.readdirSync(directory)
		files.forEach((file)=>{
			const file_path = `${directory}/${file}`
			const file_name = path.basename(file_path, "js")
			var stats = fs.statSync(file_path)
			if(stats.isDirectory()){
				_initDirectory(file_path)
			} else {
				let route = new Route(file_path, this.context, this.imports)
				this.app.use(route.context.route_url, route.route)
			}
		})
	}).bind(this)
	
	return this
})()