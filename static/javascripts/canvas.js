/************************************************************************
* canvas.js
* Manu Shirur
*
* This file implements animation using canvas.
* Implelemted Pause and Play feature, Reset and Exit.
* Shapes are implemented as classes and each class has render 
* method for drawing its shape in the center of the given point.
* Dimension of the shapes are determined randmoly on each setInterval.
* shuffle method is used to shuffle the array elements of shapes, colors,
* and points on each setInterval call and thus randomness is implemented.
************************************************************************/

//Constant variables
const MAX_POINTS = 5;

var canvasArea = document.getElementById("animation");
var gameControls = document.getElementById("game-controls");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var colorArray = new Array("deepskyblue", "red", "darkviolet", "violet", "purple", "blue", "black",
                             "orange", "powderblue", "green", "cyan", "aqua", "cadetblue", "darkgrey",
                             "crimson", "brown");
var shapes = ["Circle", "Triangle", "Square", "Line", "Rectangle", "Oval"];
let points = new Array();
let interval;
let stopAnimation = true;
let intervalDuration = 750;

canvasArea.style.display="none";
gameControls.style.display = "none";


function displayInstructions() {
    /* Displays the instruction on the canvas.

    */
    ctx.font = "1em 'Times New Roman', serif";
    ctx.fillText("Please click on 5 arbitrary spots within this box to start", 2, 20, 320);
} 

function shuffle(array) {
    /* Shuffles the given array randomly.

        This method is used to
        avoid the repeated index number 
        that might get generated using 
        Math.random() directly on the array.
    */
    array.sort(() => Math.random() - 0.5);
}


function renderShapes(shape, point){
    /* Renders shape in the provided point.

    */
    switch (shape) {
        case "Circle": new Circle(point).render();
            break;
        case "Oval": new Oval(point).render();
            break;
        case "Line": new Line(point).render();
            break;
        case "Square": new Square(point).render();
            break;
        case "Rectangle": new Rectangle(point).render();
            break;
        case "Triangle": new Triangle(point).render();
            break;
        default: new Line(point).render();
            break;
    }
}

function stopAndStartAnimation(){
    /* Stop and Start Button implementation

    */
    if( !stopAnimation ){
        document.getElementById("stopStartAnimation").innerHTML = "Play";
        clearInterval(interval);
    } else {
        document.getElementById("stopStartAnimation").innerHTML = "Pause";
        playAnimation();
    }
    stopAnimation = !(stopAnimation)
    
}

function resetExitCanvas(flag){
    /* Reset Canvas implementation

    */
    document.getElementById("stopStartAnimation").innerHTML = "Pause";
    gameControls.style.display="none";
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    displayInstructions();    
    Point.resetCount();
    document.getElementById('canvas').style.pointerEvents = 'auto';
    points = [];
    if(flag){
        canvasArea.style.display="none";
    }
}

function showCanvasDiv(){
    canvasArea.style.display="block";
    displayInstructions();
}

function playAnimation() {
    /* Plays the animation.

        shuffles the points, shapes and 
        colorArray randomly.
        Repeats the animation every 500 msec
        which is stored in intervalDuration variable
        
    */
    gameControls.style.display="block";
    interval = setInterval(function(){
        shuffle(points);
        shuffle(shapes);
        shuffle(colorArray);
        stopAnimation = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < points.length; i++){
            renderShapes(shapes[i], points[i])
        }
    }, intervalDuration);
}


// Capture the Mouse click event 
function captureClick(event){
    /* Captures the mouse click.

    */
    if (Point.getCount() < MAX_POINTS) {
        // Get relative x and y coordinates
        points.push(new Point(Math.abs(event.clientX - event.target.offsetLeft), 
                    Math.abs(event.clientY - event.target.offsetTop)))
    }

    // if clicked MAX_POINTS
    if(Point.getCount() == MAX_POINTS){ 
        event.stopPropagation();
        document.getElementById('canvas').style.pointerEvents = 'none';
        playAnimation();
    }
}


function getRandomNumberInRange(min, max) {
    /* Returns a random number between the given min and max  

    */
    return Math.floor(Math.random() * (max - min) + min);
} 


class Point {
    //constructor
    constructor(x, y) {
        this.x = x;
        this.y = y;
        if (Point.count == undefined) {
            Point.count = 1; 
        } else { 
            Point.count += 1;
        }
    }
    // Returns the number of Point objects
    static getCount(){
        return (Point.count == undefined) ? 0 : Point.count;
    }

    // Reset the class count to 0
    static resetCount() {
        Point.count = undefined;
    }
}

/* Each class has the code to display itself in the center
    of the given point and has a method called render() which
    implements its rendering function

*/
class Circle {
    // constructor
    constructor(center){
        this.center = center;
        this.radius = getRandomNumberInRange(canvas.width / 6, canvas.width / 2) / 2;
    }

    render() {
        ctx.fillStyle = colorArray[0];
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Rectangle {
    // constructor
    constructor(point){
        this.point = point;
        this.width = getRandomNumberInRange(canvas.width / 6, canvas.width / 2);
        this.height = getRandomNumberInRange(canvas.height / 6, canvas.height / 2);
    }

    render() {
        ctx.fillStyle = colorArray[1];
        ctx.fillRect(Math.abs(this.point.x - (this.width / 2)), Math.abs(this.point.y - (this.height/ 2)), this.width, this.height);
    }
}


class Square {
    // constructor
    constructor(point){
        this.point = point;
        this.width = getRandomNumberInRange(canvas.width / 6, canvas.width / 2);
    }

    render() {
        ctx.fillStyle = colorArray[12];
        ctx.fillRect(Math.abs(this.point.x - (this.width / 2)), Math.abs(this.point.y - (this.width/ 2)), this.width, this.width);
    }
}


class Triangle {
    // constructor
    constructor(point){
        this.point = point;
        this.width = getRandomNumberInRange(canvas.width / 6, canvas.width / 2);
        this.height = getRandomNumberInRange(canvas.height / 6, canvas.height / 2);
    }

    render() {
        ctx.fillStyle = colorArray[15];
        ctx.beginPath();
        ctx.moveTo(this.point.x, this.point.y);
        ctx.lineTo(this.point.x - this.width, this.point.y + this.height);
        ctx.lineTo(this.point.x + this.width, this.point.y + this.height);
        ctx.fill();
    }
}

class Line {
    // constructor
    constructor(point){
        this.point = point;
        this.length = getRandomNumberInRange(canvas.width / 6, canvas.width / 2) / 2;
    }

    render() {
        ctx.strokeStyle = colorArray[6];
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(this.point.x - this.length, this.point.y);
        ctx.lineTo(this.point.x +(2 * this.length), this.point.y);
        ctx.stroke(); 
    }
}

class Oval {
    // constructor
    constructor(point){
        this.point = point;
        this.radius_x = getRandomNumberInRange(canvas.width / 6, canvas.width / 2) / 2;
        this.radius_y = getRandomNumberInRange(canvas.width / 6, canvas.width / 2) / 2;
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = colorArray[8];
        ctx.strokeStyle = colorArray[9];
        ctx.ellipse(this.point.x, this.point.y, this.radius_x, this.radius_y, Math.random()*360, 0 , 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}