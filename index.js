const LS_USERS_KEY = 'medcare_users';
const LS_SESSION_KEY = 'medcare_session';
const LS_APPT_KEY = 'medcare_appointments';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function readUsers() { return JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]'); }
function saveUsers(users) { localStorage.setItem(LS_USERS_KEY, JSON.stringify(users)); }
function readSession() { return JSON.parse(localStorage.getItem(LS_SESSION_KEY) || 'null'); }
function saveSession(sess) { localStorage.setItem(LS_SESSION_KEY, JSON.stringify(sess)); }
function clearSession() { localStorage.removeItem(LS_SESSION_KEY); }
function readAppts() { return JSON.parse(localStorage.getItem(LS_APPT_KEY) || '[]'); }
function saveAppts(appts) { localStorage.setItem(LS_APPT_KEY, JSON.stringify(appts)); }

// Seed demo users if none
(function seed() {
  if (readUsers().length === 0) {
    const demo = [
      { name: 'Dr. Dinanta', email: 'dina@medcare.demo', password: 'doctor', role: 'doctor', specialty: 'Cardiology' },
      { name: 'john Doe', email: 'staff@medcare.demo', password: 'staff', role: 'staff' },
      { name: 'John Patient', email: 'john@demo.com', password: 'patient', role: 'patient' }
    ];
    saveUsers(demo);
  }
})();
/*********************** NAV & AUTH UI ************************/
const openAuthBtn = $('#openAuthBtn');
const userMenu = $('#userMenu');
const userGreeting = $('#userGreeting');
const logoutBtn = $('#logoutBtn');
const dashboardBtn = $('#dashboardBtn');

const authModal = $('#authModal');
const loginForm = $('#loginForm');
const registerForm = $('#registerForm');
const tabLogin = $('#tabLogin');
const tabRegister = $('#tabRegister');

const loginMsg = $('#loginMsg');
const registerMsg = $('#registerMsg');

function setAuthState() {
  const session = readSession();
  if (session) {
    openAuthBtn.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userMenu.classList.add('flex');
    userGreeting.textContent = `${session.name} · ${session.role.toUpperCase()}`;
  } else {
    openAuthBtn.classList.remove('hidden');
    userMenu.classList.add('hidden');
    userMenu.classList.remove('flex');
  }
  refreshApptDoctorOptions();
}

function redirectToDashboard() {
  const session = readSession();
  if (!session) return;
  if (session.role === 'doctor') {
    window.location.href = 'doctor.html';
  } else if (session.role === 'staff') {
    window.location.href = 'staff.html';
  } else if (session.role === 'patient') {
    window.location.href = 'patient.html';
  }
}

openAuthBtn.addEventListener('click', () => openModal('login'));
logoutBtn.addEventListener('click', () => {
  clearSession();
  setAuthState();
  window.location.href = 'index.html'; // Go back to home on logout
});
dashboardBtn.addEventListener('click', redirectToDashboard);

// Modal controls
function openModal(tab = 'login') {
  authModal.classList.remove('hidden');
  setTab(tab);
}
function closeModal() { authModal.classList.add('hidden'); }
$$('[data-close]').forEach(x => x.addEventListener('click', closeModal));

tabLogin.addEventListener('click', () => setTab('login'));
tabRegister.addEventListener('click', () => setTab('register'));

function setTab(tab) {
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('btn-primary'); tabLogin.classList.remove('btn-outline');
    tabRegister.classList.add('btn-outline'); tabRegister.classList.remove('btn-primary');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabRegister.classList.add('btn-primary'); tabRegister.classList.remove('btn-outline');
    tabLogin.classList.add('btn-outline'); tabLogin.classList.remove('btn-primary');
  }
  loginMsg.classList.add('hidden');
  registerMsg.classList.add('hidden');
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const password = $('#loginPassword').value;
  const user = readUsers().find(u => u.email.toLowerCase() === email && u.password === password);
  if (user) {
    saveSession({ name: user.name, email: user.email, role: user.role });
    setAuthState();
    closeModal();
    redirectToDashboard(); // Redirect after login
  } else {
    loginMsg.classList.remove('hidden');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#regName').value.trim();
  const email = $('#regEmail').value.trim().toLowerCase();
  const password = $('#regPassword').value;
  const role = $('#regRole').value;

  const users = readUsers();
  if (users.find(u => u.email === email)) {
    registerMsg.textContent = 'Email already registered.';
    registerMsg.classList.remove('text-green-700');
    registerMsg.classList.add('text-red-600');
    registerMsg.classList.remove('hidden');
    return;
  }

  users.push({ name, email, password, role });
  saveUsers(users);

  registerMsg.textContent = 'Account created! You can login now.';
  registerMsg.classList.add('text-green-700');
  registerMsg.classList.remove('text-red-600');
  registerMsg.classList.remove('hidden');
  setTab('login');
});

function refreshApptDoctorOptions() {
  const sel = $('#apptDoctor');
  if (!sel) return; // Only run on pages that have this element
  const docs = readUsers().filter(u => u.role === 'doctor');
  sel.innerHTML = docs.map(d => `<option value="${d.email}">${d.name} (${d.specialty || 'General'})</option>`).join('');
}

/* APPOINTMENTS *****/
const appointmentForm = $('#appointmentForm');
appointmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const session = readSession();
  if (!session || session.role !== 'patient') {
    alert('Please login as a Patient to book an appointment.');
    openModal('login');
    return;
  }
  const appts = readAppts();
  const appt = {
    id: 'A' + Math.random().toString(36).slice(2, 8),
    patientEmail: session.email,
    doctorEmail: $('#apptDoctor').value,
    date: $('#apptDate').value,
    time: $('#apptTime').value,
    notes: $('#apptNotes').value.trim(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  appts.push(appt);
  saveAppts(appts);
  appointmentForm.reset();
  alert('Appointment requested! You can see it in your dashboard.');
  redirectToDashboard();
});

// Footer year
$('#year').textContent = new Date().getFullYear();

// Init
setAuthState();
 document.getElementById("logoutBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("medcare_session"); 
       window.location.href = "index.html";
    }
  });