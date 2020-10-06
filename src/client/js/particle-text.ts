// tutorial "Vanilla JavaScript Animation Tutorial [Particles & Physics effect]"
// from: https://www.youtube.com/watch?v=XGioNBHrFU4&list=PLYElE_rzEw_siuo-kkHh5h7Sk--6IPYNh&index=7&ab_channel=Frankslaboratory

const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

if (ctx) {
  ctx.font = "30px Verdana";
  ctx.fillStyle = "white";
  ctx.fillText("A", 0, 40);
  // ctx.strokeStyle = "white";
  // ctx.strokeRect(0, 0, 100, 100);

  const data = ctx.getImageData(0, 0, 100, 100);

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

  function init() {
    particleArray = [];

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
