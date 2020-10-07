// tutorial "Vanilla JavaScript Animation Tutorial [Particles & Physics effect]"
// from: https://www.youtube.com/watch?v=XGioNBHrFU4&list=PLYElE_rzEw_siuo-kkHh5h7Sk--6IPYNh&index=7&ab_channel=Frankslaboratory

const canvas = document.getElementById("bubble-text") as HTMLCanvasElement;
console.log("CAN WE SEE CANVAS?", canvas);

// let ctx: CanvasRenderingContext2D | null;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Could not find context.");
}

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
  x: number;
  y: number;
  radius: number;
};

let particleArray: any[] = [];

// handle mouse
const mouse: MouseHandler = {
  x: -1,
  y: -1,
  radius: 0,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.radius = 0;
});

let textCoordinates: ImageData;

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  distance: number;
  density: number;
  constructor(x: number, y: number) {
    this.x = x + 100;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.distance = 0;
    this.density = Math.random() * 30 + 10;
  }
  draw() {
    if (ctx) {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.strokeStyle = "rgba(34,147,214,0.8)";
      ctx.beginPath();

      if (this.distance < mouse.radius - 5) {
        this.size = 13;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
      }
      if (this.distance <= mouse.radius) {
        this.size = 10;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
      } else {
        this.size = 8;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
      }

      ctx.closePath();
      ctx.fill();
    }
  }
  /** The update function...
   * Push particles away from the mouse if
   * they are close enough to be triggered.
   */
  update() {
    let deltaX;
    let deltaY;
    console.log("MOUSE STUFF", mouse);
    deltaX = mouse.x - this.x;

    deltaY = mouse.y - this.y;
    // re-watch: https://youtu.be/XGioNBHrFU4?list=PLYElE_rzEw_siuo-kkHh5h7Sk--6IPYNh&t=1375
    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    this.distance = distance;

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

function connect() {
  let opacityValue = 1;
  for (
    let outerLoopIdx = 0;
    outerLoopIdx < particleArray.length;
    outerLoopIdx++
  ) {
    for (
      let innerLoopIdx = outerLoopIdx;
      innerLoopIdx < particleArray.length;
      innerLoopIdx++
    ) {
      let dx = particleArray[outerLoopIdx].x - particleArray[innerLoopIdx].x;
      let dy = particleArray[outerLoopIdx].y - particleArray[innerLoopIdx].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      opacityValue = 1 - distance / 50;

      if (ctx && distance < 50) {
        opacityValue = 1 - distance / 50;
        ctx.strokeStyle = `rgba(255,255,255, ${opacityValue})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          particleArray[outerLoopIdx].x,
          particleArray[outerLoopIdx].y
        );
        ctx.lineTo(
          particleArray[innerLoopIdx].x,
          particleArray[innerLoopIdx].y
        );
        ctx.stroke();
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

    // // loop through a random number and
    // // create Particles
    // for (let index = 0; index < 500; index++) {
    //   let x = Math.random() * canvas.width;
    //   let y = Math.random() * canvas.height;
    //   particleArray.push(new Particle(x, y));
    // }
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
    // connect();
    requestAnimationFrame(animate);
  }
  init();
  animate();
} else {
  throw Error("There is no context for the canvas element. Try again");
}
export {};
