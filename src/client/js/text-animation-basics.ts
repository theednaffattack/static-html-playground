const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

type pos = number;
type Y_Pos = number;

type Particle = {
  size: number;
  color: string;
  coordinates: [pos, pos];
};

type MouseHandler = {
  x: number | null;
  y: number | null;
  radius: number;
};

let particleArray: Particle[] = [];

// handle mouse
const mouse: MouseHandler = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  console.log({ x: mouse.x, y: mouse.y });
});
