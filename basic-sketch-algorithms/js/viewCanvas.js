
globals.runAlgorithm = (sketch, algorithmValue) => {

    // set up canvas and draw strokes
    setupCanvas();
    drawStrokes(sketch, COLOR_GREY);

    // run algorithms
    if      (algorithmValue === "endpoints")            { runEndpoints(sketch); }
    else if (algorithmValue === "boundingBox")          { runBoundingBox(sketch); }
    else if (algorithmValue === "boundingBoxes")        { runBoundingBoxes(sketch); }
    else if (algorithmValue === "centerMidpoint")       { runCenterMidpoint(sketch); }
    else if (algorithmValue === "centerCentroid")       { runCenterCentroid(sketch); }
    else if (algorithmValue === "cornersShortStraw")    { runCornersShortStraw(sketch); }
    else if (algorithmValue === "cornersIStraw")        { runCornersIStraw(sketch); }
    else if (algorithmValue === "translate")        {
        
        let x = Number.parseInt(document.getElementById("translateX").value);
        let y = Number.parseInt(document.getElementById("translateY").value);
        runTranslate(sketch, x, y);
    }
    else if (algorithmValue === "resampleCount") {

        let count = Number.parseInt(document.getElementById("resampleCount").value);
        runResampleCount(sketch, count);
    }
    else if (algorithmValue === "resampleDistance") {

        let pixels = Number.parseInt(document.getElementById("resampleDistance").value);
        runResampleDistance(sketch, pixels);
    }
    else if (algorithmValue === "scaleProportional") {

        let pixels = Number.parseInt(document.getElementById("scaleProportional").value);
        runScaleProportional(sketch, pixels);
    }
    else if (algorithmValue === "scaleSquare") {

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
}

function runCornersShortStraw(sketch) {

    // get resampled sketch and corresponding corner indices
    var resampledSketch = SketchRecTools.resampleByDistance(sketch);
    var sketchCornerIndices = ShortStraw.run(resampledSketch);

    // gather corners from their indices
    var corners = [];
    for (let i = 0; i < resampledSketch.strokes.length; i++) {

        // get resampled points and corresponding corner indices of current stroke
        let resampledPoints = resampledSketch.strokes[i].points;
        let strokeCornerIndices = sketchCornerIndices[i];

        // get corners from resampled points
        for (let j = 0; j < strokeCornerIndices.length; j++) {
            corners.push(resampledPoints[strokeCornerIndices[j]]);
        }
    }

    // display corners
    for (let corner of corners) {

        let dot = new Path.Circle(new Point(corner.x, corner.y), DOT_SIZE);
        dot.fillColor = 'red';
    }
}

function runCornersIStraw(sketch) {

    // get resampled sketch and corresponding corner indices
    var resampledSketch = SketchRecTools.resampleByDistance(sketch);
    var sketchCornerIndices = IStraw.run(resampledSketch);
    
    // gather corners from their indices
    var corners = [];
    for (let i = 0; i < resampledSketch.strokes.length; i++) {

        // get resampled points and corresponding corner indices of current stroke
        let resampledPoints = resampledSketch.strokes[i].points;
        let strokeCornerIndices = sketchCornerIndices[i];

        // get corners from resampled points
        for (let j = 0; j < strokeCornerIndices.length; j++) {
            corners.push(resampledPoints[strokeCornerIndices[j]]);
        }
    }

    // display corners
    for (let corner of corners) {

        let dot = new Path.Circle(new Point(corner.x, corner.y), DOT_SIZE);
        dot.fillColor = 'red';
    }
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


let ShortStraw = {
    run: function(sketch) {
        // return no corners for an empty sketch
        if (sketch.strokes.length === 0) { return []; }
  
        let strokes = sketch.strokes;
        let sketchCorners = [];
        for (let i = 0; i < strokes.length; i++) {
            let points = strokes[i].points;
            let strokeCorners = this.findShortStrawCorners(points);
            sketchCorners.push(strokeCorners);
        }
        return sketchCorners;
    },
  
    findShortStrawCorners: function(points) {
  
        let corners = [];
  
        // ----- start algorithm -----
        // add the first point index
        corners.push(0);
  
        // handle singleton-stroke case
        if (points.length === 1) { return corners; }
  
        // create the straws and straw range
        let straws = [];
  
        // collect the straw distances
        for (let i = this.W; i < points.length - this.W; i++) {
            let straw0 = points[i - this.W];
            let strawN = points[i + this.W];
            let strawDistance = SketchRecTools.calculateDistance(straw0.x, straw0.y, strawN.x, strawN.y);
            straws.push(strawDistance);
        }
  
        // calculate the pseudo-median
        let t = ShortStraw.calculateMedian(straws) * 0.95;
  
        // iterate through each straw distance
        for (let i = 0; i < straws.length; i++) {
  
            // case: the current straw distance is less than the pseudo-median
            if (straws[i] < t) {
    
                // initialize the local min and min index's starting values
                let localMin = Number.MAX_SAFE_INTEGER;
                let localMinIndex = i;
  
                // iterate through the local straw distance cluster
                while (i < straws.length && straws[i] < t) {
  
                    // local min (i.e., corner index) candidate found
                    if (straws[i] < localMin) {
                        localMin = straws[i];
                        localMinIndex = i;
                    }
    
                    // iterate through the local cluster
                    // note: need to iterate through i in inner loop to skip local cluster in outer loop
                    i = i + 1;
                }
  
                // add the corner index of local cluster to the corner indices array
                // note: need to add W to offset between the straw indices and point indices
                corners.push(localMinIndex + this.W);
            }
        }
  
        // add the last point index
        corners.push(points.length - 1);
  
        corners = this.postProcessCorners(points, corners, straws);
        return corners;
    },
  
    postProcessCorners: function(points, corners, straws) {
        // ----- start corner post-processing check #1 -----
        let advance = false;
        while (!advance) {
            advance = true;
  
            // iterate through the corner indices
            for (let i = 1; i < corners.length; i++) {
                // get the previous and current corner indices
                let c1 = corners[i - 1];
                let c2 = corners[i];
  
                // check if line is formed between previous and current corner indices
                let isLine = this.isLine(points, c1, c2);
                if (!this.isLine(points, c1, c2)) {
  
                // get the candidate halfway corner
                // offset it by W due to straw indices and points indices mis-match
                var newCorner = this.halfwayCorner(straws, c1, c2);
                newCorner = newCorner + this.W;
  
                // skip adding new corner, since it already exists
                // can happen during an overzealous halfway corner calculation
                if (newCorner === c2) {
                    continue;
                }
  
                corners.splice(i, 0, newCorner);
                advance = false;
            }
        }
  
        // emergency stop
        if (corners.length > 15) { console.log("WARNING: Infinite Loop"); break; }
        }
        // ----- end corner post-processing check #1 -----
  
        // ----- start corner post-processing check #2 -----
        for (let i = 1; i < corners.length - 1; i++) {
            let c1 = corners[i - 1];
            let c2 = corners[i + 1];
  
            let isLine = this.isLine(points, c1, c2);
            if (isLine) {
                corners.splice(i, 1);
                i = i - 1;
            }
        }
  
        // ----- end corner post-processing check #2 -----
        return corners;
    },
  
    isLine: function(points, a, b) {
  
        let subset = points.slice(a, b + 1);
    
        let threshold = 0.95;
        let startPoint = points[a];
        let endPoint = points[b];
    
        let ax = startPoint.x;
        let ay = startPoint.y;
        let bx = endPoint.x;
        let by = endPoint.y;
        let distance = SketchRecTools.calculateDistance(ax, ay, bx, by);
        let pathDistance = SketchRecTools.calculatePathLength({ strokes: [ {points: subset} ] });
        return distance / pathDistance > threshold;
    },
  
    halfwayCorner: function(straws, a, b) {
  
        let quarter = Math.floor((b - a) / 4);
        let minValue = Number.MAX_SAFE_INTEGER;
        let minIndex = a + quarter;
  
        for (let i = a + quarter; i < b - quarter; i++) {
            if (straws[i] < minValue) {
                minValue = straws[i];
                minIndex = i;
            }
        }
  
        return minIndex;
    },
  
    calculateMedian: function(inputs) {
        var values = [];
        for (let i = 0; i < inputs.length; i++) {
            values.push(inputs[i]);
        }
    
        values.sort( function(a,b) {return a - b;} );
        var half = Math.floor(values.length/2);
        if (values.length % 2)  { return values[half]; }
        else                    { return (values[half-1] + values[half]) / 2.0; }
    },
    
    W: 3,
}; // end

let IStraw = {

    /**
     * Runs the IStraw algorithm on (an already-resampled) sketch.
     * @param {Sketch} sketch - The input resampled sketch.
     * @return {number[][]} The array of array of corner indices.
     */
    run: function(sketch) {
      var strokes = sketch.strokes;
      var sketchCorners = [];

      for (var i = 0; i < strokes.length; i++) {

        var points = strokes[i].points;        
        var strokeCorners = this.main(points);
        sketchCorners.push(strokeCorners);
      }

      return sketchCorners;
    },
  
    /**
     * Run the IStraw algorithm on points from a single stroke.
     * @param {Point[]} points - The target points.
     * @return {number[]} The resampled corner indices.
     */
    main: function(points) {

      // get the corners (line 3)
      var corners = this.getCorners(points);
  
      return corners;
    },
  
    /**
     * Get the corners.
     * @param {Point[]} points - The target resampled points.
     * @return {number[]} The corner indices.
     */
    getCorners: function(points) {

      // initialize array of corner indices (line 1)
      var corners = [];
  
      // add the 0-index to the corner indices (line 2)
      corners.push(0);
  
      // handle singleton-stroke and low point-count stroke cases
      const MIN_NUM_POINTS = 6;
      if (points.length === 1) { return corners; }
      if (points.length < MIN_NUM_POINTS) {
        corners.push(points.length - 1);
        return corners;
      }
  
      // set the window length (line 3)
      var W = 3;
  
      // zero-fill the array of straw distances to the size of points
      var straws = new Array(points.length - 1).fill(0);
  
      // set the straw distances for the points outside the window (line 4, 5, 6, 7)
      straws[1] = this.distance(points[0], points[1 + W]) * ((2 * W) / (1 + W));
      straws[2] = this.distance(points[0], points[2 + W]) * ((2 * W) / (2 + W));
      straws[points.length - 2] = ((2 * W) / (1 + W)) * this.distance(points[points.length - 1], points[points.length - 2 - W]);
      straws[points.length - 3] = ((2 * W) / (2 + W)) * this.distance(points[points.length - 1], points[points.length - 3 - W]);

      // set the straw distances for the points inside the window (line 8, 9)
      for (var i = W; i < points.length - W; i++) {
        straws[i] = this.distance(points[i - W], points[i + W]);
      }

      corners = this.initCorners(points, corners, straws, W);
      corners = this.polylineProc(points, corners, straws);
      corners = this.curveProcessPass1(points, corners);
      corners = this.curveProcessPass2(points, corners);
  
      return corners;
    },
  
    initCorners: function(points, corners, straws, W) {
      // debug
      if (this.isDebug) {
        console.log("----- 1. initCorners -----");
        console.log("   before (" + corners.length + "): " + this.debugCorners(corners));
      }
      // end debug
  
      // get the pseudo-mean (line 1)
      var t = this.mean(straws.slice(1, straws.length)) * 0.95;
  
      // (line 2)
      for (var i = W; i < points.length - W - 1; i++) {
        if (straws[i] < t) {
          var localMin = straws[i];
          var localMinIndex = i;
          while (i < points.length - W && straws[i] < t) {
            if (straws[i] < localMin) {
              localMin = straws[i];
              localMinIndex = i;
            }
            i++;
          }
          corners.push(localMinIndex);
        }
      }
  
      // (line 12)
      corners.push(points.length - 1);
  
      // get the array of point times
      var times = [];
      points.forEach(function(point){
        times.push(point.time);
      });
  
      // (line 13)
      var meanTime = this.mean(times);
  
      // (line 14)
      for (var i = 1; i < corners.length - 1; i++) {
  
        // (lines 15, 16)
        var c1 = corners[i - 1];
        var c2 = corners[i];
  
        // (line 17)
        if (c2 - c1 >= 6) {
          // (line 18, 19)
          var localMaxIndex = c1 + 3;
          var localMax = points[localMaxIndex].time;
  
          // (line 20)
          for (var j = c1 + 3; j <= c2 - 3; j++) {
            // (line 21)
            if (localMax < points[j].time) {
              localMax = points[j].time;
              localMaxIndex = j;
            }
            if (localMax > 2 * meanTime) {
              corners.slice(i, 0, localMinIndex);
            }
          }
        }
      }
  
      // debug
      if (this.isDebug) {
        console.log("    after (" + corners.length + "): " + this.debugCorners(corners));
        console.log("----- end initCorners -----")
      }
      // end debug
  
      // (line 25)
      return corners;
    },
  
    curveProcessPass2: function(points, corners) {
      // debug
      if (this.isDebug) {
        console.log("----- 7. curveProcessPass2 -----");
        console.log("   before (" + corners.length + "): " + this.debugCorners(corners));
      }
      // end debug
  
      for (var i = 1; i < corners.length - 1; i++) {
        var angles = this.compAngles2(points, corners, i);
        var notCorner = false;
  
        if
        (
          (angles[2] > 26.1 + 0.93*angles[1] && ((angles[3] > 31 + angles[1] && angles[3] > 100) || angles[3] > 161))
          ||
          (angles[0] === 0 && angles[2] - angles[1] > 15 && angles[3] > 20)
        )
        {
          notCorner = true;
          if (notCorner || angles[0] > 0) {
            corners.splice(i, 1);
            i--;
          }
        }
      }
  
      // debug
      if (this.isDebug) {
        console.log("    after (" + corners.length + "): " + this.debugCorners(corners));
        console.log("----- end curveProcessPass2 -----");
      }
      // end debug
  
      return corners;
    },
  
    compAngles2: function(points, corners, i) {
      var a0 = 0;
      var a1 = 0;
      var a2 = 0;
      var a3 = 0;
  
      var c = corners[i];
      var pos = points[c];
      var s0 = c - 12;
      if (s0 < corners[i - 1]) {
        s0 = corners[i - 1];
      }
      var e0 = c + 12;
      if (e0 > corners[i + 1]) {
        e0 = corners[i + 1];
      }
      var s1 = c - Math.ceil( (corners[i] - s0) / 3 );
      var e1 = c - Math.ceil( (corners[i] - e0) / 3 );
      var a3 = this.getAngle(pos, points[c - 1], points[c + 1]);
      if (this.diffDir(points, c, s0, e0, s1, e1)) {
        s0 = c - 4;
        e0 = c + 4;
        if (s0 < corners[i - 1]) {
          s0 = corners[i - 1];
        }
        if (e0 > corners[i + 1]) {
          e0 = corners[i + 1];
        }
        s1 = c - 1;
        e1 = c + 1;
        var a0;
        if (this.diffDir(points, c, s0, e0, s1, e1)) {
          a0 = -1;
          return [a0, a1, a2, a3];
        }
        a0 = 0;
      }
      else if ( !this.isLine(points, c, corners[i - 1], 0.975)
        && !this.isLine(points, c, corners[i + 1], 0.975) )  {
        if (this.diffDir(points, c, s0, s1, e1, e0) && a3 > 135 ) {
          a0 = 1;
        }
      }
      a1 = this.getAngle(pos, points[s0], points[e0]);
      a2 = this.getAngle(pos, points[s1], points[e1]);
      return [a0, a1, a2, a3];
    },
  
    curveProcessPass1: function(points, corners) {
      // debug
      if (this.isDebug) {
        console.log("----- 6. curveProcessPass1 -----");
        console.log("   before (" + corners.length + "): " + this.debugCorners(corners));
      }
      // end debug
  
      var preCorner = corners[0];
  
      for (var i = 1; i < corners.length - 1; i++) {
        var angles = this.compAngles1(points, corners, i);
        preCorner = corners[i];
        var notCorner = this.notCorner1(angles, corners, i);
        if (notCorner) {
          corners.splice(i, 1);
          i--;
        }
      }
  
      // debug
      if (this.isDebug) {
        console.log("    after (" + corners.length + "): " + this.debugCorners(corners));
        console.log("----- end curveProcessPass1 -----");
      }
      // end debug
  
      return corners;
    },
  
    notCorner1: function(angles, corners, i) {
      if (angles[3] > 161) {
        return true;
      }
      if ( (angles[2] > 36 + 0.85*angles[1]) && (angles[1] > 20) && (angles[3] > 80 + 0.55*angles[1]) ) {
        return true;
      }
      if ( (corners[i] - corners[i - 1] < 3 || corners[i + 1] - corners[i] < 3) && (angles[2] > 130) ) {
        return true;
      }
      return false;
    },
  
    compAngles1: function(points, corners, i) {
      var c = corners[i];
      var pos = points[c];
      var s = c - 12;
      if (s < corners[i - 1]) {
        s = corners[i - 1];
      }
      var e = c + 12;
      if (e > corners[i + 1]) {
        e = corners[i + 1];
      }
      var a1 = this.getAngle(pos, points[s], points[e]);
      s = corners[i] - Math.ceil( (c - s) / 3 );
      e = corners[i] - Math.ceil( (c - e) / 3 );
      var a2 = this.getAngle(pos, points[s], points[e]);
      var a3 = this.getAngle(pos, points[c - 1], points[c + 1]);
      if ( (c - corners[i - 1]) > 6 ) {
        a3 = this.getAngle(pos, points[c - 2], points[c + 1]);
      }
      if ( (corners[i + 1] - c) > 6 ) {
        a3 = this.getAngle(pos, points[c - 1], points[c + 2]);
      }
  
      var a = [0, a1, a2, a3];
      return a;
    },
  
    polylineProc: function(points, corners, straws) {
  
      // debug
      if (this.isDebug) {
        console.log("----- 2. polylineProc -----");
        console.log("   before (" + corners.length + "): " + this.debugCorners(corners));
      }
      // end debug
  
      // initialize the leave condition to on
      var loop = true;
  
      // keep searching for halfway corners until no more can be found
      while (loop) {
  
        // tentatively set the loop condition to off
        loop = false;
  
        // search for halfway corners between consecutive corner pairs
        for (var i = 1; i < corners.length; i++) {
  
          // get the consecutive corner pairs
          var c1 = corners[i - 1];
          var c2 = corners[i];
  
          // check if a proper line exists between the consecutive corner pair
          var isLine = this.isLine(points, c1, c2, 0.975);
  
          // the path between consecutive corner pair does not form a line
          // ==> insert a corner in-between the pair
          if (!isLine) {
  
            // create the halfway corner
            var newC = this.halfwayCorners(straws, c1, c2);
  
            // insert the new corner in-between the consecutive corner pairs
            corners.slice(newC, 0, i);
  
            // with a new corner added, the halfway corner search has to be re-started
            // ===> when this for-loop ends, restart the for-loop once more
            //leave = false;
          }
  
        }
  
      }
  
      // debug
      if (this.isDebug) {
        console.log("    after (" + corners.length + "): " + this.debugCorners(corners));
        console.log("----- end polylineProc -----");
      }
      // end debug
  
      corners = this.adjustCorners(points, corners);
      corners = this.tripletCollinearTest(points, corners);
      corners = this.shapeNoiseProcess(points, corners,);
  
      return corners;
    },
  
    shapeNoiseProcess: function(points, corners, straws) {
      if (this.isDebug) {
        console.log("----- 5. shapeNoiseProcess -----");
        console.log("   before (" + corners.length + "): " + this.debugCorners(corners));
      }
  
      for (var i = 1; i < corners.length; i++) {
        var c1 = corners[i - 1];
        var c2 = corners[i];
        if ( (c2 - c1 <= 1) || ( (c2 - c1 <= 2) && (i === 0 && i === corners.length - 2) ) ) {
          // console.log("c1: " + c1);
          // console.log("c2: " + c2);
          if (straws[c1] < straws[c2]) {
            corners.splice(c2, 1);
          }
          else {
            corners.splice(c1, 1);
          }
          i--;
        }
      }
  
      if (this.isDebug) {
        console.log("    after (" + corners.length + "): " + this.debugCorners(corners));
        console.log("----- end shapeNoiseProcess -----");
      }
  
      return corners;
    },
  
    tripletCollinearTest: function(points, corners) {
      // debug
      if (this.isDebug) {
        console.log("----- 4. tripletCollinearTest -----");
        console.log("   before (" + corners.length + "): " + this.debugCorners(corners));
      }
      // end debug
  
      for (var i = 1; i < corners.length - 1; i++) {
        var c1 = corners[i - 1];
        var c2 = corners[i + 1];
        if (this.isLine(points, c1, c2, 0.988)) {
          console.log("triplet collinear test: !!!");
          corners.splice(i, 1);
          i = i - 1;
        }
      }
  
      var times = []
      points.forEach(function(point) {
        times.push(point);
      });
      var meanTime = this.mean(times);
      for (var i = 1; i < corners.length - 1; i++) {
        var c = corners[i];
        var c1 = corners[i - 1];
        var c2 = corners[i + 1];
        var threshold = 0.9747;
        if (c2 - c1 > 10) {
          threshold = threshold + 0.0053;
        }
        if ( (points[c].time > 2 * meanTime) || (points[c - 1].time > 2 * meanTime) || (points[c + 1].time > 2 * meanTime) ) {
          threshold = threshold + 0.0066;
        }
        if (this.isLine(points, c1, c2, threshold)) {
          corners.splice(i, 1);
          i = i - 1;
        }
      }
  
      // debug
      if (this.isDebug) {
        console.log("    after (" + corners.length + "): " + this.debugCorners(corners));
        console.log("----- end tripletCollinearTest -----");
      }
      // end debug
  
      return corners;
    },
  
    adjustCorners: function(points, corners) {
      // debug
      if (this.isDebug) {
        console.log("----- 3. adjustCorners -----");
        console.log("   before (" + corners.length + "): " + this.debugCorners(corners));
      }
      // end debug
  
      for (var i = 1; i < corners -2; i++) {
        var index = corners[i];
        if (index > 2 && index < points.length - 3) {
          var pos = [];
          var angle = [];
          for (var j = 0; j <= 6; j++) {
            pos.push(points[index - 3 + j]);
          }
          for (var j = 0; j <= 4; j++) {
            angle.push(this.getAngle(pos[j + 1], pos[j],  pos[j + 2]));
          }
          if (angle[1] < angle[3]) {
            if (angle[0] < angle[1] && angle[0] < angle[2]) {
              index = index - 2;
            }
            else if (angle[1] < angle[2]) {
              index = index - 1;
            }
          }
          else {
            if (angle[4] < angle3 && angle[4] < angle[2]) {
              index = index + 2;
            }
            else if (angle[3] < angle[2]) {
              index++;
            }
          }
          corner[i] = index;
        }
      }
  
      // debug
      if (this.isDebug) {
        console.log("    after (" + corners.length + "): " + this.debugCorners(corners));
        console.log("----- end adjustCorners -----");
      }
      // end debug
  
      return corners;
    },
  
    getAngle: function(center, start, end) {
      var theAngle;
      // get two vector of the angle
      var direction1 = {x: start.x - center.x, y: start.y - center.y};
      direction1 = this.normalize(direction1);
      var direction2 = {x: end.x - center.x, y: end.y - center.y};
      direction2 = this.normalize(direction2);
      //compute the angle
      theAngle = Math.acos(direction1.x * direction2.x + direction1.y * direction2.y);
      return theAngle * 180 / Math.PI;
    },
  
    normalize: function(point) {
      var a = point.x;
      var b = point.y;
  
      var v = Math.sqrt((a * a) + (b * b));
      var u = {x: (a / v), y: (b / v)};
  
      return u;
    },
  
    halfwayCorners: function(straws, a, b) {
      var quarter = Math.floor((b - a) / 4);
      var minValue = Number.MAX_SAFE_INTEGER;
      var minIndex = a + quarter;
      for (var i = a + quarter; i < b - quarter; i++) {
        if (straws[i] < minValue) {
          minValue = straws[i];
          minIndex = i;
        }
      }
      return minIndex;
    },
  
    isLine: function(points, a, b, threshold) {
      var distance = this.distance(points[a], points[b]);
      var pathDistance = this.pathDistance(points, a, b);
      return (distance / pathDistance) > threshold;
    },
  
    diffDir: function(points, o, a, b, c, d) {
      var d0 = {x: points[a].x - points[o].x, y: points[a].y - points[o].y};
      var d1 = {x: points[o].x - points[b].x, y: points[o].y - points[b].y};
      var d2 = {x: points[c].x - points[o].x, y: points[c].y - points[o].y};
      var d3 = {x: points[o].x - points[d].x, y: points[o].y - points[d].y};
      var cross0 = (d0.x * d1.y) - (d0.y * d1.x);
      var cross1 = (d2.x * d3.y) - (d2.y * d3.x);
      var result = cross0 * cross1;
      return result > 0;
    },
  
    pathDistance: function(points, a, b) {
      var d = 0;
      for (var i = a; i < b; i++) {
        d += this.distance(points[i], points[i + 1]);
      }
      return d;
    },
  
    /**
      * Calculate the distance between two input points.
      * @param {Point} p0 - The first target point.
      * @param {Point} p1 - The first target point.
      * @return {number} The Euclidean distance between two points.
      */
    distance: function(p0, p1) {
      var deltaX = p1.x - p0.x;
      var deltaY = p1.y - p0.y;
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
  
    mean: function(values) {
      var sum = 0;
      values.forEach(function(value) {
        sum += value;
      });
      return sum / values.length;
    },
  
    debugCorners: function(corners) {
      var output = "";
      for (var i = 0; i < corners.length; i++) {
        output += corners[i];
        if (i !== corners.length - 1) { output += ", "; }
      }
  
      return output;
    },
  
    isDebug: true,
}; // end
