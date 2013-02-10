"use strict"

var Application    = require('./application')
var Control        = require('./control')
var Button         = require('./control/button')
var Emitter        = require('./event/emitter')
var Event          = require('./event')
var TouchEvent     = require('./event/touch-event')
var Touch          = require('./event/touch')
var Rect           = require('./geom/rect')
var Size           = require('./geom/size')
var Point          = require('./geom/point')
var View           = require('./view')
var ViewStyle      = require('./view/view-style')
var ViewRenderer   = require('./view/view-renderer')
var ViewController = require('./view-controller')

// temp

global.example = function() {

	var prime = require('prime')
	var fx    = require('moofx/lib/fx')

	var RootViewController = prime({

		inherits: ViewController,

		loadView: function() {

			this.view = new View()
			this.view.origin.x = 0
			this.view.origin.y = 0
			this.view.size.x = 320
			this.view.size.y = 480
			this.view.style.backgroundColor = '#cbd2d8'
			this.view.style.backgroundImage = 'background.png'

			this.button = new Button()
			this.button.size.x = 200
			this.button.size.y = 44
			this.button.origin.x = this.view.size.x / 2 - this.button.size.x / 2
			this.button.origin.y = this.view.size.y / 2 - this.button.size.y / 2
			this.button.label = 'Tap'
			this.view.addChildView(this.button)

			this.button.on('touchend', this.bound('onButtonTap'))
		},

		onButtonTap: function() {

			var view = new View()
			view.origin.x = 320
			view.origin.y = 0
			view.size.x = 320
			view.size.y = 480
			view.style.backgroundColor = '#67c0ea'

			this.view.addChildView(view)

			var move = fx(function(value) {
				view.origin.x = value
			})

			var fade = fx(function(value) {
				view.opacity = value
			})

			move.start(320, 0, {'equation': 'ease-in-out'})
			fade.start(  0, 1, {'equation': 'ease-in-out'})

		}

	})

	var root = new RootViewController()

	var app = new Application()
	app.view.addChildView(root.view)

/*
var button = new Button()
button.resizeTo(200, 40)
button.moveTo(40, 40)

app.view.addChildView(button)


var nextView = new View()
nextView.size = app.view.size
nextView.origin = new Point(320, 0)
nextView.style.backgroundColor = '#acbec7'

var nextViewButton = new Button()
nextViewButton.resizeTo(200, 40)
nextViewButton.moveTo(40, 40)
nextViewButton.on('touchend', function() {

	var anim = fx(function(val) {
		var origin = nextView.origin
		origin.x = val
		nextView.origin = origin
	})

	anim.start(0, 320, {
		equation: "ease-in-out"
	})
})

nextView.addChildView(nextViewButton)


button.on('touchend', function() {

	app.view.addChildView(nextView)

	var anim = fx(function(val) {
		var origin = nextView.origin
		origin.x = val
		nextView.origin = origin
	})

	anim.start(320, 0, {
		equation: "ease-in-out"
	})

})
*/

}