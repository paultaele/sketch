window.globals = {
    
};

window.onload = function() {

    document.getElementById("clearButton").onclick = onClickClear;
    document.getElementById("undoButton").onclick = onClickUndo;
    document.getElementById("nextButton").onclick = onClickNext;
    document.getElementById("saveButton").onclick = onClickSave;
    document.getElementById("debugButton").onclick = onClickDebug;

    function onClickClear() {

        window.globals.clearCanvas();
    }

    function onClickUndo() {
        
        window.globals.undoCanvas();
    }

    function onClickNext() {

        window.globals.nextCanvas();
    }

    function onClickSave() {

        window.globals.saveCanvas();
    }
    
    function onClickDebug() {

        window.globals.debugCanvas();
    }
}
