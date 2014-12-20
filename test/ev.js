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

    describe("EventPhase", function () {
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
        describe("constructor(type, bubbles, cancelable)", function () {
            it("should create a new Event object");
        });

        describe("#type", function () {
            it("should be a string that describes the type of the event");
        });

        describe("#bubbles", function () {
            it("should be true or false that describes whether the event will bubble or not");
        });

        describe("#cancelable", function () {
            it("should be true or false that describes whether the event is cancelable or not");
        });

        describe("#eventPhase", function () {
            it("should be a  the phase of the event");
        });

        describe("#target", function () {
            it("should be the target of the event");
        });

        describe("#currentTarget", function () {
            it("should be the current target of the event");
        });

        describe("#clone()", function () {
            it("should return a copy of the event, only copy the 'type', 'bubbles' and 'cancelable' properties");
        });

        describe("#formatToString(className, propNames)", function () {
            it("should return a string representation of the event of the specified format");
        });

        describe("#toString()", function () {
            it("should return a string representation of the event");
        });

        describe("#isDefaultPrevented()", function () {
            it("should return true or false that describes wheter the default action of the event is prevented or not");
        });

        describe("#preventDefault()", function () {
            it("should prevent the default action of the event");
        });

        describe("#stopPropagation()", function () {
            it("should stop the propagation of the event");
        });

        describe("#stopImmediatePropagation()", function () {
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
