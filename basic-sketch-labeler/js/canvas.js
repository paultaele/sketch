
//TODO:
// - handle single points
// - adjust canvas size per sketch
globals.loadCanvas = (inputSketches) => {
    
    // set sketches and first sketch
    sketches = inputSketches;
    index = 0;
    sketch = sketches[index];
    drawStrokes(sketch);
    displayStrokeSelections(sketch);
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back, next, select all, and select none buttons
    document.getElementById("backButton").disabled = true;
    if (sketches.length > 1) { document.getElementById("nextButton").disabled = false; }
    document.getElementById("labelInput").disabled = false;
    document.getElementById("labelButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    document.getElementById("selectAllButton").disabled = false;
    document.getElementById("selectNoneButton").disabled = false;
}

//
globals.backCanvas = () => {

    // display the strokes on canvas
    sketch = sketches[--index];
    drawStrokes(sketch);
    displayStrokeSelections(sketch)
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    if (index <= 0) { document.getElementById("backButton").disabled = true; }
    document.getElementById("nextButton").disabled = false;
};

//
globals.nextCanvas = () => {

    // display the strokes on canvas
    sketch = sketches[++index];
    drawStrokes(sketch);
    displayStrokeSelections(sketch)
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    document.getElementById("backButton").disabled = false;
    if (index >= sketches.length - 1) { document.getElementById("nextButton").disabled = true; }
};

globals.selectAllCanvas = () => {

    let checkboxGroup = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    for (let i = 0; i < checkboxGroup.length; ++i) {
        
        checkboxGroup[i].checked = true;
        project.activeLayer.children[i].strokeColor = COLOR_RED;
    }
}

globals.selectNoneCanvas = () => {
    
    let checkboxGroup = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    for (let i = 0; i < checkboxGroup.length; ++i) {
        
        checkboxGroup[i].checked = false;
        project.activeLayer.children[i].strokeColor = COLOR_BLACK;
    }
}

//TODO
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
                project.activeLayer.children[index].strokeColor = COLOR_RED;
            }
            
            else {

                index = idToIndex[this.id];
                project.activeLayer.children[index].strokeColor = COLOR_BLACK;
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

//
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
let index;
const COLOR_BLACK = "#000000";
const COLOR_RED = "#ff0000";
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: COLOR_BLACK
};
const MAX_DOT_DISTANCE = 4.0;
const STROKE_CHECKBOX_GROUP = "strokeCheckboxGroup";
