const STORAGE_KEY = 'farewellEpassDemo';

const defaultEntries = [
  {
    id: 'FARE-2026001',
    studentName: 'Riya Shah',
    rollNumber: 'BCA-2041',
    department: 'Computer Science',
    passType: 'VIP',
    contact: '+91 98765 43210',
    notes: 'Guest of faculty',
    passCode: 'FARE-2026001|Riya Shah|VIP|2026',
    status: 'Checked in',
    checkedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'FARE-2026002',
    studentName: 'Arjun Verma',
    rollNumber: 'MCA-1102',
    department: 'Management',
    passType: 'General',
    contact: '+91 91234 56789',
    notes: '',
    passCode: 'FARE-2026002|Arjun Verma|General|2026',
    status: 'Pending',
    checkedAt: '',
  },
];

let entries = loadEntries();

const form = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const rollNumberInput = document.getElementById('rollNumber');
const departmentInput = document.getElementById('department');
const passTypeInput = document.getElementById('passType');
const contactInput = document.getElementById('contact');
const notesInput = document.getElementById('notes');

const previewName = document.getElementById('previewName');
const previewType = document.getElementById('previewType');
const previewRoll = document.getElementById('previewRoll');
const previewDept = document.getElementById('previewDept');
const previewCode = document.getElementById('previewCode');
const qrCanvas = document.getElementById('qrCanvas');
const entryList = document.getElementById('entryList');
const studentTableBody = document.getElementById('studentTableBody');
const scanInput = document.getElementById('scanInput');
const scanMessage = document.getElementById('scanMessage');

function loadEntries() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    } catch (error) {
      console.error('Unable to parse saved entries', error);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEntries));
  return [...defaultEntries];
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatStatus(status) {
  return status === 'Checked in' ? 'success' : 'pending';
}

function updateStats() {
  const total = entries.length;
  const checked = entries.filter((entry) => entry.status === 'Checked in').length;
  const pending = total - checked;

  document.getElementById('totalStudents').textContent = total;
  document.getElementById('checkedInTotal').textContent = checked;
  document.getElementById('pendingTotal').textContent = pending;
}

function renderStudentTable() {
  studentTableBody.innerHTML = entries
    .slice()
    .reverse()
    .map((entry) => {
      return `
        <tr>
          <td>
            <strong>${entry.studentName}</strong><br />
            <span class="muted">${entry.department}</span>
          </td>
          <td>${entry.passType}</td>
          <td>${entry.id}</td>
          <td>
            <span class="badge ${formatStatus(entry.status)}">${entry.status}</span>
          </td>
          <td>${entry.checkedAt ? new Date(entry.checkedAt).toLocaleString() : '—'}</td>
        </tr>
      `;
    })
    .join('');
}

function renderRecentEntries() {
  const recent = entries.slice().reverse().slice(0, 5);

  entryList.innerHTML = recent
    .map((entry) => `
      <li>
        <strong>${entry.studentName}</strong> — ${entry.passType} • ${entry.status}
      </li>
    `)
    .join('');
}

function updatePreview(name, type, roll, dept, code) {
  previewName.textContent = name || 'Student Name';
  previewType.textContent = type || 'General';
  previewRoll.textContent = roll || '--';
  previewDept.textContent = dept || '--';
  previewCode.textContent = code || '--';
}

function generateQRCode(text) {
  if (!text) return;

  QRCode.toCanvas(
    qrCanvas,
    text,
    {
      width: 210,
      margin: 1,
      color: {
        dark: '#10182b',
        light: '#f8fbff',
      },
    },
    function (error) {
      if (error) {
        console.error('QR Code generation failed', error);
      }
    }
  );
}

function buildPassCode(studentName, roll, department) {
  const safeName = studentName.trim().replace(/\s+/g, ' ');
  const prefix = 'FARE';
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const passId = `${prefix}-${new Date().getFullYear()}-${randomPart}`;
  return `${passId}|${safeName}|${roll}|${department}`;
}

function renderPassPreview(studentData) {
  updatePreview(
    studentData.studentName,
    studentData.passType,
    studentData.rollNumber,
    studentData.department,
    studentData.id
  );
  generateQRCode(studentData.passCode);
}

function addStudent(entry) {
  entries = [entry, ...entries];
  saveEntries();
  updateStats();
  renderStudentTable();
  renderRecentEntries();
}

function makeStudentRecord(formData) {
  const studentName = formData.studentName.trim();
  const rollNumber = formData.rollNumber.trim();
  const department = formData.department.trim();
  const passType = formData.passType || 'General';
  const passId = `FARE-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const passCode = `${passId}|${studentName}|${rollNumber}|${department}|${passType}`;

  return {
    id: passId,
    studentName,
    rollNumber,
    department,
    passType,
    contact: formData.contact.trim(),
    notes: formData.notes.trim(),
    passCode,
    status: 'Pending',
    checkedAt: '',
  };
}

function showMessage(type, text) {
  scanMessage.className = `scan-message ${type}`;
  scanMessage.textContent = text;
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const record = makeStudentRecord({
    studentName: studentNameInput.value,
    rollNumber: rollNumberInput.value,
    department: departmentInput.value,
    passType: passTypeInput.value,
    contact: contactInput.value,
    notes: notesInput.value,
  });

  addStudent(record);
  renderPassPreview(record);

  form.reset();
  passTypeInput.value = 'General';
  showMessage('success', `Pass generated for ${record.studentName}. Entry code: ${record.id}`);
});

function copyPassCode() {
  const code = previewCode.textContent;
  if (!code || code === '--') return;

  navigator.clipboard.writeText(code).then(() => {
    showMessage('success', `Pass code copied: ${code}`);
  });
}

function resetDemo() {
  entries = [...defaultEntries];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  updateStats();
  renderStudentTable();
  renderRecentEntries();
  showMessage('success', 'Demo data reset.');
  const first = entries[0];
  renderPassPreview(first);
}

document.getElementById('copyCodeBtn').addEventListener('click', copyPassCode);
document.getElementById('resetDemo').addEventListener('click', resetDemo);

document.getElementById('checkInBtn').addEventListener('click', function () {
  const value = scanInput.value.trim();
  if (!value) {
    showMessage('error', 'Please enter a pass code to check in the guest.');
    return;
  }

  const student = entries.find((entry) => {
    return (
      entry.id.toLowerCase() === value.toLowerCase() ||
      entry.passCode.toLowerCase() === value.toLowerCase() ||
      entry.studentName.toLowerCase() === value.toLowerCase() ||
      entry.rollNumber.toLowerCase() === value.toLowerCase()
    );
  });

  if (!student) {
    showMessage('error', 'No matching entry found for that pass code.');
    return;
  }

  student.status = 'Checked in';
  student.checkedAt = new Date().toISOString();
  saveEntries();
  updateStats();
  renderStudentTable();
  renderRecentEntries();
  showMessage('success', `${student.studentName} checked in successfully.`);
  scanInput.value = '';
});

document.getElementById('clearScan').addEventListener('click', function () {
  scanInput.value = '';
  scanMessage.className = 'scan-message';
  scanMessage.textContent = '';
});

function init() {
  updateStats();
  renderStudentTable();
  renderRecentEntries();

  const firstEntry = entries[0];
  if (firstEntry) {
    renderPassPreview(firstEntry);
  }
}

init();

