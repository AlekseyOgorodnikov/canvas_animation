import './style.css';

(() => {
  const config = {
    dotMin: 6,
    dotMax: 20,
    spherRead: 300,
    bigDotRad: 35,
    massFactor: 0.002,
    defColor: 'rgba(250,10,30,0.9)',
    smooth: 0.9,
    mouseSize: 120,
  };
  const TWO_PI = 2 * Math.PI;

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  let w, h, mouse, dots;

  class Dot {
    constructor(r) {
      this.position = { x: mouse.x, y: mouse.y };
      this.velosity = { x: 0, y: 0 };
      this.radius = r || random(config.dotMin, config.dotMax);
      this.mass = this.radius * config.massFactor; // масса частицы
      this.color = config.defColor; // цвет частицы
    }
    // метод отрисовки частиц
    draw(x, y) {
      this.position.x = x || this.position.x + this.velosity.x;
      this.position.y = y || this.position.y + this.velosity.y;
      createCircle(
        this.position.x,
        this.position.y,
        this.radius,
        true,
        this.color
      );
      createCircle(
        this.position.x,
        this.position.y,
        this.radius,
        false,
        config.defColor
      );
    }
  }

  function updateDot() {
    for (let i = 1; i < dots.length; i++) {
      let acceleraton = { x: 0, y: 0 };
      for (let j = 0; j < dots.length; j++) {
        if (i == j) continue;
        let [a, b] = [dots[i], dots[j]]; // a and b хранится частица превая и вторая
        let delta = {
          x: b.position.x - a.position.x,
          y: b.position.y - a.position.y,
        };
        // теорема пифагора от точки а в точку b
        let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
        let force = ((dist - config.spherRead) / dist) * b.mass; // чем больше радиус частицы тем больше ее масса, и соответственно притяжение

        if (j == 0) {
          let alpha = config.mouseSize / dist;
          a.color = `rgba(250,10,30,${alpha})`;
          dist < config.mouseSize
            ? (force = (dist - config.mouseSize) * b.mass)
            : (force = a.mass);
        }
        acceleraton.x += delta.x * force;
        acceleraton.y += delta.y * force;
      }
      dots[i].velosity.x =
        dots[i].velosity.x * config.smooth + acceleraton.x * dots[i].mass;
      dots[i].velosity.y =
        dots[i].velosity.y * config.smooth + acceleraton.y * dots[i].mass;
    }
    dots.map((e) => (e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw()));
  }

  function createCircle(x, y, radius, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    mouse = { x: w / 2, y: h / 2, down: false };
    dots = [];
    dots.push(new Dot(config.bigDotRad));
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);

    if (mouse.down) {
      dots.push(new Dot());
    }
    updateDot();

    window.requestAnimationFrame(loop);
  }

  init();
  loop();

  function setPos({ layerX, layerY }) {
    [mouse.x, mouse.y] = [layerX, layerY];
  }

  function isDown() {
    mouse.down = !mouse.down;
  }

  canvas.addEventListener('mousemove', setPos);
  window.addEventListener('mousedown', isDown);
  window.addEventListener('mouseup', isDown);
  window.addEventListener('resize', init);
})();
