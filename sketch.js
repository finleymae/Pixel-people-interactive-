let capture;
let previousFrame;
let threshold = 50; // Adjust this threshold to control sensitivity
let pieSize = 20; // Adjust the size of the "pies"

function setup() {
  createCanvas(windowWidth, windowHeight); // Set canvas size to match window dimensions
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();
  previousFrame = createImage(capture.width, capture.height, RGB);
}

function draw() {
  background(255);
  image(capture, 0, 0, width, height);

  // Load current frame
  capture.loadPixels();
  previousFrame.loadPixels();

  // Compare current frame with previous frame
  for (let y = 0; y < capture.height; y += pieSize) {
    for (let x = 0; x < capture.width; x += pieSize) {
      let index = (x + y * capture.width) * 4;

      // Calculate the difference in RGB values for the pie
      let diff = calculateDifference(x, y);

      // Map the difference to a color
      let colorVal = map(diff, 0, threshold, 0, 255);
      let c;
      if (colorVal < 85) {
        c = color(255, 0, 0); // Red
      } else if (colorVal < 170) {
        c = color(0, 0, 255); // Blue
      } else if (colorVal < 255) {
        c = color(0); // Black
      } else {
        c = color(150); // Grey
      }

      // Fill the pie with the determined color
      fill(c);
      noStroke();
      rect(x, y, pieSize, pieSize);
    }
  }

  // Update the previous frame
  previousFrame.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
}

function calculateDifference(x, y) {
  let totalDiff = 0;
  for (let j = 0; j < pieSize; j++) {
    for (let i = 0; i < pieSize; i++) {
      let currentPixelIndex = ((x + i) + (y + j) * capture.width) * 4;
      let previousPixelIndex = ((x + i) + (y + j) * previousFrame.width) * 4;

      let currentR = capture.pixels[currentPixelIndex];
      let currentG = capture.pixels[currentPixelIndex + 1];
      let currentB = capture.pixels[currentPixelIndex + 2];
      let previousR = previousFrame.pixels[previousPixelIndex];
      let previousG = previousFrame.pixels[previousPixelIndex + 1];
      let previousB = previousFrame.pixels[previousPixelIndex + 2];

      // Calculate the difference in RGB values
      let diff = dist(currentR, currentG, currentB, previousR, previousG, previousB);

      totalDiff += diff;
    }
  }
  // Return the average difference for the pie
  return totalDiff / (pieSize * pieSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas to match window dimensions
}
