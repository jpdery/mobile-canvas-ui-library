"use strict"

var prime = require('prime')
var Point = require('./point')
var Size  = require('./size')

var Rect = module.exports = prime({

	constructor: function(x, y, w, h) {

		var rect = arguments[0]
		if (rect instanceof Rect) {
			x = rect.origin.x
			y = rect.origin.y
			w = rect.size.x
			h = rect.size.y
		}

		this.__origin = new Point(x, y)
		this.__size = new Size(w, h)

		return this
	}

})

prime.define(Rect.prototype, 'origin', {

	set: function(value) {
		var origin = this.__origin
		origin.x = value.x
		origin.y = value.y
	},

	get: function() {
		return new Point(this.__origin)
	}

})

prime.define(Rect.prototype, 'size', {

	set: function(value) {
		var size = this.__size
		size.x = value.x
		size.y = value.y
	},

	get: function() {
		return new Size(this.__size)
	}

})

Rect.union = function(r1, r2) {
     var x1 = Math.min(r1.origin.x, r2.origin.x)
     var y1 = Math.min(r1.origin.y, r2.origin.y)
     var x2 = Math.max(r1.origin.x + r1.size.x, r2.origin.x + r2.size.x)
     var y2 = Math.max(r1.origin.y + r1.size.y, r2.origin.x + r2.size.y)
     return new Rect(x1, y1, x2 - x1, y2 - y1)
}
