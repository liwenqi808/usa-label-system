const carrierOptions = document.querySelectorAll(".carrier-option");
const previewCarrier = document.querySelector("#previewCarrier");
const quoteAmount = document.querySelector("#quoteAmount");
const serviceSelect = document.querySelector("#serviceSelect");
const weightInput = document.querySelector("#weightInput");

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

function updateQuote() {
  if (!weightInput || !serviceSelect || !quoteAmount) return;
  const weight = Number(weightInput.value || 1);
  const serviceBoost = serviceSelect.selectedIndex * 4.65;
  const price = carrierData[currentCarrier].base + weight * carrierData[currentCarrier].perLb + serviceBoost;
  quoteAmount.textContent = `$${price.toFixed(2)}`;
}

function setCarrier(carrier) {
  currentCarrier = carrier;
  if (previewCarrier) previewCarrier.textContent = carrier;
  carrierOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.carrier === carrier);
  });

  if (serviceSelect) {
    serviceSelect.innerHTML = carrierData[carrier].services
      .map((service) => `<option>${service}</option>`)
      .join("");
  }
  updateQuote();
}

carrierOptions.forEach((option) => {
  option.addEventListener("click", () => setCarrier(option.dataset.carrier));
});
serviceSelect?.addEventListener("change", updateQuote);
weightInput?.addEventListener("input", updateQuote);
setCarrier(currentCarrier);
