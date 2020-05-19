
globals.loadCanvas = (inputSketches) => {
    
    // set sketches, index, first sketch, shapes, and domain
    sketches = inputSketches;
    index = 0;
    sketch = sketches[index];
    shapesList = [];
    domain = "";
    checkedItemsList = [];
    for (let i = 0; i < sketches.length; ++i) {
 
        shapesList[i] = [];
        checkedItemsList[i] = [];
    }

    // display strokes and checkboxes
    drawStrokes(sketch);
    displayStrokeCheckboxes(sketch);

    // set behaviors for text and buttons
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;
    document.getElementById("backButton").disabled = true;
    if (sketches.length > 1) { document.getElementById("nextButton").disabled = false; }
    document.getElementById("resetButton").disabled = false;
    document.getElementById("selectAllButton").disabled = false;
    document.getElementById("selectNoneButton").disabled = false;
    document.getElementById("downloadButton").disabled = false;

    // set behaviors for domain components
    document.getElementById("domainInput").value = "";
    document.getElementById("domainInput").disabled = false;
    document.getElementById("assignButton").disabled = false;

    // set behaviors for label components 
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

    // update sketches' shapes
    for (let i = 0; i < sketches.length; ++i) {

        // get current sketch and shapes
        let sketch = sketches[i];
        let shapes = shapesList[i];

        // get all IDs
        let ids = [];
        for (let j = 0; j < sketch.strokes.length; ++j) {

            let stroke = sketch.strokes[j];
            ids.push(stroke.id);
        }
        
        // get labeled IDs
        let labeledIds = [];
        for (let j = 0; j < shapes.length; ++j) {

            // iterate through current shape's sub-elements
            let subElements = shapes[j].subElements;
            for (let k = 0; k < subElements.length; ++k) {

                labeledIds.push(subElements[k]);
            }
        }

        // get unlabeled IDs
        let unlabeledIds = [];
        for (let j = 0; j < ids.length; ++j) {

            let id = ids[j];
            if (!labeledIds.includes(id)) { unlabeledIds.push(id); }
        }

        // create and add unlabeled shape (if any) to shapes
        if (unlabeledIds.length > 0) {

            let shape = {};
            shape.subElements = [];
            for (let j = 0; j < unlabeledIds.length; ++j) {
                
                // add checked stroke ID to shape sub-elements and to checked items
                let unlabeledId = unlabeledIds[j];
                shape.subElements.push(unlabeledId);
            }
            shape.time = sketch.strokes.find(stroke => stroke.id === unlabeledIds[0]).time;
            shape.interpretation = "";
            shape.confidence = DEFAULT_CONFIDENCE;
            shapes.push(shape);
        }

        // update current sketch's shapes
        sketch.shapes = shapes;
    }

    // download the JSON data
    let data = JSON.stringify(sketches);
    download("data.json", data);

};

globals.backCanvas = () => {

    // display strokes and checkboxes
    sketch = sketches[--index];
    drawStrokes(sketch);
    displayStrokeCheckboxes(sketch);

    // assign domain
    sketch.domain = domain;

    // clear and update information
    document.getElementById("labelInput").value = "";
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    if (index <= 0) { document.getElementById("backButton").disabled = true; }
    document.getElementById("nextButton").disabled = false;
};

globals.nextCanvas = () => {

    // display strokes and checkboxes
    sketch = sketches[++index];
    drawStrokes(sketch);
    displayStrokeCheckboxes(sketch);

    // assign domain
    sketch.domain = domain;

    // clear and update information
    document.getElementById("labelInput").value = "";
    document.getElementById("indexDisplay").innerHTML = `${index + 1} / ${sketches.length}`;

    // modify disabled status for back and next buttons
    document.getElementById("backButton").disabled = false;
    if (index >= sketches.length - 1) { document.getElementById("nextButton").disabled = true; }
};

globals.assignCanvas = () => {

    // get domainInput component
    let domainInput = document.getElementById("domainInput");
    domain = domainInput.value;
    domainInput.value = "";

    // display domain
    let p = document.createElement("p");
    let domainDisplayArea = document.getElementById("domainDisplayArea");
    p.innerHTML = `<strong>Domain:</strong> ${domain}`;
    domainDisplayArea.innerHTML = "";
    domainDisplayArea.appendChild(p);

    // assign domain to sketch
    sketch.domain = domain;
}

