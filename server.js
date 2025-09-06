const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (frontend in /public folder)
app.use(express.static(path.join(__dirname, "public")));

// Doctor database
const doctors = [
  { department: "Cardiology", keywords: ["heart", "chest pain", "cardio"], doctor: "Dr. Sharma", contact: "+91-11111-11111", room: "Room 101" },
  { department: "Pulmonology", keywords: ["cough", "breath", "asthma", "lungs"], doctor: "Dr. Singh", contact: "+91-22222-22222", room: "Room 102" },
  { department: "Dermatology", keywords: ["skin", "rash", "itch", "acne"], doctor: "Dr. Patel", contact: "+91-33333-33333", room: "Room 201" },
  { department: "Orthopedics", keywords: ["bone", "joint", "fracture", "back pain"], doctor: "Dr. Mehta", contact: "+91-44444-44444", room: "Room 202" },
  { department: "ENT", keywords: ["ear", "nose", "throat", "sinus"], doctor: "Dr. Gupta", contact: "+91-55555-55555", room: "Room 301" },
  { department: "Ophthalmology", keywords: ["eye", "vision", "sight"], doctor: "Dr. Reddy", contact: "+91-66666-66666", room: "Room 302" },
  { department: "Gastroenterology", keywords: ["stomach", "abdomen", "digestion"], doctor: "Dr. Iyer", contact: "+91-77777-77777", room: "Room 401" },
  { department: "General Physician", keywords: [], doctor: "Dr. Nair", contact: "+91-88888-88888", room: "Room 402" }
];

// Match symptoms to department/doctor
function matchDoctor(issue) {
  if (!issue) return doctors.find(d => d.department === "General Physician");
  const text = issue.toLowerCase();

  for (const doc of doctors) {
    if (doc.keywords.some(k => text.includes(k))) {
      return doc;
    }
  }
  return doctors.find(d => d.department === "General Physician");
}

// API route
app.post("/api/book", (req, res) => {
  const { name, issue, date } = req.body;

  if (!name || !issue || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const doctor = matchDoctor(issue);

  const appointment = {
    name,
    issue,
    date,
    doctor: doctor.doctor,
    department: doctor.department,
    contact: doctor.contact,
    room: doctor.room
  };

  res.json({ appointment });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
