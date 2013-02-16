(function(modules) {
    var cache = {}, require = function(id) {
        var module = cache[id];
        if (!module) {
            module = cache[id] = {};
            var exports = module.exports = {};
            modules[id].call(exports, require, module, exports, window);
        }
        return module.exports;
    };
    window["mobkit"] = require("0");
})({
    "0": function(require, module, exports, global) {
        "use strict";
        var Application = require("1");
        var Control = require("14");
        var Button = require("16");
        var Emitter = require("9");
        var Event = require("e");
        var TouchEvent = require("v");
        var Touch = require("u");
        var Rect = require("j");
        var Size = require("m");
        var Point = require("k");
        var View = require("n");
        var ViewStyle = require("p");
        var ViewRenderer = require("q");
        var ViewController = require("s");
        global.example = function() {
            var prime = require("3");
            var fx = require("17");
            var RootViewController = prime({
                inherits: ViewController,
                loadView: function() {
                    this.view = new View;
                    this.view.origin.x = 0;
                    this.view.origin.y = 0;
                    this.view.size.x = 320;
                    this.view.size.y = 480;
                    this.view.style.backgroundColor = "#cbd2d8";
                    this.view.style.backgroundImage = "background.png";
                    this.button = new Button;
                    this.button.size.x = 200;
                    this.button.size.y = 44;
                    this.button.origin.x = this.view.size.x / 2 - this.button.size.x / 2;
                    this.button.origin.y = this.view.size.y / 2 - this.button.size.y / 2;
                    this.button.label = "Tap";
                    this.view.addChild(this.button);
                    this.button.on("touchend", this.bound("onButtonTap"));
                },
                onButtonTap: function() {
                    var view = new View;
                    view.origin.x = 320;
                    view.origin.y = 0;
                    view.size.x = 320;
                    view.size.y = 480;
                    view.style.backgroundColor = "#67c0ea";
                    this.view.addChild(view);
                    var move = fx(function(value) {
                        view.origin.x = value;
                    });
                    var fade = fx(function(value) {
                        view.opacity = value;
                    });
                    move.start(320, 0, {
                        equation: "ease-in-out"
                    });
                    fade.start(0, 1, {
                        equation: "ease-in-out"
                    });
                }
            });
            var root = new RootViewController;
            var app = new Application;
            app.view.addChild(root.view);
        };
    },
    "1": function(require, module, exports, global) {
        "use strict";
        module.exports = require("2");
    },
    "2": function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var array = require("4");
        var Map = require("8");
        var Emitter = require("9");
        var Rect = require("j");
        var Size = require("m");
        var Point = require("k");
        var View = require("n");
        var ViewRenderer = require("q");
        var ViewController = require("s");
        var Event = require("e");
        var Touch = require("u");
        var TouchEvent = require("v");
        require("w");
        require("11");
        var ApplicationController = module.exports = prime({
            inherits: ViewController,
            constructor: function(size) {
                ApplicationController.parent.constructor.call(this);
                this.__size = size;
                this.__userTouches = new Map;
                this.__viewTouches = new Map;
                return this;
            },
            loadView: function() {
                this.view = new View;
                this.view.size = new Point(320, 480);
                var renderer = ViewRenderer.create(this.view);
                renderer.canvas.addEventListener("touchcancel", this.bound("__onTouchCancel"));
                renderer.canvas.addEventListener("touchstart", this.bound("__onTouchStart"));
                renderer.canvas.addEventListener("touchmove", this.bound("__onTouchMove"));
                renderer.canvas.addEventListener("touchend", this.bound("__onTouchEnd"));
            },
            __onTouchCancel: function(e) {},
            __onTouchStart: function(e) {
                var changedTouches = new Map;
                array.each(e.changedTouches, function(t) {
                    var i = t.identifier;
                    var x = t.pageX;
                    var y = t.pageY;
                    var view = this.view.getViewAtPoint(x, y);
                    if (view) {
                        var touch = new Touch;
                        touch.__setTarget(view);
                        touch.__setOrigin(x, y);
                        var touches = changedTouches.get(view);
                        if (touches === null) {
                            changedTouches.set(view, touches = []);
                        }
                        array.push(touches, touch);
                        this.__userTouches.set(t, touch);
                        this.__viewTouches.set(t, view);
                    }
                }, this);
                changedTouches.each(function(touches, view) {
                    view.emit(new TouchEvent("touchstart", true, this.__userTouches.values()), touches);
                }, this);
            },
            __onTouchMove: function(e) {
                var changedTouches = new Map;
                array.each(e.changedTouches, function(t) {
                    var i = t.identifier;
                    var x = t.pageX;
                    var y = t.pageY;
                    var touch = this.__userTouches.get(t);
                    var view = this.__viewTouches.get(t);
                    touch.__setOrigin(x, y);
                    var touches = changedTouches.get(view);
                    if (touches === null) {
                        changedTouches.set(view, touches = []);
                    }
                    array.push(touches, touch);
                }, this);
                changedTouches.each(function(touches, view) {
                    view.emit(new TouchEvent("touchmove", true, this.__userTouches.values()), touches);
                }, this);
            },
            __onTouchEnd: function(e) {
                var changedTouches = new Map;
                array.each(e.changedTouches, function(t) {
                    var i = t.identifier;
                    var x = t.pageX;
                    var y = t.pageY;
                    var touch = this.__userTouches.get(t);
                    var view = this.__viewTouches.get(t);
                    touch.__setOrigin(x, y);
                    var touches = changedTouches.get(view);
                    if (touches === null) {
                        changedTouches.set(view, touches = []);
                    }
                    array.push(touches, touch);
                    this.__userTouches.remove(t);
                    this.__viewTouches.remove(t);
                }, this);
                changedTouches.each(function(touches, view) {
                    view.emit(new TouchEvent("touchend", true, this.__userTouches.values()), touches);
                }, this);
            }
        });
    },
    "3": function(require, module, exports, global) {
        "use strict";
        var has = function(self, key) {
            return Object.hasOwnProperty.call(self, key);
        };
        var each = function(object, method, context) {
            for (var key in object) if (method.call(context, object[key], key, object) === false) break;
            return object;
        };
        if (!{
            valueOf: 0
        }.propertyIsEnumerable("valueOf")) {
            var buggy = "constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(",");
            var proto = Object.prototype;
            each = function(object, method, context) {
                for (var key in object) if (method.call(context, object[key], key, object) === false) return object;
                for (var i = 0; key = buggy[i]; i++) {
                    var value = object[key];
                    if ((value !== proto[key] || has(object, key)) && method.call(context, value, key, object) === false) break;
                }
                return object;
            };
        }
        var create = Object.create || function(self) {
            var constructor = function() {};
            constructor.prototype = self;
            return new constructor;
        };
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        var define = Object.defineProperty;
        try {
            var obj = {
                a: 1
            };
            getOwnPropertyDescriptor(obj, "a");
            define(obj, "a", {
                value: 2
            });
        } catch (e) {
            getOwnPropertyDescriptor = function(object, key) {
                return {
                    value: object[key]
                };
            };
            define = function(object, key, descriptor) {
                object[key] = descriptor.value;
                return object;
            };
        }
        var implement = function(proto) {
            each(proto, function(value, key) {
                if (key !== "constructor" && key !== "define" && key !== "inherits") this.define(key, getOwnPropertyDescriptor(proto, key) || {
                    writable: true,
                    enumerable: true,
                    configurable: true,
                    value: value
                });
            }, this);
            return this;
        };
        var prime = function(proto) {
            var superprime = proto.inherits;
            var constructor = has(proto, "constructor") ? proto.constructor : superprime ? function() {
                return superprime.apply(this, arguments);
            } : function() {};
            if (superprime) {
                var superproto = superprime.prototype;
                var cproto = constructor.prototype = create(superproto);
                constructor.parent = superproto;
                cproto.constructor = constructor;
            }
            constructor.define = proto.define || superprime && superprime.define || function(key, descriptor) {
                define(this.prototype, key, descriptor);
                return this;
            };
            constructor.implement = implement;
            return constructor.implement(proto);
        };
        prime.has = has;
        prime.each = each;
        prime.create = create;
        prime.define = define;
        module.exports = prime;
    },
    "4": function(require, module, exports, global) {
        "use strict";
        var array = require("5");
        module.exports = array.implement({
            set: function(i, value) {
                this[i] = value;
                return this;
            },
            get: function(i) {
                return i in this ? this[i] : null;
            },
            count: function() {
                return this.length;
            },
            each: function(method, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this && method.call(context, this[i], i, this) === false) break;
                }
                return this;
            },
            backwards: function(method, context) {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (i in this && method.call(context, this[i], i, this) === false) break;
                }
                return this;
            },
            index: function(value) {
                var index = array.indexOf(this, value);
                return index === -1 ? null : index;
            },
            remove: function(i) {
                return array.splice(this, i, 1)[0];
            }
        });
    },
    "5": function(require, module, exports, global) {
        "use strict";
        var array = require("6")["array"];
        var names = ("pop,push,reverse,shift,sort,splice,unshift,concat,join,slice,toString,indexOf,lastIndexOf,forEach,every,some" + ",filter,map,reduce,reduceRight").split(",");
        for (var methods = {}, i = 0, name, method; name = names[i++]; ) if (method = Array.prototype[name]) methods[name] = method;
        if (!methods.filter) methods.filter = function(fn, context) {
            var results = [];
            for (var i = 0, l = this.length >>> 0; i < l; i++) if (i in this) {
                var value = this[i];
                if (fn.call(context, value, i, this)) results.push(value);
            }
            return results;
        };
        if (!methods.indexOf) methods.indexOf = function(item, from) {
            for (var l = this.length >>> 0, i = from < 0 ? Math.max(0, l + from) : from || 0; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };
        if (!methods.map) methods.map = function(fn, context) {
            var length = this.length >>> 0, results = Array(length);
            for (var i = 0, l = length; i < l; i++) {
                if (i in this) results[i] = fn.call(context, this[i], i, this);
            }
            return results;
        };
        if (!methods.every) methods.every = function(fn, context) {
            for (var i = 0, l = this.length >>> 0; i < l; i++) {
                if (i in this && !fn.call(context, this[i], i, this)) return false;
            }
            return true;
        };
        if (!methods.some) methods.some = function(fn, context) {
            for (var i = 0, l = this.length >>> 0; i < l; i++) {
                if (i in this && fn.call(context, this[i], i, this)) return true;
            }
            return false;
        };
        if (!methods.forEach) methods.forEach = function(fn, context) {
            for (var i = 0, l = this.length >>> 0; i < l; i++) {
                if (i in this) fn.call(context, this[i], i, this);
            }
        };
        var toString = Object.prototype.toString;
        array.isArray = Array.isArray || function(self) {
            return toString.call(self) === "[object Array]";
        };
        module.exports = array.implement(methods);
    },
    "6": function(require, module, exports, global) {
        "use strict";
        var prime = require("3"), type = require("7");
        var slice = Array.prototype.slice;
        var ghost = prime({
            constructor: function ghost(self) {
                this.valueOf = function() {
                    return self;
                };
                this.toString = function() {
                    return self + "";
                };
                this.is = function(object) {
                    return self === object;
                };
            }
        });
        var shell = function(self) {
            if (self == null || self instanceof ghost) return self;
            var g = shell[type(self)];
            return g ? new g(self) : self;
        };
        var register = function() {
            var g = prime({
                inherits: ghost
            });
            return prime({
                constructor: function(self) {
                    return new g(self);
                },
                define: function(key, descriptor) {
                    var method = descriptor.value;
                    this[key] = function(self) {
                        return arguments.length > 1 ? method.apply(self, slice.call(arguments, 1)) : method.call(self);
                    };
                    g.prototype[key] = function() {
                        return shell(method.apply(this.valueOf(), arguments));
                    };
                    prime.define(this.prototype, key, descriptor);
                    return this;
                }
            });
        };
        for (var types = "string,number,array,object,date,function,regexp".split(","), i = types.length; i--; ) shell[types[i]] = register();
        module.exports = shell;
    },
    "7": function(require, module, exports, global) {
        "use strict";
        var toString = Object.prototype.toString, types = /number|object|array|string|function|date|regexp|boolean/;
        var type = function(object) {
            if (object == null) return "null";
            var string = toString.call(object).slice(8, -1).toLowerCase();
            if (string === "number" && isNaN(object)) return "null";
            if (types.test(string)) return string;
            return "object";
        };
        module.exports = type;
    },
    "8": function(require, module, exports, global) {
        "use strict";
        var prime = require("3"), array = require("5");
        var Map = prime({
            constructor: function() {
                if (!this || this.constructor !== Map) return new Map;
                this.length = 0;
                this._values = [];
                this._keys = [];
            },
            set: function(key, value) {
                var index = array.indexOf(this._keys, key);
                if (index === -1) {
                    this._keys.push(key);
                    this._values.push(value);
                    this.length++;
                } else {
                    this._values[index] = value;
                }
                return this;
            },
            get: function(key) {
                var index = array.indexOf(this._keys, key);
                return index === -1 ? null : this._values[index];
            },
            count: function() {
                return this.length;
            },
            each: function(method, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (method.call(context, this._values[i], this._keys[i], this) === false) break;
                }
                return this;
            },
            backwards: function(method, context) {
                for (var i = this.length - 1; i >= 0; i--) {
                    if (method.call(context, this._values[i], this._keys[i], this) === false) break;
                }
                return this;
            },
            map: function(method, context) {
                var results = new Map;
                this.each(function(value, key) {
                    results.set(key, method.call(context, value, key, this));
                }, this);
                return results;
            },
            filter: function(method, context) {
                var results = new Map;
                this.each(function(value, key) {
                    if (method.call(context, value, key, this)) results.set(key, value);
                }, this);
                return results;
            },
            every: function(method, context) {
                var every = true;
                this.each(function(value, key) {
                    if (!method.call(context, value, key, this)) return every = false;
                }, this);
                return every;
            },
            some: function(method, context) {
                var some = false;
                this.each(function(value, key) {
                    if (method.call(context, value, key, this)) return !(some = true);
                }, this);
                return some;
            },
            index: function(value) {
                var index = array.indexOf(this._values, value);
                return index > -1 ? this._keys[index] : null;
            },
            remove: function(key) {
                var index = array.indexOf(this._keys, key);
                if (index !== -1) {
                    this._keys.splice(index, 1);
                    this.length--;
                    return this._values.splice(index, 1)[0];
                }
                return null;
            },
            keys: function() {
                return this._keys.slice();
            },
            values: function() {
                return this._values.slice();
            }
        });
        module.exports = Map;
    },
    "9": function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var array = require("4");
        var bound = require("a");
        var mixin = require("d");
        var Event = require("e");
        require("b");
        require("g");
        var Emitter = module.exports = prime({
            addListener: function(type, listener) {
                type = type.toLowerCase();
                var listeners = this.__listeners || (this.__listeners = {});
                var events = listeners[type];
                if (events === undefined) {
                    events = listeners[type] = [];
                }
                if (array.index(events, listener) === null) array.push(events, listener);
                return this;
            },
            hasListener: function(type, listener) {
                type = type.toLowerCase();
                var events = this.__listeners[type];
                if (events === undefined) return this;
                return !!array.index(events, listener);
            },
            removeListener: function(type, listener) {
                type = type.toLowerCase();
                var events = this.__listeners[type];
                if (events === undefined) return this;
                array.remove(events, listener);
                return this;
            },
            removeListeners: function(type) {
                if (type) {
                    type = type.toLowerCase();
                    delete this.__listeners[type];
                    return this;
                }
                this.__listeners = [];
                return this;
            },
            on: function() {
                return this.addListener.apply(this, arguments);
            },
            off: function() {
                return this.removeListener.apply(this, arguments);
            },
            once: function(type, listener) {},
            emit: function(event) {
                if (typeof event === "string") {
                    event = new Event(event, false);
                }
                var type = event.type;
                var args = array.slice(arguments, 1);
                if (event.source === null) event.__setSource(this);
                var listeners = this.__listeners || (this.__listeners = {});
                var events = listeners[type];
                if (events) {
                    for (var i = 0, l = events.length; i < l; i++) {
                        events[i].apply(this, args);
                    }
                }
                if (!event.bubbles || event.stopped) return this;
                var responder = this.__responder;
                if (responder) {
                    arguments[0] = event;
                    responder.emit.apply(responder, arguments);
                }
                return this;
            },
            insertResponder: function(responder) {
                var parent = this.responder;
                if (parent) {
                    responder.responder = parent;
                }
                this.responder = responder;
            }
        });
        mixin(Emitter, bound);
        prime.define(Emitter.prototype, "responder", {
            set: function(value) {
                this.__responder = value;
            },
            get: function() {
                return this.__responder;
            }
        });
    },
    a: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var fn = require("b");
        var bound = prime({
            bound: function(name) {
                var bound = this._bound || (this._bound = {});
                return bound[name] || (bound[name] = fn.bound(this[name], this));
            }
        });
        module.exports = bound;
    },
    b: function(require, module, exports, global) {
        "use strict";
        var fn = require("c");
        var slice = Array.prototype.slice;
        fn.implement({
            bound: function(thisArg) {
                var args = slice.call(arguments, 1), self = this;
                return function() {
                    return self.apply(thisArg, args.concat(slice.call(arguments)));
                };
            }
        });
        module.exports = fn;
    },
    c: function(require, module, exports, global) {
        "use strict";
        var function_ = require("6")["function"];
        var names = "apply,bind,call,isGenerator,toString".split(",");
        for (var methods = {}, i = 0, name, method; name = names[i++]; ) if (method = Function.prototype[name]) methods[name] = method;
        module.exports = function_.implement(methods);
    },
    d: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var slice = Array.prototype.slice;
        function mixin(object) {
            var mixins = slice.call(arguments, 1);
            for (var i = 0; i < mixins.length; i++) {
                object.implement(prime.create(mixins[i].prototype));
            }
            return object;
        }
        module.exports = mixin;
    },
    e: function(require, module, exports, global) {
        "use strict";
        module.exports = require("f");
    },
    f: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var Event = module.exports = prime({
            constructor: function(type, bubbles) {
                this.__type = type.toLowerCase();
                this.__source = null;
                this.__bubbles = bubbles || true;
                this.__stopped = false;
                this.__timestamp = Date.now();
                return this;
            },
            stop: function() {
                this.__stopped = true;
                return this;
            },
            __setSource: function(source) {
                this.__source = source;
            }
        });
        prime.define(Event.prototype, "type", {
            get: function() {
                return this.__type;
            }
        });
        prime.define(Event.prototype, "bubbles", {
            get: function() {
                return this.__bubbles;
            }
        });
        prime.define(Event.prototype, "stopped", {
            get: function() {
                return this.__stopped;
            }
        });
        prime.define(Event.prototype, "source", {
            get: function() {
                return this.__source;
            }
        });
        prime.define(Event.prototype, "timestamp", {
            get: function() {
                return this.__timestamp;
            }
        });
    },
    g: function(require, module, exports, global) {
        "use strict";
        var array = require("5");
        var number = require("h");
        array.implement({
            clean: function() {
                return array.filter(this, function(item) {
                    return item !== null && item !== undefined;
                });
            },
            invoke: function(methodName) {
                var args = array.slice(arguments, 1);
                return array.map(this, function(item) {
                    return item[methodName].apply(item, args);
                });
            },
            associate: function(keys) {
                var obj = {}, length = Math.min(this.length, keys.length);
                for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
                return obj;
            },
            contains: function(item, from) {
                return array.indexOf(this, item, from) != -1;
            },
            append: function(items) {
                this.push.apply(this, items);
                return this;
            },
            last: function() {
                return this.length ? this[this.length - 1] : null;
            },
            random: function() {
                return this.length ? this[number.random(0, this.length - 1)] : null;
            },
            include: function(item) {
                if (!array.contains(this, item)) array.push(this, item);
                return this;
            },
            combine: function(items) {
                for (var i = 0, l = items.length; i < l; i++) array.include(this, items[i]);
                return this;
            },
            empty: function() {
                this.length = 0;
                return this;
            },
            pick: function() {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (this[i] !== null && this[i] !== undefined) return this[i];
                }
                return null;
            },
            find: function(fn, context) {
                for (var i = 0, l = this.length; i < l; i++) {
                    var item = this[i];
                    if (fn.call(context, item, i, this)) return item;
                }
                return null;
            }
        });
        module.exports = array;
    },
    h: function(require, module, exports, global) {
        "use strict";
        var number = require("i");
        module.exports = number.implement({
            limit: function(min, max) {
                return Math.min(max, Math.max(min, this));
            },
            round: function(precision) {
                precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
                return Math.round(this * precision) / precision;
            },
            times: function(fn, context) {
                for (var i = 0; i < this; i++) fn.call(context, i, null, this);
                return this;
            },
            random: function(max) {
                return Math.floor(Math.random() * (max - this + 1) + this);
            }
        });
    },
    i: function(require, module, exports, global) {
        "use strict";
        var number = require("6")["number"];
        var names = "toExponential,toFixed,toLocaleString,toPrecision,toString,valueOf".split(",");
        for (var methods = {}, i = 0, name, method; name = names[i++]; ) if (method = Number.prototype[name]) methods[name] = method;
        module.exports = number.implement(methods);
    },
    j: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var mixin = require("d");
        var Point = require("k");
        var Size = require("m");
        var Emitter = require("9");
        var Properties = require("l");
        var Rect = module.exports = prime({
            constructor: function(x, y, w, h) {
                var rect = arguments[0];
                if (rect instanceof Rect) {
                    x = rect.origin.x;
                    y = rect.origin.y;
                    w = rect.size.x;
                    h = rect.size.y;
                }
                this.origin = new Point(x, y);
                this.size = new Size(w, h);
                return this;
            }
        });
        mixin(Rect, Emitter);
        mixin(Rect, Properties);
        Properties.define(Rect, "origin", {
            value: function() {
                return new Point(0, 0);
            }
        });
        Properties.define(Rect, "size", {
            value: function() {
                return new Size(0, 0);
            }
        });
        Rect.union = function(r1, r2) {
            var x1 = Math.min(r1.origin.x, r2.origin.x);
            var y1 = Math.min(r1.origin.y, r2.origin.y);
            var x2 = Math.max(r1.origin.x + r1.size.x, r2.origin.x + r2.size.x);
            var y2 = Math.max(r1.origin.y + r1.size.y, r2.origin.x + r2.size.y);
            return new Rect(x1, y1, x2 - x1, y2 - y1);
        };
    },
    k: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var mixin = require("d");
        var Emitter = require("9");
        var Properties = require("l");
        var Point = module.exports = prime({
            constructor: function(x, y) {
                var point = arguments[0];
                if (point instanceof Point) {
                    x = point.x;
                    y = point.y;
                }
                this.x = x || 0;
                this.y = y || 0;
                return this;
            }
        });
        mixin(Point, Emitter);
        mixin(Point, Properties);
        Properties.define(Point, "x", {
            value: 0
        });
        Properties.define(Point, "y", {
            value: 0
        });
    },
    l: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var mixin = require("d");
        var Properties = module.exports = prime({});
        Properties.define = function(prime, name, descriptor) {
            var parentSetter = null;
            var parentGetter = null;
            var parent = prime.parent;
            if (parent) {
                var parentDescriptor = Object.getOwnPropertyDescriptor(parent, name);
                if (parentDescriptor) {
                    parentSetter = parent.set;
                    parentGetter = parent.get;
                }
            }
            descriptor = descriptor || {};
            var proto = prime.prototype || prime;
            var bound = descriptor.bound || "__" + name;
            var value = descriptor.value || null;
            var write = descriptor.writable || true;
            var onSet = descriptor.onSet || function() {};
            var onGet = descriptor.onGet || function() {};
            if (!typeof value === "function") {
                value = function() {
                    return value;
                };
            }
            var setter = function(value) {
                if (!write) throw new Error("Property " + name + " is read-only");
                var current = this[bound];
                var changed = onSet.call(this, value, current, parentSetter);
                if (changed === undefined) {
                    changed = value;
                }
                if (current === changed) return;
                this[bound] = changed;
                if (this.emit) {
                    this.emit("propertychange", name, changed);
                }
            };
            var getter = function() {
                var current = bound in this ? this[bound] : this[bound] = value.call(this);
                var changed = onGet.call(this, current, parentGetter);
                if (changed == undefined) {
                    changed = current;
                }
                return changed;
            };
            Object.defineProperty(proto, name, {
                set: setter,
                get: getter
            });
        };
    },
    m: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var mixin = require("d");
        var Emitter = require("9");
        var Properties = require("l");
        var Size = module.exports = prime({
            constructor: function(x, y) {
                var size = arguments[0];
                if (size instanceof Size) {
                    x = size.x;
                    y = size.y;
                }
                this.x = x || 0;
                this.y = y || 0;
                return this;
            }
        });
        mixin(Size, Emitter);
        mixin(Size, Properties);
        Properties.define(Size, "x", {
            value: 0
        });
        Properties.define(Size, "y", {
            value: 0
        });
    },
    n: function(require, module, exports, global) {
        "use strict";
        module.exports = require("o");
    },
    o: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var array = require("4");
        var Emitter = require("9");
        var Rect = require("j");
        var Size = require("m");
        var Point = require("k");
        var ViewStyle = require("p");
        var ViewRenderer = require("q");
        require("g");
        var View = module.exports = prime({
            inherits: Emitter,
            constructor: function(name) {
                this.__name = name;
                this.__style = new ViewStyle(this);
                this.__opacity = 1;
                this.__visible = true;
                this.__parent = null;
                this.__window = null;
                this.__children = [];
                this.origin = new Point(0, 0);
                this.center = new Point(0, 0);
                this.size = new Size;
                this.on("add", this.bound("onAdd"));
                this.on("remove", this.bound("onRemove"));
                this.on("addtoparent", this.bound("onAddToParent"));
                this.on("addtowindow", this.bound("onAddToWindow"));
                this.on("removefromparent", this.bound("onRemoveFromParent"));
                this.on("removefromwindow", this.bound("onRemoveFromWindow"));
                this.on("touchcancel", this.bound("onTouchCancel"));
                this.on("touchstart", this.bound("onTouchStart"));
                this.on("touchmove", this.bound("onTouchMove"));
                this.on("touchend", this.bound("onTouchEnd"));
                return this;
            },
            destroy: function() {
                this.removeFromParent();
                this.__name = null;
                this.__style.destroy();
                this.__style = null;
                this.__opacity = null;
                this.__visible = null;
                this.__origin.on("propertychange", this.bound("__onOriginChange"));
                this.__center.on("propertychange", this.bound("__onCenterChange"));
                this.__size.on("propertychange", this.bound("__onSizeChange"));
                this.__origin = null;
                this.__center = null;
                this.__size = null;
                this.__parent = null;
                this.__window = null;
                this.__children = null;
                this.off("add", this.bound("onAdd"));
                this.off("remove", this.bound("onRemove"));
                this.off("addtoparent", this.bound("onAddToParent"));
                this.off("addtowindow", this.bound("onAddToWindow"));
                this.off("removefromparent", this.bound("onRemoveFromParent"));
                this.off("removefromwindow", this.bound("onRemoveFromWindow"));
                this.off("touchcancel", this.bound("onTouchCancel"));
                this.off("touchstart", this.bound("onTouchStart"));
                this.off("touchmove", this.bound("onTouchMove"));
                this.off("touchend", this.bound("onTouchEnd"));
                this.removeListeners();
                ViewRenderer.free(this);
                return this;
            },
            moveTo: function(x, y) {
                x = x || 0;
                y = y || 0;
                this.origin = new Point(x, y);
                return this;
            },
            moveBy: function(x, y) {
                var origin = this.origin;
                origin.x += x || 0;
                origin.y += y || 0;
                this.origin = origin;
                return this;
            },
            resizeTo: function(x, y) {
                x = x || 0;
                y = y || 0;
                this.size = new Size(x, y);
                return this;
            },
            resizeBy: function(x, y) {
                var size = this.size;
                size.x += x || 0;
                size.y += y || 0;
                this.size = size;
                return this;
            },
            addChild: function(view) {
                return this.addChildAt(view, this.__children.length);
            },
            addChildAt: function(view, index) {
                var children = this.__children;
                if (index > children.length || index < 0) return;
                view.removeFromParent();
                array.splice(children, index, 1, view);
                view.responder = this;
                view.__setParent(this);
                view.__setWindow(this.window);
                this.emit("add", view);
                return this.reflow();
            },
            addChildBefore: function(child, before) {
                var index = this.getChildIndex(before);
                if (index === null) return this;
                return this.addChildAt(child, index);
            },
            addChildAfter: function(child, after) {
                var index = this.getChildIndex(before);
                if (index === null) return this;
                return this.addChildAt(child, index + 1);
            },
            removeChild: function(child, destroy) {
                var index = this.getChildIndex(child);
                if (index === null) return this;
                return this.removeChildAt(index, destroy);
            },
            removeChildAt: function(index, destroy) {
                var children = this.__children;
                var view = children[index];
                if (view === undefined) return this;
                array.splice(children, index, 1);
                view.__setParent(null);
                view.__setWindow(null);
                view.responder = null;
                this.emit("remove", view);
                if (destroy) view.destroy();
                return this.reflow();
            },
            removeFromParent: function(destroy) {
                if (this.__parent) {
                    this.__parent.removeChild(this, destroy);
                }
                return this;
            },
            getChild: function(name) {
                return array.find(this.__children, function(view) {
                    return view.name === name;
                });
            },
            getChildAt: function(index) {
                return this.__children[index] || null;
            },
            getChildByTypeAt: function(type, index) {
                return this;
            },
            getChildIndex: function(child) {
                return array.indexOf(this.__children, child);
            },
            getViewAtPoint: function(x, y) {
                if (this.contains(x, y) === false) return null;
                var children = this.__children;
                for (var i = children.length - 1; i >= 0; i--) {
                    var child = children[i];
                    if (child.contains(x, y)) {
                        var origin = child.origin;
                        var relx = x - origin.x;
                        var rely = y - origin.y;
                        return child.getViewAtPoint(relx, rely) || child;
                    }
                }
                return null;
            },
            contains: function(x, y) {
                var point = arguments[0];
                if (point instanceof Point) {
                    x = point.x;
                    y = point.y;
                }
                var s = this.__size;
                var o = this.__origin;
                return x >= o.x && x <= o.x + s.x && y >= o.y && y <= o.y + s.y;
            },
            draw: function(context, area) {
                if (this.__style) {
                    this.__style.draw(context, area);
                }
                return this;
            },
            redraw: function(area) {
                ViewRenderer.redraw(this, area || new Rect(0, 0, this.__size.x, this.__size.y));
                return this;
            },
            reflow: function() {
                ViewRenderer.reflow(this);
                return this;
            },
            onAdd: function(view) {},
            onRemove: function(view) {},
            onAddToParent: function(parent) {},
            onAddToWindow: function(masterView) {},
            onRemoveFromParent: function(parent) {},
            onRemoveFromWindow: function(masterView) {},
            onTouchCancel: function(e) {},
            onTouchStart: function(e) {},
            onTouchMove: function(e) {},
            onTouchEnd: function(e) {},
            __setParent: function(value) {
                var parent = this.__parent;
                if (parent && value === null) {
                    this.__parent = value;
                    return this.emit("removefromparent", parent);
                }
                if (parent === null && value) {
                    this.__parent = value;
                    return this.emit("addtoparent", parent);
                }
                return this;
            },
            __setWindow: function(value) {
                var master = this.__window;
                if (master && value === null) {
                    this.__window = value;
                    return this.emit("removefromwindow", master);
                }
                if (master === null && value) {
                    this.__window = value;
                    return this.emit("addtowindow", master);
                }
                return this;
            },
            __onSizeChange: function(key, val, e) {
                var origin = this.__origin;
                var center = this.__center;
                switch (key) {
                  case "x":
                    center.x = origin.x + val / 2;
                    break;
                  case "y":
                    center.y = origin.y + val / 2;
                    break;
                }
                this.reflow();
            },
            __onOriginChange: function(key, val, e) {
                var size = this.__size;
                var center = this.__center;
                switch (key) {
                  case "x":
                    center.x = val + size.x / 2;
                    break;
                  case "y":
                    center.y = val + size.y / 2;
                    break;
                }
                this.reflow();
            },
            __onCenterChange: function(key, val, e) {
                var size = this.__size;
                var origin = this.__origin;
                switch (key) {
                  case "x":
                    origin.x = val - size.x / 2;
                    break;
                  case "y":
                    origin.y = val - size.y / 2;
                    break;
                }
                this.reflow();
            },
            __onAddToWindow: function(masterView) {
                this.__window = masterView;
                array.invoke(this.__children, "emit", "addtowindow", masterView);
            },
            __onRemoveFromWindow: function(masterView) {
                this.__window = null;
                array.invoke(this.__children, "emit", "removefromwindow", masterView);
            }
        });
        prime.define(View.prototype, "name", {
            get: function() {
                return this.__name;
            }
        });
        prime.define(View.prototype, "size", {
            set: function(value) {
                var func = this.bound("__onSizeChange");
                var size = this.__size;
                if (size) {
                    size.off("propertychange", func);
                }
                size = this.__size = value;
                size.on("propertychange", func);
                if (size.x !== value.x || size.y !== value.y) {
                    this.emit("resize").reflow();
                }
            },
            get: function() {
                return this.__size;
            }
        });
        prime.define(View.prototype, "origin", {
            set: function(value) {
                var func = this.bound("__onOriginChange");
                var origin = this.__origin;
                if (origin) {
                    origin.off("propertychange", func);
                }
                origin = this.__origin = value;
                origin.on("propertychange", func);
                if (origin.x !== value.x || origin.y !== value.y) {
                    this.emit("move").reflow();
                }
            },
            get: function() {
                return this.__origin;
            }
        });
        prime.define(View.prototype, "center", {
            set: function(value) {
                var func = this.bound("__onCenterChange");
                var center = this.__center;
                if (center) {
                    center.off("propertychange", func);
                }
                center = this.__center = value;
                center.on("propertychange", func);
                if (center.x !== value.x || center.y !== value.y) {
                    this.emit("move").reflow();
                }
            },
            get: function() {
                return this.__center;
            }
        });
        prime.define(View.prototype, "visible", {
            set: function(value) {
                if (this.__visible !== value) {
                    this.__visible = value;
                    this.reflow();
                }
            },
            get: function() {
                return this.__visible;
            }
        });
        prime.define(View.prototype, "opacity", {
            set: function(value) {
                if (value > 1) value = 1;
                if (value < 0) value = 0;
                if (this.__opacity !== value) {
                    this.__opacity = value;
                    this.reflow();
                }
            },
            get: function() {
                return this.__opacity;
            }
        });
        prime.define(View.prototype, "style", {
            set: function(value) {
                this.__style = value;
            },
            get: function() {
                return this.__style;
            }
        });
        prime.define(View.prototype, "parent", {
            get: function() {
                return this.__parent;
            }
        });
        prime.define(View.prototype, "window", {
            get: function() {
                return this.__window;
            }
        });
        prime.define(View.prototype, "children", {
            get: function() {
                return array.slice(this.__children);
            }
        });
    },
    p: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var array = require("4");
        var mixin = require("d");
        var bound = require("a");
        var ViewStyle = module.exports = prime({
            constructor: function(view) {
                this.__view = view;
                this.__backgroundColor = "";
                this.__backgroundImage = "";
                this.__backgroundRepeat = "";
                return this;
            },
            destroy: function() {
                this.__view = null;
                return this;
            },
            draw: function(context, area) {
                var x = area.origin.x;
                var y = area.origin.y;
                var w = area.size.x;
                var h = area.size.y;
                var backgroundColor = this.__backgroundColor;
                if (backgroundColor) {
                    context.fillStyle = backgroundColor;
                    context.fillRect(x, y, w, h);
                }
                var backgroundImage = this.__backgroundImage;
                if (backgroundImage && backgroundImage.naturalWidth && backgroundImage.naturalHeight) {
                    var pattern = context.createPattern(backgroundImage, this.__backgroundRepeat || "repeat");
                    context.fillStyle = pattern;
                    context.fillRect(x, y, w, h);
                }
            },
            __onBackgroundImageLoad: function() {
                this.view.redraw();
            }
        });
        mixin(ViewStyle, bound);
        prime.define(ViewStyle.prototype, "view", {
            get: function() {
                return this.__view;
            }
        });
        prime.define(ViewStyle.prototype, "backgroundColor", {
            set: function(value) {
                if (this.__backgroundColor !== value) {
                    this.__backgroundColor = value;
                    this.view.redraw();
                }
            },
            get: function() {
                return this.__backgroundColor;
            }
        });
        prime.define(ViewStyle.prototype, "backgroundImage", {
            set: function(value) {
                if (this.__backgroundImage) {
                    this.__backgroundImage.removeEventListener("load", this.bound("__onBackgroundImageLoad"));
                    this.__backgroundImage = null;
                }
                this.__backgroundImage = new Image;
                this.__backgroundImage.src = value;
                this.__backgroundImage.addEventListener("load", this.bound("__onBackgroundImageLoad"));
            },
            get: function() {
                return this.__backgroundImage && this.__backgroundImage.src || "";
            }
        });
    },
    q: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var Map = require("8");
        var requestFrame = require("r").request;
        var cancelFrame = require("r").cancel;
        var Rect = require("j");
        var Size = require("m");
        var Point = require("k");
        var Emitter = require("9");
        var buffers = new Map;
        var redraws = new Map;
        var instances = new Map;
        var ViewRenderer = module.exports = prime({
            inherits: Emitter,
            constructor: function(view) {
                this.__view = view;
                this.__canvas = document.createElement("canvas");
                this.__canvas.width = this.__view.size.x;
                this.__canvas.height = this.__view.size.y;
                document.body.appendChild(this.__canvas);
                this.__context = this.__canvas.getContext("2d");
                this.__nextFrame = null;
            },
            redraw: function(view, area) {
                var a = redraws.get(view);
                if (a) {
                    a = Rect.union(a, area);
                } else {
                    a = area;
                }
                redraws.set(view, a);
                if (this.__nextFrame === null) {
                    this.__nextFrame = requestFrame(this.render.bind(this));
                }
                return this;
            },
            reflow: function(view) {
                if (this.__nextFrame === null) {
                    this.__nextFrame = requestFrame(this.render.bind(this));
                }
                return this;
            },
            render: function() {
                this.__nextFrame = null;
                if (this.__view === null) return;
                this.__context.clearRect(0, 0, this.__view.size.x, this.__view.size.y);
                var self = this;
                var paint = function(view, offset) {
                    if (view.visible === false) return;
                    var context = null;
                    var buffer = buffers.get(view);
                    if (buffer === null) {
                        buffer = document.createElement("canvas");
                        buffer.width = view.size.x;
                        buffer.height = view.size.y;
                        context = buffer.getContext("2d");
                        context.save();
                        view.draw(context, new Rect(0, 0, view.size.x, view.size.y));
                        context.restore();
                        buffers.set(view, buffer);
                        redraws.remove(view);
                    }
                    var area = redraws.get(view);
                    if (area) {
                        context = buffer.getContext("2d");
                        context.save();
                        context.rect(area.origin.x, area.origin.y, area.size.x, area.size.y);
                        context.clip();
                        view.draw(context, area);
                        context.restore();
                        redraws.remove(view);
                    }
                    var origin = new Point(offset.x + view.origin.x, offset.y + view.origin.y);
                    self.__context.save();
                    self.__context.globalAlpha = view.opacity;
                    self.__context.drawImage(buffer, 0, 0, view.size.x, view.size.y, origin.x, origin.y, view.size.x, view.size.y);
                    var children = view.children;
                    for (var i = 0; i < children.length; i++) paint(children[i], origin);
                    self.__context.restore();
                };
                paint(this.__view, new Point);
                return this;
            }
        });
        prime.define(ViewRenderer.prototype, "canvas", {
            get: function() {
                return this.__canvas;
            }
        });
        var root = function(view) {
            while (view.parent) view = view.parent;
            return view;
        };
        ViewRenderer.create = function(view) {
            var instance = instances.get(view);
            if (instance) {
                throw new Error("There is already a renderer assocaited with this view");
            }
            instance = new ViewRenderer(view);
            instances.set(view, instance);
            return instance;
        };
        ViewRenderer.get = function(view) {
            var instance = instances.get(root(view));
            if (instance) return instance;
            return null;
        };
        ViewRenderer.redraw = function(view, area) {
            var instance = ViewRenderer.get(view);
            if (instance) {
                instance.redraw(view, area);
            }
            return this;
        };
        ViewRenderer.reflow = function(view) {
            var instance = ViewRenderer.get(view);
            if (instance) {
                instance.reflow(view);
            }
            return this;
        };
        ViewRenderer.free = function(view) {
            var buffer = buffers.get(view);
            if (buffer) {
                buffer.width = 0;
                bugger.height = 0;
            }
            buffers.remove(view);
            redraws.remove(view);
        };
    },
    r: function(require, module, exports, global) {
        "use strict";
        var array = require("5");
        var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame || function(callback) {
            return setTimeout(callback, 1e3 / 60);
        };
        var callbacks = [];
        var iterator = function(time) {
            var split = callbacks.splice(0, callbacks.length);
            for (var i = 0, l = split.length; i < l; i++) split[i](time || (time = +(new Date)));
        };
        var cancel = function(callback) {
            var io = array.indexOf(callbacks, callback);
            if (io > -1) callbacks.splice(io, 1);
        };
        var request = function(callback) {
            var i = callbacks.push(callback);
            if (i === 1) requestFrame(iterator);
            return function() {
                cancel(callback);
            };
        };
        exports.request = request;
        exports.cancel = cancel;
    },
    s: function(require, module, exports, global) {
        "use strict";
        module.exports = require("t");
    },
    t: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var array = require("4");
        var Emitter = require("9");
        var View = require("n");
        var ViewController = module.exports = prime({
            inherits: Emitter,
            constructor: function() {
                ViewController.parent.constructor.call(this);
                this.__view = null;
                this.loadView();
                this.view.insertResponder(this);
                this.on("touchcancel", this.bound("onTouchCancel"));
                this.on("touchstart", this.bound("onTouchStart"));
                this.on("touchmove", this.bound("onTouchMove"));
                this.on("touchend", this.bound("onTouchEnd"));
            },
            destroy: function() {
                this.off("touchcancel", this.bound("onTouchCancel"));
                this.off("touchstart", this.bound("onTouchStart"));
                this.off("touchmove", this.bound("onTouchMove"));
                this.off("touchend", this.bound("onTouchEnd"));
            },
            loadView: function() {
                this.view = new View;
            },
            onTouchCancel: function() {},
            onTouchStart: function() {},
            onTouchMove: function() {},
            onTouchEnd: function() {}
        });
        prime.define(ViewController.prototype, "view", {
            set: function(value) {
                this.__view = value;
            },
            get: function(value) {
                return this.__view;
            }
        });
    },
    u: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var Point = require("k");
        var Touch = module.exports = prime({
            constructor: function(target, x, y) {
                this.__identifier = Date.now();
                this.__setTarget(target);
                this.__setOrigin(x, y);
                return this;
            },
            __setOrigin: function(x, y) {
                this.__origin = new Point(x, y);
                return this;
            },
            __setTarget: function(target) {
                this.__target = target;
                return this;
            }
        });
        prime.define(Touch.prototype, "identifier", {
            get: function() {
                return this.__identifier;
            }
        });
        prime.define(Touch.prototype, "target", {
            get: function() {
                return this.__target;
            }
        });
        prime.define(Touch.prototype, "origin", {
            get: function() {
                return new Point(this.__origin);
            }
        });
    },
    v: function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var array = require("4");
        var Event = require("f");
        var TouchEvent = module.exports = prime({
            inherits: Event,
            constructor: function(type, bubbles, touches) {
                TouchEvent.parent.constructor.call(this, type, bubbles);
                this.__touches = array.slice(touches);
                return this;
            }
        });
        prime.define(TouchEvent.prototype, "touches", {
            get: function() {
                return this.__touches;
            }
        });
    },
    w: function(require, module, exports, global) {
        "use strict";
        require("x");
        require("z");
        require("10");
    },
    x: function(require, module, exports, global) {
        "use strict";
        var storage = require("y").createStorage();
        var customs = {};
        var dispatchEvent = Element.prototype.dispatchEvent;
        var addEventListener = Element.prototype.addEventListener;
        var removeEventListener = Element.prototype.removeEventListener;
        Element.prototype.dispatchEvent = function(event, data) {
            var custom = customs[event];
            if (custom) {
                data = data || {};
                if (fail(custom.condition, this, data)) return;
                var name = event;
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(name, custom.bubbleable, custom.cancelable);
                custom.onDispatch.call(this, event, data);
            }
            return dispatchEvent.call(this, event);
        };
        Element.prototype.addEventListener = function(type, listener, capture) {
            var custom = customs[type];
            if (custom) {
                custom.onAdd.call(this);
                listener = validate(this, type, listener);
                var name = root(custom);
                if (name) addEventListener.call(this, name, dispatch(this, type, listener), capture);
            }
            return addEventListener.call(this, type, listener, capture);
        };
        Element.prototype.removeEventListener = function(type, listener, capture) {
            var custom = customs[type];
            if (custom) {
                custom.onRemove.call(this);
                listener = validate(this, type, listener);
                var name = root(custom);
                if (name) removeEventListener.call(this, name, dispatch(this, type, listener), capture);
                detach(this, type, listener);
            }
            return removeEventListener.call(this, type, listener, capture);
        };
        var defineCustomEvent = function(name, custom) {
            custom.base = "base" in custom ? custom.base : null;
            custom.condition = "condition" in custom ? custom.condition : true;
            custom.bubbleable = "bubbleable" in custom ? custom.bubbleable : true;
            custom.cancelable = "cancelable" in custom ? custom.cancelable : true;
            custom.onAdd = custom.onAdd || function() {};
            custom.onRemove = custom.onRemove || function() {};
            custom.onDispatch = custom.onDispatch || function() {};
            var base = customs[custom.base];
            var condition = function(e) {
                return pass(base.condition, this, e) && pass(custom.condition, this, e);
            };
            customs[name] = base ? {
                base: base.base,
                bubbleable: custom.bubbleable,
                cancelable: custom.cancelable,
                condition: condition,
                onAdd: inherit(custom, base, "onAdd"),
                onRemove: inherit(custom, base, "onRemove"),
                onDispatch: inherit(custom, base, "onDispatch")
            } : custom;
        };
        var inherit = function(custom, base, method) {
            return function() {
                base[method].apply(this, arguments);
                custom[method].apply(this, arguments);
            };
        };
        var root = function(custom) {
            var base = custom.base;
            if (base === null) return null;
            var parent = customs[base];
            if (parent) return root(parent);
            return base;
        };
        var pass = function(condition, element, e) {
            return typeof condition === "function" ? condition.call(element, e) : condition;
        };
        var fail = function(condition, element, e) {
            return !pass(condition, element, e);
        };
        var handler = function(element, type, listener) {
            var events = storage(element);
            if (events[type] === undefined) {
                events[type] = [];
            }
            events = events[type];
            for (var i = 0, l = events.length; i < l; i++) {
                var event = events[i];
                if (event.listener === listener) return event;
            }
            event = events[events.length] = {
                dispatch: null,
                validate: null,
                listener: listener
            };
            return event;
        };
        var detach = function(element, type, listener) {
            var events = storage(element);
            if (events[type] === undefined) return;
            events = events[type];
            for (var i = 0, l = events.length; i < l; i++) {
                var event = events[i];
                if (event.listener === listener) {
                    events.splice(i, 1);
                }
            }
            return event;
        };
        var dispatch = function(element, type, listener) {
            var event = handler(element, type, listener);
            if (event.dispatch === null) {
                event.dispatch = function(e) {
                    element.dispatchEvent(type, e);
                };
            }
            return event.dispatch;
        };
        var validate = function(element, type, listener) {
            var event = handler(element, type, listener);
            if (event.validate === null) {
                event.validate = function(e) {
                    if (e instanceof CustomEvent) listener.call(this, e);
                };
            }
            return event.validate;
        };
        module.exports = global.defineCustomEvent = defineCustomEvent;
    },
    y: function(require, module, exports, global) {
        void function(global, undefined_, undefined) {
            var getProps = Object.getOwnPropertyNames, defProp = Object.defineProperty, toSource = Function.prototype.toString, create = Object.create, hasOwn = Object.prototype.hasOwnProperty, funcName = /^\n?function\s?(\w*)?_?\(/;
            function define(object, key, value) {
                if (typeof key === "function") {
                    value = key;
                    key = nameOf(value).replace(/_$/, "");
                }
                return defProp(object, key, {
                    configurable: true,
                    writable: true,
                    value: value
                });
            }
            function nameOf(func) {
                return typeof func !== "function" ? "" : "name" in func ? func.name : toSource.call(func).match(funcName)[1];
            }
            var Data = function() {
                var dataDesc = {
                    value: {
                        writable: true,
                        value: undefined
                    }
                }, datalock = "return function(k){if(k===s)return l}", uids = create(null), createUID = function() {
                    var key = Math.random().toString(36).slice(2);
                    return key in uids ? createUID() : uids[key] = key;
                }, globalID = createUID(), storage = function(obj) {
                    if (hasOwn.call(obj, globalID)) return obj[globalID];
                    if (!Object.isExtensible(obj)) throw new TypeError("Object must be extensible");
                    var store = create(null);
                    defProp(obj, globalID, {
                        value: store
                    });
                    return store;
                };
                define(Object, function getOwnPropertyNames(obj) {
                    var props = getProps(obj);
                    if (hasOwn.call(obj, globalID)) props.splice(props.indexOf(globalID), 1);
                    return props;
                });
                function Data() {
                    var puid = createUID(), secret = {};
                    this.unlock = function(obj) {
                        var store = storage(obj);
                        if (hasOwn.call(store, puid)) return store[puid](secret);
                        var data = create(null, dataDesc);
                        defProp(store, puid, {
                            value: (new Function("s", "l", datalock))(secret, data)
                        });
                        return data;
                    };
                }
                define(Data.prototype, function get(o) {
                    return this.unlock(o).value;
                });
                define(Data.prototype, function set(o, v) {
                    this.unlock(o).value = v;
                });
                return Data;
            }();
            var WM = function(data) {
                var validate = function(key) {
                    if (key == null || typeof key !== "object" && typeof key !== "function") throw new TypeError("Invalid WeakMap key");
                };
                var wrap = function(collection, value) {
                    var store = data.unlock(collection);
                    if (store.value) throw new TypeError("Object is already a WeakMap");
                    store.value = value;
                };
                var unwrap = function(collection) {
                    var storage = data.unlock(collection).value;
                    if (!storage) throw new TypeError("WeakMap is not generic");
                    return storage;
                };
                var initialize = function(weakmap, iterable) {
                    if (iterable !== null && typeof iterable === "object" && typeof iterable.forEach === "function") {
                        iterable.forEach(function(item, i) {
                            if (item instanceof Array && item.length === 2) set.call(weakmap, iterable[i][0], iterable[i][1]);
                        });
                    }
                };
                function WeakMap(iterable) {
                    if (this === global || this == null || this === WeakMap.prototype) return new WeakMap(iterable);
                    wrap(this, new Data);
                    initialize(this, iterable);
                }
                function get(key) {
                    validate(key);
                    var value = unwrap(this).get(key);
                    return value === undefined_ ? undefined : value;
                }
                function set(key, value) {
                    validate(key);
                    unwrap(this).set(key, value === undefined ? undefined_ : value);
                }
                function has(key) {
                    validate(key);
                    return unwrap(this).get(key) !== undefined;
                }
                function delete_(key) {
                    validate(key);
                    var data = unwrap(this), had = data.get(key) !== undefined;
                    data.set(key, undefined);
                    return had;
                }
                function toString() {
                    unwrap(this);
                    return "[object WeakMap]";
                }
                try {
                    var src = ("return " + delete_).replace("e_", "\\u0065"), del = (new Function("unwrap", "validate", src))(unwrap, validate);
                } catch (e) {
                    var del = delete_;
                }
                var src = ("" + Object).split("Object");
                var stringifier = function toString() {
                    return src[0] + nameOf(this) + src[1];
                };
                define(stringifier, stringifier);
                var prep = {
                    __proto__: []
                } instanceof Array ? function(f) {
                    f.__proto__ = stringifier;
                } : function(f) {
                    define(f, stringifier);
                };
                prep(WeakMap);
                [ toString, get, set, has, del ].forEach(function(method) {
                    define(WeakMap.prototype, method);
                    prep(method);
                });
                return WeakMap;
            }(new Data);
            var defaultCreator = Object.create ? function() {
                return Object.create(null);
            } : function() {
                return {};
            };
            function createStorage(creator) {
                var weakmap = new WM;
                creator || (creator = defaultCreator);
                function storage(object, value) {
                    if (value || arguments.length === 2) {
                        weakmap.set(object, value);
                    } else {
                        value = weakmap.get(object);
                        if (value === undefined) {
                            value = creator(object);
                            weakmap.set(object, value);
                        }
                    }
                    return value;
                }
                return storage;
            }
            if (typeof module !== "undefined") {
                module.exports = WM;
            } else if (typeof exports !== "undefined") {
                exports.WeakMap = WM;
            } else if (!("WeakMap" in global)) {
                global.WeakMap = WM;
            }
            WM.createStorage = createStorage;
            if (global.WeakMap) global.WeakMap.createStorage = createStorage;
        }((0, eval)("this"));
    },
    z: function(require, module, exports, global) {
        "use strict";
        var defineCustomEvent = require("x");
        var elem = document.createElement("div");
        var base = null;
        var keys = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            msTransition: "MSTransitionEnd",
            transition: "transitionend"
        };
        for (var key in keys) {
            if (key in elem.style) base = keys[key];
        }
        var onDispatch = function(custom, data) {
            custom.propertyName = data.propertyName;
            custom.elapsedTime = data.elapsedTime;
            custom.pseudoElement = data.pseudoElement;
        };
        defineCustomEvent("transitionend", {
            base: base,
            onDispatch: onDispatch
        });
        defineCustomEvent("owntransitionend", {
            base: "transitionend",
            condition: function(e) {
                return e.target === this;
            }
        });
    },
    "10": function(require, module, exports, global) {
        "use strict";
        var defineCustomEvent = require("x");
        var elem = document.createElement("div");
        var base = null;
        var keys = {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            OAnimation: "oAnimationEnd",
            msAnimation: "MSAnimationEnd",
            animation: "animationend"
        };
        for (var key in keys) {
            if (key in elem.style) base = keys[key];
        }
        var onDispatch = function(custom, data) {
            custom.animationName = data.animationName;
            custom.elapsedTime = data.elapsedTime;
        };
        defineCustomEvent("animationend", {
            base: base,
            onDispatch: onDispatch
        });
        defineCustomEvent("ownanimationend", {
            base: "animationend",
            condition: function(e) {
                return e.target === this;
            }
        });
    },
    "11": function(require, module, exports, global) {
        "use strict";
        require("12");
        require("13");
    },
    "12": function(require, module, exports, global) {
        "use strict";
        var hasTouchEvent = "ontouchstart" in global;
        var hasTouchList = "TouchList" in global;
        var hasTouch = "Touch" in global;
        if (!hasTouchList) {
            var TouchList = function() {
                this.length = 0;
            };
            TouchList.prototype.identifiedTouch = function(id) {
                return this[0] && this[0].identifier === id ? this[0] : null;
            };
            TouchList.prototype.item = function(index) {
                return this[index] || null;
            };
        }
        if (!hasTouch) {
            var Touch = function() {};
        }
        var touch = null;
        var target = null;
        var onDocumentMouseDown = function(e) {
            if (target === null) {
                target = e.target;
                touch = new Touch;
                touch.identifier = Date.now();
                touch.screenX = e.screenX;
                touch.screenY = e.screenY;
                touch.clientX = e.clientX;
                touch.clientY = e.clientY;
                touch.pageX = e.pageX;
                touch.pageY = e.pageY;
                touch.radiusX = 0;
                touch.radiusY = 0;
                touch.rotationAngle = 0;
                touch.force = 0;
                touch.target = target;
                var list = new TouchList;
                list.length = 1;
                list[0] = touch;
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("touchstart", true, true);
                event.touches = list;
                event.targetTouches = list;
                event.changedTouches = list;
                target.dispatchEvent(event);
            }
        };
        var onDocumentMouseMove = function(e) {
            if (target) {
                touch.screenX = e.screenX;
                touch.screenY = e.screenY;
                touch.clientX = e.clientX;
                touch.clientY = e.clientY;
                touch.pageX = e.pageX;
                touch.pageY = e.pageY;
                var list = new TouchList;
                list.length = 1;
                list[0] = touch;
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("touchmove", true, true);
                event.touches = list;
                event.targetTouches = list;
                event.changedTouches = list;
                target.dispatchEvent(event);
            }
        };
        var onDocumentMouseUp = function(e) {
            if (target) {
                touch.screenX = e.screenX;
                touch.screenY = e.screenY;
                touch.clientX = e.clientX;
                touch.clientY = e.clientY;
                touch.pageX = e.pageX;
                touch.pageY = e.pageY;
                var list = new TouchList;
                list.length = 1;
                list[0] = touch;
                var event = document.createEvent("CustomEvent");
                event.initCustomEvent("touchend", true, true);
                event.touches = new TouchList;
                event.targetTouches = new TouchList;
                event.changedTouches = list;
                target.dispatchEvent(event);
                target = null;
            }
        };
        if (!hasTouchEvent) {
            document.addEventListener("mousedown", onDocumentMouseDown);
            document.addEventListener("mousemove", onDocumentMouseMove);
            document.addEventListener("mouseup", onDocumentMouseUp);
        }
    },
    "13": function(require, module, exports, global) {
        "use strict";
        var map = require("y")();
        var defineCustomEvent = require("x");
        var onDispatch = function(custom, data) {
            custom.view = data.view;
            custom.touches = data.touches;
            custom.targetTouches = data.targetTouches;
            custom.changedTouches = data.changedTouches;
            custom.ctrlKey = data.ctrlKey;
            custom.shiftKey = data.shiftKey;
            custom.altKey = data.altKey;
            custom.metaKey = data.metaKey;
        };
        var is = function(parent, node) {
            return parent === node || parent.contains(node);
        };
        var inside = function(x, y, node) {
            var element = document.elementFromPoint(x, y);
            if (element) return is(node, element);
            return false;
        };
        var outside = function(x, y, node) {
            var element = document.elementFromPoint(x, y);
            if (element) return !is(node, element);
            return true;
        };
        var append = function(parent, object) {
            var merge = {};
            for (var k in parent) merge[k] = parent[k];
            for (var k in object) merge[k] = object[k];
            return merge;
        };
        var attach = function(name, func) {
            return function() {
                this.addEventListener(name, func);
            };
        };
        var detach = function(name, func) {
            return function() {
                this.removeEventListener(name, func);
            };
        };
        var storage = function(element, touch) {
            var data = map.get(element);
            if (!data) map.set(element, data = {});
            return data;
        };
        var enters = function(element, touch) {
            var data = storage(element);
            var name = touch.identifier;
            if (data[name] === undefined || data[name] === "out") {
                data[name] = "in";
                return true;
            }
            return false;
        };
        var leaves = function(element, touch) {
            var data = storage(element);
            var name = touch.identifier;
            if (data[name] === undefined || data[name] === "in") {
                data[name] = "out";
                return true;
            }
            return false;
        };
        var enter = function(e) {
            this.dispatchEvent("tapenter", e);
        };
        var leave = function(e) {
            this.dispatchEvent("tapleave", e);
        };
        var custom = {
            onDispatch: onDispatch
        };
        defineCustomEvent("tapstart", append(custom, {
            base: "touchstart",
            condition: function(e) {
                return e.targetTouches.length === 1;
            }
        }));
        defineCustomEvent("tapmove", append(custom, {
            base: "touchmove",
            condition: function(e) {
                return e.targetTouches[0] === e.changedTouches[0];
            }
        }));
        defineCustomEvent("tapend", append(custom, {
            base: "touchend",
            condition: function(e) {
                return e.targetTouches.length === 0;
            }
        }));
        defineCustomEvent("tapcancel", append(custom, {
            base: "touchcancel",
            condition: function(e) {
                return true;
            }
        }));
        defineCustomEvent("tap", append(custom, {
            base: "tapend",
            condition: function(e) {
                var touch = e.changedTouches[0];
                return inside(touch.pageX, touch.pageY, this);
            }
        }));
        defineCustomEvent("tapinside", append(custom, {
            base: "tapmove",
            condition: function(e) {
                var touch = e.targetTouches[0];
                return inside(touch.pageX, touch.pageY, this);
            }
        }));
        defineCustomEvent("tapoutside", append(custom, {
            base: "tapmove",
            condition: function(e) {
                var touch = e.targetTouches[0];
                return outside(touch.pageX, touch.pageY, this);
            }
        }));
        defineCustomEvent("tapenter", append(custom, {
            base: "tapinside",
            condition: function(e) {
                return enters(this, e.targetTouches[0]);
            },
            onAdd: attach("tapstart", enter),
            onRemove: detach("tapstart", enter)
        }));
        defineCustomEvent("tapleave", append(custom, {
            base: "tapoutside",
            condition: function(e) {
                return leaves(this, e.targetTouches[0]);
            },
            onAdd: attach("tapend", leave),
            onRemove: detach("tapend", leave)
        }));
    },
    "14": function(require, module, exports, global) {
        "use strict";
        module.exports = require("15");
    },
    "15": function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var array = require("4");
        var View = require("n");
        var Control = module.exports = prime({
            inherits: View
        });
    },
    "16": function(require, module, exports, global) {
        "use strict";
        var prime = require("3");
        var Control = require("15");
        var Button = module.exports = prime({
            inherits: Control,
            constructor: function() {
                Button.parent.constructor.apply(this, arguments);
                this.style.backgroundColor = "#fff";
                this.__label = "";
            },
            onTouchStart: function(touches, e) {
                Button.parent.onTouchStart.call(this, touches, e);
                this.style.backgroundColor = "#26a7e9";
            },
            onTouchEnd: function(touches, e) {
                Button.parent.onTouchEnd.call(this, touches, e);
                this.style.backgroundColor = "#fff";
            },
            draw: function(context, area) {
                Button.parent.draw.apply(this, arguments);
                context.font = "17px Arial";
                context.fillStyle = "#000";
                context.textAlign = "center";
                context.fillText(this.__label, area.size.x / 2, area.size.y / 2 + 17 / 2);
            }
        });
        prime.define(Button.prototype, "label", {
            set: function(value) {
                this.__label = value;
                this.redraw();
            },
            get: function() {
                return this.__label;
            }
        });
    },
    "17": function(require, module, exports, global) {
        "use strict";
        var prime = require("3"), requestFrame = require("r").request, bezier = require("18");
        var map = require("5").map;
        var sDuration = "([\\d.]+)(s|ms)?", sCubicBezier = "cubic-bezier\\(([-.\\d]+),([-.\\d]+),([-.\\d]+),([-.\\d]+)\\)";
        var rDuration = RegExp(sDuration), rCubicBezier = RegExp(sCubicBezier), rgCubicBezier = RegExp(sCubicBezier, "g");
        var equations = {
            "default": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
            linear: "cubic-bezier(0, 0, 1, 1)",
            "ease-in": "cubic-bezier(0.42, 0, 1.0, 1.0)",
            "ease-out": "cubic-bezier(0, 0, 0.58, 1.0)",
            "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1.0)"
        };
        equations.ease = equations["default"];
        var compute = function(from, to, delta) {
            return (to - from) * delta + from;
        };
        var divide = function(string) {
            var numbers = [];
            var template = (string + "").replace(/[-.\d]+/g, function(number) {
                numbers.push(+number);
                return "@";
            });
            return [ numbers, template ];
        };
        var Fx = prime({
            constructor: function Fx(render, options) {
                this.setOptions(options);
                this.render = render || function() {};
                var self = this;
                this.bStep = function(t) {
                    return self.step(t);
                };
                this.bExit = function(time) {
                    self.exit(time);
                };
            },
            setOptions: function(options) {
                if (options == null) options = {};
                if (!(this.duration = this.parseDuration(options.duration || "500ms"))) throw new Error("invalid duration");
                if (!(this.equation = this.parseEquation(options.equation || "default"))) throw new Error("invalid equation");
                this.callback = options.callback || function() {};
                return this;
            },
            parseDuration: function(duration) {
                if (duration = (duration + "").match(rDuration)) {
                    var time = +duration[1], unit = duration[2] || "ms";
                    if (unit === "s") return time * 1e3;
                    if (unit === "ms") return time;
                }
            },
            parseEquation: function(equation, array) {
                var type = typeof equation;
                if (type === "function") {
                    return equation;
                } else if (type === "string") {
                    equation = equations[equation] || equation;
                    var match = equation.replace(/\s+/g, "").match(rCubicBezier);
                    if (match) {
                        equation = map(match.slice(1), function(v) {
                            return +v;
                        });
                        if (array) return equation;
                        if (equation.toString() === "0,0,1,1") return function(x) {
                            return x;
                        };
                        type = "object";
                    }
                }
                if (type === "object") {
                    return bezier(equation[0], equation[1], equation[2], equation[3], 1e3 / 60 / this.duration / 4);
                }
            },
            cancel: function(to) {
                this.to = to;
                this.cancelExit = requestFrame(this.bExit);
            },
            exit: function(time) {
                this.render(this.to);
                delete this.cancelExit;
                this.callback(time);
            },
            start: function(from, to) {
                this.stop();
                if (this.duration === 0) {
                    this.cancel(to);
                    return this;
                }
                this.isArray = false;
                this.isNumber = false;
                var fromType = typeof from, toType = typeof to;
                if (fromType === "object" && toType === "object") {
                    this.isArray = true;
                } else if (fromType === "number" && toType === "number") {
                    this.isNumber = true;
                }
                var from_ = divide(from), to_ = divide(to);
                this.from = from_[0];
                this.to = to_[0];
                this.templateFrom = from_[1];
                this.templateTo = to_[1];
                if (this.from.length !== this.to.length || this.from.toString() === this.to.toString()) {
                    this.cancel(to);
                    return this;
                }
                delete this.time;
                this.length = this.from.length;
                this.cancelStep = requestFrame(this.bStep);
                return this;
            },
            stop: function() {
                if (this.cancelExit) {
                    this.cancelExit();
                    delete this.cancelExit;
                } else if (this.cancelStep) {
                    this.cancelStep();
                    delete this.cancelStep;
                }
                return this;
            },
            step: function(now) {
                this.time || (this.time = now);
                var factor = (now - this.time) / this.duration;
                if (factor > 1) factor = 1;
                var delta = this.equation(factor), from = this.from, to = this.to, tpl = this.templateTo;
                for (var i = 0, l = this.length; i < l; i++) {
                    var f = from[i], t = to[i];
                    tpl = tpl.replace("@", t !== f ? compute(f, t, delta) : t);
                }
                this.render(this.isArray ? tpl.split(",") : this.isNumber ? +tpl : tpl, factor);
                if (factor !== 1) {
                    this.cancelStep = requestFrame(this.bStep);
                } else {
                    delete this.cancelStep;
                    this.callback(now);
                }
            }
        });
        var fx = function(render) {
            var ffx = new Fx(render);
            return {
                start: function(from, to, options) {
                    var type = typeof options;
                    ffx.setOptions(type === "function" ? {
                        callback: options
                    } : type === "string" || type === "number" ? {
                        duration: options
                    } : options).start(from, to);
                    return this;
                },
                stop: function() {
                    ffx.stop();
                    return this;
                }
            };
        };
        fx.prototype = Fx.prototype;
        module.exports = fx;
    },
    "18": function(require, module, exports, global) {
        module.exports = function(x1, y1, x2, y2, epsilon) {
            var curveX = function(t) {
                var v = 1 - t;
                return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
            };
            var curveY = function(t) {
                var v = 1 - t;
                return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
            };
            var derivativeCurveX = function(t) {
                var v = 1 - t;
                return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
            };
            return function(t) {
                var x = t, t0, t1, t2, x2, d2, i;
                for (t2 = x, i = 0; i < 8; i++) {
                    x2 = curveX(t2) - x;
                    if (Math.abs(x2) < epsilon) return curveY(t2);
                    d2 = derivativeCurveX(t2);
                    if (Math.abs(d2) < 1e-6) break;
                    t2 = t2 - x2 / d2;
                }
                t0 = 0, t1 = 1, t2 = x;
                if (t2 < t0) return curveY(t0);
                if (t2 > t1) return curveY(t1);
                while (t0 < t1) {
                    x2 = curveX(t2);
                    if (Math.abs(x2 - x) < epsilon) return curveY(t2);
                    if (x > x2) t0 = t2; else t1 = t2;
                    t2 = (t1 - t0) * .5 + t0;
                }
                return curveY(t2);
            };
        };
    }
});
