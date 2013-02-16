"use strict"

var prime        = require('prime')
var Map          = require('prime/map')
var requestFrame = require('moofx/lib/frame').request
var cancelFrame  = require('moofx/lib/frame').cancel
var Rect         = require('../geom/rect')
var Size         = require('../geom/size')
var Point        = require('../geom/point')
var Emitter      = require('../util/emitter')

var buffers = new Map()
var redraws = new Map()
var instances = new Map()

var ViewRenderer = module.exports = prime({

    inherits: Emitter,

    constructor: function(view) {

        this.__view = view

        this.__canvas = document.createElement('canvas')
        this.__canvas.width = this.__view.size.x
        this.__canvas.height = this.__view.size.y
        document.body.appendChild(this.__canvas)

        // this.__canvas = document.getElementById('canvas');
        // this.__canvas.width = this.__view.size.x
        // this.__canvas.height = this.__view.size.y

        this.__context = this.__canvas.getContext('2d')


        this.__nextFrame = null
    },

    redraw: function(view, area) {

        var a = redraws.get(view)
        if (a) {
            a = Rect.union(a, area)
        } else {
            a = area
        }

        redraws.set(view, a)

        if (this.__nextFrame === null) {
            this.__nextFrame = requestFrame(this.render.bind(this))
        }

        return this;
    },

    reflow: function(view) {

        if (this.__nextFrame === null) {
            this.__nextFrame = requestFrame(this.render.bind(this))
        }

        return this;
    },

    render: function() {

        this.__nextFrame = null;

        if (this.__view === null)
            return

        this.__context.clearRect(
            0, 0,
            this.__view.size.x,
            this.__view.size.y
        )

        var self = this;

        var paint = function(view, offset) {

            if (view.visible === false)
                return

            var context = null

            var buffer = buffers.get(view)
            if (buffer === null) {

                buffer = document.createElement('canvas')
                buffer.width  = view.size.x
                buffer.height = view.size.y

                context = buffer.getContext('2d')
                context.save()
                view.draw(context, new Rect(
                    0, 0,
                    view.size.x,
                    view.size.y
                ))
                context.restore()

                buffers.set(view, buffer)

                redraws.remove(view)
            }

            var area = redraws.get(view)
            if (area) {

                context = buffer.getContext('2d');
                context.save()
                context.rect(
                    area.origin.x,
                    area.origin.y,
                    area.size.x,
                    area.size.y
                )
                context.clip()
                view.draw(context, area)
                context.restore()

                redraws.remove(view)
            }

            var origin = new Point(
                offset.x + view.origin.x,
                offset.y + view.origin.y
            )

            self.__context.save()
            self.__context.globalAlpha = view.opacity
            self.__context.drawImage(
                buffer,
                0,
                0,
                view.size.x,
                view.size.y,
                origin.x,
                origin.y,
                view.size.x,
                view.size.y
            )

            var children = view.children

            for (var i = 0; i < children.length; i++) paint(children[i], origin)

            self.__context.restore();
        }

        paint(this.__view, new Point());

        return this
    }

})

prime.define(ViewRenderer.prototype, 'canvas', {

    get: function() {
        return this.__canvas
    }

})

var root = function(view) {
    while (view.parent) view = view.parent
    return view
}

ViewRenderer.create = function(view) {

    var instance = instances.get(view)
    if (instance) {
        throw new Error('There is already a renderer assocaited with this view')
    }

    instance = new ViewRenderer(view)
    instances.set(view, instance)
    return instance
}

ViewRenderer.get = function(view) {
    var instance = instances.get(root(view))
    if (instance) return instance
    return null
}

ViewRenderer.redraw = function(view, area) {

    var instance = ViewRenderer.get(view)
    if (instance) {
        instance.redraw(view, area)
    }

    return this
}

ViewRenderer.reflow = function(view) {

    var instance = ViewRenderer.get(view)
    if (instance) {
        instance.reflow(view)
    }

    return this
}

ViewRenderer.free = function(view) {

    var buffer = buffers.get(view)
    if (buffer) {
        buffer.width = 0
        bugger.height = 0
    }

    buffers.remove(view)
    redraws.remove(view)
}
