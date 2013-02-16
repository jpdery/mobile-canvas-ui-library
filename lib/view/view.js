"use strict"

var prime        = require('prime')
var array        = require('prime/shell/array')
var Emitter      = require('../util/emitter')
var Rect         = require('../geom/rect')
var Size         = require('../geom/size')
var Point        = require('../geom/point')
var ViewStyle    = require('./view-style')
var ViewRenderer = require('./view-renderer')
require('prime-util/shell/array')

// TODO:
// Add options for the renderer
// Add options to clip child views
// Compute bounds when new childs are added

var View = module.exports = prime({

    inherits: Emitter,

    constructor: function(name) {

        this.__name = name

        this.__style = new ViewStyle(this)

        this.__opacity = 1
        this.__visible = true

        this.__parent = null
        this.__window = null
        this.__children = []

        this.origin = new Point(0, 0)
        this.center = new Point(0, 0)
        this.size = new Size()

        this.on('add', this.bound('onAdd'))
        this.on('remove', this.bound('onRemove'))
        this.on('addtoparent', this.bound('onAddToParent'))
        this.on('addtowindow', this.bound('onAddToWindow'))
        this.on('removefromparent', this.bound('onRemoveFromParent'))
        this.on('removefromwindow', this.bound('onRemoveFromWindow'))

        this.on('touchcancel', this.bound('onTouchCancel'))
        this.on('touchstart', this.bound('onTouchStart'))
        this.on('touchmove', this.bound('onTouchMove'))
        this.on('touchend', this.bound('onTouchEnd'))

        return this
    },

    destroy: function() {

        this.removeFromParent()

        this.__name = null

        this.__style.destroy()
        this.__style = null

        this.__opacity = null
        this.__visible = null

        this.__origin.on('propertychange', this.bound('__onOriginChange'))
        this.__center.on('propertychange', this.bound('__onCenterChange'))
        this.__size.on('propertychange', this.bound('__onSizeChange'))

        this.__origin = null
        this.__center = null
        this.__size = null

        this.__parent = null
        this.__window = null
        this.__children = null

        this.off('add', this.bound('onAdd'))
        this.off('remove', this.bound('onRemove'))
        this.off('addtoparent', this.bound('onAddToParent'))
        this.off('addtowindow', this.bound('onAddToWindow'))
        this.off('removefromparent', this.bound('onRemoveFromParent'))
        this.off('removefromwindow', this.bound('onRemoveFromWindow'))

        this.off('touchcancel', this.bound('onTouchCancel'))
        this.off('touchstart', this.bound('onTouchStart'))
        this.off('touchmove', this.bound('onTouchMove'))
        this.off('touchend', this.bound('onTouchEnd'))

        this.removeListeners()

        ViewRenderer.free(this)

        return this
    },

    moveTo: function(x, y) {
        x = x || 0
        y = y || 0
        this.origin = new Point(x, y)
        return this
    },

    moveBy: function(x, y) {
        var origin = this.origin
        origin.x += x || 0
        origin.y += y || 0
        this.origin = origin
        return this
    },

    resizeTo: function(x, y) {
        x = x || 0
        y = y || 0
        this.size = new Size(x, y)
        return this
    },

    resizeBy: function(x, y) {
        var size = this.size
        size.x += x || 0
        size.y += y || 0
        this.size = size
        return this
    },

    addChild: function(view) {
        return this.addChildAt(view, this.__children.length)
    },

    addChildAt: function(view, index) {

        var children = this.__children

        if (index > children.length ||
            index < 0)
            return

        view.removeFromParent()

        array.splice(children, index, 1, view)
        view.responder = this
        view.__setParent(this)
        view.__setWindow(this.window)

        this.emit('add', view)

        return this.reflow()
    },

    addChildBefore: function(child, before) {

        var index = this.getChildIndex(before)
        if (index === null)
            return this

        return this.addChildAt(child, index)
    },

    addChildAfter: function(child, after) {

        var index = this.getChildIndex(before)
        if (index === null)
            return this

        return this.addChildAt(child, index + 1)
    },

    removeChild: function(child, destroy) {

        var index = this.getChildIndex(child)
        if (index === null)
            return this

        return this.removeChildAt(index, destroy)
    },

    removeChildAt: function(index, destroy) {

        var children = this.__children

        var view = children[index]
        if (view === undefined)
            return this

        array.splice(children, index, 1)
        view.__setParent(null)
        view.__setWindow(null)
        view.responder = null

        this.emit('remove', view)

        if (destroy) view.destroy()

        return this.reflow()
    },

    removeFromParent: function(destroy) {

        if (this.__parent) {
            this.__parent.removeChild(this, destroy)
        }

        return this
    },

    getChild: function(name) {
        return array.find(this.__children, function(view) {
            return view.name === name
        })
    },

    getChildAt: function(index) {
        return this.__children[index] || null
    },

    getChildByTypeAt: function(type, index) {
        return this
    },

    getChildIndex: function(child) {
        return array.indexOf(this.__children, child)
    },

    getViewAtPoint: function(x, y) {

        if (this.contains(x, y) === false)
            return null

        var children = this.__children
        for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i]
            if (child.contains(x, y)) {
                var origin = child.origin;
                var relx = x - origin.x
                var rely = y - origin.y
                return child.getViewAtPoint(relx, rely) || child
            }
        }

        return null
    },

    contains: function(x, y) {

        var point = arguments[0]
        if (point instanceof Point) {
            x = point.x
            y = point.y
        }

        var s = this.__size
        var o = this.__origin
        return x >= o.x && x <= o.x + s.x && y >= o.y && y <= o.y + s.y
    },

    draw: function(context, area) {

        if (this.__style) {
            this.__style.draw(context, area)
        }

        return this
    },

    redraw: function(area) {
        ViewRenderer.redraw(this, area || new Rect(0, 0, this.__size.x, this.__size.y))
        return this
    },

    reflow: function() {
        ViewRenderer.reflow(this)
        return this
    },

    onAdd: function(view) {

    },

    onRemove: function(view) {

    },

    onAddToParent: function(parent) {

    },

    onAddToWindow: function(masterView) {

    },

    onRemoveFromParent: function(parent) {

    },

    onRemoveFromWindow: function(masterView) {

    },

    onTouchCancel: function(e) {

    },

    onTouchStart: function(e) {

    },

    onTouchMove: function(e) {

    },

    onTouchEnd: function(e) {

    },

    /* Private API */

    __setParent: function(value) {

        var parent = this.__parent

        if (parent && value === null) {
            this.__parent = value
            return this.emit('removefromparent', parent)
        }

        if (parent === null && value) {
            this.__parent = value
            return this.emit('addtoparent', parent)
        }

        return this
    },

    __setWindow: function(value) {

        var master = this.__window

        if (master && value === null) {
            this.__window = value
            return this.emit('removefromwindow', master)
        }

        if (master === null && value) {
            this.__window = value
            return this.emit('addtowindow', master)
        }

        return this
    },

    __onSizeChange: function(key, val, e) {

        var origin = this.__origin
        var center = this.__center

        switch (key) {
            case 'x': center.x = origin.x + val / 2; break
            case 'y': center.y = origin.y + val / 2; break
        }

        this.reflow()
    },

    __onOriginChange: function(key, val, e) {

        var size = this.__size
        var center = this.__center

        switch (key) {
            case 'x': center.x = val + size.x / 2; break
            case 'y': center.y = val + size.y / 2; break
        }

        this.reflow()
    },

    __onCenterChange: function(key, val, e) {

        var size = this.__size
        var origin = this.__origin

        switch (key) {
            case 'x': origin.x = val - size.x / 2; break
            case 'y': origin.y = val - size.y / 2; break
        }

        this.reflow()
    },

    __onAddToWindow: function(masterView) {
        this.__window = masterView
        array.invoke(this.__children, 'emit', 'addtowindow', masterView)
    },

    __onRemoveFromWindow: function(masterView) {
        this.__window = null
        array.invoke(this.__children, 'emit', 'removefromwindow', masterView)
    }

})

