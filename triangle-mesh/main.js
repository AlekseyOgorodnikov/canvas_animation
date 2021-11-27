import './style.css';
import { Layer } from './modules/layer';
import { Loop } from './modules/loop.js';
import { Mesh } from './modules/mesh.js';

class App {
  constructor(container) {
    this.layer = new Layer(container);

    addEventListener('resize', () => this.createMesh());
    this.createMesh();

    this.loop = new Loop(
      (time) => this.update(time),
      () => this.display()
    );
  }
  createMesh() {
    this.mesh = new Mesh(this.layer);
  }
  update(correction = 0) {
    this.mesh.updateParticles(correction);
    this.mesh.updateTriangles(correction);
  }
  display() {
    this.mesh.renderTriangles(this.layer.context);
    // this.mesh.renderParticales(this.layer.context);
  }
}

onload = () => {
  new App(document.body);
};
