const carrierOptions = document.querySelectorAll(".carrier-option");
const previewCarrier = document.querySelector("#previewCarrier");
const quoteAmount = document.querySelector("#quoteAmount");
const serviceSelect = document.querySelector("#serviceSelect");
const weightInput = document.querySelector("#weightInput");
const canvas = document.querySelector("#auroraCanvas");
const context = canvas.getContext("2d");

const carrierData = {
  FedEx: {
    base: 9.75,
    perLb: 0.42,
    services: ["Ground Advantage", "2Day Express", "Priority Overnight"]
  },
  UPS: {
    base: 11.4,
    perLb: 0.55,
    services: ["Ground Saver", "2nd Day Air", "Next Day Air"]
  },
  USPS: {
    base: 6.95,
    perLb: 0.31,
    services: ["Priority Mail", "Ground Advantage", "Priority Express"]
  }
};

let currentCarrier = "FedEx";
let width = 0;
let height = 0;
let particles = [];

function setCanvasSize() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  particles = Array.from({ length: width < 760 ? 18 : 30 }, (_, index) => ({
    x: (width / 30) * index + Math.random() * 90,
    y: Math.random() * height,
    radius: 120 + Math.random() * 190,
    speed: 0.16 + Math.random() * 0.38,
    hue: [184, 146, 42, 328, 156][index % 5],
    alpha: 0.12 + Math.random() * 0.08
  }));
}

function drawAurora() {
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

function setCarrier(carrier) {
  currentCarrier = carrier;
  previewCarrier.textContent = carrier;
  carrierOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.carrier === carrier);
  });

  serviceSelect.innerHTML = carrierData[carrier].services
    .map((service) => `<option>${service}</option>`)
    .join("");
  updateQuote();
}

function updateQuote() {
  const weight = Number(weightInput.value || 1);
  const serviceBoost = serviceSelect.selectedIndex * 4.65;
  const price = carrierData[currentCarrier].base + weight * carrierData[currentCarrier].perLb + serviceBoost;
  quoteAmount.textContent = `$${price.toFixed(2)}`;
}

carrierOptions.forEach((option) => {
  option.addEventListener("click", () => setCarrier(option.dataset.carrier));
});

serviceSelect.addEventListener("change", updateQuote);
weightInput.addEventListener("input", updateQuote);
window.addEventListener("resize", setCanvasSize);

setCanvasSize();
setCarrier(currentCarrier);
drawAurora();
