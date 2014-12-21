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
                });

                (function () {
                    var event = new Event("test", true);
                    expect(event.type).to.equal("test");
                    expect(event.bubbles).to.be.true;
                    expect(event.cancelable).to.be.false;
                });

                (function () {
                    var event = new Event("test");
                    expect(event.type).to.equal("test");
                    expect(event.bubbles).to.be.false;
                    expect(event.cancelable).to.be.false;
                });

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
            it("should be a number that describes the phase of the event");
        });

        describe("#target:Object", function () {
            it("should be the target of the event");
        });

        describe("#currentTarget:Object", function () {
            it("should be the current target of the event");
        });

        describe("#clone():Event", function () {
            it("should return a copy of the event, only copy the 'type', 'bubbles' and 'cancelable' properties");
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
            it("should return true or false that describes wheter the default action of the event is prevented or not");
        });

        describe("#preventDefault():void", function () {
            it("should prevent the default action of the event");
        });

        describe("#stopPropagation():void", function () {
            it("should stop the propagation of the event");
        });

        describe("#stopImmediatePropagation():void", function () {
            it("should stop the propagation of the event immediately");
        });
    });

    describe("EventDispatcher", function () {
        describe("constructor(target = undefined)", function () {
            it("should create a new EventDispatcher object");
        });

        describe("#getTarget()", function () {
            it("should return the target of the dispatcher when the target is not 'undefined' or 'null'");

            it("should return the dispatcher itself when the target is 'undefined' or 'null'");
        });

        describe("#addEventListener(type, listener, useCapture = false, priority = 0)", function () {
            it("should register a listener for events of the specified type");
        });

        describe("#removeEventListener(type, listener, useCapture = false)", function () {
            it("should remove the specified listener");
        });

        describe("#hasEventListener(type)", function () {
            it("should return true or false that describes whether the dispatcher has some listeners or not");
        });

        describe("#willTrigger(type)", function () {
            it("should return true or false that describes wheter the dispatcher has some listeners or not");
        });

        describe("#dispatchEvent(event)", function () {
            it("should call registered listeners for the type of the event");

            it("should return true when the default action of the event is not prevented");
        });
    });

    describe("EventNode extends EventDispatcher", function () {
        describe("constructor(target)", function () {
            it("should return a new EventNode object");
        });

        describe("#willTrigger(type)", function () {
            it("should return true or false that describes whether the dispatcher and its parents has some listeners");
        });

        describe("#dispatchEvent(event)", function () {
            it("should dispatch the event into the event flow");

            it("should return true when the default action of the event is not prevented in the event flow");
        });
    });
})
