const canvas = document.querySelector("#auroraCanvas");
const context = canvas?.getContext("2d");

let width = 0;
let height = 0;
let particles = [];

function setCanvasSize() {
  if (!canvas || !context) return;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  particles = Array.from({ length: 30 }, (_, index) => ({
    x: (width / 30) * index + Math.random() * 90,
    y: Math.random() * height,
    radius: 120 + Math.random() * 190,
    speed: 0.16 + Math.random() * 0.38,
    hue: [184, 146, 42, 328, 156][index % 5],
    alpha: 0.12 + Math.random() * 0.08
  }));
}

function drawAurora() {
  if (!canvas || !context) return;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(7, 11, 19, 0.34)";
  context.fillRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.speed;
    particle.y += Math.sin(Date.now() * 0.0004 + index) * 0.18;

    if (particle.x - particle.radius > width) {
      particle.x = -particle.radius;
      particle.y = Math.random() * height;
    }

    const gradient = context.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.radius
    );
    gradient.addColorStop(0, `hsla(${particle.hue}, 95%, 72%, ${particle.alpha})`);
    gradient.addColorStop(0.52, `hsla(${particle.hue}, 95%, 62%, ${particle.alpha * 0.42})`);
    gradient.addColorStop(1, "rgba(7, 11, 19, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(drawAurora);
}

window.addEventListener("resize", setCanvasSize);
setCanvasSize();
drawAurora();
