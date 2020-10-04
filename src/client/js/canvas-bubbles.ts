import * as CSS from "csstype";

// canvas 1
const canvasfg = document.getElementById("canvasfg") as HTMLCanvasElement;
const ctxfg = canvasfg.getContext("2d");

canvasfg.width = window.innerWidth;
canvasfg.height = window.innerHeight;

// canvas 2 (background)
const canvasbg = document.getElementById("canvasbg") as HTMLCanvasElement;
const ctxbg = canvasbg.getContext("2d");

let checkCtxBg = ctxbg ? ctxbg : new Error("Context 'ctxbg' is null");

canvasbg.width = window.innerWidth;
canvasbg.height = window.innerHeight;

// create two arrays to store values for our Bubbles
let fgBubbles: any[] = [];
let bgBubbles: any[] = [];

function addFgBubble() {
  // 1- Create a new Bubble and give it a color and...
  // vertical speed.
  // 2-  Push the new Bubble onto our empty array.

  fgBubbles.push(new Bubble("rgb(255,194,194)", 1.8));
}

function addBgBubble() {
  bgBubbles.push(new Bubble("rgb(255,255,255)", 2.5));
}

/**
 * Bubble Class
 * used to create new instances of a bubble.
 */
class Bubble {
  /** A valid CSS color property */
  color: CSS.Properties["color"];
  /** Is this bubble scheduled to die. */
  life: boolean;
  /** Bubble radius
   *
   * See definition: [radius](https://www.dictionary.com/browse/radius)
   */
  radius: number;
  /** The 'x' axis position of the Bubble. */
  xAxisPos: number;
  /** The 'y' axis position of the Bubble. */
  yAxisPos: number;
  /** Rate bubbles travel upward (rise) */
  velocity_y_axis: number;
  /** Rate bubbles travel side-to-side (wiggle) */
  velocity_x_axis: number;
  /** Speed that a bubble shrinks */
  velocity_radius: number;

  constructor(color: CSS.Properties["color"], yAxisSpeed: number) {
    this.color = color;
    this.life = true;
    this.radius = Math.random() * 150 + 30;
    this.xAxisPos = Math.random() * window.innerWidth;
    this.yAxisPos = Math.random() * 20 + window.innerHeight + this.radius;
    this.velocity_y_axis = Math.random() * 0.0002 + 0.001 + yAxisSpeed;
    this.velocity_radius = 0;
    this.velocity_x_axis = Math.random() * 4 - 2;
  }

  update() {
    // Slightly increase Y speed for each frame
    // of animation.
    this.velocity_y_axis += 0.00001;
    // Shrink the bubble for every frame of
    // animation.
    this.velocity_radius += 0.02;
    // Causes the bubble to rise by
    // updating its position.
    this.yAxisPos -= this.velocity_y_axis;
    // random positoin change between -2, 2
    this.xAxisPos += this.velocity_x_axis;

    // if the bubble is larger than one,
    // shrink it.
    if (this.radius > 1) {
      this.radius -= this.velocity_radius;
    }
    // If the bubble is too small, destroy it.
    if (this.radius <= 1) {
      this.life = false;
    }
  }
  draw(currentCanvas: CanvasRenderingContext2D) {
    currentCanvas.beginPath();
    currentCanvas.arc(
      this.xAxisPos,
      this.yAxisPos,
      this.radius,
      0,
      2 * Math.PI
    );

    // currentCanvas.fillStyle = "rebeccapurple";
    currentCanvas.fillStyle = this.color ? this.color : "papayawhip";

    currentCanvas.fill();
  }
}

function handleBubbles() {
  for (let index = 0; index < fgBubbles.length; index++) {
    fgBubbles[index].update();
    if (!fgBubbles[index].life) {
      fgBubbles.splice(index, 1);
    }
  }
  for (let index = 0; index < bgBubbles.length; index++) {
    bgBubbles[index].update();

    if (!bgBubbles[index].life) {
      bgBubbles.splice(index, 1);
    }
  }
  // Check if we have enough bubbles.
  // If not, add one.
  if (fgBubbles.length < window.innerWidth / 4) {
    addFgBubble();
  }

  // We do the same (as above) for background bubbles, but
  // we use fewer.
  if (bgBubbles.length < window.innerWidth / 12) {
    addBgBubble();
  }
}

function animate() {
  if (ctxfg !== null) {
    ctxfg.clearRect(0, 0, canvasfg.width, canvasfg.height);
  }

  if (ctxbg !== null) {
    ctxbg.clearRect(0, 0, canvasbg.width, canvasbg.height);
  }

  handleBubbles();

  for (let index = fgBubbles.length - 1; index >= 0; index--) {
    fgBubbles[index].draw(ctxfg);
  }
  for (let index = bgBubbles.length - 1; index >= 0; index--) {
    bgBubbles[index].draw(ctxbg);
  }

  requestAnimationFrame(animate);
}

window.addEventListener("load", animate);
