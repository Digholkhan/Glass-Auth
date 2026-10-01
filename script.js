const authShell = document.getElementById('authShell');
const authCard = document.getElementById('authCard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const particlesContainer = document.getElementById('particles');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initParticles() {
  if (!particlesContainer) return;

  const particleCount = reduceMotion ? 24 : 52;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.setProperty('--duration', `${8 + Math.random() * 12}s`);
    particle.style.setProperty('--x-shift', `${(Math.random() - 0.5) * 30}px`);
    particle.style.setProperty('--y-shift', `${(Math.random() - 0.5) * 28}px`);
    particle.style.width = `${2 + Math.random() * 4}px`;
    particle.style.height = particle.style.width;
    particle.style.opacity = `${0.14 + Math.random() * 0.5}`;
    particlesContainer.appendChild(particle);
  }
}

function setMode(mode) {
  authShell.dataset.mode = mode;
  authCard.dataset.mode = mode;
  document.querySelectorAll('.auth-form').forEach((panel) => {
    const isActive = panel.dataset.form === mode;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', String(!isActive));
  });

  requestAnimationFrame(syncAuthCardHeight);
}

function syncAuthCardHeight() {
  const activePanel = document.querySelector('.auth-form.active');
  if (!activePanel) return;

  const height = Math.ceil(
    activePanel.scrollHeight ||
    activePanel.offsetHeight ||
    activePanel.getBoundingClientRect().height
  );
  authCard.style.height = `${height}px`;
  authCard.style.overflowY = authShell.dataset.mode === 'register' ? 'auto' : 'hidden';
}

function togglePassword(button) {
  const target = document.getElementById(button.dataset.target);
  const isPassword = target.type === 'password';
  target.type = isPassword ? 'text' : 'password';
  button.textContent = isPassword ? 'Hide' : 'Show';
  button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
}

document.querySelectorAll('.form-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const nextMode = button.dataset.target;
    setMode(nextMode);
  });
});

document.querySelectorAll('.toggle-password').forEach((button) => {
  button.addEventListener('click', () => togglePassword(button));
});

function showError(input, message) {
  const fieldGroup = input.closest('.field-group');
  const errorEl = fieldGroup.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  const fieldGroup = input.closest('.field-group');
  const errorEl = fieldGroup.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }
  input.setAttribute('aria-invalid', 'false');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updatePasswordMeter(password) {
  const bars = document.querySelectorAll('.meter-bar');
  const strengthText = document.getElementById('strengthText');
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  bars.forEach((bar, index) => {
    bar.classList.remove('active', 'good');
    if (index < score) {
      bar.classList.add(score >= 3 ? 'good' : 'active');
    }
  });

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const labelIndex = Math.min(labels.length - 1, Math.max(0, score - 1));
  strengthText.textContent = labels[labelIndex];
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const submitButton = loginForm.querySelector('.primary-btn');
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let valid = true;

  if (!email) {
    showError(emailInput, 'Please enter your email address.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError(emailInput, 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError(emailInput);
  }

  if (!password) {
    showError(passwordInput, 'Please enter your password.');
    valid = false;
  } else {
    clearError(passwordInput);
  }

  if (!valid) return;

  submitButton.classList.add('loading');
  submitButton.disabled = true;
  submitButton.querySelector('.btn-label').textContent = 'Signing in...';

  setTimeout(() => {
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    submitButton.querySelector('.btn-label').textContent = 'Sign In';
    alert('Login successful — demo mode active.');
  }, 1200);
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = document.getElementById('registerName');
  const emailInput = document.getElementById('registerEmail');
  const passwordInput = document.getElementById('registerPassword');
  const confirmInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('terms');
  const submitButton = registerForm.querySelector('.primary-btn');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;

  let valid = true;

  if (!name) {
    showError(nameInput, 'Please enter your full name.');
    valid = false;
  } else {
    clearError(nameInput);
  }

  if (!email) {
    showError(emailInput, 'Please enter your email address.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError(emailInput, 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError(emailInput);
  }

  if (!password) {
    showError(passwordInput, 'Password is required.');
    valid = false;
  } else if (password.length < 8) {
    showError(passwordInput, 'Use at least 8 characters.');
    valid = false;
  } else {
    clearError(passwordInput);
  }

  if (!confirmPassword) {
    showError(confirmInput, 'Please confirm your password.');
    valid = false;
  } else if (password !== confirmPassword) {
    showError(confirmInput, 'Passwords do not match.');
    valid = false;
  } else {
    clearError(confirmInput);
  }

  if (!termsCheckbox.checked) {
    termsCheckbox.setCustomValidity('Please accept the terms and privacy policy.');
    termsCheckbox.reportValidity();
    valid = false;
  } else {
    termsCheckbox.setCustomValidity('');
  }

  if (!valid) return;

  submitButton.classList.add('loading');
  submitButton.disabled = true;
  submitButton.querySelector('.btn-label').textContent = 'Creating account...';

  setTimeout(() => {
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    submitButton.querySelector('.btn-label').textContent = 'Create Account';
    alert('Registration successful — demo mode active.');
  }, 1200);
});

document.getElementById('registerPassword').addEventListener('input', (event) => {
  updatePasswordMeter(event.target.value);
});

['loginEmail', 'loginPassword', 'registerName', 'registerEmail', 'registerPassword', 'confirmPassword'].forEach((id) => {
  const input = document.getElementById(id);
  if (!input) return;

  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      clearError(input);
    }
  });
});

const authCardMove = (event) => {
  if (reduceMotion) return;

  const rect = authCard.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  const rotateY = (x - 0.5) * 8;
  const rotateX = (0.5 - y) * 8;

  authCard.style.setProperty('--tilt-y', `${rotateY}deg`);
  authCard.style.setProperty('--tilt-x', `${rotateX}deg`);
  authCard.style.setProperty('--shine-x', `${(x - 0.5) * 120}px`);
};

document.addEventListener('pointermove', (event) => {
  if (reduceMotion) return;

  const shellRect = authShell.getBoundingClientRect();
  const x = (event.clientX - shellRect.left) / shellRect.width - 0.5;
  const y = (event.clientY - shellRect.top) / shellRect.height - 0.5;

  const scene = document.querySelector('.scene');
  if (scene) {
    scene.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
  }

  if (window.innerWidth > 640) {
    authCardMove(event);
  }
});

document.addEventListener('pointerleave', () => {
  authCard.style.setProperty('--tilt-y', '0deg');
  authCard.style.setProperty('--tilt-x', '0deg');
  authCard.style.setProperty('--shine-x', '0px');
  const scene = document.querySelector('.scene');
  if (scene) scene.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

authCard.addEventListener('pointermove', authCardMove);

authCard.addEventListener('pointerleave', () => {
  authCard.style.setProperty('--tilt-y', '0deg');
  authCard.style.setProperty('--tilt-x', '0deg');
  authCard.style.setProperty('--shine-x', '0px');
});

initParticles();
setMode('login');
updatePasswordMeter('');

requestAnimationFrame(syncAuthCardHeight);

window.addEventListener('resize', syncAuthCardHeight);
