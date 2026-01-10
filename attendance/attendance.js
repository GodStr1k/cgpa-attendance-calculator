function saveAttendance(event) {
  if (event) event.preventDefault();

  const sid = document.getElementById("sid").value;
  const subject = document.getElementById("subject").value;
  const total = Number(document.getElementById("total").value);
  const attended = Number(document.getElementById("attended").value);

  if (!sid || !subject || total <= 0 || attended < 0) {
    result.innerText = "Enter valid values";
    return false;
  }

  const percentage = ((attended / total) * 100).toFixed(2);

  fetch("http://localhost:3000/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: sid,
      subject,
      percentage
    })
  });

  result.innerText =
    "Saved Successfully\n" +
    "Subject: " + subject + "\n" +
    "Attendance: " + percentage + "%";

  return false;
}