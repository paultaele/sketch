window.globals = {
    
};

window.onload = () => {

    document.getElementById("resizeButton").onclick = onClickResize;
    document.getElementById("clearButton").onclick = onClickClear;
    document.getElementById("undoButton").onclick = onClickUndo;
    document.getElementById("submitButton").onclick = onClickSubmit;
    document.getElementById("saveButton").onclick = onClickSave;
    document.getElementById("debugButton").onclick = onClickDebug;

    function onClickResize()    { window.globals.resizeCanvas(); }
    function onClickClear()     { window.globals.clearCanvas(); }
    function onClickUndo()      { window.globals.undoCanvas(); }
    function onClickSubmit()    { window.globals.submitCanvas(); }
    function onClickSave()      { window.globals.saveCanvas(); }    
    function onClickDebug()     { window.globals.debugCanvas(); }
}
