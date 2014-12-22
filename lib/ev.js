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

    Object.defineProperties(this, {
        /* private properties */
        "_type": {
            "value": type,
            "writable": true
        },
        "_bubbles": {
            "value": bubbles,
            "writable": true
        },
        "_cancelable": {
            "value": cancelable,
            "writable": true
        },
        "_defaultPrevented": {
            "value": false,
            "writable": true
        },

        /* internal properties */
        "_eventPhase": {
            "value": EventPhase.AT_TARGET,
            "writable": true
        },
        "_target": {
            "value": null,
            "writable": true
        },
        "_currentTarget": {
            "value": null,
            "writable": true
        },
        "_propagationStopped": {
            "value": false,
            "writable": true
        },
        "_immediatePropagationStopped": {
            "value": false,
            "writable": true
        }
    });
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

    Object.defineProperties(this, {
        /* internal properties */
        "_target": {
            "value": target === null ? this : target,
            "writable": true
        },
        "_listeners": {
            "value": {},
            "writable": true
        },
        "_captureListeners": {
            "value": {},
            "writable": true
        }
    });
}

Object.defineProperties(EventDispatcher.prototype, {
    /* methods */
    "addEventListener": {
        "value": function (type, listener, useCapture, priority) {
            if (typeof type !== "string") {
                throw new TypeError("'type' should be a string");
            }
            if (typeof listener !== "function") {
                throw new TypeError("'listener' should be a function");
            }
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

            var i;

            /*
             * If the listener already has been added, does nothing.
             * The priority of the listener won't be changed.
             */
            for (i = 0; i < listeners.length; i++) {
                if (listeners[i].listener === listener) {
                    return;
                }
            }

            /*
             * The priority larger is higher.
             */
            var eventListener = new EventListener(listener, priority);
            for (i = listeners.length - 1; i >= 0; i--) {
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
            if (typeof type !== "string") {
                throw new TypeError("'type' should be a string");
            }
            if (typeof listener !== "function") {
                throw new TypeError("'listener' should be a function");
            }
            if (typeof useCapture !== "boolean") {
                useCapture = false;
            }

            var listeners;
            if (useCapture) {
                if (this._captureListeners[type] === undefined) {
                    return;
                }
                listeners = this._captureListeners[type];
            }
            else {
                if(this._listeners[type] === undefined) {
                    return;
                }
                listeners = this._listeners[type];
            }

            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].listener === listener) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        }
    },

    "hasEventListener": {
        "value": function (type) {
            if (typeof type !== "string") {
                throw new TypeError("'type' should be a string");
            }

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
            if (typeof type !== "string") {
                throw new TypeError("'type' should be a string");
            }

            return this.hasEventListener(type);
        }
    },

    "dispatchEvent": {
        "value": function (event) {
            if (!(event instanceof Event)) {
                throw new TypeError("'event' should be an Event object");
            }

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
    if (typeof target !== "object") {
        target = null
    }

    EventDispatcher.call(this, target);

    Object.defineProperties(this, {
        /* private properties */
        "_parentNode": {
            "value": null,
            "writable": true
        }
    });
}

EventNode.prototype = Object.create(EventDispatcher.prototype, {
    "constructor": {
        "value"       : EventNode,
        "writable"    : true,
        "configurable": true
    }
});

Object.defineProperties(EventNode.prototype, {
    "parentNode": {
        "get": function () { return this._parentNode; },
        "set": function (value) {
            if (typeof value !== "object") {
                throw new TypeError("'parentNode' should be an object");
            }

            this._parentNode = value;
        }
    },

    "willTrigger": {
        "value": function (type) {
            if (typeof type !== "string") {
                throw new TypeError("'type' should be a string");
            }

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
            if (!(event instanceof Event)) {
                throw new TypeError("'event' should be an Event object");
            }

            if (event.bubbles) {
                event         = event.clone();
                event._target = this._target;

                var flow = [];
                var node = this;
                while (node !== null) {
                    flow.push(node);
                    node = node.parentNode;
                    if (typeof node !== "object") {
                        throw new TypeError("a non-object value in the event flow");
                    }
                }

                var listeners, i, j;
                var type = event.type;

                /* capturing phase */
                event._eventPhase = EventPhase.CAPTURING_PHASE;

                for (i = flow.length - 1; i > 0; i--) {
                    event._currentTarget = flow[i]._target;

                    listeners = flow[i]._captureListeners[type];
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
                if (event._propagationStopped) {
                    return !event.isDefaultPrevented();
                }

                /* bubbling phase */
                event._eventPhase = EventPhase.BUBBLING_PHASE;

                for (i = 1; i < flow.length; i++) {
                    event._currentTarget = flow[i]._target;

                    listeners = flow[i]._listeners[type];
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
