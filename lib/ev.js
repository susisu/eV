/*
 * eV / ev.js
 * copyright (c) 2014 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        "EventPhase"     : EventPhase,
        "Event"          : Event,
        "EventDispatcher": EventDispatcher,
        "EventNode"      : EventNode
    });
}


var EventPhase = Object.freeze({
    "AT_TARGET"      : 2,
    "BUBBLING_PHASE" : 3,
    "CAPTURING_PHASE": 1
});


function Event(type, bubbles, cancelable) {
    if (typeof type !== "string") {
        throw new TypeError("'type' should be a string");
    }
    if (typeof bubbles !== "boolean") {
        bubbles = false;
    }
    if (typeof cancelable !== "boolean") {
        cancelable = false;
    }

    /* private properties */
    this._type             = type;
    this._bubbles          = bubbles;
    this._cancelable       = cancelable;
    this._defaultPrevented = false;

    /* internal properties */
    this._eventPhase                  = EventPhase.AT_TARGET;
    this._target                      = null;
    this._currentTarget               = null;
    this._propagationStopped          = false;
    this._immediatePropagationStopped = false;
}

Object.defineProperties(Event.prototype, {
    /* getter / setter properties */
    "type": {
        "get": function () { return this._type; }
    },

    "bubbles": {
        "get": function () { return this._bubbles; }
    },

    "cancelable": {
        "get": function () { return this._cancelable; }
    },

    "eventPhase": {
        "get": function () { return this._eventPhase; }
    },

    "target": {
        "get": function () { return this._target; }
    },

    "currentTarget": {
        "get": function () { return this._currentTarget; }
    },

    /* methods */
    "clone": {
        "value": function () {
            return new Event(this._type, this._bubbles, this._cancelable);
        }
    },

    "formatToString": {
        "value": function (className, propNames) {
            if (typeof className !== "string") {
                throw new TypeError("'className' should be a string");
            }

            var str = "[" + className;
            for (var i = 0; i < propNames.length; i++) {
                var name  = propNames[i];
                var value = this[name];
                if (typeof value === "string") {
                    str += " " + name + "=\"" + value + "\"";
                }
                else {
                    str += " " + name + "=" + String(value);
                }
            }
            str += "]";
            return str;
        }
    },

    "toString": {
        "value": function () {
            return this.formatToString("Event", ["type", "bubbles", "cancelable"]);
        }
    },

    "isDefaultPrevented": {
        "value": function () { return this._defaultPrevented; }
    },

    "preventDefault": {
        "value": function () {
            if (this._cancelable) {
                this._defaultPrevented = true;
            }
        }
    },

    "stopPropagation": {
        "value": function () {
            this._propagationStopped = true;
        }
    },

    "stopImmediatePropagation": {
        "value": function () {
            this._propagationStopped          = true;
            this._immediatePropagationStopped = true;
        }
    }
});


function EventListener(listener, priority) {
    this.listener = listener;
    this.priority = priority;
}


function EventDispatcher(target) {
    if (typeof target !== "object") {
        target = null
    }

    /* internal properties */
    this._target           = target === null ? this : target;
    this._listeners        = {};
    this._captureListeners = {};
}

