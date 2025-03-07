// script.js
const form = document.getElementById('multiStepForm');
const steps = document.querySelectorAll('.step');
const progressBar = document.querySelector('.progress');
const nextButtons = document.querySelectorAll('.next-btn');
const prevButtons = document.querySelectorAll('.prev-btn');
const summaryFields = {
  name: document.getElementById('summary-name'),
  email: document.getElementById('summary-email'),
  phone: document.getElementById('summary-phone'),
  address: document.getElementById('summary-address'),
  dob: document.getElementById('summary-dob'),
  gender: document.getElementById('summary-gender')
};

let currentStep = 0;

// Show current step
function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex);
  });
  updateProgressBar();
}

// Update progress bar
function updateProgressBar() {
  const progress = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Validate current step
function validateStep(stepIndex) {
  const inputs = steps[stepIndex].querySelectorAll('input, select');
  let isValid = true;
  inputs.forEach(input => {
    if (!input.checkValidity()) {
      isValid = false;
      input.reportValidity();
    }
  });
  return isValid;
}

// Save form data to localStorage
function autoSave() {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  localStorage.setItem('formData', JSON.stringify(data));
}

// Load saved form data
function loadSavedData() {
  const savedData = JSON.parse(localStorage.getItem('formData'));
  if (savedData) {
    Object.keys(savedData).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = savedData[key];
    });
  }
}

// Update summary
function updateSummary() {
  const formData = new FormData(form);
  Object.keys(summaryFields).forEach(key => {
    summaryFields[key].textContent = formData.get(key);
  });
}

// Next button click
nextButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      autoSave();
      currentStep++;
      showStep(currentStep);
      if (currentStep === steps.length - 1) {
        updateSummary();
      }
    }
  });
});

// Previous button click
prevButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
  });
});

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Form submitted successfully!');
  localStorage.removeItem('formData'); // Clear saved data
  form.reset();
  currentStep = 0;
  showStep(currentStep);
});

// Initialize
loadSavedData();
showStep(currentStep);