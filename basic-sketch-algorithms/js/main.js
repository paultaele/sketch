
window.globals = {
    
};


window.addEventListener("load", () => {

    document.getElementById("clearButton").onclick = onClickClear;
    document.getElementById("undoButton").onclick = onClickUndo;
    document.getElementById("testButton").onclick = onClickTest;
    document.getElementById("algorithmSelect").onchange = onChangeAlgorithm;

    document.getElementById("viewCanvas").style.display = "none";

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

        // hide attributes
        let elements = document.getElementsByClassName("attributes");
        for (let element of elements) { element.style.display = "none"; }

        // case: translate
        if (algorithmValue === "translate") {

            document.getElementById("translateArea").style.display = "inline";
            document.getElementById("translateX").value = "0";
            document.getElementById("translateY").value = "0";
        }

        // case: resample (count)
        else if (algorithmValue === "resampleCount") {

            document.getElementById("resampleCountArea").style.display = "inline";
            document.getElementById("resampleCount").value = "100";
        }
        
        // case: resample (distance)
        else if (algorithmValue === "resampleDistance") {

            document.getElementById("resampleDistanceArea").style.display = "inline";
            document.getElementById("resampleDistance").value = "100";
        }

        // case: scale (proportional)
        else if (algorithmValue === "scaleProportional") {

            document.getElementById("scaleProportionalArea").style.display = "inline";
            document.getElementById("scaleProportional").value = "100";
        }

        // case: scale (square)
        else if (algorithmValue === "scaleSquare") {

            document.getElementById("scaleSquareArea").style.display = "inline";
            document.getElementById("scaleSquare").value = "100";
        }
    }
});
