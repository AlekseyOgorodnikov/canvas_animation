import './style.css';

class GradientAnimation {
  constructor() {
    // получение холста
    this.cnv = document.querySelector('canvas');
    // контекст холста
    this.ctx = this.cnv.getContext('2d');
    // количество кругов
    this.circleNum = 20;
    // скорость анимации
    this.speed = 0.005;
    // установка минимального и максимального радиуса
    this.minRadius = 400;
    this.maxRadius = 800;
    // установка размеров холста
    this.setCanvasSize();
    // создание кругов
    this.createCircles();
    // анимация кругов
    this.drawAnimation();

    // прослушивание измененеия окна браузера
    window.onresize = () => {
      this.setCanvasSize();
      this.createCircles();
    };
  }
  // установка размера холста
  setCanvasSize() {
    // сохраняем ширину холста (ширина холста = ширене области просмотра)
    this.w = this.cnv.width = innerWidth;
    // сохраяняем высоту холста (высота холста = высоте области просмотра)
    this.h = this.cnv.height = innerHeight;
  }
  // создание кругов
  createCircles() {
    this.circles = [];
    for (let i = 0; i < this.circleNum; i++) {
      this.circles.push(
        new Circle(this.w, this.h, this.minRadius, this.maxRadius)
      );
    }
  }
  // прорисовка круга
  drawCircles() {
    this.circles.forEach((circle) => circle.draw(this.ctx, this.speed));
  }
  // очищение холста
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
  // анимация кругов
  drawAnimation() {
    this.clearCanvas();
    this.drawCircles();
    window.requestAnimationFrame(() => this.drawAnimation());
  }
}

class Circle {
  constructor(w, h, minRadius, maxRadius) {
    // объявление координат x, y и радиус окружности. х и y устанавливаем рандомное значение
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    //вращение кругов
    this.angle = Math.random() * 2 * Math.PI;
    this.radius = Math.random() * (maxRadius - minRadius) + minRadius;
    // генерация двух случайных цветов градиента
    this.firstColor = `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
    this.secondColor = `hsla(${Math.random() * 360}, 100%, 50%, 0)`;
  }
  draw(ctx, speed) {
    //вращение вокруг своей оси
    this.angle += speed;

    const x = this.x + Math.cos(this.angle) * 200; //координата x текущего круга плюс cos угла текущего круга
    const y = this.y + Math.sin(this.angle) * 200; //координата y текущего круга плюс sin угла текущего круга
    // создание градиента
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius);
    gradient.addColorStop(0, this.firstColor);
    gradient.addColorStop(1, this.secondColor);

    // наложение
    ctx.globalCompositeOperation = `overlay`;
    // заливка круга
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// проверка изменений ширины холста при изменение окна браузера
window.onload = () => new GradientAnimation();