globals.labelCanvas = () => {

    // get the checked stroke IDs and mapping of stroke IDs to checked status
    let checkboxes = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    let isChecked = false;
    let checkedCheckboxes = []; // checked checkedboxes
    let idToChecked = {};       // stroke ID to checked stroke IDs mapping
    for (let i = 0; i < checkboxes.length; ++i) {

        // add checked stroke ID to list
        let checkbox = checkboxes[i];
        if (checkbox.checked) {

            isChecked = true;
            checkedCheckboxes.push(checkbox.id);
        }
        idToChecked[checkbox.id] = checkbox.checked;
    }

    // skip if no checked checkboxes
    if (!isChecked) {

        alert("ERROR: Must check at least one checkbox to label.");
        return;
    }

    // remove the checked labels, breaks, and checkboxes
    let labels = document.getElementsByTagName("label");        // label elements
    // let breakElements = document.getElementsByTagName("br");    // break elements
    let labelsToBold = [];
    for (let i = 0; i < labels.length; ++i) { // get checked labels

        let label = labels[i];
        if (idToChecked[label.htmlFor]) { labelsToBold.push(label); }
    }
    for (let i = 0; i < checkedCheckboxes.length; ++i) { // uncheck checked checkboxes

        document.getElementById(checkedCheckboxes[i]).checked = false;
    }
    for (let i = 0; i < labelsToBold.length; ++i) { // bold checked labels

        let labelToBold = labelsToBold[i];
        labelToBold.innerHTML = "<em>" + labelToBold.innerHTML + "</em>";
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
    for (let i = 0; i < checkedCheckboxes.length; ++i) {
        
        // add checked stroke ID to shape sub-elements and to checked items
        let checkedStrokeId = checkedCheckboxes[i];
        shape.subElements.push(checkedStrokeId);
    }
    shape.time = idToTime[shape.subElements[0]];
    shape.interpretation = document.getElementById("labelInput").value;
    shape.confidence = DEFAULT_CONFIDENCE;
    shapesList[index].push(shape);

    // add checked stroke IDs to checked items
    let checkedItems = checkedItemsList[index];
    for (let i = 0; i < checkedCheckboxes.length; ++i) {
        
        checkedItems.push(checkedCheckboxes[i]);
    }

    // clear label input
    document.getElementById("labelInput").value = "";
};

globals.resetCanvas = () => {
    
    // clear shapes, checked items list. and label input
    shapesList[index] = [];
    checkedItemsList[index] = [];
    document.getElementById("labelInput").value = "";

    // 
    for (let i = 0; i < project.activeLayer.children.length; ++i) {

        project.activeLayer.children[i].strokeColor = COLOR_BLACK;
    }

    // re-display stroke checkboxes 
    displayStrokeCheckboxes(sketch);
}

globals.selectAllCanvas = () => {

    let checkboxGroup = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    for (let i = 0; i < checkboxGroup.length; ++i) {
        
        checkboxGroup[i].checked = true;
        project.activeLayer.children[i].strokeColor = COLOR_BLACK;
    }
};

globals.selectNoneCanvas = () => {
    
    let checkboxGroup = document.getElementsByName(STROKE_CHECKBOX_GROUP);
    for (let i = 0; i < checkboxGroup.length; ++i) {
        
        checkboxGroup[i].checked = false;
        project.activeLayer.children[i].strokeColor = COLOR_GREY;
    }
};

function displayStrokeCheckboxes(sketch) {

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
        // if (checkedItems.includes(strokeId)) {
            
        //     continue; 
        // }

        // create HTML tags
        let checkbox = document.createElement("input"); 
        checkbox.type = "checkbox";
        checkbox.name = STROKE_CHECKBOX_GROUP;
        checkbox.id = strokeId;
        checkbox.value = strokeId;
        let label = document.createElement("label");
        label.htmlFor = strokeId;

        let innerHTML = checkedItems.includes(strokeId)
            ? "<em>" + strokeId + "</em>"
            : strokeId;

        label.innerHTML = innerHTML;
        
        let breakElement = document.createElement("br");
        breakElement.id = strokeId;

        // set checkbox behavior
        checkbox.addEventListener("change", function() {

            let index = idToIndex[this.id];
            if (this.checked) {
                
                project.activeLayer.children[index].strokeColor = COLOR_BLACK;
            }
            
            else {

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

function download(file, text) {
  
    // create an invisible element 
    // note: equivalent to
    // <a href="path of file" download="file name"> 
    let element = document.createElement('a'); 
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(text)); 
    element.setAttribute('download', file); 

    // include element into document
    document.body.appendChild(element); 

    // add onClick property 
    element.click(); 

    // remove element from body
    document.body.removeChild(element); 
};



let sketch;
let sketches;
let shapesList;
let checkedItemsList;
let index;
let domain;
const COLOR_BLACK = "#000000";
const COLOR_GREY = "#c0c0c0";
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: COLOR_GREY
};
const MAX_DOT_DISTANCE = 4.0;
const DEFAULT_CONFIDENCE = "1.0";
const STROKE_CHECKBOX_GROUP = "strokeCheckboxGroup";
