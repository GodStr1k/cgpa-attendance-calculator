function loadDashboard() {
  const id = document.getElementById("sid").value;
  const output = document.getElementById("output");

  if (!id) {
    output.innerText = "Enter Student ID";
    return;
  }

  output.innerText = "Loading...";

  // 1️⃣ Fetch attendance
  fetch("http://localhost:3000/dashboard/" + id)
    .then(res => res.json())
    .then(data => {

      let text = "ATTENDANCE:\n";

      if (data.attendance && data.attendance.length > 0) {
        data.attendance.forEach(a => {
          text += `${a.subject}: ${a.percentage}%\n`;
        });
      } else {
        text += "No attendance data\n";
      }

      // 2️⃣ Fetch CGPA
      fetch("http://localhost:3000/cgpa/" + id)
        .then(res => res.json())
        .then(cg => {

          text += "\nCGPA DETAILS:\n";

          if (cg && cg.cgpa) {
            text += "CGPA: " + cg.cgpa + "\n";
            text += "Total Credits: " + cg.total_credits;
          } else {
            text += "No CGPA data";
          }

          output.innerText = text;
        });
    })
    .catch(() => {
      output.innerText = "Error loading data";
    });
}