let points = [];
let noPoints = 0;
let noClusters = 6;
let colors = [];
let pivots = [];
let pivotsInitialised = false;

function setup() {
  createCanvas(700, 700);
  colors = [color(255,255,255),color(0,0,255),color(0,255,0),color(0,255,255),color(255,0,0),color(255,0,255),color(255,255,0)];
}

function draw() {
  background(0);
  strokeWeight(4);
  for (let p of points) drawPoint(p);
  if (pivotsInitialised)
    for (let i = 0; i < noClusters; i++) drawPivot(i);
}

function keyTyped() {
  if (key == 'i') initialisePoints(100);
  if (key == 'n') step();
  if (key == 'r') reset(); // sometimes the algorithm finds a suboptimal solution. In that case, just try again
}

function mousePressed() {
  addPoint(mouseX, mouseY);
}

function reset() {
  pivotsInitialised = false;
}

function initialisePoints(noInitPoints) {
  let roots = [];
  for (let i = 0; i < noClusters; i++) roots[i] = createVector(sin(TWO_PI * i / noClusters) * width / 3, cos(TWO_PI * i / noClusters) * height / 3);
  let j = 0;
  for (let i = 0; i < noInitPoints; i++) {
    //console.log(roots[j])
    addPoint(width/2+roots[j].x + random(-200, 200)/noClusters,height/2+ roots[j].y + random(-200, 200)/noClusters);
    j = (j + 1) % noClusters;
    console.log(j)
  }
}

function addPoint(x, y) {
  let p = new pointClass(x, y);
  points[noPoints] = p;
  noPoints++;
}

function drawPoint(p) {
  //console.log(colors[p.index])
  p.show(colors[p.index]);
}

function drawPivot(i) {
  push();
  stroke(colors[i]);
  strokeWeight(1);
  translate(pivots[i].x, pivots[i].y);
  line(-5, -5, 5, 5);
  line(-5, 5, 5, -5);
  pop();
}

function step() {
  if (!pivotsInitialised) {
    pivotsInitialised = true;
    for (let i = 0; i < noClusters; i++) {
      let index = floor(random(0, noPoints));
      pivots[i] = createVector(points[index].x, points[index].y);
    }
    return;
  }
  for (let p of points) {
    let minDist = (p.x - pivots[0].x) * (p.x - pivots[0].x) + (p.y - pivots[0].y) * (p.y - pivots[0].y);
    let index = 0;
    for (let i = 1; i < noClusters; i++) {
      let d = (p.x - pivots[i].x) * (p.x - pivots[i].x) + (p.y - pivots[i].y) * (p.y - pivots[i].y);
      if (d < minDist) {
        minDist = d;
        index = i;
      }
    }
    p.index = index;
  }
  let sums = [];
  let nos = [];
  for (let i = 0; i < noClusters; i++) {
    sums[i] = createVector(0, 0);
    nos[i] = 0;
  }
  for (let p of points) {
    sums[p.index].x += p.x;
    sums[p.index].y += p.y;
    nos[p.index]++;
  }
  for (let i = 0; i < noClusters; i++) {
    if (nos[i] > 0) {
      pivots[i].x = sums[i].x / nos[i];
      pivots[i].y = sums[i].y / nos[i]
    }
  }
}
