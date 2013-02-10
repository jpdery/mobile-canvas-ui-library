"use strict"

var prime = require('prime')

var Point = require('../geom/point')

var Touch = module.exports = prime({

	constructor: function(target, x, y) {
		this.__identifier = Date.now()
		this.__setTarget(target)
		this.__setOrigin(x, y)
		return this
	},

	/* Private API */

	__setOrigin: function(x, y) {
		this.__origin = new Point(x, y)
		return this
	},

	__setTarget: function(target) {
		this.__target = target
		return this
	}

})

prime.define(Touch.prototype, 'identifier', {

	get: function() {
		return this.__identifier
	}

})

prime.define(Touch.prototype, 'target', {

	get: function() {
		return this.__target
	}

})

prime.define(Touch.prototype, 'origin', {

	get: function() {
		return new Point(this.__origin)
	}

})

