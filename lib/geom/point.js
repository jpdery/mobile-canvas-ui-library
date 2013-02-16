"use strict"

var prime   = require('prime')
var Emitter = require('../util/emitter')

var Point = module.exports = prime({

    inherits: Emitter,

    constructor: function(x, y) {

        Point.parent.constructor.call(this)

        var point = arguments[0]
        if (point instanceof Point) {
            x = point.x
            y = point.y
        }

        this.__x = x || 0
        this.__y = y || 0

        return this
    }

})

prime.define(Point.prototype, 'x', {

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

prime.define(Point.prototype, 'y', {

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
