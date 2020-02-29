"use strict";

(function errorReporting(){
    
    //used for the name of the layer
    const layerId = "msg-layer-" + Date.now();

    /**
     * Sound for the error message
     */
    function errorSound(){
        let context = new AudioContext();
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
     * @param message - string with the message to display
     * @param isError - true if this is an error 
    */
    function createMsg(message,isError){

        //div which will contain the error message
        const msgLayer = document.getElementById(layerId);
        const messageDiv = document.createElement("div");

        //Let's set the CSS and text of the just created div
        const colorToUse = isError ? "#ff0000" : "#ffff00";
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
        
        //After 2 seconds, we remove the message from the page
        setTimeout(function removeFirstMessage(){
            messageDiv.style.opacity = 0;
            messageDiv.style.transition = "opacity " + 2 + "s";
            messageDiv.style.WebkitTransition = "opacity " + 2 + "s";
            messageDiv.remove();
        },2000);
        
    }  
    
    window.onload = function firstMessage(){

        //I create the div that will contain all the error messages
        const node = document.createElement("div");
        node.setAttribute("id", layerId);
        node.setAttribute("style", "position:absolute; \
            width:100%;height:auto;z-index:1000; \
            top:0; left:0;"
        );
        document.body.appendChild(node);

        createMsg("Attention, error-alert.js is in function!",false)
    }


    window.onerror = function alertUser(error) { 
        createMsg(error,true)
    };

})()