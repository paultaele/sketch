
//TODO:
// - handle single points
// - adjust canvas size per sketch
globals.loadCanvas = (inputSketches) => {

    // set sketches and first sketch
    sketches = inputSketches;
    index = 0;
    sketch = sketches[index];

    //
    drawStrokes(sketch);

    // modify disabled status for back and next buttons
    document.getElementById("backButton").disabled = true;
    if (sketches.length > 1) { document.getElementById("nextButton").disabled = false; }
}

//
globals.backCanvas = () => {

    // display the strokes on canvas
    --index;
    sketch = sketches[index];
    drawStrokes(sketch);

    // modify disabled status for back and next buttons
    if (index <= 0) { document.getElementById("backButton").disabled = true; }
    document.getElementById("nextButton").disabled = false;
};

//
globals.nextCanvas = () => {

    // display the strokes on canvas
    ++index;
    sketch = sketches[index];
    drawStrokes(sketch);

    // modify disabled status for back and next buttons
    document.getElementById("backButton").disabled = false;
    if (index >= sketches.length - 1) { document.getElementById("nextButton").disabled = true; }
};

//
function drawStrokes(sketch) {

    // clear all strokes from canvas
    project.activeLayer.removeChildren();

    //
    console.log(`${sketch.canvasHeight} x ${sketch.canvasHeight}`);

    // resize canvas to sketch 
    let borderSize = getComputedStyle(document.getElementById("myCanvas"), null).getPropertyValue('border-left-width');
    borderSize = parseInt(borderSize.slice(0, borderSize.length - 2));
    document.getElementById("myCanvas").width = sketch.canvasWidth - borderSize;
    document.getElementById("myCanvas").height = sketch.canvasHeight - borderSize;

    // iterate through each sketch stroke
    for (let i = 0; i < sketch.strokes.length; ++i) {

        // get sketch strokes
        let sketchStroke = sketch.strokes[i];
        
        // initialize stroke
        let stroke = new Path();
        stroke.style = PATH_STYLE;

        //
        for (let j = 0; j < sketchStroke.points.length; ++j) {
            let point = sketchStroke.points[j];
            stroke.add([point.x, point.y]);
        }
    }
}



let sketch;
let sketches = [];
let index;
const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: '#000000'
};
const MAX_DOT_DISTANCE = 4.0;