Object.defineProperties(EventDispatcher.prototype, {
    /* methods */
    "addEventListener": {
        "value": function (type, listener, useCapture, priority) {
            /* default arguments */
            if (typeof useCapture !== "boolean") {
                useCapture = false;
            }
            if (typeof priority !== "number") {
                priority = 0;
            }

            var listeners;
            if (useCapture) {
                if (this._captureListeners[type] === undefined) {
                    this._captureListeners[type] = [];
                }
                listeners = this._captureListeners[type];
            }
            else {
                if(this._listeners[type] === undefined) {
                    this._listeners[type] = [];
                }
                listeners = this._listeners[type];
            }

            /*
             * If the listener already has been added, does nothing.
             * The priority of the listener won't be changed.
             */
            if (listeners.indexOf(listener) >= 0) {
                return;
            }

            var eventListener = new EventListener(listener, priority);
            for (var i = listeners.length - 1; i >= 0; i--) {
                if (listeners[i].priority >= priority) {
                    listeners.splice(i + 1, 0, eventListener);
                    return;
                }
            }
            listeners.unshift(eventListener);
        }
    },

    "removeEventListener": {
        "value": function (type, listener, useCapture) {
            /* default arguments */
            if (typeof useCapture !== "boolean") {
                useCapture = false;
            }

            var listeners;
            if (useCapture) {
                if (this._captureListeners[type] === undefined) {
                    this._captureListeners[type] = [];
                }
                listeners = this._captureListeners[type];
            }
            else {
                if(this._listeners[type] === undefined) {
                    this._listeners[type] = [];
                }
                listeners = this._listeners[type];
            }

            for (var i = 0; i < listeners.length; i++) {
                if (listeners.listener === listener) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        }
    },

    "hasEventListener": {
        "value": function (type) {
            if (this._listeners[type] !== undefined && this._listeners[type].length > 0) {
                return true;
            }
            else if (this._captureListeners[type] !== undefined && this._captureListeners[type].length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    },

    "willTrigger": {
        "value": function (type) {
            return this.hasEventListener(type);
        }
    },

    "dispatchEvent": {
        "value": function (event) {
            event                = event.clone();
            event._target        = this._target;
            event._currentTarget = this._target;

            var listeners = this._listeners[event.type];
            if (listeners !== undefined) {
                listeners = listeners.slice();
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i].listener.call(undefined, event);

                    if (event._immediatePropagationStopped) {
                        return !event.isDefaultPrevented();
                    }
                }
            }

            return !event.isDefaultPrevented();
        }
    }
});


function EventNode(target) {
    EventDispatcher.call(this, target);

    this.parentNode = null;
}

EventNode.prototype = Object.create(EventDispatcher.prototype, {
    "constructor": {
        "value"       : EventNode,
        "writable"    : true,
        "configurable": true
    }
});

Object.defineProperties(EventNode.prototype, {
    "willTrigger": {
        "value": function (type) {
            var node = this;
            while (node !== null) {
                if (node.hasEventListener(type)) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }
    },

    "dispatchEvent": {
        "value": function (event) {
            if (event.bubbles) {
                event         = event.clone();
                event._target = this._target;

                var nodes = [];
                var node  = this;
                nodes.push(node);
                while (node.parentNode !== null) {
                    node = node.parentNode;
                    nodes.push(node);
                }

                var listeners, i, j;

                /* capturing phase */
                event._eventPhase = EventPhase.CAPTURING_PHASE;

                for (i = nodes.length - 1; i > 0; i--) {
                    event._currentTarget = nodes[i]._target;

                    listeners = nodes[i]._captureListeners[type];
                    if (listeners !== undefined) {
                        listeners = listeners.slice();
                        for (j = 0; j < listeners.length; j++) {
                            listeners[j].listener.call(undefined, event);

                            if (event._immediatePropagationStopped) {
                                return !event.isDefaultPrevented();
                            }
                        }
                    }

                    if (event._propagationStopped) {
                        return !event.isDefaultPrevented();
                    }
                }

                /* at target */
                event._eventPhase    = EventPhase.AT_TARGET;
                event._currentTarget = this._target;

                listeners = this._listeners[type];
                if (listeners !== undefined) {
                    listeners = listeners.slice();
                    for (j = 0; j < listeners.length; j++) {
                        listeners[j].listener.call(undefined, event);

                        if (event._immediatePropagationStopped) {
                            return !event.isDefaultPrevented();
                        }
                    }
                }

                /* bubbling phase */
                event._eventPhase = EventPhase.BUBBLING_PHASE;

                for (i = 1; i < nodes.length; i++) {
                    event._currentTarget = node[i]._target;

                    listeners = nodes[i]._listeners[type];
                    if (listeners !== undefined) {
                        listeners = listeners.slice();
                        for (j = 0; j < listeners.length; j++) {
                            listeners[j].listener.call(undefined, event);

                            if (event._immediatePropagationStopped) {
                                return !event.isDefaultPrevented();
                            }
                        }
                    }

                    if (event._propagationStopped) {
                        return !event.isDefaultPrevented();
                    }
                }

                return !event.isDefaultPrevented();
            }
            else {
                return EventDispatcher.prototype.dispatchEvent.call(this, event);
            }
        }
    }
});


end();
