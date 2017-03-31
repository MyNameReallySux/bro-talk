const fs = 				require("fs")
const path = 			require("path")
const package = 		require("./package.json")
const util = 			require("util")

const express = 		require("express")
const mongoose = 		require('mongoose');
const bodyParser = 		require("body-parser")
const cookieParser = 	require("cookie-parser")
const compression = 	require("compression")
const logger = 			require('morgan');

const Page = 			require("./models/page")

const utils = 			require("./modules/utils")
const simpleRoute =		require("./modules/routes")

var app = express()
var conx = 'mongodb://localhost/bro-talk'

mongoose.connect(conx)
mongoose.Promise = global.Promise

var simpledb = require('mongoose-simpledb');

app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.set('routes', path.join(__dirname, 'routes'))

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(cookieParser())
app.use(compression())
app.use(logger("dev"))

app.use(express.static(path.join(__dirname, 'public'), { 
    dotfiles: 'ignore', 
    etag: false,
    extensions: ['htm', 'html'],
    index: false }
));

simpledb.init({
	modelsDir: path.join(__dirname, 'models'),
	connectionString: conx
}, (err, db)=>{	
	app.get("/", (err, res, req, next)=>{
		res.set('Cache-Control', `max-age=${5}`)
	})
	simpleRoute.init(app, package, {})
});

app.listen(app.get('port'), ()=>{
	console.log(`App is running on port ${app.get('port')}`)
})