"use strict";
function Closure() {
    //used for the name of the layer
    var layerId = "msg-layer-" + Date.now();
    /**
     * Sound for the error message
     */
    function errorSound() {
        var context = new AudioContext();
        var oscillator = context.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = 300;
        oscillator.connect(context.destination);
        var time = context.currentTime;
        oscillator.start(time);
        oscillator.stop(time + 0.1);
    }
    /**
     * @returns {Number} the largest zIndex used on the page
     * @trows error in case the largest zIndex is large than Number.MAX_VALUE - 1
     */
    function findHighestZIndex() {
        var pageElements = document.getElementsByTagName("*");
        var highestZIndex = 0;
        for (var i = 0; i < pageElements.length; i++) {
            var elementStyle = getComputedStyle(pageElements[i]);
            var elementZIndex = parseInt(elementStyle.getPropertyValue('z-index'), 10);
            if (elementZIndex > highestZIndex) {
                highestZIndex = elementZIndex;
            }
        }
        if (highestZIndex < Number.MAX_VALUE - 1) {
            return String(highestZIndex);
        }
        else {
            throw ("Maximum Zindex number reached");
        }
    }
    /**
     * @param {string} color to be validated
     * @returns returns the given hex if correct, otherwise #d3d3d3
     */
    function isValidHEX(color) {
        if (typeof (color) === "string") {
            if (/#[0-9a-zA-Z]{3,6}$/.test(color)) {
                return color;
            }
        }
        return "#d3d3d3"; //generic grey 
    }
    /**
     * This function takes care of creating the error message,
     * after five seconds it eliminates it
     * the message can also be removed with a mouse click
     * @param {string} message message to display
     * @param {string} hexColor desired HEX color
    */
    function createMsg(message, hexColor) {
        //Text for the error message
        var messageDiv = document.createElement("div");
        messageDiv.style.position = "relative";
        messageDiv.style.width = "99%";
        messageDiv.style.height = "auto";
        messageDiv.style.wordWrap = "break-word";
        messageDiv.style.minHeight = "20px";
        messageDiv.style.padding = "10px";
        messageDiv.style.zIndex = (function () {
            try {
                return findHighestZIndex();
            }
            catch (e) {
                return "1000";
            }
        }());
        messageDiv.style.background = isValidHEX(hexColor);
        messageDiv.style.top = "0";
        messageDiv.style.left = "0";
        var content = document.createTextNode(message);
        messageDiv.appendChild(content);
        var closingMessage = document.createElement("span");
        var icon = document.createTextNode("[X]");
        closingMessage.appendChild(icon);
        closingMessage.style.float = "right";
        closingMessage.style.marginRight = "10px";
        messageDiv.appendChild(closingMessage);
        //layer on which to insert the message
        var msgLayer = document.getElementById(layerId);
        msgLayer.appendChild(messageDiv);
        /**
         * function used to remove the msg with a CSS transition
         * this fx remove also the associated listener
         */
        function removeMsg() {
            messageDiv.style.opacity = "0";
            messageDiv.style.transition = "opacity " + 2 + "s";
            msgLayer.removeChild(messageDiv);
        }
        errorSound();
        messageDiv.addEventListener("click", removeMsg);
        setTimeout(removeMsg, 5000);
    }
    //first message after page load
    window.onload = function firstMessage() {
        //Div that will contain all the error messages
        var node = document.createElement("div");
        node.setAttribute("id", layerId);
        node.setAttribute("style", "position:absolute; \
            width:100%;height:auto;z-index:1000; \
            top:0; left:0; \
            opacity: 0.8;" //added some transparency
        );
        document.body.appendChild(node);
        createMsg("Attention, error-alert.js must be used only in a development evironment!", "#ffff00");
    };
    //when an error occurs on the page, shows the alert on top
    window.onerror = function alertUser(error) {
        var errorString = String(error);
        createMsg(errorString, "#ff0000");
    };
    /**
     * @param input (from ...args, see below)
     * @returns string with all the string/converted numbers or booleans of input
     */
    function returnStringElements(input) {
        return input.filter(function (elem) {
            if (typeof (elem) === "string") {
                return elem;
            }
            else if (typeof (elem) === "number" ||
                typeof (elem) === "boolean") {
                return String(elem);
            }
            else {
                return "Empty message";
            }
        });
    }
    //Shows a message also with console.log, console.warn and console.error
    //displays only the string values
    var oldLogFx = console.log;
    console.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var msgToDisplay = returnStringElements(args);
        createMsg(msgToDisplay, "#d3d3d3");
        oldLogFx.apply(console, arguments);
    };
    var oldWarnFx = console.warn;
    console.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var msgToDisplay = returnStringElements(args);
        createMsg(msgToDisplay, "#ffff00");
        oldWarnFx.apply(console, arguments);
    };
    var oldErrorFx = console.error;
    console.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var msgToDisplay = returnStringElements(args);
        createMsg(msgToDisplay, "#ff0000");
        oldErrorFx.apply(console, arguments);
    };
    return {
        //generic function (clone of createMsg)
        genericMsg: function (yourMsg, desiredColor) {
            createMsg(yourMsg, desiredColor);
        }
    };
}
var errorAlert = Closure();
