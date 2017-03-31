const router = require("express").Router()
const db = require("mongoose-simpledb").db

var counter = 1;
var countStr = ""

function handleError(res, err){
	res.send(JSON.stringify({
		status: "error",
		error: err.message
	}, null, 4))
}

function handleData(res, obj){
	res.send(JSON.stringify({
		status: "success",
		data: obj
	}, null, 4))	
}

function updateData(res, page, data){
	var changed = {}
	var status = "updated"
	for(let [key, value] of entries(data)){
		if(page[key] != value){
			changed[key] = page[key]
			page[key] = value;
		}
	}
	if(!changed.length > 0){
		status = "no change"
		changed = undefined
	}
	page.save((err)=>{
		if(err) handleError(res, err)
	})
	res.send(JSON.stringify({
		status: status,
		data: page,
		changed: changed
	}, null, 4))	
}

function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}

function nextKey(code_name, onError, onNextKey){
	Keys = db.Keys
	Keys.findOne({code_name: code_name}, (err, key)=>{
		if(key == undefined){
			key = new Keys({
				code_name: code_name,
			})
			key.save((err)=>{
				if(err) onError(err)
			})
		}
		var count = key.count;
		count++;

		if(count > 1){
			code_name = `${code_name}_${count}`
		}
		key.count = count;
		key.save((err)=>{
			if(err) onError(err)
		})
		
		onNextKey(code_name)
	})
}

module.exports.init = function(context, onFinished){
	var modules = context.modules || {}
	const Page = db.Page

	router.get('/:page(\\d+)?', modules.mcache(5), (req, res, next)=>{	
		var page = req.params.page - 1 || 0
		var page_size = 10
		var skip = page * page_size
		Page.find({}, null, {
			skip: skip, 
			limit: page_size
		}).sort('code_name').exec((err, page)=>{
			if(err) handleError(res, err)
			else 	handleData(res, page)
		})
	})
	
	router.post('/', (req, res, next)=>{
		var name = req.body.name
		var code_name = `page_${name}`
		
		if(name){
			nextKey(code_name, (err)=>handleError(res, err), (code_name)=>{
				Page.create({
					name: name,
					code_name: code_name
				}, (err, page)=>{
					if(err) handleError(res, err)
					else 	handleData(res, page)
				})
			})
		} else {
			handleError({
				message: "No name field in request body."
			})
		}
		
	})
	
	router.put('/:code_name', (req, res, next)=>{
		var code_name = req.params.code_name;
		try {
			if(code_name.indexOf("page_") != 0){
				throw new Error("Must pass a page code name with put request.")
			}
			if(req.body == {}){
				throw new Error("Must pass a body with put request.")
			}
			Page.findOne({
				code_name: code_name 
			}, (err, page)=>{
				if(err) handleError(err)
				else {
					updateData(res, page, req.body)
				}
			})
		} catch(err){
			handleError(res, err)
		}
	})
	
	router.get('/:name', modules.mcache(5), (req, res, next)=>{
		var name = req.params.name;
		var code_name = "", value = ""
		if(name.indexOf("page_") == 0){
			 code_name = name
			 value = code_name
		} else {
			code_name = `page_${req.params.name}`
			value = new RegExp(code_name, 'i')
		}
		Page.find({
			code_name: value 
		}, (err, page)=>{
			if(err) handleError(res, err)
			else 	handleData(res, page)
		})
	})
	onFinished(router)
}