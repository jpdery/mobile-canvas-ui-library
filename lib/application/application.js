"use strict"

var prime          = require('prime')
var array          = require('prime/shell/array')
var Map            = require('prime/map')
var Emitter        = require('../util/emitter')
var Rect           = require('../geom/rect')
var Size           = require('../geom/size')
var Point          = require('../geom/point')
var View           = require('../view')
var ViewRenderer   = require('../view/view-renderer')
var ViewController = require('../view-controller')
var Event          = require('../event')
var Touch          = require('../event/touch')
var TouchEvent     = require('../event/touch-event')
require('event-util')
require('touch-util')

var ApplicationController = module.exports = prime({

    inherits: ViewController,

    constructor: function(size) {

        ApplicationController.parent.constructor.call(this)

        this.__size = size
        this.__userTouches = new Map()
        this.__viewTouches = new Map()

        return this
    },

    loadView: function() {

        this.view = new View()
        this.view.size = new Point(
            320,
            480
        )

        var renderer = ViewRenderer.create(this.view)


        renderer.canvas.addEventListener('touchcancel', this.bound('__onTouchCancel'))
        renderer.canvas.addEventListener('touchstart', this.bound('__onTouchStart'))
        renderer.canvas.addEventListener('touchmove', this.bound('__onTouchMove'))
        renderer.canvas.addEventListener('touchend', this.bound('__onTouchEnd'))
    },

    /* Private API */

    __onTouchCancel: function(e) {

    },

    __onTouchStart: function(e) {

        var changedTouches = new Map()

        array.each(e.changedTouches, function(t) {

            var i = t.identifier
            var x = t.pageX
            var y = t.pageY

            var view = this.view.getViewAtPoint(x, y)
            if (view) {

                var touch = new Touch()
                touch.__setTarget(view)
                touch.__setOrigin(x, y)

                var touches = changedTouches.get(view)
                if (touches === null) {
                    changedTouches.set(view, (touches = []))
                }

                array.push(touches, touch)

                this.__userTouches.set(t, touch)
                this.__viewTouches.set(t, view)
            }
        }, this)

        changedTouches.each(function(touches, view) {
             view.emit(new TouchEvent('touchstart', true, this.__userTouches.values()), touches)
        }, this)
    },

    __onTouchMove: function(e) {

        var changedTouches = new Map()

        array.each(e.changedTouches, function(t) {

            var i = t.identifier
            var x = t.pageX
            var y = t.pageY

            var touch = this.__userTouches.get(t)
            var view  = this.__viewTouches.get(t)

            touch.__setOrigin(x, y)

            var touches = changedTouches.get(view)
            if (touches === null) {
                changedTouches.set(view, (touches = []))
            }

            array.push(touches, touch)

        }, this)

        changedTouches.each(function(touches, view) {
            view.emit(new TouchEvent('touchmove', true, this.__userTouches.values()), touches)
        }, this)
    },

    __onTouchEnd: function(e) {

        var changedTouches = new Map()

        array.each(e.changedTouches, function(t) {

            var i = t.identifier
            var x = t.pageX
            var y = t.pageY

            var touch = this.__userTouches.get(t)
            var view  = this.__viewTouches.get(t)

            touch.__setOrigin(x, y)

            var touches = changedTouches.get(view)
            if (touches === null) {
                changedTouches.set(view, (touches = []))
            }

            array.push(touches, touch)

            this.__userTouches.remove(t)
            this.__viewTouches.remove(t)

        }, this)

        changedTouches.each(function(touches, view) {
            view.emit(new TouchEvent('touchend', true, this.__userTouches.values()), touches)
        }, this)

    }

})

