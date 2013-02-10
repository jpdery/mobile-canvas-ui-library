"use strict"

var prime   = require('prime')
var Control = require('./control')

var Button = module.exports = prime({

    inherits: Control,

    constructor: function() {
        Button.parent.constructor.apply(this, arguments)
        this.style.backgroundColor = "#fff"
        this.__label = '';
    },

    onTouchStart: function(touches, e) {
        Button.parent.onTouchStart.call(this, touches, e)
        this.style.backgroundColor = "#26a7e9"
    },

    onTouchEnd: function(touches, e) {
        Button.parent.onTouchEnd.call(this, touches, e)
        this.style.backgroundColor = "#fff"
    },

    draw: function(context, area) {

        Button.parent.draw.apply(this, arguments)

        context.font = '17px Arial';
        context.fillStyle = '#000';
        context.textAlign = 'center'
        context.fillText(this.__label, area.size.x / 2, area.size.y / 2 + 17 / 2)
    }

})

prime.define(Button.prototype, 'label', {

    set: function(value) {
        this.__label = value
        this.redraw()
    },

    get: function() {
        return this.__label
    }

})