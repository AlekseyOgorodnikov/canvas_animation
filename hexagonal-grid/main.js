import './style.css';

(() => {
  const cnv = document.querySelector('canvas');
  const ctx = cnv.getContext('2d');
  let w, h, centerX, centerY;

  function resizeCanvas() {
    w = cnv.width = innerWidth;
    h = cnv.height = innerHeight;
    centerX = w / 2;
    centerY = h / 2;
  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  const config = {
    hue: 0,
    bgFillColor: 'rgba(50,50,50,0.05)',
    dirsCount: 6,
    stepsToTurn: 12,
    dotSize: 4,
    dotsCount: 300,
    dotVelocity: 2,
    distance: 70,
    gradientLength: 5,
  };

  function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco) {
    ctx.globalCompositeOperation = gco;
    ctx.shadowColor = shadowColor || `black`;
    ctx.shadowBlur = shadowBlur || 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  class Dot {
    constructor() {
      this.pos = { x: centerX, y: centerY };
      this.dir = ((Math.random() * 3) | 0) * 2; // направление
      this.step = 0;
    }
    // частица
    redrawDot() {
      let xy = Math.abs(this.pos.x - centerX) + Math.abs(this.pos.y - centerY);
      let makeHue = (config.hue + xy / config.gradientLength) % 360;
      let color = `hsl(${makeHue},100%,50%)`;
      let blur = config.dotSize - Math.sin(xy / 8) * 2;
      let size = config.dotSize - Math.sin(xy / 9) * 2 - Math.sin(xy / 2);
      let x = this.pos.x - size / 2;
      let y = this.pos.y - size / 2;

      drawRect(color, x, y, size, size, color, blur, `lighter`);
    }
    // перемещение частицы
    moveDot() {
      this.step++;
      this.pos.x += dirsList[this.dir].x * config.dotVelocity; //случайное значение x
      this.pos.y += dirsList[this.dir].y * config.dotVelocity; //случайное значение y
    }
    // смена направления
    changeDir() {
      if (this.step % config.stepsToTurn === 0) {
        this.dir =
          Math.random() > 0.5
            ? (this.dir + 1) % config.dirsCount
            : (this.dir + config.dirsCount - 1) % config.dirsCount;
      }
    }
    // удаление точки
    killDot(id) {
      let percent = Math.random() * Math.exp(this.step / config.distance);
      if (percent > 100) {
        dotsList.splice(id, 1);
      }
    }
  }

  let dirsList = [];

  function createDirs() {
    for (let i = 0; i < 360; i += 360 / config.dirsCount) {
      let x = Math.cos((i * Math.PI) / 180);
      let y = Math.sin((i * Math.PI) / 180);
      dirsList.push({ x: x, y: y });
    }
  }
  createDirs();

  // добавление точек
  let dotsList = [];

  function addDot() {
    if (dotsList.length < config.dotsCount && Math.random() > 0.8) {
      dotsList.push(new Dot());
      config.hue = (config.hue + 1) % 360;
    }
  }

  function refreshDots() {
    dotsList.forEach((i, id) => {
      i.moveDot();
      i.redrawDot();
      i.changeDir();
      i.killDot(id);
    });
  }

  // зацикливаем анимацию 60 раз в секунду
  function loop() {
    drawRect(config.bgFillColor, 0, 0, w, h, 0, 0, `normal`);
    addDot();
    refreshDots();

    requestAnimationFrame(loop);
  }

  loop();
})();
