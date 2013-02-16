"use strict"

var prime      = require('prime')
var mixin      = require('prime-util/prime/mixin')
var Point      = require('./point')
var Size       = require('./size')
var Emitter    = require('../util/emitter')
var Properties = require('../util/properties')

var Rect = module.exports = prime({

    constructor: function(x, y, w, h) {

        var rect = arguments[0]
        if (rect instanceof Rect) {
            x = rect.origin.x
            y = rect.origin.y
            w = rect.size.x
            h = rect.size.y
        }

        this.origin = new Point(x, y)
        this.size = new Size(w, h)

        return this
    }

})

mixin(Rect, Emitter)
mixin(Rect, Properties)

Properties.define(Rect, 'origin', {

    value: function() {
        return new Point(0, 0)
    }

})

Properties.define(Rect, 'size', {

    value: function() {
        return new Size(0, 0)
    }

})

Rect.union = function(r1, r2) {
     var x1 = Math.min(r1.origin.x, r2.origin.x)
     var y1 = Math.min(r1.origin.y, r2.origin.y)
     var x2 = Math.max(r1.origin.x + r1.size.x, r2.origin.x + r2.size.x)
     var y2 = Math.max(r1.origin.y + r1.size.y, r2.origin.x + r2.size.y)
     return new Rect(x1, y1, x2 - x1, y2 - y1)
}
