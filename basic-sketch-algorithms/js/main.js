
window.globals = {
    
};


window.addEventListener("load", () => {

    document.getElementById("clearButton").onclick = onClickClear;
    document.getElementById("undoButton").onclick = onClickUndo;
    document.getElementById("testButton").onclick = onClickTest;
    document.getElementById("algorithmSelect").onchange = onChangeAlgorithm;

    function onClickClear()         { window.globals.clearCanvas(); }
    function onClickUndo()          { window.globals.undoCanvas(); }
    function onClickTest()          { window.globals.testCanvas(); }
    
    function onChangeAlgorithm()    {
        
        // get current algorithm value
        let algorithmValue = document.getElementById("algorithmSelect").value;

        //
        let testButton = document.getElementById("testButton");
        if (algorithmValue === "divider") { testButton.disabled = true; }
        else { testButton.disabled = false; }

        // case: translate
        if (algorithmValue === "translate") {

            document.getElementById("translateArea").style.display = "inline";
            document.getElementById("translateX").value = "0";
            document.getElementById("translateY").value = "0";
        }

        // case: no algorithm with attributes
        else {

            let elements = document.getElementsByClassName("attributes");
            for (let element of elements) { element.style.display = "none"; }
        }
    }
});

