const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = require('mongoose-simpledb').Types.ObjectId;

exports.schema = {
	code_name: {
		type: String,
		unique: true,
		required: [true, 'Codename field is required']
	},
	count: {
		type: Number,
		default: 0
	}
}