import './style.css';

(() => {
  const cnv = document.querySelector('canvas');
  const ctx = cnv.getContext('2d');
  const numberOfRings = 3;
  let startAngle = 0;
  const ringRadiusOffset = 7; // смещение нового круга
  const ringRadius = 200; // радиус волн
  const maxWaveAmplitude = 17; // высота волн
  const numberOfWaves = 7; // количество волн
  const colors = ['#771122', '#bb1122', '#ff1122'];
  const waveOffset = 15;

  function init() {
    cnv.width = innerWidth;
    cnv.height = innerHeight;
  }

  init();

  function updateRings() {
    for (let i = 0; i < numberOfRings; i++) {
      let radius = i * ringRadiusOffset + ringRadius;
      let offsetAngle = (i * waveOffset * Math.PI) / 180;
      drawRing(radius, colors[i], offsetAngle);
    }
    startAngle >= 360 ? (startAngle = 0) : startAngle++;
  }

  let centerX = cnv.width / 2;
  let centerY = cnv.height / 2;

  function drawRing(radius, color, offsetAngle) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 9;
    ctx.beginPath();
    // ctx.moveTo(centerX + 200, centerY); рисуем от центра экрана и доавляем радиус к x чтобы убрать линию в центре
    for (let i = -180; i < 180; i++) {
      let currentAngle = ((i + startAngle) * Math.PI) / 180; // переводим градусы в радианы
      // из окружности в волну и обратно
      let displacement = 0;
      let now = Math.abs(i);

      if (now > 70) {
        displacement = (now - 70) / 70;
      }

      if (displacement >= 1) {
        displacement = 1;
      }

      let waveAmplitude =
        radius +
        displacement *
          Math.sin((currentAngle + offsetAngle) * numberOfWaves) *
          maxWaveAmplitude; // высота волны
      let x = centerX + Math.cos(currentAngle) * waveAmplitude;
      let y = centerY + Math.sin(currentAngle) * waveAmplitude;
      i > -180 ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function loop() {
    cnv.width |= 0; // ctx.clearReact(0,0,cnv.width,cnv.height)
    updateRings();
    requestAnimationFrame(loop);
  }

  loop();

  window.addEventListener('resize', init);
})();
