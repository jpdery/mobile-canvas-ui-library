"use strict"

var prime = require('prime')
var array = require('prime/shell/array')
var bound = require('prime-util/prime/bound')
var mixin = require('prime-util/prime/mixin')
var Event = require('../event')
require('prime-util/shell/function')
require('prime-util/shell/array')

var Emitter = module.exports = prime({

    addListener: function(type, listener) {

        type = type.toLowerCase()

        var listeners = this.__listeners || (this.__listeners = {})

        var events = listeners[type]
        if (events === undefined) {
            events = listeners[type] = []
        }

        if (array.index(events, listener) === null) array.push(events, listener)

        return this
    },

    hasListener: function(type, listener) {

        type = type.toLowerCase()

        var events = this.__listeners[type]
        if (events === undefined)
            return this

        return !!array.index(events, listener)
    },

    removeListener: function(type, listener) {

        type = type.toLowerCase()

        var events = this.__listeners[type]
        if (events === undefined)
            return this

        array.remove(events, listener)

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

    emit: function(event) {

        if (typeof event === 'string') {
            event = new Event(event, false)
        }

        var type = event.type
        var args = array.slice(arguments, 1)

        if (event.source === null) event.__setSource(this)

        var listeners = this.__listeners || (this.__listeners = {})

        var events = listeners[type]
        if (events) {
            for (var i = 0, l = events.length; i < l; i++) {
                events[i].apply(this, args)
            }
        }

        if (!event.bubbles || event.stopped)
            return this

        var responder = this.__responder
        if (responder) {
            arguments[0] = event
            responder.emit.apply(responder, arguments)
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