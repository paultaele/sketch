
function onMouseDown(event) {

    // hide view canvas
    displayViewCanvas(false);

    // - create a new stroke and set its style
    // - add the first point to the stroke
    stroke = new Path();
    stroke.style = PATH_STYLE;
	stroke.add(event.point);
    
    // - create new times
    // - add the first time to the times
    times = [];
    times.push(Date.now());
}

function onMouseDrag(event) {

    // add the current point to the stroke
    stroke.add(event.point);
    
    // addd the current time to the times
    times.push(Date.now());
}

function onMouseUp(event) {

    // - add the last point to the stroke
    // - add stroke to strokes
    stroke.add(event.point);
    strokes.push(stroke);

    // - add the last time to the timespan
    // - add times to timespan
    times.push(Date.now());
    timespan.push(times);
    
    // handle case when dot is drawn
    let distance = 0;
    for (let i = 1; i < stroke.segments.length; ++i) {

        let point1 = stroke.segments[i - 1].point;
        let point2 = stroke.segments[i].point;
        distance += Math.sqrt(
            ((point2.x - point1.x) * (point2.x - point1.x)) +
            ((point2.y - point1.y) * (point2.y - point1.y))
        );
        if (distance > MAX_DOT_DISTANCE) { return; }
    }
    stroke.lastSegment.remove();
    let firstPoint = stroke.segments[0].point;
    stroke.add(firstPoint + [0, PATH_STYLE.strokeWidth]);
}

globals.clearCanvas = () => {

    // hide view canvas
    displayViewCanvas(false);
    
    // - clear all strokes and entire timespan
    // - clear current stroke and times
    strokes = [];
    stroke = undefined;
    timespan = [];
    times = undefined;

    // clear all strokes from canvas
    project.activeLayer.removeChildren();
};

globals.undoCanvas = () => {

    // hide view canvas
    displayViewCanvas(false);

    // skip if no strokes
    if (!project.activeLayer.hasChildren()) { return; }

    // - remove latest stroke and times from strokes and timespan, respectively
    // - set stroke and times to latest stroke and times, respectively and if any
    strokes.pop();
    stroke = strokes.length > 0 ? strokes[strokes.length - 1] : undefined;
    timespan.pop();
    times = timespan.length > 0 ? timespan[timespan.length - 1] : undefined;
    
    // undo latest stroke from canvas
    project.activeLayer.lastChild.remove();
};

globals.testCanvas = () => {

    // skip if no strokes
    if (strokes.length === 0) { return; }

    // create sketch object and get algorithm value
    let sketch = createSketch(strokes);
    let algorithmValue = document.getElementById("algorithmSelect").value;

    // run algorithm on sketch
    globals.runAlgorithm(sketch, algorithmValue);

    // show view canvas
    displayViewCanvas(true);
}

function displayViewCanvas(state) {

    // get view canvas
    let viewCanvas = document.getElementById("viewCanvas");

    // case: display view canvas
    if (state) {

        viewCanvas.style.display = "inline";
        viewCanvas.width = 498;
        viewCanvas.height = 498;
        viewCanvas.style.border = "1px solid #000000";
    }

    // case: hide view canvas
    else {

        viewCanvas.style.display = "none";
    }
}

function createSketch(strokes) {

    // create canvas
    let sketch = {};

    // set the sketch's strokes and substrokes
    sketch.strokes = [];
    for (let i = 0; i < strokes.length; ++i) {
        
        // initialize sketch stroke
        sketch.strokes[i] = {};
        sketch.strokes[i].points = [];

        // iterate through stroke's points
        let stroke = strokes[i];
        for (let j = 0; j < stroke.segments.length; ++j) {
            
            // convert point to sketch point
            let point = stroke.segments[j].point;
            sketch.strokes[i].id = generateUuidv4();
            sketch.strokes[i].time = timespan[i][0];
            sketch.strokes[i].points[j] = {
                x: point.x,
                y: point.y,
                time: timespan[i][j],
                id: generateUuidv4()
            };
        }
    }
    sketch.substrokes = sketch.strokes;

    // get sketch's start time
    let firstTime = timespan[0][0];

    // set the sketch's shape
    let shape = {};
    shape.subElements = [];
    for (let i = 0; i < sketch.strokes.length; ++i) {

        shape.subElements.push(sketch.strokes[i].id);
    }
    shape.time = firstTime;
    shape.interpretation = EMPTY_VALUE;
    shape.confidence = DEFAULT_CONFIDENCE;

    // get canvas width and height
    let canvasWidth = document.getElementById("drawCanvas").width;
    let canvasHeight = document.getElementById("drawCanvas").height;
    
    // set the sketch's id, time, domain, strokes, and shape
    sketch.id = generateUuidv4();
    sketch.time = firstTime;
    sketch.domain = EMPTY_VALUE;
    sketch.canvasWidth = project.activeLayer.view.size.width;
    sketch.canvasHeight = project.activeLayer.view.size.height;
    sketch.shapes = [shape];

    return sketch;
}

function generateUuidv4() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

let stroke;
let times;
let sketch;
let strokes = [];
let timespan = [];
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: '#000000'
};
const MAX_DOT_DISTANCE = 4.0;
const EMPTY_VALUE = "";
const DEFAULT_CONFIDENCE = "1.0";
