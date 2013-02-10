"use strict"

var prime   = require('prime')
var array   = require('prime/shell/array')
var Emitter = require('../event/emitter')
var View    = require('../view')

/**
 * @since 0.0.1
 */
var ViewController = module.exports = prime({

    inherits: Emitter,

    constructor: function() {

        ViewController.parent.constructor.call(this)

        this.__view = null

        this.loadView()

        this.view.insertResponder(this)

        this.on('touchcancel', this.bound('onTouchCancel'))
        this.on('touchstart', this.bound('onTouchStart'))
        this.on('touchmove', this.bound('onTouchMove'))
        this.on('touchend', this.bound('onTouchEnd'))
    },

    destroy: function() {
        this.off('touchcancel', this.bound('onTouchCancel'))
        this.off('touchstart', this.bound('onTouchStart'))
        this.off('touchmove', this.bound('onTouchMove'))
        this.off('touchend', this.bound('onTouchEnd'))
    },

    loadView: function() {
        this.view = new View()
    },

    onTouchCancel: function() {

    },

    onTouchStart: function() {

    },

    onTouchMove: function() {

    },

    onTouchEnd: function() {

    },

})

prime.define(ViewController.prototype, 'view', {

    set: function(value) {
        this.__view = value
    },

    get: function(value) {
        return this.__view
    }

})
