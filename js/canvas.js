
function onMouseDown(event) {
    
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
    
    // - clear all strokes
    // - clear current stroke
    strokes = [];
    stroke = undefined;

    // - clear entire timespan
    // - clear current times
    timespan = [];
    times = undefined;

    // clear all strokes from canvas
    project.activeLayer.removeChildren();
}

globals.undoCanvas = () => {

    // skip if no strokes
    if (!project.activeLayer.hasChildren()) { return; }

    // - remove latest stroke from strokes
    // - set stroke to latest stroke, if any
    strokes.pop();
    stroke = strokes.length > 0 ? strokes[strokes.length - 1] : undefined;

    // - remove latest times from timespan
    // - set times to latest times, if any
    timespan.pop();
    times = timespan.length > 0 ? timespan[timespan.length - 1] : undefined;
    
    // - undo latest stroke from canvas
    project.activeLayer.lastChild.remove();
}

globals.nextCanvas = () => {

    // skip if no strokes
    if (strokes.length === 0) { return; }

    // create canvas
    let sketch = {};
    sketch.strokes = [];

    // set the sketch's strokes
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

    // set the sketch's id, time, domain, strokes, and shape
    sketch.id = generateUuidv4();
    sketch.time = firstTime;
    sketch.domain = EMPTY_VALUE;
    sketch.canvasWidth = project.activeLayer.view.size.width;
    sketch.canvasHeight = project.activeLayer.view.size.height;
    sketch.shapes = [shape];

    // add sketch to list
    sketches.push(sketch);

    // clear canvas
    globals.clearCanvas();
}

//TODO
globals.downloadCanvas = () => {

    //TODO: only download if canvas is clear
    // reason: current non-empty sketch may not be saved yet
    console.log();

    let data = JSON.stringify(sketches);

    download("data.json", data);

    //TODO: clear sketches after downloading
}

globals.debugCanvas = () => {

    console.log(strokes);
    console.log(timespan);
}

function generateUuidv4() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function download(file, text) { 
  
    //creating an invisible element 
    let element = document.createElement('a'); 
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' 
                         + encodeURIComponent(text)); 
    element.setAttribute('download', file); 

    //the above code is equivalent to 
    // <a href="path of file" download="file name"> 

    document.body.appendChild(element); 

    //onClick property 
    element.click(); 

    document.body.removeChild(element); 
} 



let stroke;
let times;
let sketch;
let strokes = [];
let timespan = [];
let sketches = [];
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: '#000000'
};
const MAX_DOT_DISTANCE = 4.0;
const EMPTY_VALUE = "";
const DEFAULT_CONFIDENCE = "1.0";