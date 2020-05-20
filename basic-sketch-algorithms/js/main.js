
window.globals = {
    
};


window.addEventListener("load", () => {

    document.getElementById("clearButton").onclick = onClickClear;
    document.getElementById("undoButton").onclick = onClickUndo;
    document.getElementById("testButton").onclick = onClickTest;
    document.getElementById("algorithmSelect").onchange = onChangeAlgorithm;

    // document.getElementById("testButton").disabled = true;

    function onClickClear()         { window.globals.clearCanvas(); }
    function onClickUndo()          { window.globals.undoCanvas(); }
    function onClickTest()          { window.globals.testCanvas(); }
    // function onChangeAlgorithm()    { window.globals.changeAlgorithm(); }
    
    function onChangeAlgorithm()    {
        
        // get algorithm value and test button
        let algorithmValue = document.getElementById("algorithmSelect").value;
        let testButton = document.getElementById("testButton");

        // set test button state
        testButton.disabled = algorithmValue === "divider" ? true : false;
    }

});

