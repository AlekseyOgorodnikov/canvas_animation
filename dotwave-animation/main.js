import './style.css';

(() => {
  const properties = {
    spaceDiameter: 32, //диаметр пространства точки
    dotDiameter: 14, //диаметр самой точки
    wavelength: 100, //длинна волны
    velocity: 0.02, //скорость по умолчанию .02
    direction: 1, //направление (1: из центра, -1: в центр)
    displacement: 1, //смещение (0: отключить, 1: включить)
  };

  const canvas = document.createElement('canvas'); //создаём Canvas
  const ctx = canvas.getContext('2d'); //получаем контекст
  let w = (canvas.width = innerWidth); //ширина равна ширине области просмотра
  let h = (canvas.height = innerHeight); //высота равна высоте области просмотра
  let dotsList; //переменная для хранения списка точек
  canvas.style.background = 'rgba(17, 17, 23 ,1)'; //цвет canvas
  document.querySelector('body').appendChild(canvas); //добавляем canvas в body

  // изменение размера окна
  window.onresize = function () {
    w = canvas.width = innerWidth; //ширина равна ширине области просмотра
    h = canvas.height = innerHeight; //высота равна высоте области просмотра
    // заново расчитаем количество кругов
    init();
  };

  //класс точки
  class Dot {
    constructor(x, y, num) {
      this.x = x;
      this.y = y;
      this.radius = properties.dotDiameter / 2;
      this.scale = getDistance(x, y) / properties.wavelength;
      this.text = num;
    }

    update() {
      this.resize();
      this.draw();
    }

    // изменяем размер точки
    resize() {
      this.scale = this.scale - properties.velocity * properties.direction;
    }

    // метод отрисовки точки
    draw() {
      let s = 1 - Math.abs(Math.sin(this.scale));
      let o = (1 - s) * 255;
      let r = this.radius * s; // синус может быть отрицательным поэтому в модуле

      // ctx.beginPath();
      // ctx.arc(this.x, this.y, r, 0, 2 * Math.PI, false);
      // ctx.closePath();
      // ctx.fillStyle = 'rgba( 255,' + o + ', ' + o + ', ' + s + ')';
      // ctx.fill();
      // отрисовка текста за место цветов
      ctx.fillStyle = 'rgba(' + o + ', 255, ' + o + ' ,' + s + ')';
      ctx.fillText(this.text, this.x, this.y);
    }
  }

  init();

  function init() {
    dotsList = [];
    /* или const dotsContX = Math.floor(w / properties.spaceDiameter) */
    const dotsContX = (w / properties.spaceDiameter) | 0; // определение сколько точек поместится в ширину
    const dotsContY = (h / properties.spaceDiameter) | 0; // определение сколько точек поместится в ширину
    const startX =
      (properties.spaceDiameter + w - dotsContX * properties.spaceDiameter) / 2;
    const startY =
      (properties.spaceDiameter + h - dotsContY * properties.spaceDiameter) / 2;

    let displacement = (properties.spaceDiameter / 4) * properties.displacement; //смещение на расстояние = половине диаметра

    for (let j = 0; j < dotsContY; j++) {
      displacement = -displacement;
      let y = startY + j * properties.spaceDiameter;
      for (let i = 0; i < dotsContX; i++) {
        let x = startX + i * properties.spaceDiameter + displacement; // расположение точек по горизонтали
        dotsList.push(new Dot(x, y, j + i));
      }
    }
  }
  // отображение точек на экране и зациклим функцию
  loop();
  function loop() {
    ctx.clearRect(0, 0, w, h); // очищаем холст
    // перебераем массив и отрисовываем точку
    for (let a in dotsList) {
      dotsList[a].update();
    }
    // зациклим loop методом requestAnimationFrame
    requestAnimationFrame(loop);
  }

  // вычисление дистанции передавай координаты точки
  function getDistance(x, y) {
    let deltaX = w / 2 - x;
    let deltaY = h / 2 - y;
    // длинна гипотенузы расстояние от точки
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
})();
