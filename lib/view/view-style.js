"use strict"

var prime = require('prime')
var array = require('prime/shell/array')
var mixin = require('prime-util/prime/mixin')
var bound = require('prime-util/prime/bound')

var ViewStyle = module.exports = prime({

    constructor: function(view) {

        this.__view = view

        this.__backgroundColor = ''
        this.__backgroundImage = ''
        this.__backgroundRepeat = ''

        return this
    },

    destroy: function() {
        this.__view = null
        return this
    },

    draw: function(context, area) {

        var x = area.origin.x
        var y = area.origin.y
        var w = area.size.x
        var h = area.size.y

        var backgroundColor = this.__backgroundColor
        if (backgroundColor) {
            context.fillStyle = backgroundColor
            context.fillRect(x, y, w, h)
        }

        var backgroundImage = this.__backgroundImage
        if (backgroundImage &&
            backgroundImage.naturalWidth && backgroundImage.naturalHeight) {
            var pattern = context.createPattern(backgroundImage, this.__backgroundRepeat || 'repeat')
            context.fillStyle = pattern
            context.fillRect(x, y, w, h)
        }
    },

     __onBackgroundImageLoad: function() {
        this.view.redraw()
     }

})

mixin(ViewStyle, bound)

prime.define(ViewStyle.prototype, 'view', {

    get: function() {
        return this.__view
    }

})

prime.define(ViewStyle.prototype, 'backgroundColor', {

    set: function(value) {
        if (this.__backgroundColor !== value) {
            this.__backgroundColor = value
            this.view.redraw()
        }
    },

    get: function() {
        return this.__backgroundColor
    }

})

prime.define(ViewStyle.prototype, 'backgroundImage', {

    set: function(value) {

        if (this.__backgroundImage) {
            this.__backgroundImage.removeEventListener('load', this.bound('__onBackgroundImageLoad'))
            this.__backgroundImage = null
        }

        this.__backgroundImage = new Image()
        this.__backgroundImage.src = value
        this.__backgroundImage.addEventListener('load', this.bound('__onBackgroundImageLoad'))
    },

    get: function() {
        return this.__backgroundImage && this.__backgroundImage.src || ''
    }

})
