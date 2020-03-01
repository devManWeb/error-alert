"use strict";

function closure(){
    
    //used for the name of the layer
    const layerId = "msg-layer-" + Date.now();

    /**
     * Sound for the error message
     */
    function errorSound(){
        const context = new AudioContext();
        let oscillator = context.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = 300;
        oscillator.connect(context.destination);
        let time = context.currentTime;
        oscillator.start(time);
        oscillator.stop(time + 0.1);
    }

    /** 
     * This function takes care of creating the error message, 
     * after two seconds it eliminates it 
     * the message can also be removed with a mouse click
     * @param message - string with the message to display
     * @param hexColor - string with the desired hex color
    */
    function createMsg(message,hexColor){

        //div which will contain the error message
        const msgLayer = document.getElementById(layerId);
        const messageDiv = document.createElement("div");

        //Let's set the CSS and text of the just created div
        let colorToUse;
        if(/#[0-9a-zA-Z]{3,6}$/.test(hexColor)){
            colorToUse = hexColor;
        } else {
            hexColor = "#d3d3d3"; //generic grey 
        }

        messageDiv.setAttribute('style',"position:relative; \
            width:100%;height:auto; padding:10px; z-index:1000; \
            background:" + colorToUse + "; \
            top:0; left:0;"
        );
        const content = document.createTextNode(message);

        //I append the div with the error to the main div 
        //that contains all the warning messages
        messageDiv.appendChild(content);
        msgLayer.appendChild(messageDiv);

        errorSound();
        messageDiv.addEventListener("click", removeMsg);

        /**
         * function used to remove the msg
         */
        function removeMsg(){
            //first we remove the listener
            messageDiv.removeEventListener("click", removeMsg);

            //then, there is the CSS transition
            messageDiv.style.opacity = 0;
            messageDiv.style.transition = "opacity " + 2 + "s";
            messageDiv.style.WebkitTransition = "opacity " + 2 + "s";

            //finally, we remove it from the DOM
            messageDiv.remove();
        }

        setTimeout(removeMsg,5000);
        
    }  
    
    //first message after page load
    window.onload = function firstMessage(){

        //I create the div that will contain all the error messages
        const node = document.createElement("div");
        node.setAttribute("id", layerId);
        node.setAttribute("style", "position:absolute; \
            width:100%;height:auto;z-index:1000; \
            top:0; left:0; \
            opacity: 0.8;"  //added some transparency
        );
        document.body.appendChild(node);

        createMsg(
            "Attention, error-alert.js must be used only in a development evironment!",
            "#ffff00"
        );
    }

    //messages on JS errors
    window.onerror = function alertUser(error) { 
        createMsg(error,"#ff0000");
    };


    //console.log messages will also be shown (strings only)
    const oldLogFx = console.log;
    console.log = function (...args) {
        const msgToDisplay = args.filter(function(elem){
            return typeof(elem) === "string";
        });
        createMsg(msgToDisplay,"#d3d3d3");
        oldLogFx.apply(console, arguments);
    };

    //console.warn messages will also be shown (strings only)
    const oldWarnFx = console.warn;
    console.warn = function (...args) {
        const msgToDisplay = args.filter(function(elem){
            return typeof(elem) === "string";
        });
        createMsg(msgToDisplay,"#ffff00");
        oldWarnFx.apply(console, arguments);
    };

    //console.error messages will also be shown (strings only)
    const oldErrorFx = console.error;
    console.error = function (...args) {
        const msgToDisplay = args.filter(function(elem){
            return typeof(elem) === "string";
        });
        createMsg(msgToDisplay,"#ff0000");
        oldErrorFx.apply(console, arguments);
    };


    return {

        //generic function (clone of createMsg)
        genericMsg : function (yourMsg,desiredColor){
            createMsg(yourMsg,desiredColor);
        }
    }

}

const errorAlert = new closure();