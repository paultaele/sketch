
window.globals = {
    
};

window.onload = () => {

    // load files at file input
    let input = document.getElementById("uploadButton");
    input.addEventListener('change', loadFiles);
}

function loadFiles(event) {

    //TODO: disable all buttons

    // get file from upload button
    let file = event.target.files[0];

    // collect the sketches from the file(s)
    // let sketches = [];
    let reader = new FileReader();
    reader.onload = (e) => {

        // get sketches from file
        let sketches = JSON.parse(e.target.result);

        // TODO

        // debug
        window.globals.test(sketches);

        // reset upload button's value
        let input = document.getElementById("uploadButton");
        input.value = "";
    };
    reader.readAsText(file);

    //TODO: enable all buttons
}
