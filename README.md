# eV
The eV (electronvolt) provides a simple DOM-like event system.

## Installation
``` shell
$ npm install electronvolt
```

## Example
``` javascript
var ev = require("electronvolt");

// create event nodes
var node = new ev.EventNode();
var parent = new ev.EventNode();

// compose event flow
node.parentNode = parent;

var listener = function (event) {
    switch (event.eventPhase) {
        case ev.EventPhase.AT_TARGET:
            console.log("at target");
            break;
        case ev.EventPhase.BUBBLING_PHASE:
            console.log("bubbling phase");
            break;
        case ev.EventPhase.CAPTURING_PHASE:
            console.log("capturing phase");
            break;
    }
};

// add event listeners
node.addEventListener("example", listener);
parent.addEventListener("example", listener);
parent.addEventListener("example", listener, true);

// dispatch event into the event flow
node.dispatchEvent(new ev.Event("example", true));
// -> capturing phase
// -> at target
// -> bubbling phase
```

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
