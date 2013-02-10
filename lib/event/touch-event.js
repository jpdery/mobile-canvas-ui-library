"use strict"

var prime = require('prime')
var array = require('prime/shell/array')

var Event = require('./event')

var TouchEvent = module.exports = prime({

	inherits: Event,

	constructor: function(type, bubbles, touches) {
		TouchEvent.parent.constructor.call(this, type, bubbles)
		this.__touches = array.slice(touches)
		return this
	}

})

prime.define(TouchEvent.prototype, 'touches', {

	get: function() {
		return this.__touches
	}

})
