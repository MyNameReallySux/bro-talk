const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//require('mongoose-html').loadType(mongoose);
//const Html = mongoose.Types.Html;

exports.schema = {
	name: {
		type: String,
		required: [true, 'Name field is required']
	},
	code_name: {
		type: String,
		unique: true,
		required: [true, 'Codename field is required']
	},
	content: {
		type: String
	},
	template: {
		type: String
	}
}