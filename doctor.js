
    const diseases = JSON.parse(localStorage.getItem("patient_diseases") || "[]");
    document.getElementById("patientDiseases").innerHTML = diseases.length
      ? diseases.map(d => `<li>${d}</li>`).join("")
      : "<li>No reports yet.</li>";

    // Show patient personal details
    const details = JSON.parse(localStorage.getItem("patient_details") || "{}");
    document.getElementById("patientDetails").innerHTML = details.name
      ? `
        <p><b>Name:</b> ${details.name}</p>
        <p><b>Age:</b> ${details.age}</p>
        <p><b>Email:</b> ${details.email}</p>
        <p><b>Phone:</b> ${details.phone}</p>
        <p><b>Address:</b> ${details.address}</p>
      `
      : "<p>No details available.</p>";

    // Save prescription
    const prescriptionHistory = JSON.parse(localStorage.getItem("prescription_history") || "[]");
    function renderPrescriptions() {
      document.getElementById("prescriptionHistory").innerHTML = prescriptionHistory.length
        ? prescriptionHistory.map(p => `<li>${p}</li>`).join("")
        : "<li>No prescriptions saved yet.</li>";
    }
    renderPrescriptions();

    document.getElementById("saveDocNote").addEventListener("click", () => {
      const note = document.getElementById("docNote").value.trim();
      if (note) {
        prescriptionHistory.push(note);
        localStorage.setItem("prescription_history", JSON.stringify(prescriptionHistory));
        document.getElementById("docNote").value = "";
        document.getElementById("docNoteSaved").classList.remove("hidden");
        setTimeout(() => document.getElementById("docNoteSaved").classList.add("hidden"), 2000);
        renderPrescriptions();
      } else {
        alert("Please write a note before saving.");
      }
    });

    // Logout function
    document.getElementById("logoutBtn").addEventListener("click", function () {
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("medcare_session");
        window.location.href = "index.html";
      }
    });