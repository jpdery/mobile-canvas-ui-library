"use strict"

var prime   = require('prime')
var Emitter = require('../event/emitter')

var Size = module.exports = prime({

    inherits: Emitter,

    constructor: function(x, y) {

        Size.parent.constructor.call(this)

        var size = arguments[0]
        if (size instanceof Size) {
            x = size.x
            y = size.y
        }

        this.__x = x || 0
        this.__y = y || 0

        return this
    }

})

prime.define(Size.prototype, 'x', {

    set: function(value) {
        if (this.__x !== value) {
            this.__x = value
            this.emit('propertychange', 'x', value)
        }
    },

    get: function() {
        return this.__x
    }

})

prime.define(Size.prototype, 'y', {

    set: function(value) {
        if (this.__y !== value) {
            this.__y = value
            this.emit('propertychange', 'y', value)
        }
    },

    get: function() {
        return this.__y
    }

})
