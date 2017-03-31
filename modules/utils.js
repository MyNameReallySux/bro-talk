var util = require('util');

String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.singularize = function(){
    if(this.charAt(this.length - 1) == 's') {
        return this.slice(0, this.length - 1);
    } else {
        return this;
    }
}

String.prototype.pluralize = function(){
    if(this.charAt(this.length - 1) != 's') {
        return this + 's';
    } else {
        return this;
    }
}

String.prototype.isEquivalentTo = function(value){
    var str = this.toString();
    str = str.toLowerCase();
    return str == value.singularize() || str == value.pluralize();
}      

String.prototype.splitBy = function(type){
    if(type.isEquivalentTo('word')){
        var words = this.split(" ");
        return words;
    } 
}

String.prototype.countBy = function(type){
    if(type.isEquivalentTo('word')){
        var count = this.split(" ");
        return count.length;
    } 
}

String.prototype.shortenBy = function(type, limit){
    if(type.isEquivalentTo('word')){
        var words = this.splitBy(type);
        if (words.length > limit) {
            var snippet = words.slice(0, limit)
            snippet = snippet.join(" ");
            snippet = snippet.trim() + " ...";
            return snippet;
        } else {
            return words.join(" ");
        } 
    } 
}

isSet = function(variable){
    return (typeof variable != undefined)
        && variable !== null 
        && variable != ''
        && variable != undefined;
}

isString = function(variable){
    return (typeof variable == "string" && isSet(variable));
}

isNum = function(variable){
    return (typeof variable == "number" && isSet(variable));
}

isArray = function(variable){
    return (util.isArray(variable) && isSet(variable));
}

.isFunction = function(variable){
    return variable && {}.toString.call(variable) === '[object Function]';
}

isObject = function(variable){
    return (typeof variable == "object" && isSet(variable));
}

getErrorMsg = function(req, res, err){
    errorMap = {
        404 :   "There was no page found at '" + req + "'.",
        500 :   "There was an internal server error. Please send an email to " + require() + "<" + owner
    }
}

logopts = {
    showHidden: true,
    depth: 3,
    colors: true
}

module.exports = this;