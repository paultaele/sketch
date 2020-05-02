window.globals = {
    
};

window.onload = function() {

    document.getElementById("clearButton").onclick = onClickClear;
    document.getElementById("undoButton").onclick = onClickUndo;
    document.getElementById("nextButton").onclick = onClickNext;
    document.getElementById("downloadButton").onclick = onClickDownload;
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

    function onClickDownload() {

        window.globals.downloadCanvas();
    }
    
    function onClickDebug() {

        window.globals.debugCanvas();
    }
}
