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
wavestarts[2].color = 'red'; 

wavestarts[3] = {};
wavestarts[3].difference = -46; //difference between wave2 and original wave
wavestarts[3].variance = 4; //variance
wavestarts[3].color = 'green'; 

wavestarts[4] = {};
wavestarts[4].difference = -56; //difference between wave2 and original wave
wavestarts[4].variance = 4; //variance
wavestarts[4].color = 'blue'; 

// A list of vehicles
var vehicles = [];

function setup() {
  createCanvas(800, 600);
  slider_start2   = createSlider(0, 800, 300).parent('start2');
  slider_stop2   = createSlider(0, 800, 280).parent('stop2');
  slider_difference   = createSlider(-100, 100, -15).parent('difference');
  slider_variance   = createSlider(0, 50, 6).parent('variance');
  
    // We are now making random vehicles and storing them in an array
  for (var i = 0; i < 50; i++) {
    vehicles.push(new Vehicle(random(width),random(height)));
  }
}

function draw() {
  background('#cccccc');
  drawwaves();
  
  for (var i = 0; i < vehicles.length; i++) {
    vehicles[i].applyBehaviors(vehicles);
    vehicles[i].update();
    vehicles[i].borders();
    vehicles[i].display(); 
  }
 
}

//------------------------------------------------------
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