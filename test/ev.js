/*
 * eV.test / ev.js
 * copyright (c) 2014 Susisu
 */

"use strict";

var chai   = require("chai"),
    expect = chai.expect;

var ev = require("../lib/ev.js");

describe("ev", function () {
    var EventPhase      = ev.EventPhase;
    var Event           = ev.Event;
    var EventDispatcher = ev.EventDispatcher;
    var EventNode       = ev.EventNode;

    describe("EventPhase:Object", function () {
        it("should have constant number properties to describe the phase of an event", function () {
            expect(EventPhase).to.have.property("AT_TARGET");
            expect(EventPhase).to.have.property("BUBBLING_PHASE");
            expect(EventPhase).to.have.property("CAPTURING_PHASE");

            expect(EventPhase.AT_TARGET).to.be.a("number");
            expect(EventPhase.BUBBLING_PHASE).to.be.a("number");
            expect(EventPhase.CAPTURING_PHASE).to.be.a("number");

            expect(EventPhase.AT_TARGET).not.to.equal(EventPhase.BUBBLING_PHASE);
            expect(EventPhase.AT_TARGET).not.to.equal(EventPhase.CAPTURING_PHASE);
            expect(EventPhase.BUBBLING_PHASE).not.to.equal(EventPhase.CAPTURING_PHASE);
        });
    });

    describe("Event", function () {
        describe("constructor(type:String, bubbles:Boolean = false, cancelable:Boolean = false)", function () {
            it("should create a new Event object", function () {
                (function () {
                    var event = new Event("test", true, true);
                    expect(event.type).to.equal("test");
                    expect(event.bubbles).to.be.true;
                    expect(event.cancelable).to.be.true;
                    expect(event.isDefaultPrevented()).to.be.false;
                    expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                    expect(event.target).to.be.null;
                    expect(event.currentTarget).to.be.null;
                })();

                (function () {
                    var event = new Event("test", true);
                    expect(event.type).to.equal("test");
                    expect(event.bubbles).to.be.true;
                    expect(event.cancelable).to.be.false;
                })();

                (function () {
                    var event = new Event("test");
                    expect(event.type).to.equal("test");
                    expect(event.bubbles).to.be.false;
                    expect(event.cancelable).to.be.false;
                })();

                expect(function () { new Event(); }).to.throw(TypeError);
            });
        });

        describe("#type:String", function () {
            it("should be a string that describes the type of the event", function () {
                var event = new Event("test", true, true);
                expect(event.type).to.equal("test");
            });
        });

        describe("#bubbles:Boolean", function () {
            it("should be true or false that describes whether the event will bubble or not", function () {
                var event = new Event("test", true, true);
                expect(event.bubbles).to.be.true;
            });
        });

        describe("#cancelable:Boolean", function () {
            it("should be true or false that describes whether the event is cancelable or not", function () {
                var event = new Event("test", true, true);
                expect(event.cancelable).to.be.true;
            });
        });

        describe("#eventPhase:Number", function () {
            it("should be a number that describes the phase of the event", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var atTargetListener = function (event) {
                        expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                    };
                    var bubblingListener = function (event) {
                        expect(event.eventPhase).to.equal(EventPhase.BUBBLING_PHASE);
                    };
                    var capturingListener = function (event) {
                        expect(event.eventPhase).to.equal(EventPhase.CAPTURING_PHASE);
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(new Event("test", true, true));
                })();
            });
        });

        describe("#target:Object", function () {
            it("should be the target of the event", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        expect(event.target).to.equal(dispatcher);
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var atTargetListener = function (event) {
                        expect(event.target).to.equal(node);
                    };
                    var bubblingListener = function (event) {
                        expect(event.target).to.equal(node);
                    };
                    var capturingListener = function (event) {
                        expect(event.target).to.equal(node);
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var target = {};
                    var dispatcher = new EventDispatcher(target);
                    var listener = function (event) {
                        expect(event.target).to.equal(target);
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var target = {};
                    var parentTarget = {};
                    var node = new EventNode(target);
                    var parent = new EventNode(parentTarget);
                    node.parentNode = parent;
                    var atTargetListener = function (event) {
                        expect(event.target).to.equal(target);
                    };
                    var bubblingListener = function (event) {
                        expect(event.target).to.equal(target);
                    };
                    var capturingListener = function (event) {
                        expect(event.target).to.equal(target);
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(new Event("test", true, true));
                })();
            });
        });

        describe("#currentTarget:Object", function () {
            it("should be the current target of the event", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        expect(event.currentTarget).to.equal(dispatcher);
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var atTargetListener = function (event) {
                        expect(event.currentTarget).to.equal(node);
                    };
                    var bubblingListener = function (event) {
                        expect(event.currentTarget).to.equal(parent);
                    };
                    var capturingListener = function (event) {
                        expect(event.currentTarget).to.equal(parent);
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var target = {};
                    var dispatcher = new EventDispatcher(target);
                    var listener = function (event) {
                        expect(event.currentTarget).to.equal(target);
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var target = {};
                    var parentTarget = {};
                    var node = new EventNode(target);
                    var parent = new EventNode(parentTarget);
                    node.parentNode = parent;
                    var atTargetListener = function (event) {
                        expect(event.currentTarget).to.equal(target);
                    };
                    var bubblingListener = function (event) {
                        expect(event.currentTarget).to.equal(parentTarget);
                    };
                    var capturingListener = function (event) {
                        expect(event.currentTarget).to.equal(parentTarget);
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(new Event("test", true, true));
                })();
            });
        });

        describe("#clone():Event", function () {
            it("should return a copy of the event, only copy the 'type', 'bubbles' and 'cancelable' properties", function () {
                var node = new EventNode();
                var parent = new EventNode();
                node.parentNode = parent;
                var atTargetListener = function (event) {
                    var clone = event.clone();
                    expect(clone).not.to.equal(event);
                    expect(clone.type).to.equal("test");
                    expect(clone.bubbles).to.be.true;
                    expect(clone.cancelable).to.be.true;
                    expect(clone.eventPhase).to.equal(EventPhase.AT_TARGET);
                    expect(clone.target).to.be.null;
                    expect(clone.currentTarget).to.be.null;
                };
                var bubblingListener = function (event) {
                    var clone = event.clone();
                    expect(clone).not.to.equal(event);
                    expect(clone.type).to.equal("test");
                    expect(clone.bubbles).to.be.true;
                    expect(clone.cancelable).to.be.true;
                    expect(clone.eventPhase).to.equal(EventPhase.AT_TARGET);
                    expect(clone.target).to.be.null;
                    expect(clone.currentTarget).to.be.null;
                };
                var capturingListener = function (event) {
                    var clone = event.clone();
                    expect(clone).not.to.equal(event);
                    expect(clone.type).to.equal("test");
                    expect(clone.bubbles).to.be.true;
                    expect(clone.cancelable).to.be.true;
                    expect(clone.eventPhase).to.equal(EventPhase.AT_TARGET);
                    expect(clone.target).to.be.null;
                    expect(clone.currentTarget).to.be.null;
                };
                node.addEventListener("test", atTargetListener);
                parent.addEventListener("test", bubblingListener);
                parent.addEventListener("test", capturingListener, true);
                node.dispatchEvent(new Event("test", true, true));
            });
        });

        describe("#formatToString(className:String, propNames:Array):String", function () {
            it("should return a string representation of the event of the specified format", function () {
                var event = new Event("test", true, true);
                expect(event.formatToString("Event", ["type", "bubbles", "cancelable"]))
                    .to.equal("[Event type=\"test\" bubbles=true cancelable=true]");
                expect(event.formatToString("FooEvent", ["type", "bubbles", "cancelable"]))
                    .to.equal("[FooEvent type=\"test\" bubbles=true cancelable=true]");
                expect(event.formatToString("Event", ["bubbles", "cancelable", "type"]))
                    .to.equal("[Event bubbles=true cancelable=true type=\"test\"]");
                expect(event.formatToString("Event", ["type", "bubbles"]))
                    .to.equal("[Event type=\"test\" bubbles=true]");
                expect(event.formatToString("Event", ["type"]))
                    .to.equal("[Event type=\"test\"]");
                expect(function () { event.formatToString(undefined, []); }).to.throw(TypeError);
            });
        });

        describe("#toString():String", function () {
            it("should return a string representation of the event", function () {
                var event = new Event("test", true, true);
                expect(event.toString()).to.equal("[Event type=\"test\" bubbles=true cancelable=true]");
            });
        });

        describe("#isDefaultPrevented():Boolean", function () {
            it("should return true or false that describes wheter the default action of the event is prevented or not", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener1 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.false;
                        event.preventDefault();
                        expect(event.isDefaultPrevented()).to.be.true;
                    };
                    var listener2 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.true;
                    };
                    dispatcher.addEventListener("test", listener1);
                    dispatcher.addEventListener("test", listener2);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener1 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.false;
                        event.preventDefault();
                        expect(event.isDefaultPrevented()).to.be.false;
                    };
                    var listener2 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.false;
                    };
                    dispatcher.addEventListener("test", listener1);
                    dispatcher.addEventListener("test", listener2);
                    dispatcher.dispatchEvent(new Event("test", true, false));
                })();
            });
        });

        describe("#preventDefault():void", function () {
            it("should prevent the default action of the event", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener1 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.false;
                        event.preventDefault();
                        expect(event.isDefaultPrevented()).to.be.true;
                    };
                    var listener2 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.true;
                    };
                    dispatcher.addEventListener("test", listener1);
                    dispatcher.addEventListener("test", listener2);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener1 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.false;
                        event.preventDefault();
                        expect(event.isDefaultPrevented()).to.be.false;
                    };
                    var listener2 = function (event) {
                        expect(event.isDefaultPrevented()).to.be.false;
                    };
                    dispatcher.addEventListener("test", listener1);
                    dispatcher.addEventListener("test", listener2);
                    dispatcher.dispatchEvent(new Event("test", true, false));
                })();
            });
        });

        describe("#stopPropagation():void", function () {
            it("should stop the propagation of the event", function () {
                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener1 = function (event) {
                        throw new Error("at target listener 1 is called");
                    };
                    var atTargetListener2 = function (event) {
                        throw new Error("at target listener 2 is called");
                    };
                    var bubblingListener1 = function (event) {
                        throw new Error("bubbling listener 1 is called");
                    };
                    var bubblingListener2 = function (event) {
                        throw new Error("bubbling listener 2 is called");
                    };
                    var capturingListener1 = function (event) {
                        event.stopPropagation();
                    };
                    var capturingListener2 = function (event) {};
                    node.addEventListener("test", atTargetListener1);
                    node.addEventListener("test", atTargetListener2);
                    parent.addEventListener("test", bubblingListener1);
                    parent.addEventListener("test", bubblingListener2);
                    parent.addEventListener("test", capturingListener1, true);
                    parent.addEventListener("test", capturingListener2, true);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener1 = function (event) {
                        event.stopPropagation();
                    };
                    var atTargetListener2 = function (event) {};
                    var bubblingListener1 = function (event) {
                        throw new Error("bubbling listener 1 is called");
                    };
                    var bubblingListener2 = function (event) {
                        throw new Error("bubbling listener 2 is called");
                    };
                    var capturingListener1 = function (event) {};
                    var capturingListener2 = function (event) {};
                    node.addEventListener("test", atTargetListener1);
                    node.addEventListener("test", atTargetListener2);
                    parent.addEventListener("test", bubblingListener1);
                    parent.addEventListener("test", bubblingListener2);
                    parent.addEventListener("test", capturingListener1, true);
                    parent.addEventListener("test", capturingListener2, true);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener1 = function (event) {};
                    var atTargetListener2 = function (event) {};
                    var bubblingListener1 = function (event) {
                        event.stopPropagation();
                    };
                    var bubblingListener2 = function (event) {};
                    var capturingListener1 = function (event) {};
                    var capturingListener2 = function (event) {};
                    node.addEventListener("test", atTargetListener1);
                    node.addEventListener("test", atTargetListener2);
                    parent.addEventListener("test", bubblingListener1);
                    parent.addEventListener("test", bubblingListener2);
                    parent.addEventListener("test", capturingListener1, true);
                    parent.addEventListener("test", capturingListener2, true);
                    node.dispatchEvent(originalEvent);
                })();
            });
        });

        describe("#stopImmediatePropagation():void", function () {
            it("should stop the propagation of the event immediately", function () {
                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener1 = function (event) {
                        throw new Error("at target listener 1 is called");
                    };
                    var atTargetListener2 = function (event) {
                        throw new Error("at target listener 2 is called");
                    };
                    var bubblingListener1 = function (event) {
                        throw new Error("bubbling listener 1 is called");
                    };
                    var bubblingListener2 = function (event) {
                        throw new Error("bubbling listener 2 is called");
                    };
                    var capturingListener1 = function (event) {
                        event.stopImmediatePropagation();
                    };
                    var capturingListener2 = function (event) {
                        throw new Error("capturing listener 2 is called");
                    };
                    node.addEventListener("test", atTargetListener1);
                    node.addEventListener("test", atTargetListener2);
                    parent.addEventListener("test", bubblingListener1);
                    parent.addEventListener("test", bubblingListener2);
                    parent.addEventListener("test", capturingListener1, true);
                    parent.addEventListener("test", capturingListener2, true);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener1 = function (event) {
                        event.stopImmediatePropagation();
                    };
                    var atTargetListener2 = function (event) {
                        throw new Error("at target listener 2 is called");
                    };
                    var bubblingListener1 = function (event) {
                        throw new Error("bubbling listener 1 is called");
                    };
                    var bubblingListener2 = function (event) {
                        throw new Error("bubbling listener 2 is called");
                    };
                    var capturingListener1 = function (event) {};
                    var capturingListener2 = function (event) {};
                    node.addEventListener("test", atTargetListener1);
                    node.addEventListener("test", atTargetListener2);
                    parent.addEventListener("test", bubblingListener1);
                    parent.addEventListener("test", bubblingListener2);
                    parent.addEventListener("test", capturingListener1, true);
                    parent.addEventListener("test", capturingListener2, true);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener1 = function (event) {};
                    var atTargetListener2 = function (event) {};
                    var bubblingListener1 = function (event) {
                        event.stopImmediatePropagation();
                    };
                    var bubblingListener2 = function (event) {
                        throw new Error("bubbling listener 2 is called");
                    };
                    var capturingListener1 = function (event) {};
                    var capturingListener2 = function (event) {};
                    node.addEventListener("test", atTargetListener1);
                    node.addEventListener("test", atTargetListener2);
                    parent.addEventListener("test", bubblingListener1);
                    parent.addEventListener("test", bubblingListener2);
                    parent.addEventListener("test", capturingListener1, true);
                    parent.addEventListener("test", capturingListener2, true);
                    node.dispatchEvent(originalEvent);
                })();
            });
        });
    });

    describe("EventDispatcher", function () {
        describe("constructor(target:Object = undefined)", function () {
            it("should create a new EventDispatcher object", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        expect(event.target).to.equal(dispatcher);
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test"));
                })();

                (function () {
                    var target = {};
                    var dispatcher = new EventDispatcher(target);
                    var listener = function (event) {
                        expect(event.target).to.equal(target);
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test"));
                })();
            });
        });

        describe("#addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:Number = 0):void", function () {
            it("should register a listener for events of the specified type", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var originalEvent = new Event("test", true, true);
                    var listener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.dispatchEvent(originalEvent);
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(node);
                    };
                    var bubblingListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.BUBBLING_PHASE);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(parent);
                    };
                    var capturingListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.CAPTURING_PHASE);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(parent);
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var counter = 0;
                    var listener1 = function (event) {
                        expect(counter).to.equal(0);
                        counter++;
                    };
                    var listener2 = function (event) {
                        expect(counter).to.equal(1);
                    };
                    dispatcher.addEventListener("test", listener1);
                    dispatcher.addEventListener("test", listener2);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var counter = 0;
                    var listener1 = function (event) {
                        expect(counter).to.equal(0);
                        counter++;
                    };
                    var listener2 = function (event) {
                        expect(counter).to.equal(1);
                    };
                    dispatcher.addEventListener("test", listener1);
                    dispatcher.addEventListener("test", listener2);
                    dispatcher.addEventListener("test", listener1);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var counter = 0;
                    var listener1 = function (event) {
                        expect(counter).to.equal(0);
                        counter++;
                    };
                    var listener2 = function (event) {
                        expect(counter).to.equal(1);
                    };
                    dispatcher.addEventListener("test", listener2, false, 0);
                    dispatcher.addEventListener("test", listener1, false, 1);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();
            });
        });

        describe("#removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void", function () {
            it("should remove the specified listener", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        throw new Error("listener is called");
                    };
                    dispatcher.addEventListener("test", listener);
                    dispatcher.removeEventListener("test", listener);
                    dispatcher.dispatchEvent(new Event("test", true, true));
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener1 = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(node);
                    };
                    var bubblingListener1 = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.BUBBLING_PHASE);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(parent);
                    };
                    var capturingListener1 = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.CAPTURING_PHASE);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(parent);
                    };
                    var atTargetListener2 = function (event) {
                        throw new Error("at target listener 2 is called");
                    };
                    var bubblingListener2 = function (event) {
                        throw new Error("bubbling listener 2 is called");
                    };
                    var capturingListener2 = function (event) {
                        throw new Error("capturing listener 2 is called");
                    };
                    node.addEventListener("test", atTargetListener1);
                    parent.addEventListener("test", bubblingListener1);
                    parent.addEventListener("test", capturingListener1, true);
                    node.addEventListener("test", atTargetListener2);
                    parent.addEventListener("test", bubblingListener2);
                    parent.addEventListener("test", capturingListener2, true);
                    node.removeEventListener("test", atTargetListener2);
                    parent.removeEventListener("test", bubblingListener2);
                    parent.removeEventListener("test", capturingListener2, true);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        throw new Error("listener is called");
                    };
                    expect(function () {
                        dispatcher.removeEventListener("test", listener);
                    }).not.to.throw(Error);
                })();
            });
        });

        describe("#hasEventListener(type:String):Boolean", function () {
            it("should return true or false that describes whether the dispatcher has some listeners or not", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    expect(dispatcher.hasEventListener("test")).to.be.false;
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {};
                    dispatcher.addEventListener("test", listener);
                    expect(dispatcher.hasEventListener("test")).to.be.true;
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {};
                    dispatcher.addEventListener("test", listener, true);
                    expect(dispatcher.hasEventListener("test")).to.be.true;
                })();
            });
        });

        describe("#willTrigger(type:String):Boolean", function () {
            it("should return true or false that describes whether the dispatcher has some listeners or not", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    expect(dispatcher.willTrigger("test")).to.be.false;
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {};
                    dispatcher.addEventListener("test", listener);
                    expect(dispatcher.willTrigger("test")).to.be.true;
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {};
                    dispatcher.addEventListener("test", listener, true);
                    expect(dispatcher.willTrigger("test")).to.be.true;
                })();
            });
        });

        describe("#dispatchEvent(event:Event):Boolean", function () {
            it("should call registered listeners for the type of the event", function () {
                var dispatcher = new EventDispatcher();
                var originalEvent = new Event("test", true, true);
                var listener = function (event) {
                    expect(event).not.to.equal(originalEvent);
                    expect(event.type).to.equal("test");
                    expect(event.bubbles).to.be.true;
                    expect(event.cancelable).to.be.true;
                    expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                    expect(event.target).to.equal(dispatcher);
                    expect(event.currentTarget).to.equal(dispatcher);
                };
                dispatcher.addEventListener("test", listener);
                dispatcher.dispatchEvent(originalEvent);
            });

            it("should return true when the default action of the event is not prevented", function () {
                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        event.preventDefault();
                    };
                    dispatcher.addEventListener("test", listener);
                    var result = dispatcher.dispatchEvent(new Event("test", true, true));
                    expect(result).to.be.false;
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {};
                    dispatcher.addEventListener("test", listener);
                    var result = dispatcher.dispatchEvent(new Event("test", true, true));
                    expect(result).to.be.true;
                })();

                (function () {
                    var dispatcher = new EventDispatcher();
                    var listener = function (event) {
                        event.preventDefault();
                    };
                    dispatcher.addEventListener("test", listener);
                    var result = dispatcher.dispatchEvent(new Event("test", true, false));
                    expect(result).to.be.true;
                })();
            });
        });
    });

    describe("EventNode extends EventDispatcher", function () {
        describe("constructor(target:Object)", function () {
            it("should return a new EventNode object", function () {
                (function () {
                    var node = new EventNode();
                    var listener = function (event) {
                        expect(event.target).to.equal(node);
                    };
                    node.addEventListener("test", listener);
                    node.dispatchEvent(new Event("test"));
                })();

                (function () {
                    var target = {};
                    var node = new EventNode(target);
                    var listener = function (event) {
                        expect(event.target).to.equal(target);
                    };
                    node.addEventListener("test", listener);
                    node.dispatchEvent(new Event("test"));
                })();
            });
        });

        describe("#parentNode:Object", function () {
            it("should be the parent node object of this", function () {
                var node = new EventNode();
                var parent = new EventNode();
                node.parentNode = parent;
                expect(node.parentNode).to.equal(parent);
                expect(function () { node.parentNode = undefined; }).to.throw(TypeError);
            });
        });

        describe("#willTrigger(type:String):Boolean", function () {
            it("should return true or false that describes whether the dispatcher and its parents has some listeners", function () {
                (function () {
                    var node = new EventNode();
                    expect(node.willTrigger("test")).to.be.false;
                })();

                (function () {
                    var node = new EventNode();
                    var listener = function (event) {};
                    node.addEventListener("test", listener);
                    expect(node.willTrigger("test")).to.be.true;
                })();

                (function () {
                    var node = new EventNode();
                    var listener = function (event) {};
                    node.addEventListener("test", listener, true);
                    expect(node.willTrigger("test")).to.be.true;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var listener = function (event) {};
                    parent.addEventListener("test", listener);
                    expect(node.willTrigger("test")).to.be.true;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var listener = function (event) {};
                    parent.addEventListener("test", listener, true);
                    expect(node.willTrigger("test")).to.be.true;
                })();
            });
        });

        describe("#dispatchEvent(event:Event):Boolean", function () {
            it("should dispatch the event into the event flow", function () {
                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", false, false);
                    var atTargetListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.false;
                        expect(event.cancelable).to.be.false;
                        expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(node);
                    };
                    var bubblingListener = function (event) {
                        throw new Error("bubbling listener is called");
                    };
                    var capturingListener = function (event) {
                        throw new Error("capturing listener is called");
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var node = new EventNode();
                    var originalEvent = new Event("test", true, false);
                    var atTargetListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.false;
                        expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(node);
                    };
                    node.addEventListener("test", atTargetListener);
                    node.dispatchEvent(originalEvent);
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.AT_TARGET);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(node);
                    };
                    var bubblingListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.BUBBLING_PHASE);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(parent);
                    };
                    var capturingListener = function (event) {
                        expect(event).not.to.equal(originalEvent);
                        expect(event.type).to.equal("test");
                        expect(event.bubbles).to.be.true;
                        expect(event.cancelable).to.be.true;
                        expect(event.eventPhase).to.equal(EventPhase.CAPTURING_PHASE);
                        expect(event.target).to.equal(node);
                        expect(event.currentTarget).to.equal(parent);
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    node.dispatchEvent(originalEvent);
                })();
            });

            it("should return true when the default action of the event is not prevented in the event flow", function () {
                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener = function (event) {};
                    var bubblingListener = function (event) {};
                    var capturingListener = function (event) {};
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.true;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener = function (event) {
                        event.preventDefault();
                    };
                    var bubblingListener = function (event) {};
                    var capturingListener = function (event) {};
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.false;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener = function (event) {};
                    var bubblingListener = function (event) {
                        event.preventDefault();
                    };
                    var capturingListener = function (event) {};
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.false;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, true);
                    var atTargetListener = function (event) {};
                    var bubblingListener = function (event) {};
                    var capturingListener = function (event) {
                        event.preventDefault();
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.false;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, false);
                    var atTargetListener = function (event) {};
                    var bubblingListener = function (event) {};
                    var capturingListener = function (event) {};
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.true;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, false);
                    var atTargetListener = function (event) {
                        event.preventDefault();
                    };
                    var bubblingListener = function (event) {};
                    var capturingListener = function (event) {};
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.true;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, false);
                    var atTargetListener = function (event) {};
                    var bubblingListener = function (event) {
                        event.preventDefault();
                    };
                    var capturingListener = function (event) {};
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.true;
                })();

                (function () {
                    var node = new EventNode();
                    var parent = new EventNode();
                    node.parentNode = parent;
                    var originalEvent = new Event("test", true, false);
                    var atTargetListener = function (event) {};
                    var bubblingListener = function (event) {};
                    var capturingListener = function (event) {
                        event.preventDefault();
                    };
                    node.addEventListener("test", atTargetListener);
                    parent.addEventListener("test", bubblingListener);
                    parent.addEventListener("test", capturingListener, true);
                    var result = node.dispatchEvent(originalEvent);
                    expect(result).to.be.true;
                })();
            });
        });
    });
})
