"use strict"

var prime      = require('prime')
var mixin      = require('prime-util/prime/mixin')
var Emitter    = require('../util/emitter')
var Properties = require('../util/properties')

var Size = module.exports = prime({

    constructor: function(x, y) {

        var size = arguments[0]
        if (size instanceof Size) {
            x = size.x
            y = size.y
        }

        this.x = x || 0
        this.y = y || 0

        return this
    }

})

mixin(Size, Emitter)
mixin(Size, Properties)

Properties.define(Size, 'x', {
    value: 0
})

Properties.define(Size, 'y', {
    value: 0
})