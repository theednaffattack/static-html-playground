// tutorial "Vanilla JavaScript Animation Tutorial [Particles & Physics effect]"
// from: https://www.youtube.com/watch?v=XGioNBHrFU4&list=PLYElE_rzEw_siuo-kkHh5h7Sk--6IPYNh&index=7&ab_channel=Frankslaboratory

const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
// Using window height and width failed on mobile,
// so I'm going with the fix suggested below.
// https://stackoverflow.com/a/54812656/9448010
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

type pos = number;
type Y_Pos = number;

type MouseHandler = {
  x: number | null;
  y: number | null;
  radius: number;
};

let particleArray: any[] = [];

// handle mouse
const mouse: MouseHandler = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.radius = 150;
});

let textCoordinates: ImageData;

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  constructor(x: number, y: number) {
    this.x = x + 100;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 50;
  }
  draw() {
    if (ctx) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    } else {
      throw new Error("Cannot construct a Particle instance with a context.");
    }
  }
  /** The update function...
   * Push particles away from the mouse if
   * they are close enough to be triggered.
   */
  update() {
    let deltaX;
    let deltaY;
    if (mouse.x && mouse.y) {
      deltaX = mouse.x - this.x;
      deltaY = mouse.y - this.y;
      // re-watch: https://youtu.be/XGioNBHrFU4?list=PLYElE_rzEw_siuo-kkHh5h7Sk--6IPYNh&t=1375
      let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let forceDirectionX = deltaX / distance;
      let forceDirectionY = deltaY / distance;
      let maxDistance = mouse.radius;

      // convert number to a value between 1 and 0.
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        // this.size = 50;
        this.x -= directionX;
        this.y -= directionY;
      } else {
        // this.size = 3;
        // Return particles to their original position.
        if (this.x !== this.baseX) {
          let xPosDeltaFromOriginalPos = this.x - this.baseX;
          this.x -= xPosDeltaFromOriginalPos / 10;
        }
        if (this.y !== this.baseY) {
          let yPosDeltaFromOriginalPos = this.y - this.baseY;
          this.y -= yPosDeltaFromOriginalPos / 10;
        }
      }
    }
  }
}

if (ctx) {
  ctx.font = "30px Verdana";
  ctx.fillStyle = "white";
  ctx.fillText("eddie", 0, 40);
  // ctx.strokeStyle = "white";
  // ctx.strokeRect(0, 0, 100, 100);

  textCoordinates = ctx.getImageData(0, 0, 100, 100);
  function init() {
    console.log("THE HELL??????", textCoordinates);
    console.log("WHAT IS TEXT COORDINATES?", textCoordinates);

    particleArray = [];

    // Watch the video in the commented link below to explain what's
    // happening. We're scanning row-by-row the data returned from
    // 'textCoordinates'.
    // from: https://youtu.be/XGioNBHrFU4?list=PLYElE_rzEw_siuo-kkHh5h7Sk--6IPYNh&t=2506
    // 'textCoordinates' data is from `ctx.getImageData(0, 0, 100, 100);`
    // which returns data in a 'Uint8ClampedArray'.
    // See MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
    // Values are grouped for rgba, so they're in groups of four.
    // Also the values range from 0 - 255, INCLUDING THE VALUES FOR THE
    // ALPHA CHANNEL. Instead of 0 - 1, in HTML, opacity is measured as 0 - 255
    // Because of this we return four times the area scanned by 'ctx.getImageData()'
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
      for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
        // inner loop
        // 128 below denotes opacity of 50%
        if (
          textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
        ) {
          // inside if statement
          let positionX = x;
          let positionY = y;
          particleArray.push(new Particle(positionX * 10, positionY * 10));
        }
      }
      // outer loop
    }

    // loop through a random number and
    // create Particles
    for (let index = 0; index < 500; index++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      particleArray.push(new Particle(x, y));
    }
  }

  function animate() {
    // clear the canvas on every frame of animation.
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    // Loop over our collection of particles and call
    // draw() on each.
    for (let index = 0; index < particleArray.length; index++) {
      particleArray[index].draw();
      particleArray[index].update();
    }

    // Recurse one frame at a time
    requestAnimationFrame(animate);
  }
  init();
  animate();
} else {
  throw Error("There is no context for the canvas element. Try again");
}
export {};
