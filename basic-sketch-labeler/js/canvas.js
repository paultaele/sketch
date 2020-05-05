
globals.loadCanvas = (inputSketches) => {
    
    // set sketches, index, first sketch, and shapes
    sketches = inputSketches;
    index = 0;
    sketch = sketches[index];
    shapes = Array(sketches.length).fill([]);
    shapes[index] = [];
    
    // display strokes and stroke selections
    drawStrokes(sketch);
    displayStrokeSelections(sketch);

    // set behaviors for text and buttons
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;
    document.getElementById("backButton").disabled = true;
    if (sketches.length > 1) { document.getElementById("nextButton").disabled = false; }
    document.getElementById("resetButton").disabled = false;
    document.getElementById("selectAllButton").disabled = false;
    document.getElementById("selectNoneButton").disabled = false;
    document.getElementById("downloadButton").disabled = false;

    // set behaviors for label input and button 
    document.getElementById("labelInput").value = "";
    document.getElementById("labelInput").disabled = false;
    document.getElementById("labelButton").disabled = true;
    document.getElementById("labelInput").oninput = function() {

        document.getElementById("labelButton").disabled
            = document.getElementById("labelInput").value.trim() !== "" ?
                false : true;
        
    };
}

globals.downloadCanvas = () => {

    // 
    let numEmpty = 0;
    for (let i = 0; i < shapes.length; ++i) {

        // get current shape
        let shape = shapes[i];

        // skip shape if empty
        console.log(shape);
        if (shape.length === 0) { ++numEmpty; continue; }
        
        // debug
        console.log(shape);
    }

    //
    if (numEmpty === sketches.length) {
        alert("ERROR: There are no new labeled sketches to download.");
        return;
    }

    // console.log(`sketches.length: ${sketches.length}`);
    // console.log(`shapes.length: ${shapes.length}`);
};

globals.backCanvas = () => {

    // display strokes and stroke selections
    sketch = sketches[--index];
    drawStrokes(sketch);
    displayStrokeSelections(sketch);

    // clear and update information
    shapes[index] = [];
    document.getElementById("labelInput").value = "";
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    if (index <= 0) { document.getElementById("backButton").disabled = true; }
    document.getElementById("nextButton").disabled = false;
};

globals.nextCanvas = () => {

    // display strokes and stroke selections
    sketch = sketches[++index];
    drawStrokes(sketch);
    displayStrokeSelections(sketch);

    // clear and update information
    shapes[index] = [];
    document.getElementById("labelInput").value = "";
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    document.getElementById("backButton").disabled = false;
    if (index >= sketches.length - 1) { document.getElementById("nextButton").disabled = true; }
};

globals.labelCanvas = () => {

    // get the checked stroke IDs and mapping of stroke IDs to checked status
    let checkboxes = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    let isChecked = false;
    let idToChecked = {};
    let checkedStrokeIds = [];
    for (let i = 0; i < checkboxes.length; ++i) {

        let checkbox = checkboxes[i];
        if (checkbox.checked) {
            isChecked = true;
            checkedStrokeIds.push(checkbox.id);
        }
        idToChecked[checkbox.id] = checkbox.checked;
    }

    // skip if no checked checkboxes
    if (!isChecked) {

        alert("ERROR: Must check at least one checkbox to label.");
        return;
    }

    // remove the checked labels and checkboxes
    let labels = document.getElementsByTagName("label");
    let labelsToRemove = [];
    for (let i = 0; i < labels.length; ++i) {

        let label = labels[i];
        let labelFor = label.htmlFor;
        if (idToChecked[labelFor]) { labelsToRemove.push(label); }
    }
    for (let i = 0; i < labelsToRemove.length; ++i) {

        labelsToRemove[i].remove();
    }
    for (let i = 0; i < checkedStrokeIds.length; ++i) {

        document.getElementById(checkedStrokeIds[i]).remove();
    }

    // reset all stroke colors to un-selected
    for (let i = 0; i < project.activeLayer.children.length; ++i) {

        project.activeLayer.children[i].strokeColor = COLOR_GREY;
    }

    // create and add labeled shape
    let idToTime = {};
    let shape = {};
    for (let i = 0; i < sketch.strokes.length; ++i) {

        idToTime[sketch.strokes[i].id] = sketch.strokes[i].points[0].time;
    }
    shape.subElements = [];
    for (let i = 0; i < checkedStrokeIds.length; ++i) {
        
        shape.subElements.push(checkedStrokeIds[i]);
    }
    shape.time = idToTime[shape.subElements[0]];
    shape.interpretation = document.getElementById("labelInput").value;
    shape.confidence = DEFAULT_CONFIDENCE;
    shapes[index].push(shape);
}

