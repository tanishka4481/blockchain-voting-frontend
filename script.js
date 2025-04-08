async function submitVote() {
  const aadhaar = document.getElementById("aadhaar").value.trim();
  const candidate = document.getElementById("candidate").value;
  const email = document.getElementById("email").value.trim();
  const status = document.getElementById("status");

  if (!aadhaar || aadhaar.length !== 12 || isNaN(aadhaar)) {
    status.textContent = "Enter valid 12-digit Aadhaar.";
    return;
  }

  if (!candidate) {
    status.textContent = "Please select a candidate.";
    return;
  }

  const encrypted = simpleEncrypt(aadhaar);
  const voteData = { aadhaar: encrypted, candidate, email };

  try {
    const res = await fetch("http://localhost:3000/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voteData),
    });
    const result = await res.json();
    status.textContent = `✅ ${result.message}`;
  } catch (err) {
    status.textContent = "❌ Failed to submit vote.";
    console.error(err);
  }
}
