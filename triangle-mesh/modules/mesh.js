export class Mesh {
  constructor({ w, h }) {
    this.maxDist = Math.hypot(w, h); //получаем диагональ с помощью метода гипотенузы
    this.stepX = this.maxDist * 0.1; //хранение расстояние между частицами 10% от диагонали

    this.stepY = (this.stepX * Math.sqrt(3)) / 2;

    this.extraPoints = 3;
    this.cols = ((w / this.stepX) | 0) + this.extraPoints; //количество колонок
    this.rows = ((h / this.stepY) | 0) + this.extraPoints; //количество строк

    this.extraOffsetX = this.stepX / 4;
    this.offsetX = (w - (this.cols - 1) * this.stepX) / 2; // Ширина занимаемая частицами cols
    this.offsetY = (h - (this.rows - 1) * this.stepY) / 2;

    this.colorRange = 160;
    this.colorTimer = 0;
    this.colorSeed = 30;

    this.createParticles();
    this.createTriangles();
  }
  createParticles() {
    this.particles = [];

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const shiftX = i & 1 ? -this.extraOffsetX : this.extraOffsetX;
        const x = j * this.stepX + this.offsetX + shiftX;
        const y = i * this.stepY + this.offsetY;

        const homeX = x;
        const homeY = y;

        const angle = Math.random() * Math.PI * 2;
        const radius =
          (Math.random() * this.extraOffsetX) / 2 + this.extraOffsetX;
        const velocity = Math.random() * 2 - 1;

        this.particles.push({ x, y, homeX, homeY, angle, radius, velocity });
      }
    }
  }
  //создание треугольников
  updateTriangles(correction) {
    this.colorTimer = (this.colorTimer + this.colorSeed * correction) % 360;
  }
  createTriangles() {
    this.triangles = [];
    for (let y = 0; y < this.rows - 1; y++) {
      const vertices = [];
      for (let x = 0; x < this.cols; x++) {
        let a = x + this.cols * (y + 1);
        let b = x + this.cols * y;

        if (y & 1) {
          [a, b] = [b, a];
        }

        vertices.push(this.particles[a], this.particles[b]);
      }
      for (let i = 0; i < vertices.length - 2; i++) {
        const a = vertices[i];
        const b = vertices[i + 1];
        const c = vertices[i + 2];

        this.triangles.push({ a, b, c });
      }
    }
  }
  renderTriangles(ctx) {
    this.triangles.forEach((item) => {
      const { a, b, c } = item;
      const posX = (a.x + b.x + c.x) / 3;
      const posY = (a.y + b.y + c.y) / 3;
      const dist = Math.hypot(posX, posY);
      const hue = (dist / this.maxDist) * this.colorRange - this.colorTimer;

      ctx.strokeStyle = `hsl(${hue},70%,70%)`;
      ctx.fillStyle = `hsl(${hue},85%,50%)`;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
    });
  }
  // частицы
  updateParticles(correction = 0) {
    this.particles.forEach((item) => {
      item.angle += item.velocity * correction;
      item.x = Math.cos(item.angle) * item.radius + item.homeX;
      item.y = Math.sin(item.angle) * item.radius + item.homeY;
    });
  }
  renderParticales(ctx) {
    ctx.fillStyle = 'orange';
    this.particles.forEach((item) => {
      ctx.beginPath();
      ctx.arc(item.x, item.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}