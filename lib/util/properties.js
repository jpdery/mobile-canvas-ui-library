"use strict"

var prime = require('prime')
var mixin = require('prime-util/prime/mixin')

var Properties = module.exports = prime({ })

Properties.define = function(prime, name, descriptor) {

	var parentSetter = null
	var parentGetter = null

	var parent = prime.parent
	if (parent) {
		var parentDescriptor = Object.getOwnPropertyDescriptor(parent, name)
		if (parentDescriptor) {
			parentSetter = parent.set
			parentGetter = parent.get
		}
	}

	descriptor = descriptor || {}

	var proto = prime.prototype || prime
	var bound = descriptor.bound || '__' + name
	var value = descriptor.value || null
	var write = descriptor.writable || true
	var onSet = descriptor.onSet || function(){}
	var onGet = descriptor.onGet || function(){}

	if (!typeof value === 'function') {
		value = function() {
			return value
		}
	}

	var setter = function(value) {

		if (!write) throw new Error('Property ' + name + ' is read-only')

		var current = this[bound]
		var changed = onSet.call(this, value, current, parentSetter)
		if (changed === undefined) {
			changed = value
		}

		if (current === changed) return

		this[bound] = changed

		if (this.emit) {
			this.emit('propertychange', name, changed)
		}
	}

	var getter = function() {

		var current = bound in this ? this[bound] : (this[bound] = value.call(this))
		var changed = onGet.call(this, current, parentGetter)
		if (changed == undefined) {
			changed = current
		}

		return changed
	}

	Object.defineProperty(proto, name, {
		set: setter,
		get: getter
	})
}