prime.define(View.prototype, 'name', {

    get: function() {
        return this.__name
    }

})

prime.define(View.prototype, 'size', {

    set: function(value) {

        var func = this.bound('__onSizeChange')

        var size = this.__size
        if (size) {
            size.off('propertychange', func)
        }

        size = this.__size = value
        size.on('propertychange', func)

        if (size.x !== value.x ||
            size.y !== value.y) {
            this.emit('resize').reflow()
        }
    },

    get: function() {
        return this.__size
    }

})

prime.define(View.prototype, 'origin', {

    set: function(value) {

        var func = this.bound('__onOriginChange')

        var origin = this.__origin
        if (origin) {
            origin.off('propertychange', func)
        }

        origin = this.__origin = value
        origin.on('propertychange', func)

        if (origin.x !== value.x ||
            origin.y !== value.y) {
            this.emit('move').reflow()
        }
    },

    get: function() {
        return this.__origin
    }

})

prime.define(View.prototype, 'center', {

    set: function(value) {

        var func = this.bound('__onCenterChange')

        var center = this.__center
        if (center) {
            center.off('propertychange', func)
        }

        center = this.__center = value
        center.on('propertychange', func)

        if (center.x !== value.x ||
            center.y !== value.y) {
            this.emit('move').reflow()
        }
    },

    get: function() {
        return this.__center
    }
})

prime.define(View.prototype, 'visible', {

    set: function(value) {
        if (this.__visible !== value) {
            this.__visible = value
            this.reflow()
        }
    },

    get: function() {
        return this.__visible
    }

})

prime.define(View.prototype, 'opacity', {

    set: function(value) {
        if (value > 1) value = 1
        if (value < 0) value = 0
        if (this.__opacity !== value) {
            this.__opacity = value
            this.reflow()
        }
    },

    get: function() {
        return this.__opacity
    }

})

prime.define(View.prototype, 'style', {

    set: function(value) {
        this.__style = value
    },

    get: function() {
        return this.__style
    }

})

prime.define(View.prototype, 'parent', {

    get: function() {
        return this.__parent
    }

})

prime.define(View.prototype, 'window', {

    get: function() {
        return this.__window
    }

})

prime.define(View.prototype, 'children', {

    get: function() {
        return array.slice(this.__children)
    }

})
