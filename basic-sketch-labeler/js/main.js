
window.globals = {
    
};

window.onload = () => {

    document.getElementById("uploadButton").addEventListener('change', loadFiles);
    document.getElementById("backButton").onclick = onClickBack;
    document.getElementById("nextButton").onclick = onClickNext;
    document.getElementById("selectAllButton").onclick = onClickSelectAll;
    document.getElementById("selectNoneButton").onclick = onClickSelectNone;
    document.getElementById("strokeSelectionsArea");

}

function loadFiles(event) {
    
    // get file from upload button
    let file = event.target.files[0];

    // collect the sketches from the file(s)
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {

        // get sketches from file
        let sketches = JSON.parse(e.target.result);

        // load sketches
        window.globals.loadCanvas(sketches);

        // reset upload button's value
        let input = document.getElementById("uploadButton");
        input.value = "";
    };
}

function onClickNext()          { window.globals.nextCanvas(); }
function onClickBack()          { window.globals.backCanvas(); }
function onClickSelectAll()     { window.globals.selectAllCanvas(); }
function onClickSelectNone()    { window.globals.selectNoneCanvas(); }
