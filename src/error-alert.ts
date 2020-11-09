"use strict";

function Closure(){
    
    //used for the name of the layer
    const layerId = "msg-layer-" + Date.now();

    /**
     * Sound for the error message
     */
    function errorSound():void{
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
     * @returns {Number} the largest zIndex used on the page
     * @trows error in case the largest zIndex is large than Number.MAX_VALUE - 1
     */
    function findHighestZIndex():string{
        const pageElements = document.getElementsByTagName("*") as HTMLCollectionOf<HTMLElement>;
        let highestZIndex:number = 0;
        for (let i = 0; i < pageElements.length; i++){
            const elementStyle:CSSStyleDeclaration = getComputedStyle(pageElements[i]);
            const elementZIndex:number = parseInt(
                elementStyle.getPropertyValue('z-index'), 10
            );
            if(elementZIndex > highestZIndex){
                highestZIndex = elementZIndex;
            }
        }
        if (highestZIndex < Number.MAX_VALUE - 1){
            return String(highestZIndex);
        } else {
            throw("Maximum Zindex number reached");
        }
    }

    /**
     * @param {string} color to be validated
     * @returns returns the given hex if correct, otherwise #d3d3d3
     */
    function isValidHEX(color:string):string{
        if(typeof(color) === "string"){
            if(/#[0-9a-zA-Z]{3,6}$/.test(color)){
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
    function createMsg(message:string,hexColor:string):void{     

        //Text for the error message
        const messageDiv = document.createElement("div");
        messageDiv.style.position = "relative";
        messageDiv.style.width = "99%";
        messageDiv.style.height = "auto";
        messageDiv.style.wordWrap = "break-word";
        messageDiv.style.minHeight = "20px";
        messageDiv.style.padding = "10px";
        messageDiv.style.zIndex = (function():string{
            try{
                return findHighestZIndex();
            } catch(e){
                return "1000";
            }
        }());
        messageDiv.style.background = isValidHEX(hexColor);
        messageDiv.style.top = "0";
        messageDiv.style.left = "0";

        var content = document.createTextNode(message);
        messageDiv.appendChild(content);

        const closingMessage = document.createElement("span");
        const icon = document.createTextNode("[X]");
        closingMessage.appendChild(icon);
        closingMessage.style.float = "right";
        closingMessage.style.marginRight = "10px";
        messageDiv.appendChild(closingMessage);

        //layer on which to insert the message
        const msgLayer = document.getElementById(layerId) as HTMLDivElement;
        msgLayer.appendChild(messageDiv);

        /**
         * function used to remove the msg with a CSS transition
         * this fx remove also the associated listener
         */
        function removeMsg():void{
            messageDiv.style.opacity = "0";
            messageDiv.style.transition = "opacity " + 2 + "s";
            msgLayer.removeChild(messageDiv);
        }

        errorSound();
        messageDiv.addEventListener("click", removeMsg);
        setTimeout(removeMsg,5000);   
    }  
    
    //first message after page load
    window.onload = function firstMessage():void{

        //Div that will contain all the error messages
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

    //when an error occurs on the page, shows the alert on top
    window.onerror = function alertUser(error):void { 
        const errorString = String(error);
        createMsg(errorString,"#ff0000");
    };

    /**
     * @param input (from ...args, see below)
     * @returns string with all the string/converted numbers or booleans of input
     */
    function returnStringElements(input:any):string{
        return input.filter(function(elem:any){
            if(typeof(elem) === "string"){
                return elem;
            } else if(
                typeof(elem) === "number" || 
                typeof(elem) === "boolean"
            ){
                return String(elem);
            } else {
                return "Empty message";
            }
        }) ;
    }

    //Shows a message also with console.log, console.warn and console.error
    //displays only the string values
    const oldLogFx = console.log;
    console.log = function (...args):void {
        const msgToDisplay = returnStringElements(args);
        createMsg(msgToDisplay,"#d3d3d3");
        oldLogFx.apply(console, arguments as any);
    };
    
    const oldWarnFx = console.warn;
    console.warn = function (...args) {
        const msgToDisplay = returnStringElements(args);
        createMsg(msgToDisplay,"#ffff00");
        oldWarnFx.apply(console, arguments as any);
    };

    const oldErrorFx = console.error;
    console.error = function (...args) {
        const msgToDisplay = returnStringElements(args);
        createMsg(msgToDisplay,"#ff0000");
        oldErrorFx.apply(console, arguments as any);
    };

    return {
        //generic function (clone of createMsg)
        genericMsg : function(yourMsg:string, desiredColor:string):void{
            createMsg(yourMsg,desiredColor);
        }
    }

}

const errorAlert = Closure();