const ORGANIZER_PIN = (window.APP_CONFIG && window.APP_CONFIG.organizerPin) || 'montfort2026';
const STORAGE_KEY = 'montfortFarewellPasses';

const pinScreen = document.getElementById('pinScreen');
const dashboard = document.getElementById('dashboard');
const pinInput = document.getElementById('pinInput');
const pinSubmit = document.getElementById('pinSubmit');
const totalPasses = document.getElementById('totalPasses');
const checkedInCount = document.getElementById('checkedInCount');
const pendingCount = document.getElementById('pendingCount');
const entryTableBody = document.getElementById('entryTableBody');
const scanResult = document.getElementById('scanResult');

let scanner = null;

function getPasses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePasses(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderStats() {
  const items = getPasses();
  const total = items.length;
  const checked = items.filter((item) => item.status === 'Checked In').length;
  const pending = total - checked;

  totalPasses.textContent = total;
  checkedInCount.textContent = checked;
  pendingCount.textContent = pending;

  entryTableBody.innerHTML = items
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item) => {
      const statusClass = item.status === 'Checked In' ? 'checked' : 'pending';
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.phone}</td>
          <td>${item.id}</td>
          <td><span class="status-badge ${statusClass}">${item.status}</span></td>
          <td>${item.scannedAt ? new Date(item.scannedAt).toLocaleString() : '—'}</td>
        </tr>
      `;
    })
    .join('');
}

function authenticate() {
  const entered = pinInput.value.trim();
  if (entered === ORGANIZER_PIN) {
    pinScreen.style.display = 'none';
    dashboard.classList.add('active');
    renderStats();
    return;
  }

  alert('Incorrect organizer PIN.');
}

pinSubmit.addEventListener('click', authenticate);
pinInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') authenticate();
});

function updateEntryStatus(passId) {
  const items = getPasses();
  const index = items.findIndex((item) => item.id === passId);

  if (index === -1) {
    scanResult.innerHTML = 'Pass not found in the system.';
    return;
  }

  const item = items[index];
  item.status = 'Checked In';
  item.scannedAt = new Date().toISOString();
  savePasses(items);
  renderStats();

  scanResult.innerHTML = `
    <strong>${item.name}</strong><br />
    Phone: ${item.phone}<br />
    Pass ID: ${item.id}<br />
    Checked in at: ${new Date(item.scannedAt).toLocaleString()}
  `;
}

function handleScanSuccess(decodedText) {
  try {
    const parsed = JSON.parse(decodedText);
    if (parsed && parsed.id) {
      updateEntryStatus(parsed.id);
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    }
  } catch (error) {
    scanResult.innerHTML = 'QR code is valid but not in the expected pass format.';
  }
}

function handleScanFailure() {
  // silent: avoid constant noise from non-QR frames
}

async function startScanner() {
  if (!window.Html5Qrcode) {
    scanResult.innerHTML = 'QR scanner library failed to load.';
    return;
  }

  const devices = await Html5Qrcode.getCameras();
  if (!devices || devices.length === 0) {
    scanResult.innerHTML = 'No camera device found.';
    return;
  }

  scanner = new Html5Qrcode('reader');
  await scanner.start(
    devices[0].id,
    { fps: 10, qrbox: { width: 260, height: 260 } },
    handleScanSuccess,
    handleScanFailure
  );

  scanResult.innerHTML = 'Scanner active. Point the camera at a pass QR code.';
}

document.getElementById('startScan').addEventListener('click', startScanner);
document.getElementById('stopScan').addEventListener('click', function () {
  if (scanner) {
    scanner.stop().catch(() => {});
    scanResult.innerHTML = 'Scanner stopped.';
  }
});

renderStats();
