"use strict"

var prime        = require('prime')
var array        = require('prime/shell/array')
var Emitter      = require('../event/emitter')
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

        View.parent.constructor.call(this)

        this.__name = name

        this.__style = new ViewStyle(this)

        this.__opacity = 1
        this.__visible = true

        this.__origin = new Point(0, 0)
        this.__origin.on('propertychange', this.bound('__onOriginChange'))

        this.__center = new Point(0, 0)
        this.__center.on('propertychange', this.bound('__onCenterChange'))

        this.__size = new Size()
        this.__size.on('propertychange', this.bound('__onSizeChange'))

        this.__parentView = null
        this.__masterView = null
        this.__childViews = []

        this.on('addtomasterview', this.bound('__onAddToMasterView'))
        this.on('removefrommasterview', this.bound('__onRemoveFromMasterView'))

        this.on('addchildview', this.bound('onAddChildView'))
        this.on('removechildview', this.bound('onRemoveChildView'))
        this.on('addtoparentview', this.bound('onAddToParentView'))
        this.on('addtomasterview', this.bound('onAddToMasterView'))
        this.on('removefromparentview', this.bound('onRemoveFromParentView'))
        this.on('removefrommasterview', this.bound('onRemoveFromMasterView'))

        this.on('touchcancel', this.bound('onTouchCancel'))
        this.on('touchstart', this.bound('onTouchStart'))
        this.on('touchmove', this.bound('onTouchMove'))
        this.on('touchend', this.bound('onTouchEnd'))

        return this
    },

    destroy: function() {

        this.removeFromParentView()

        this.__name = null

        this.__style.destroy()
        this.__style = null

        this.__opacity = null
        this.__visible = null

        this.__origin.on('propertychange', this.bound('__onOriginChange'))
        this.__origin = null

        this.__center.on('propertychange', this.bound('__onCenterChange'))
        this.__center = null

        this.__size.on('propertychange', this.bound('__onSizeChange'))
        this.__size = null

        this.__parentView = null
        this.__masterView = null
        this.__childViews = null

        this.off('addtomasterview', this.bound('__onAddToMasterView'))
        this.off('removefrommasterview', this.bound('__onRemoveFromMasterView'))

        this.off('addchildview', this.bound('onAddChildView'))
        this.off('removechildview', this.bound('onRemoveChildView'))
        this.off('addtoparentview', this.bound('onAddToParentView'))
        this.off('addtomasterview', this.bound('onAddToMasterView'))
        this.off('removefromparentview', this.bound('onRemoveFromParentView'))
        this.off('removefrommasterview', this.bound('onRemoveFromMasterView'))

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

    addChildView: function(view) {
        return this.addChildViewAt(view, this.__childViews.length)
    },

    addChildViewAt: function(view, index) {

        var children = this.__childViews

        if (index > children.length ||
            index < 0)
            return

        if (view.parentView) {
            view.removeFromParentView()
        }

        array.splice(children, index, 1, view)
        view.responder = this
        view.__setParentView(this)
        view.__setMasterView(this.masterView)

        this.emit('addchildview', view)

        return this.reflow()
    },

    addChildViewBefore: function(child, before) {

        var index = this.getChildViewIndex(before)
        if (index === null)
            return this

        return this.addChildViewAt(child, index)
    },

    addChildViewAfter: function(child, after) {

        var index = this.getChildViewIndex(before)
        if (index === null)
            return this

        return this.addChildViewAt(child, index + 1)
    },

    removeChildView: function(child, destroy) {

        var index = this.getChildViewIndex(child)
        if (index === null)
            return this

        return this.removeChildViewAt(index, destroy)
    },

    removeChildViewAt: function(index, destroy) {

        var children = this.__childViews

        var view = children[index]
        if (view === undefined)
            return this

        array.splice(children, index, 1)
        view.__setParentView(null)
        view.__setMasterView(null)
        view.responder = null

        this.emit('removechildview', view)

        if (destroy) view.destroy()

        return this.reflow()
    },

    removeFromParentView: function(destroy) {

        if (this.__parentView) {
            this.__parentView.removeChildView(this, destroy)
        }

        return this
    },

    getChildView: function(name) {
        return array.find(this.__childViews, function(view) {
            return view.name === name
        })
    },

    getChildViewAt: function(index) {
        return this.__childViews[index] || null
    },

    getChildViewByTypeAt: function(type, index) {
        return this
    },

    getChildViewIndex: function(child) {
        return array.indexOf(this.__childViews, child)
    },

    getViewAtPoint: function(x, y) {

        if (this.contains(x, y) === false)
            return null

        var children = this.__childViews
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

    onAddChildView: function(view) {

    },

    onRemoveChildView: function(view) {

    },

    onAddToParentView: function(parentView) {

    },

    onAddToMasterView: function(masterView) {

    },

    onRemoveFromParentView: function(parentView) {

    },

    onRemoveFromMasterView: function(masterView) {

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

    __setParentView: function(value) {

        var parent = this.__parentView

        if (parent && value === null) {
            this.__parentView = value
            return this.emit('removefromparentview', parent)
        }

        if (parent === null && value) {
            this.__parentView = value
            return this.emit('addtoparentview', parent)
        }

        return this
    },

    __setMasterView: function(value) {

        var master = this.__masterView

        if (master && value === null) {
            this.__masterView = value
            return this.emit('removefrommasterview', master)
        }

        if (master === null && value) {
            this.__masterView = value
            return this.emit('addtomasterview', master)
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

    __onAddToMasterView: function(masterView) {
        this.__masterView = masterView
        array.invoke(this.__childViews, 'emit', 'addtomasterview', masterView)
    },

    __onRemoveFromMasterView: function(masterView) {
        this.__masterView = null
        array.invoke(this.__childViews, 'emit', 'removefrommasterview', masterView)
    }

})

prime.define(View.prototype, 'name', {

    get: function() {
        return this.__name
    }

})

prime.define(View.prototype, 'size', {

    set: function(value) {

        var size = this.__size
        if (size.x === value.x &&
            size.y === value.y)
            return

        size.x = value.x
        size.y = value.y

        this.emit('resize')
    },

    get: function() {
        return this.__size
    }

})

prime.define(View.prototype, 'origin', {

    set: function(value) {

        var origin = this.__origin
        if (origin.x === value.x &&
            origin.y === value.y)
            return

        origin.x = value.x
        origin.y = value.y

        this.emit('move')
    },

    get: function() {
        return this.__origin
    }

})

prime.define(View.prototype, 'center', {

    set: function(value) {

        var center = this.__center
        if (center.x === value.x &&
            center.y === value.y)
            return

        center.x = value.x
        center.y = value.y

        this.emit('move')
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

    },

    get: function() {
        return this.__style
    }

})

prime.define(View.prototype, 'parentView', {

    get: function() {
        return this.__parentView || null
    }

})

prime.define(View.prototype, 'childViews', {

    get: function() {
        return array.slice(this.__childViews)
    }

})
