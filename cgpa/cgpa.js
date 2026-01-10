function calculate(event) {
  if (event) event.preventDefault();

  const sid = document.getElementById("sid").value;

  if (!sid) {
    out.innerText = "Enter Student ID";
    return false;
  }

  let totalCredits = 0;
  let totalPoints = 0;

  for (let i = 1; i <= 8; i++) {
    const credits = Number(document.getElementById("c" + i).value);
    const gpa = Number(document.getElementById("g" + i).value);

    if (credits > 0 && gpa > 0) {
      totalCredits += credits;
      totalPoints += credits * gpa;
    }
  }

  if (totalCredits === 0) {
    out.innerText = "Enter at least one semester";
    return false;
  }

  const cgpa = (totalPoints / totalCredits).toFixed(2);

  out.innerText =
    "Saved Successfully\n" +
    "Total Credits: " + totalCredits + "\n" +
    "CGPA: " + cgpa;

  fetch("http://localhost:3000/cgpa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: sid,
      totalCredits,
      cgpa
    })
  });

  return false;
}