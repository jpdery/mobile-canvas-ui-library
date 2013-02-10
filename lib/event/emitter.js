"use strict"

var prime = require('prime')
var array = require('prime/shell/array')
var bound = require('prime-util/prime/bound')
var mixin = require('prime-util/prime/mixin')
var Event = require('./event')
require('prime-util/shell/function')
require('prime-util/shell/array')

var Emitter = module.exports = prime({

    constructor: function() {
        this.__listeners = {}
        this.__responder = null
        return this
    },

    addListener: function(type, listener) {

        type = type.toLowerCase()

        var listeners = this.__listeners[type]
        if (listeners === undefined) {
            listeners = this.__listeners[type] = []
        }

        if (array.index(listeners, listener) === null) array.push(listeners, listener)

        return this
    },

    hasListener: function(type, listener) {

        type = type.toLowerCase()

        var listeners = this.__listeners[type]
        if (listeners === undefined)
            return this

        return !!array.index(listeners, listener)
    },

    removeListener: function(type, listener) {

        type = type.toLowerCase()

        var listeners = this.__listeners[type]
        if (listeners === undefined)
            return this

        array.remove(listeners, listener)

        return this
    },

    removeListeners: function(type) {

        if (type) {
            type = type.toLowerCase()
            delete this.__listeners[type]
            return this
        }

        this.__listeners = []

        return this
    },

    on: function() {
        return this.addListener.apply(this, arguments)
    },

    off: function() {
        return this.removeListener.apply(this, arguments)
    },

    once: function(type, listener) {

    },

    emit: function() {

        var args = array.slice(arguments, 1)
        var type = ''

        var event = null

        if (typeof args[0] === 'string') {
            type = args[0].toLowerCase()
        }

        var event = args[args.length - 1]
        if (event instanceof Event) {
            type = event.type
        } else {
            event = new Event(type, false)
            args.push(event)
        }

        if (event.__source === null) {
            event.__source = this
        }

        var listeners = this.__listeners[type]
        if (listeners) {
            for (var i = 0, l = listeners.length; i < l; i++) {
                listeners[i].apply(this, args)
            }
        }

        if (!event.bubbles || event.stopped)
            return this

        var responder = this.__responder
        if (responder) {
            array.push(args, type)
            responder.emit.apply(responder, args)
        }

        return this
    },

    insertResponder: function(responder) {

        var parent = this.responder
        if (parent) {
            responder.responder = parent
        }

        this.responder = responder

    }

})

mixin(Emitter, bound)

prime.define(Emitter.prototype, 'responder', {

    set: function(value) {
        this.__responder = value
    },

    get: function() {
        return this.__responder
    }

})