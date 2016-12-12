var yoff = 0.0;        // 2nd dimension of perlin noise
var wavestarts = [];
wavestarts[0] = {};
wavestarts[0].difference = 0; //difference between wave2 and original wave
wavestarts[0].variance = 2;
wavestarts[0].color = '#666699'; 

wavestarts[1] = {};
wavestarts[1].difference = -20; //difference between wave2 and original wave
wavestarts[1].variance = 3; //variance
wavestarts[1].color = '#9999cc'; 

wavestarts[2] = {};
wavestarts[2].difference = -29; //difference between wave2 and original wave
wavestarts[2].variance = 4; //variance
wavestarts[2].color = '#cccccc'; 

wavestarts[3] = {};
wavestarts[3].difference = -46; //difference between wave2 and original wave
wavestarts[3].variance = 4; //variance
wavestarts[3].color = '#666666'; 

wavestarts[4] = {};
wavestarts[4].difference = -56; //difference between wave2 and original wave
wavestarts[4].variance = 4; //variance
wavestarts[4].color = '#666699'; 

// A list of vehicles
var vehicles = [];

// "x-offset" in Perlin noise space for fish
var fish_xoff = 0;
var fish_x = 0;
var fish_y = 0;
var framecount = 0;

var canvas_width = 700;
var canvas_height = 600;

//"rockets"
var lifetime;  // How long should each generation live
var population;  // Population
var lifeCounter;   // Timer for cycle of generation
var target;        // Target location
var info;
var recordtime;         // Fastest time to target
var obstacles;  //an array list to keep track of all the obstacles!

//images
var ft = {}; //namespace


function preload() {
  ft.lighthouse = loadImage('assets/lighthouse.png'); 
  ft.rocks = loadImage('assets/rocks2.png');
  ft.sky = loadImage('assets/sky.png');
  ft.water = loadImage('assets/water.png');
  ft.fish = loadImage('assets/fish2.png');
}

function setup() {
  createCanvas(canvas_width, canvas_height);
  slider_start2   = createSlider(0, 800, 300).parent('start2');
  slider_stop2   = createSlider(0, 800, 280).parent('stop2');
  slider_difference   = createSlider(-100, 100, -15).parent('difference');
  slider_variance   = createSlider(0, 50, 6).parent('variance');
  
  // We are now making random vehicles and storing them in an array
  for (var i = 0; i < 75; i++) {
    vehicles.push(new Vehicle(random(width),random(height)));
  }
  
  //"rockets"
  // The number of cycles we will allow a generation to live
  lifetime = height/2;
  // Initialize variables
  lifeCounter = 0;
  target = new Obstacle(width, 24, 24, 24);

  // Create a population with a mutation rate, and population max
  var mutationRate = 0.01;
  population = new Population(mutationRate, 50);
  info = createP("");
  info.position(250,10);
  recordtime = lifeCounter;
  target = new Obstacle(width/2-12, 24, 25, 25);
  // Create the obstacle course
  obstacles = [];
  obstacles.push(new Obstacle(0, 300, 800, 10));
}

function draw() {
  background('#cccccc');
  
  image(ft.sky, 0, 0);
  image(ft.lighthouse, 400, 130);
  drawwaves();
  image(ft.water, 0, 293);
  image(ft.rocks, 162, 465);
 
  set_new_seek_target();
  draw_otherfish();
  draw_learningfish()
}

//------------------------------------------------------
function draw_otherfish(){
  //sets globals used in next for loop
  
  
  for (var i = 0; i < vehicles.length; i++) {
    vehicles[i].applyBehaviors(vehicles, fish_x, fish_y);
    vehicles[i].update();
    vehicles[i].borders();
    vehicles[i].display(); 
  }
}
function draw_learningfish(){
  
  // Draw the start and target locations
  target.display();

  // If the generation hasn't ended yet
  if (lifeCounter < lifetime) {
    population.live(obstacles);
    if ((population.targetReached()) && (lifeCounter < recordtime)) {
      recordtime = lifeCounter;
    }
    lifeCounter++;
    // Otherwise a new generation
  }
  else {
    lifeCounter = 0;
    population.fitness();
    population.selection();
    population.reproduction();
  }

 // Draw the obstacles
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].display();

  }
  //info.html("Generation #: " + population.getGenerations() + "<br>" + "Cycles left: " + (lifetime-lifeCounter));

}


//every N frames, set a new seek target 
function set_new_seek_target(){
  var n = 500;
  if (framecount%n === 0){
    fish_x = noise(fish_xoff) * width;
    fish_xoff += 0.1;
    fish_y = random(canvas_height-200, canvas_height-150);
  }
  framecount++;
  
  //debug, show target
  push();
  fill('red');
  //ellipse(fish_x, fish_y, 25, 25);
  pop();
  
  //set learning target
  target.location.x = fish_x;
  target.location.y = fish_y;
}

function drawwaves(){
   //play around with having slider affect only one wave
   //if i add it to all waves, they all behave too similarly
   wavestarts[1].difference = slider_difference.value();
   wavestarts[1].variance = slider_variance.value();
    //waves, reverse through array so first one is largest plain color
    for(var counter=wavestarts.length - 1; counter >= 0;counter--){
      drawwave(slider_start2.value()+ wavestarts[counter].difference, slider_stop2.value()+wavestarts[counter].variance, wavestarts[counter].color);
    }
}

function drawwave(start, stop, fillcolor){
  fill(fillcolor);
   // We are going to draw a polygon out of the wave points
  beginShape(); 
  
  var xoff = 0;       // Option #1: 2D Noise

  // Iterate over horizontal pixels
  for (var x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise, map to 
    
    // Option #1: 2D Noise
    var y = map(noise(xoff, yoff), 0, 1, start, stop);

    // Set the vertex
    vertex(x, y); 
    // Increment x dimension for noise
    xoff += 0.05;
  }
  // increment y dimension for noise
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

//utility helper
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}