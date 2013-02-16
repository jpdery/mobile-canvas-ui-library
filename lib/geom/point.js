"use strict"

var prime      = require('prime')
var mixin      = require('prime-util/prime/mixin')
var Emitter    = require('../util/emitter')
var Properties = require('../util/properties')

var Point = module.exports = prime({

    constructor: function(x, y) {

        var point = arguments[0]
        if (point instanceof Point) {
            x = point.x
            y = point.y
        }

        this.x = x || 0
        this.y = y || 0

        return this
    }

})

mixin(Point, Emitter)
mixin(Point, Properties)

Properties.define(Point, 'x', {
    value: 0
})

Properties.define(Point, 'y', {
    value: 0
})
