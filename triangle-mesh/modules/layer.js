export class Layer {
  constructor(container) {
    container.appendChild(this.createLayer());
    addEventListener('resize', () => this.fitToContainer(), false);
    this.fitToContainer();
  }
  // создание холста
  createLayer() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    return this.canvas;
  }
  // контейнер
  fitToContainer() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }
  // ширина
  get w() {
    return this.canvas.width;
  }
  // высота
  get h() {
    return this.canvas.height;
  }
}