globals.selectAllCanvas = () => {

    let checkboxGroup = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    for (let i = 0; i < checkboxGroup.length; ++i) {
        
        checkboxGroup[i].checked = true;
        project.activeLayer.children[i].strokeColor = COLOR_BLACK;
    }
}

globals.selectNoneCanvas = () => {
    
    let checkboxGroup = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    for (let i = 0; i < checkboxGroup.length; ++i) {
        
        checkboxGroup[i].checked = false;
        project.activeLayer.children[i].strokeColor = COLOR_GREY;
    }
}

function displayStrokeSelections(sketch) {

    // clear strokes selection area
    document.getElementById("strokeSelectionsArea").innerHTML = "";

    // create mapping between stroke ID and index
    let idToIndex = {};
    for (let i = 0; i < sketch.strokes.length; ++i) {

        idToIndex[sketch.strokes[i].id] = i;
    }

    // create checkboxes for each stroke
    for (let i = 0; i < sketch.strokes.length; ++i) {
        
        // get the current stroke ID
        let strokeId = sketch.strokes[i].id;

        // create HTML tags
        let checkbox = document.createElement("input"); 
        checkbox.type = "checkbox";
        checkbox.name = STROKE_CHECKBOX_GROUP;
        checkbox.id = strokeId;
        checkbox.value = strokeId;
        let label = document.createElement("label");
        label.htmlFor = strokeId;
        label.innerHTML = strokeId;
        let breakElement = document.createElement("br");

        // set checkbox behavior
        checkbox.addEventListener("change", function() {

            let index;
            if (this.checked) {
                
                index = idToIndex[this.id];
                project.activeLayer.children[index].strokeColor = COLOR_BLACK;
            }
            
            else {

                index = idToIndex[this.id];
                project.activeLayer.children[index].strokeColor = COLOR_GREY;
            }
        });

        // add checkbox to stroke selections area
        document.getElementById("strokeSelectionsArea").appendChild(checkbox);
        document.getElementById("strokeSelectionsArea").appendChild(label);
        document.getElementById("strokeSelectionsArea").appendChild(breakElement);
    }

    // select all checkboxes and highlight all strokes
    globals.selectAllCanvas();
}

function drawStrokes(sketch) {

    // clear all strokes from canvas
    project.activeLayer.removeChildren();

    // resize canvas to sketch 
    document.getElementById("myCanvas").width = sketch.canvasWidth;
    document.getElementById("myCanvas").height = sketch.canvasHeight;

    // iterate through each sketch stroke
    for (let i = 0; i < sketch.strokes.length; ++i) {

        // get sketch strokes
        let sketchStroke = sketch.strokes[i];
        
        // initialize stroke
        let stroke = new Path();
        stroke.style = PATH_STYLE;

        // add stroke to canvas
        for (let j = 0; j < sketchStroke.points.length; ++j) {
            let point = sketchStroke.points[j];
            stroke.add([point.x, point.y]);
        }
    }
}



let sketch;
let sketches = [];
let shapes = [];
let index;
const COLOR_BLACK = "#000000";
const COLOR_RED = "#ff0000";
const COLOR_GREY = "#c0c0c0";
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: COLOR_GREY
};
const MAX_DOT_DISTANCE = 4.0;
const DEFAULT_CONFIDENCE = "1.0";
const STROKE_CHECKBOX_GROUP = "strokeCheckboxGroup";
