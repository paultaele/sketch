
globals.runAlgorithm = (sketch, algorithmValue) => {

    // set up canvas and draw strokes
    setupCanvas();
    drawStrokes(sketch, COLOR_GREY);

    // run algorithms
    if      (algorithmValue === "endpoints")        { runEndpoints(sketch); }
    else if (algorithmValue === "boundingBox")      { runBoundingBox(sketch); }
    else if (algorithmValue === "boundingBoxes")    { runBoundingBoxes(sketch); }
    else if (algorithmValue === "centerMidpoint")   { runCenterMidpoint(sketch); }
    else if (algorithmValue === "centerCentroid")   { runCenterCentroid(sketch); }
    else if (algorithmValue === "translate")        {
        
        let x = Number.parseInt(document.getElementById("translateX").value);
        let y = Number.parseInt(document.getElementById("translateY").value);
        runTranslate(sketch, x, y);
    }
    else if (algorithmValue === "resampleCount")    {

        let count = Number.parseInt(document.getElementById("resampleCount").value);
        runResampleCount(sketch, count);
    }
    else if (algorithmValue === "resampleDistance")    {

        let pixels = Number.parseInt(document.getElementById("resampleDistance").value);
        runResampleDistance(sketch, pixels);
    }
    else if (algorithmValue === "scaleProportional")    {

        let pixels = Number.parseInt(document.getElementById("scaleProportional").value);
        runScaleProportional(sketch, pixels);
    }
    else if (algorithmValue === "scaleSquare")    {

        let pixels = Number.parseInt(document.getElementById("scaleSquare").value);
        runScaleSquare(sketch, pixels);
    }
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

function runBoundingBox(sketch) {

    // get the global min and max coordinate values
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    for (let stroke of sketch.strokes) {

        for (let point of stroke.points) {

            if      (point.x < minX) { minX = point.x; }
            else if (point.x > maxX) { maxX = point.x; }
            if      (point.y < minY) { minY = point.y; }
            else if (point.y > maxY) { maxY = point.y; }
        }
    }

    // draw bounding box
    let boundingBox = new Path();
    boundingBox.style = { strokeWidth: 4, strokeColor: "red" };
    boundingBox.add(new Point(minX, minY));
    boundingBox.add(new Point(maxX, minY));
    boundingBox.add(new Point(maxX, maxY));
    boundingBox.add(new Point(minX, maxY));
    boundingBox.add(new Point(minX, minY));
}

function runBoundingBoxes(sketch) {

    for (let stroke of sketch.strokes) {

        // get the global min and max coordinate values
        let minX = Number.MAX_SAFE_INTEGER;
        let minY = Number.MAX_SAFE_INTEGER;
        let maxX = Number.MIN_SAFE_INTEGER;
        let maxY = Number.MIN_SAFE_INTEGER;
    
        for (let point of stroke.points) {

            if      (point.x < minX) { minX = point.x; }
            else if (point.x > maxX) { maxX = point.x; }
            if      (point.y < minY) { minY = point.y; }
            else if (point.y > maxY) { maxY = point.y; }
        }
    
        // draw bounding box
        let boundingBox = new Path();
        boundingBox.style = { strokeWidth: 4, strokeColor: "red" };
        boundingBox.add(new Point(minX, minY));
        boundingBox.add(new Point(maxX, minY));
        boundingBox.add(new Point(maxX, maxY));
        boundingBox.add(new Point(minX, maxY));
        boundingBox.add(new Point(minX, minY));
    }
}

function runCenterMidpoint(sketch) {

    let center = {x: 250, y: 250};
    let newSketch = SketchRecTools.translateToPoint(sketch, center);
    drawStrokes(newSketch, COLOR_RED);
}

function runCenterCentroid(sketch) {

    let center = {x: 250, y: 250};
    let newSketch = SketchRecTools.translateToCentroid(sketch, center);
    drawStrokes(newSketch, COLOR_RED);
}

function runTranslate(sketch, x, y) {

    let newSketch = SketchRecTools.translate(sketch, x, y);
    drawStrokes(newSketch, COLOR_RED);
}

function runResampleCount(sketch, count) {

    // get all resampled points
    let newSketch = SketchRecTools.resampleByCount(sketch, count);
    let points = [];
    for (let stroke of newSketch.strokes) {

        for (let point of stroke.points) {

            points.push(point);
        }
    }

    // draw resampled points
    for (let point of points) {

        let dot = new Path.Circle(new Point(point.x, point.y), DOT_SIZE);
        dot.fillColor = 'red';
    }
}

function runResampleDistance(sketch, pixels) {

    // get all resampled points
    let newSketch = SketchRecTools.resampleByDistance(sketch, pixels);
    let points = [];
    for (let stroke of newSketch.strokes) {

        for (let point of stroke.points) {

            points.push(point);
        }
    }

    // draw resampled points
    for (let point of points) {

        let dot = new Path.Circle(new Point(point.x, point.y), DOT_SIZE);
        dot.fillColor = 'red';
    }
}

function runScaleProportional(sketch, pixels) {

    let newSketch = SketchRecTools.scaleProportional(sketch, pixels);
    drawStrokes(newSketch, COLOR_RED);
}

function runScaleSquare(sketch, pixels) {

    let newSketch = SketchRecTools.scaleSquare(sketch, pixels);
    drawStrokes(newSketch, COLOR_RED);

    console.log(newSketch);
}



function drawStrokes(sketch, color) {

    // clear all strokes from canvas
    project.activeLayer.removeChildren();

    // iterate through each sketch stroke
    for (let i = 0; i < sketch.strokes.length; ++i) {

        // get sketch strokes
        let sketchStroke = sketch.strokes[i];
        
        // initialize stroke
        let stroke = new Path();
        stroke.strokeWidth = 4;
        stroke.strokeColor = color;

        // add stroke to canvas
        for (let j = 0; j < sketchStroke.points.length; ++j) {
            let point = sketchStroke.points[j];
            stroke.add([point.x, point.y]);
        }
    }
}

function setupCanvas() {

    // switch scope to view canvas
    let viewScope = new paper.PaperScope();
    let viewCanvas = document.getElementById("viewCanvas");
    viewScope.setup(viewCanvas);
    viewScope.activate();

    // set canvas size
    viewCanvas.style.display = "inline";
    viewCanvas.width = 498;
    viewCanvas.height = 498;
    viewCanvas.style.border = "1px solid #000000";
    paper.view.viewSize = new Size(498, 498);
}

const PATH_STYLE = {
    strokeWidth: 4,
    strokeColor: '#808080'
};
const MAX_DOT_DISTANCE = 4.0;
const DOT_SIZE = 8;
const COLOR_GREY    = "#808080";
const COLOR_BLACK   = "#000000";
const COLOR_RED     = "#ff0000";



let SketchRecTools = {

    resampleByCount: function(sketch, n) {
        let S = this.calculatePathLength(sketch) / (n - 1);

        return this.getResample(sketch, S);
    },
  
    resampleByDistance: function(sketch, S) {

        if (typeof S === "undefined") {
            S = this.determineResampleSpacing(sketch);
        }

        return this.getResample(sketch, S);
    },
  
    determineResampleSpacing(sketch) {
        let box = this.calculateBoundingBox(sketch);
        let diagonal = this.calculateDistance(box.minX, box.minY, box.maxX, box.maxY);
        S = diagonal / 40.0;
    
        return S;
    },
  
    /**
     * Resamples the sketch on an interspacing distance.
     * @param {Sketch} sketch - The target sketch.
     * @param {number} S - The interspacing distance.
     * @return {Sketch} The resampled sketch.
     */
    getResample: function(sketch, S) {
        //  initialize the variables
        let D = 0.0;
        let newStrokes = [];
        let strokes = sketch.strokes;
    
        // iterate through the strokes
        for (let i = 0; i < strokes.length; i++) {
            // get the current stroke, and skip if no points
            let stroke = strokes[i];
            if (stroke.points.length === 0) { continue; }
    
            // get the raw points
            let points = [];
            for (let j = 0; j < stroke.points.length; j++) {
            // get the current stroke point and add it to the points list
            let p = stroke.points[j];
            points.push(p);
            }
    
            // initialize the resampled points with the first raw point
            let newPoints = [];
            newPoints.push( {x: points[0].x, y: points[0].y, time: points[0].time} );
    
            // get the resampled points
            for (let j = 1; j < points.length; j++) {
            // get the previous and current point
            let prevPoint = points[j - 1];
            let currPoint = points[j];
    
            // get the distance between the previous and current point
            let d = this.calculateDistance(prevPoint.x, prevPoint.y, currPoint.x, currPoint.y);
    
            // check for ready resampled points
            if (D + d >= S) { // resampled point ready
    
                // set the resampled point's (x, y, t)
                let qx = prevPoint.x + ((S-D)/d)*(currPoint.x-prevPoint.x);
                let qy = prevPoint.y + ((S-D)/d)*(currPoint.y-prevPoint.y);
                let qt = currPoint.time;
    
                // set the resampled point data
                let q = {x: qx, y: qy, time: qt};
    
                // insert the resampled point into the raw and resampled point list
                newPoints.push(q);
                points.splice(j, 0, q);
                D = 0.0;
            }
            else { D += d; } // resampled point ready
            }
    
            // reset the distance counter for the next stroke
            D = 0.0;
    
            // wrap the resampled points to a stroke and add it to array of resampled strokes
            newStroke = {points: newPoints};
            newStrokes.push(newStroke);
        }
    
        // wrap the resampled strokes into a resampled sketch and return
        let newSketch = {strokes: newStrokes};
        return newSketch;
    },
  
    /**
     * Calculates the bounding box.
     * @param {Sketch} sketch - The target sketch.
     * @return {Box} The target sketch's bounding box.
     */
    calculateBoundingBox: function(sketch) {
        // bounding box is null if there is not sketch or sketch strokes
        if (sketch === null || sketch === undefined || sketch.strokes === null || sketch.strokes === undefined || sketch.strokes.length === 0) {
            return null;
        }
  
        let strokes = sketch.strokes;
        let point0 = strokes[0].points[0];
        let minX = point0.x;
        let minY = point0.y;
        let maxX = point0.x;
        let maxY = point0.y;
  
        for (let i = 0; i < strokes.length; i++) {
    
            let points = strokes[i].points;
            for (let j = 0; j < points.length; j++) {
    
            let point = points[j];
            if (point.x < minX) { minX = point.x; }
            else if (point.x > maxX) { maxX = point.x; }
            if (point.y < minY) { minY = point.y; }
            else if (point.y > maxY) { maxY = point.y; }
            }
        }
        let centerX = minX + ((maxX - minX) / 2);
        let centerY = minY + ((maxY - minY) / 2);
    
        let topLeft = {x: minX, y: minY};
        let topRight = {x: maxX, y: minY};
        let bottomLeft = {x: minX, y: maxY};
        let bottomRight = {x: maxX, y: maxY};
        let center = {x: centerX, y: centerY};
  
        let width = maxX - minX;
        let height = maxY - minY;
  
        let box = {
            topLeft: topLeft,
            topRight: topRight,
            bottomLeft: bottomLeft,
            bottomRight: bottomRight,
            center: center,
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            centerX: centerX,
            centerY: centerY,
            height: height,
            width: width
        };
        return box;
    },
  
    calculateDistance: function(x0, y0, x1, y1) {
  
        return Math.sqrt( (x1 - x0)*(x1 - x0) + (y1 - y0)*(y1 - y0)  );
    },
  
    calculatePathLength: function(sketch) {
  
        let distances = 0.0;
  
        let strokes = sketch.strokes;
        for (let i = 0; i < strokes.length; i++) {
            var points = strokes[i].points;
            for (let j = 0; j < points.length - 1; j++) {
  
                let p0 = points[j];
                let p1 = points[j + 1];
                distances += this.calculateDistance(p0.x, p0.y, p1.x, p1.y);
            }
        }
  
        return distances;
    },
  
    /**
     * Translate the sketch to a point.
     * @param {Sketch} sketch - The target sketch.
     * @param {number} x - The destination x-coordinate.
     * @param {number} y - The destination y-coordinate.
     * @return {Sketch} The translated sketch.
     */
    translate: function(sketch, x, y) {
        if (sketch === null || sketch === undefined || sketch.strokes === null || sketch.strokes === undefined || sketch.strokes.length === 0) {
            return null;
        }
  
        // get the current strokes and initialize the new strokes
        let strokes = sketch.strokes;
        let newStrokes = [];
  
        // iterate through each stroke
        for (let i = 0; i < strokes.length; i++) {
  
            // get the current points and initialize the new points
            let points = strokes[i].points;
            let newPoints = [];
    
            // iterate through each point
            for (let j = 0; j < points.length; j++) {
    
                // get the current point
                let point = points[j];
    
                // get the translated point
                let qx = point.x + x;
                let qy = point.y + y;
                let qtime = point.time;
                let q = {x: qx, y: qy, time: qtime};
    
                // add the new point
                newPoints.push(q);
            }
  
            newStrokes.push({points: newPoints});
        }
  
        var newSketch = {strokes: newStrokes};
        return newSketch;
    },
  
    translateToPoint: function(sketch, point) {
        if (sketch === null || sketch === undefined || sketch.strokes === null || sketch.strokes === undefined || sketch.strokes.length === 0) {
            return null;
        }
        if (point === null || point === undefined) {
            return null;
        }
  
        // get the sketch's bounding box and its center
        let box = this.calculateBoundingBox(sketch);
        let center = box.center;
  
        // get the x- and y-deltas
        let x = point.x - center.x;
        let y = point.y - center.y;
  
        //
        let newSketch = this.translate(sketch, x, y);
        return newSketch;
    },
  
    translateToCentroid: function(sketch, center) {
        // calculate the centroid
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        let strokes = sketch.strokes;
        for (let i = 0; i < strokes.length; i++) {
            let points = strokes[i].points;
            for (let j = 0; j < points.length; j++) {
                let p = points[j];
                sumX += p.x;
                sumY += p.y;
                ++count;
            }
        }
  
        let meanX = sumX / count;
        let meanY = sumY / count;
  
        let moveX = center.x - meanX;
        let moveY = center.y - meanY;
  
        let newSketch = this.translate(sketch, moveX, moveY);
  
        return newSketch;
    },
  
    scaleProportional: function(sketch, size) {
        // get the bounding box and determine scale
        let box = this.calculateBoundingBox(sketch);
        let scale = box.height > box.width ? size / box.height : size / box.width;
  
        // get the offset
        let xOffset = Number.MAX_SAFE_INTEGER;
        let yOffset = Number.MAX_SAFE_INTEGER;
        let strokes = sketch.strokes;
        for (let i = 0; i < strokes.length; i++) {
            let points = strokes[i].points;
            for (let j = 0; j < points.length; j++) {
                let point = points[j];
                if (point.x < xOffset) { xOffset = point.x; }
                if (point.y < yOffset) { yOffset = point.y; }
            }
        }
  
        // get the scaled sketch
        let newStrokes = [];
        for (let i = 0; i < strokes.length; i++) {
            let points = strokes[i].points;
            let newPoints = [];
            for (let j = 0; j < points.length; j++) {
                let point = points[j];
                let x = ((point.x - xOffset) * scale) + xOffset;
                let y = ((point.y - yOffset) * scale) + yOffset;
                newPoints.push({x: x, y: y, time: point.time});
            }
            let newStroke = {points: newPoints};
            newStrokes.push(newStroke);
        }
        let newSketch = {strokes: newStrokes};
  
        // relocate scaled sketch to center of original sketch
        let newBox = this.calculateBoundingBox(newSketch);
        let moveX = box.centerX - newBox.centerX;
        let moveY = box.centerY - newBox.centerY;
        newSketch = this.translate(newSketch, moveX, moveY);
  
        return newSketch;
    },
  
    scaleSquare: function(sketch, size) {
        // get the bounding box
        let box = this.calculateBoundingBox(sketch);
  
        // get the scaled sketch
        let newStrokes = [];
        let strokes = sketch.strokes;
        for (let i = 0; i < strokes.length; i++) {
            let points = strokes[i].points;
            let newPoints = [];
            for (let j = 0; j < points.length; j++) {
                let point = points[j];
                let x = point.x * size / box.width;
                let y = point.y * size / box.height;
                newPoints.push({x: x, y: y, time: point.time});
            }
            let newStroke = {points: newPoints};
            newStrokes.push(newStroke);
        }
        let newSketch = {strokes: newStrokes};
  
        // relocate scaled sketch to center of original sketch
        let newBox = this.calculateBoundingBox(newSketch);
        let moveX = box.centerX - newBox.centerX;
        let moveY = box.centerY - newBox.centerY;
        newSketch = this.translate(newSketch, moveX, moveY);
  
      return newSketch;
    },
}; // end
