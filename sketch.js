let metalBuffer;

function setup() {
  createCanvas(windowWidth, windowHeigth);
  metalBuffer = createGraphics(width, height);
  noLoop(); // Only update when needed
}

function draw() {
  background(50);
  generateRustyMetalTexture();
  image(metalBuffer, 0, 0);
}

function generateRustyMetalTexture() {
  // Base metal color (dark gray with slight brown tint)
  const baseColor = {
    r: 70,
    g: 65,
    b: 60
  };

  metalBuffer.loadPixels();

  // Generate complex rusty metal texture
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Create noise and variation
      const noiseX = x * 0.1;
      const noiseY = y * 0.1;
      
      // Multiple noise layers for depth
      const rust1 = noise(noiseX, noiseY) * 50;
      const rust2 = noise(noiseX * 2, noiseY * 2) * 30;
      const rust3 = noise(noiseX * 4, noiseY * 4) * 20;

      // Rust color variation (brownish-orange)
      const rustIntensity = (rust1 + rust2 + rust3) / 3;
      
      const rustColor = {
        r: baseColor.r + rustIntensity * 1.5,
        g: baseColor.g + rustIntensity,
        b: baseColor.b + rustIntensity * 0.5
      };

      // Add scratches and wear
      const scratchNoise = noise(x * 0.05, y * 0.05);
      const scratchIntensity = scratchNoise > 0.6 ? 20 : 0;

      // Pixel color calculation
      const index = (x + y * width) * 4;
      metalBuffer.pixels[index] = constrain(rustColor.r + scratchIntensity, 0, 255);     // Red
      metalBuffer.pixels[index + 1] = constrain(rustColor.g + scratchIntensity * 0.7, 0, 255); // Green
      metalBuffer.pixels[index + 2] = constrain(rustColor.b + scratchIntensity * 0.3, 0, 255); // Blue
      metalBuffer.pixels[index + 3] = 255; // Full opacity
    }
  }

  metalBuffer.updatePixels();

  // Add additional texture details
  applyMetalTextureLayers(metalBuffer);
}

function applyMetalTextureLayers(buffer) {
  // Overlay subtle scratches
  buffer.strokeWeight(1);
  buffer.stroke(100, 90, 80, 100);
  
  for (let i = 0; i < 500; i++) {
    const x1 = random(width);
    const y1 = random(height);
    const x2 = x1 + random(-50, 50);
    const y2 = y1 + random(-50, 50);
    
    buffer.line(x1, y1, x2, y2);
  }

  // Add subtle edge highlights
  buffer.noFill();
  buffer.strokeWeight(2);
  buffer.stroke(120, 110, 100, 50);
  buffer.rect(0, 0, width, height);
}

function mousePressed() {
  // Regenerate texture on click
  redraw();
}

function keyPressed() {
  // Save the current texture
  if (key === 's' || key === 'S') {
    save('rusty_metal_texture.png');
  }
}
