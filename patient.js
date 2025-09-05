function setAuthState() {
  const session = readSession();
  if (session && session.role === 'patient') {
    $('#userGreeting').textContent = `${session.name} · ${session.role.toUpperCase()}`;
  } else {
    alert('Access denied. Please login as a Patient.');
    window.location.href = 'index.html';
  }
}

function renderApptList(el, appts) {
  if (appts.length === 0) { el.innerHTML = '<div class="text-gray-600">No appointments found.</div>'; return; }
  el.innerHTML = '';
  for (const a of appts) {
    const row = document.createElement('div');
    row.className = 'flex items-start justify-between gap-4 p-3 border-b border-gray-100';
    const doctor = readUsers().find(u => u.email === a.doctorEmail);
    row.innerHTML = `
      <div>
        <div class="font-semibold">Dr. ${doctor ? doctor.name : a.doctorEmail}</div>
        <div class="text-sm text-gray-600">${a.date} · ${a.time}</div>
        <div class="text-sm text-gray-500">Notes: ${a.notes || '-'}</div>
      </div>
      <div class="text-right">
        <span class="px-2 py-1 rounded-full text-xs border ${a.status === 'pending' ? 'border-amber-300 text-amber-700' : 'border-emerald-300 text-emerald-700'}">${a.status}</span>
      </div>`;
    el.appendChild(row);
  }
}

function refreshDashboard() {
  const session = readSession();
  $('#dashInfo').textContent = `Signed in as ${session.name} (${session.role.toUpperCase()})`;
  renderApptList($('#patientApptList'), readAppts().filter(a => a.patientEmail === session.email));
}

// Event Listeners
$('#logoutBtn').addEventListener('click', () => {
  clearSession();
  window.location.href = 'index.html';
});

// Init
setAuthState();
refreshDashboard();