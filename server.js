const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const VOTE_LOG_FILE = "./votes.json";
let votes = [];

// Load previous votes
if (fs.existsSync(VOTE_LOG_FILE)) {
  votes = JSON.parse(fs.readFileSync(VOTE_LOG_FILE));
}

// Encrypt/decrypt simulation
function maskAadhaar(aadhaar) {
  return "****" + aadhaar.slice(-4);
}

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com", // use test email here
    pass: "yourpassword",
  },
});

app.post("/api/vote", (req, res) => {
  const { aadhaar, candidate, email } = req.body;
  const masked = maskAadhaar(aadhaar);
  const timestamp = new Date().toISOString();

  const voteEntry = {
    voter: masked,
    candidate,
    timestamp,
  };

  votes.push(voteEntry);
  fs.writeFileSync(VOTE_LOG_FILE, JSON.stringify(votes, null, 2));

  // Send email confirmation
  if (email) {
    const mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Vote Confirmation",
      text: `Your vote for ${candidate} has been recorded securely at ${timestamp}.`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Email failed:", err);
      else console.log("Email sent:", info.response);
    });
  }

  res.send({ message: "Vote received and logged securely!", timestamp });
});

// Dashboard route
app.get("/api/dashboard", (req, res) => {
  const counts = {};
  votes.forEach((v) => {
    counts[v.candidate] = (counts[v.candidate] || 0) + 1;
  });
  res.json(counts);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
