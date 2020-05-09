
globals.loadCanvas = (inputSketches) => {

    // set sketches, index, first sketch, and shapes
    sketches = inputSketches;
    index = 0;
    sketch = sketches[index];

    // display strokes and checkboxes
    drawStrokes(sketch);
    displayInterpretationCheckboxes(sketch);

    // set behaviors for text and buttons
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;
    document.getElementById("backButton").disabled = true;
    if (sketches.length > 1) { document.getElementById("nextButton").disabled = false; }
    document.getElementById("selectAllButton").disabled = false;
    document.getElementById("selectNoneButton").disabled = false;
};

globals.backCanvas = () => {

    // display strokes and checkboxes
    sketch = sketches[--index];
    drawStrokes(sketch);
    displayInterpretationCheckboxes(sketch);

    // clear and update information
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    if (index <= 0) { document.getElementById("backButton").disabled = true; }
    document.getElementById("nextButton").disabled = false;
};

globals.nextCanvas = () => {

    // display strokes and checkboxes
    sketch = sketches[++index];
    drawStrokes(sketch);
    displayInterpretationCheckboxes(sketch);

    // clear and update information
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    document.getElementById("backButton").disabled = false;
    if (index >= sketches.length - 1) { document.getElementById("nextButton").disabled = true; }
};

globals.selectAllCanvas = () => {

    setInterpretationCheckboxes(true, COLOR_BLACK);
};

globals.selectNoneCanvas = () => {
    
    setInterpretationCheckboxes(false, COLOR_GREY);
};

function drawStrokes(sketch) {

    // clear all strokes from canvas
    project.activeLayer.removeChildren();

    // resize canvas to sketch 
    document.getElementById("myCanvas").width = sketch.canvasWidth;
    document.getElementById("myCanvas").height = sketch.canvasHeight;
    project.activeLayer.view.viewSize = new Size(sketch.canvasWidth, sketch.canvasHeight);

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

function displayInterpretationCheckboxes(sketch) {

    // clear strokes selection area
    document.getElementById("strokeSelectionsArea").innerHTML = "";

    // create mapping between shape and index
    let timeToIndex = {};
    for (let i = 0; i < sketch.shapes.length; ++i) {

        timeToIndex[sketch.shapes[i].time] = i;
    }

    // create checkboxes for each shape interpretation
    for (let i = 0; i < sketch.shapes.length; ++i) {
        
        // get the current shape interpretation and time
        let interpretation = sketch.shapes[i].interpretation;
        if (interpretation.length === 0) { interpretation = "&#12296;unlabeled&#12297;"; }

        // create HTML tags
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = STROKE_CHECKBOX_GROUP;
        checkbox.id = i;
        checkbox.value = i;
        let label = document.createElement("label");
        label.htmlFor = i;
        label.innerHTML = interpretation;

        // set checkbox behavior
        checkbox.addEventListener("change", function() {

            let shape = sketch.shapes[this.id];
            let subElements = shape.subElements;
            let strokeIndices = [];
            
            // create mapping and list of stroke IDs
            let idToIndex = {};
            for (let j = 0; j < sketch.strokes.length; ++j) {

                let stroke = sketch.strokes[j];
                idToIndex[stroke.id] = j;
            }
            for (let j = 0; j < subElements.length; ++j) {

                let subElement = subElements[j];
                let strokeIndex = idToIndex[subElement];
                strokeIndices.push(strokeIndex);
            }
        
            if (this.checked) {
                
                for (let j = 0; j < strokeIndices.length; ++j) {
                    
                    let strokeIndex = strokeIndices[j]; 
                    project.activeLayer.children[strokeIndex].strokeColor = COLOR_BLACK;
                }
            }
            
            else {

                for (let j = 0; j < strokeIndices.length; ++j) {

                    let strokeIndex = strokeIndices[j];
                    project.activeLayer.children[strokeIndex].strokeColor = COLOR_GREY;
                }
            }
        });

        // add checkbox to stroke selections area
        document.getElementById("strokeSelectionsArea").appendChild(checkbox);
        document.getElementById("strokeSelectionsArea").appendChild(label);
        document.getElementById("strokeSelectionsArea").appendChild(document.createElement("br"));
    }

    // select all checkboxes and highlight all strokes
    globals.selectAllCanvas();
}

function setInterpretationCheckboxes(status, color) {

    // iterate through each checkbox
    let checkboxGroup = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    let strokeIndices = [];
    for (let i = 0; i < checkboxGroup.length; ++i) {

        // set checkbox status
        let checkbox = checkboxGroup[i];
        checkbox.checked = status;

        // get current checkbox's corresponding strokes IDs
        let subElements = sketch.shapes[checkbox.id].subElements;

        // create mapping and list of stroke IDs
        let idToIndex = {};
        for (let j = 0; j < sketch.strokes.length; ++j) {

            let stroke = sketch.strokes[j];
            idToIndex[stroke.id] = j;
        }
        for (let j = 0; j < subElements.length; ++j) {

            let subElement = subElements[j];
            let strokeIndex = idToIndex[subElement];
            strokeIndices.push(strokeIndex);
        }
    }

    // colorize all strokes
    for (let i = 0; i < strokeIndices.length; ++i) {

        let strokeIndex = strokeIndices[i];
        project.activeLayer.children[strokeIndex].strokeColor = color;
    }
}

let sketch;
let sketches;
let index;
const COLOR_BLACK = "#000000";
const COLOR_GREY = "#c0c0c0";
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: COLOR_GREY
};
const MAX_DOT_DISTANCE = 4.0;
const STROKE_CHECKBOX_GROUP = "strokeCheckboxGroup";
