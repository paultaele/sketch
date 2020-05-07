
globals.loadCanvas = (inputSketches) => {

    
    // set sketches, index, first sketch, and shapes
    sketches = inputSketches;
    index = 0;
    sketch = sketches[index];
    shapesList = [];
    checkedItemsList = [];
    for (let i = 0; i < sketches.length; ++i) {
 
        shapesList[i] = [];
        checkedItemsList[i] = [];
    }

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

// TODO
globals.downloadCanvas = () => {

    // update sketches' shapes
    let numEmpty = 0;
    for (let i = 0; i < sketches.length; ++i) {

        // get current sketch and shapes
        let sketch = sketches[i];
        let shapes = shapesList[i];

        // skip current sketch if shapes is empty (i.e., no shapes were labeled)
        if (shapes.length === 0) { ++numEmpty; continue; }

        // get list of all stroke ids
        let strokes = sketch.strokes;
        let ids = [];
        for (let j = 0; j < strokes.length; ++j) {

            let stroke = strokes[j];
            ids.push(stroke.id);
        }

        // get map of labeled stroke IDs
        let labeledIdsMap = {};
        for (let j = 0; j < shapes.length; ++j) {
            
            let shape = shapes[j];
            for (let k = 0; k < shape.subElements.length; ++k) {

                labeledIdsMap[shape.subElements[k]] = true;
            }
        }

        // get list of unlabeled stroke IDs
        let unlabeledIds = [];
        for (let j = 0; j < ids.length; ++j) {

            let id = ids[j];
            if (labeledIdsMap[id] !== true) { unlabeledIds.push(id); }
        }

        // check for non-empty list of unlabeled IDs
        if (unlabeledIds.length > 0) {

            // create shape of unlabeled strokes
            let unlabeledShape = {};
            unlabeledShape.confidence = "1,0";
            unlabeledShape.interpretation = "";
            unlabeledShape.subElements = [];
            for (let j = 0; j < unlabeledIds.length; ++j) {

                unlabeledShape.subElements.push(unlabeledIds[j]);
            }
            for (let j = 0; j < sketch.strokes.length; ++j) {

                let stroke = strokes[j];
                if (stroke.id === unlabeledIds[0]) {

                    unlabeledShape.time = stroke.time;
                    break;       
                }
            }

            // add unlabeled shape to list of shapes
            shapes.push(unlabeledShape);
        }

        // set sketch's shapes
        sketch.shapes = [];
        for (let j = 0; j < shapes.length; ++j) {

            // add shape to sketch
            let shape = shapes[j];
            sketch.shapes.push(shape);
        }
    }

    // skip if there are no labeled shapes in sketches
    if (numEmpty === sketches.length) {
        alert("ERROR: There are no new labeled sketches to download.");
        return;
    }

    // downlaod sketches with updated shapes
    //TODO
};

globals.backCanvas = () => {

    // display strokes and stroke selections
    sketch = sketches[--index];
    drawStrokes(sketch);
    displayStrokeSelections(sketch);

    // clear and update information
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

        // add checked stroke ID to list
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
        
        // add checked stroke ID to shape sub-elements and to checked items
        let checkedStrokeId = checkedStrokeIds[i];
        shape.subElements.push(checkedStrokeId);
    }
    shape.time = idToTime[shape.subElements[0]];
    shape.interpretation = document.getElementById("labelInput").value;
    shape.confidence = DEFAULT_CONFIDENCE;
    shapesList[index].push(shape);

    // add checked stroke IDs to checked items
    let checkedItems = checkedItemsList[index];
    for (let i = 0; i < checkedStrokeIds.length; ++i) {
        
        checkedItems.push(checkedStrokeIds[i]);
    }

    // clear label input
    document.getElementById("labelInput").value = "";
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

    // get current sketch's list of checked items
    let checkedItems = checkedItemsList[index];

    // create checkboxes for each stroke ID
    for (let i = 0; i < sketch.strokes.length; ++i) {
        
        // get the current stroke ID
        let strokeId = sketch.strokes[i].id;

        // skip if stroke ID is already in list of checked items
        if (checkedItems.includes(strokeId)) { continue; }

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
let sketches;
let shapesList;
let checkedItemsList;
let index;
const COLOR_BLACK = "#000000";
const COLOR_GREY = "#c0c0c0";
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: COLOR_GREY
};
const MAX_DOT_DISTANCE = 4.0;
const DEFAULT_CONFIDENCE = "1.0";
const STROKE_CHECKBOX_GROUP = "strokeCheckboxGroup";
