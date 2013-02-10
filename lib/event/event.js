"use strict"

var prime = require('prime')

var Event = module.exports = prime({

    constructor: function(type, bubbles) {
        this.__type = type
        this.__source = null
        this.__bubbles = bubbles || true
        this.__stopped = false
        this.__timestamp = Date.now()
        return this
    },

    stop: function() {
        this.__stopped = true
        return this
    }

})

prime.define(Event.prototype, 'type', {

    get: function() {
        return this.__type
    }

})

prime.define(Event.prototype, 'bubbles', {

    get: function() {
        return this.__bubbles
    }

})

prime.define(Event.prototype, 'stopped', {

    get: function() {
        return this.__stopped
    }

})

prime.define(Event.prototype, 'source', {

    get: function() {
        return this.__source
    }

})

prime.define(Event.prototype, 'timestamp', {

    get: function() {
        return this.__timestamp
    }

})
