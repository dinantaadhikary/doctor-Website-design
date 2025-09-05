 // Example: Doctors in the system
    let doctors = JSON.parse(localStorage.getItem("medcare_doctors") || '["Dr. Roy", "Dr. Sayandeep", "Dr. Sahid"]');

    // Example: Patient descriptions format
    let patientDiseases = JSON.parse(localStorage.getItem("patient_diseases") || "[]");
    // [{text:"Fever", date:"2025-09-05T12:30:00Z", doctor:"Dr. Smith"}]

    const listEl = document.getElementById("patientDescriptionList");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    function renderDescriptions() {
      listEl.innerHTML = "";
      let filtered = [...patientDiseases];

      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(item => item.text.toLowerCase().includes(searchTerm));
      }

      if (sortSelect.value === "newest") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      if (filtered.length === 0) {
        listEl.innerHTML = "<li>No descriptions found.</li>";
        return;
      }

      filtered.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("flex", "items-center", "justify-between", "bg-gray-50", "p-3", "rounded-lg");

        let displayText = item.text;
        if (searchTerm) {
          const regex = new RegExp(`(${searchTerm})`, "gi");
          displayText = item.text.replace(regex, "<mark>$1</mark>");
        }

        const span = document.createElement("span");
        span.innerHTML = `${displayText} <small class="text-gray-500">(${new Date(item.date).toLocaleString()})</small> 
          ${item.doctor ? `<span class="ml-2 text-blue-600">[Assigned: ${item.doctor}]</span>` : `<span class="ml-2 text-red-500">[Unassigned]</span>`}`;

        const btnsDiv = document.createElement("div");
        btnsDiv.classList.add("flex", "gap-2");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "btn-outline";
        editBtn.addEventListener("click", () => editDescription(index));

        const assignBtn = document.createElement("button");
        assignBtn.textContent = "Assign Doctor";
        assignBtn.className = "btn-primary px-3 py-1 text-sm";
        assignBtn.addEventListener("click", () => assignDoctor(index));

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "btn-danger";
        delBtn.addEventListener("click", () => deleteDescription(index));

        btnsDiv.append(editBtn, assignBtn, delBtn);

        li.append(span, btnsDiv);
        listEl.appendChild(li);
      });
    }

    function editDescription(index) {
      const newDesc = prompt("Edit patient description:", patientDiseases[index].text);
      if (newDesc !== null && newDesc.trim() !== "") {
        patientDiseases[index].text = newDesc.trim();
        localStorage.setItem("patient_diseases", JSON.stringify(patientDiseases));
        renderDescriptions();
      }
    }

    function deleteDescription(index) {
      if (confirm("Are you sure you want to delete this description?")) {
        patientDiseases.splice(index, 1);
        localStorage.setItem("patient_diseases", JSON.stringify(patientDiseases));
        renderDescriptions();
      }
    }

    function assignDoctor(index) {
      const doctorName = prompt("Enter doctor name or choose: \n" + doctors.join("\n"), patientDiseases[index].doctor || "");
      if (doctorName && doctorName.trim() !== "") {
        patientDiseases[index].doctor = doctorName.trim();
        localStorage.setItem("patient_diseases", JSON.stringify(patientDiseases));
        renderDescriptions();
      }
    }

    searchInput.addEventListener("input", renderDescriptions);
    sortSelect.addEventListener("change", renderDescriptions);

    renderDescriptions();

    document.getElementById("logoutBtn").addEventListener("click", function () {
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("medcare_session");
        window.location.href = "index.html";
      }
    });
    function markCheckedIn() {
      const btn = document.getElementById('checkInBtn');
      btn.textContent = 'Checked-in ✅';
      btn.classList.remove('bg-green-600', 'hover:bg-green-700');
      btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    }
