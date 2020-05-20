
globals.runAlgorithm = (sketch, algorithmValue) => {

    // switch scope to view canvas
    let viewScope = new paper.PaperScope();
    let viewCanvas = document.getElementById("viewCanvas");
    viewScope.setup(viewCanvas);
    viewScope.activate();

    // draw strokes
    drawStrokes(sketch);

    // debug
    if (algorithmValue === "endpoints")             { runEndpoints(sketch); }
    else if (algorithmValue === "boundingBox")      { runBoundingBox(sketch); }
    else if (algorithmValue === "boundingBoxes")    { runBoundingBoxes(sketch); }
}

function runEndpoints(sketch) {

    // get all endpoints
    let endpoints = [];
    for (let stroke of sketch.strokes) {

        endpoints.push(stroke.points[0]);
        endpoints.push(stroke.points[stroke.points.length - 1]);
    }

    // display dots
    for (let endpoint of endpoints) {

        let dot = new Path.Circle(new Point(endpoint.x, endpoint.y), DOT_SIZE);
        dot.fillColor = 'red';
    }
}

// TODO
function runBoundingBox(sketch) {

    // debug
    console.log("runBoundingBox(sketch)");
}

// TODO
function runBoundingBoxes(sketch) {

    // debug
    console.log("runBoundingBoxes(sketch)");
}

function drawStrokes(sketch) {

    // clear all strokes from canvas
    project.activeLayer.removeChildren();


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

const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: '#808080'
};
const MAX_DOT_DISTANCE = 4.0;
const DOT_SIZE = 8;