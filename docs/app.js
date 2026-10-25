const APP_CONFIG = window.APP_CONFIG || {
  organizerPin: 'montfort2026',
  useSupabase: false,
  supabaseUrl: '',
  supabaseAnonKey: '',
};

const STORAGE_KEY = 'montfortFarewellPasses';
const PASS_LIMIT = 200;

const form = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const phoneInput = document.getElementById('phoneNumber');
const canvas = document.getElementById('qrCanvas');
const previewName = document.getElementById('previewName');
const previewPhone = document.getElementById('previewPhone');
const previewCode = document.getElementById('previewCode');

function getStoredPasses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePasses(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, PASS_LIMIT)));
}

function generatePassCode() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MWS-${new Date().getFullYear()}-${random}`;
}

function renderPreview(pass) {
  previewName.textContent = pass.name || 'Your Name';
  previewPhone.textContent = pass.phone || '+91 ---------';
  previewCode.textContent = pass.id || '--';

  const payload = JSON.stringify({
    id: pass.id,
    name: pass.name,
    phone: pass.phone,
    createdAt: pass.createdAt,
  });

  QRCode.toCanvas(canvas, payload, {
    width: 220,
    margin: 1,
    color: {
      dark: '#0a1626',
      light: '#f9f4ef',
    },
  }, function (error) {
    if (error) {
      console.error('QR generation failed', error);
    }
  });
}

function createPassRecord(name, phone) {
  const timestamp = new Date().toISOString();
  const id = generatePassCode();

  return {
    id,
    name,
    phone,
    createdAt: timestamp,
    scannedAt: '',
    status: 'Pending',
  };
}

function storePass(pass) {
  const list = getStoredPasses();
  const updated = [pass, ...list];
  savePasses(updated);
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = studentNameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    return;
  }

  const pass = createPassRecord(name, phone);
  storePass(pass);
  renderPreview(pass);
  form.reset();
});

function copyCode() {
  const code = previewCode.textContent;
  if (!code || code === '--') return;

  navigator.clipboard.writeText(code).then(() => {
    alert('Pass ID copied.');
  });
}

document.getElementById('copyPass').addEventListener('click', copyCode);

const sample = createPassRecord('Montfort Student', '+91 98765 43210');
renderPreview(sample);
