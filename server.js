// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());           // allow cross-origin requests
app.use(express.json());   // parse JSON request bodies

// In-memory store (simple)
const appointments = [];

// Simple disease -> doctor mapping (expand as needed)
const diseaseMapping = {
  "tooth": "Dentist","teeth": "Dentist","cavity": "Dentist","gum": "Dentist",
  "eye": "Ophthalmologist","vision": "Ophthalmologist","cataract": "Ophthalmologist",
  "heart": "Cardiologist","chest pain": "Cardiologist",
  "lungs": "Pulmonologist","breathing": "Pulmonologist","asthma": "Pulmonologist",
  "skin": "Dermatologist","rash": "Dermatologist","allergy": "Dermatologist",
  "fever": "General Physician","cold": "General Physician","cough": "General Physician",
  "stomach": "Gastroenterologist","liver": "Gastroenterologist",
  "diabetes": "Endocrinologist","thyroid": "Endocrinologist",
  "bone": "Orthopedic","joint": "Orthopedic","fracture": "Orthopedic",
  "kidney": "Nephrologist","urine": "Urologist",
  "brain": "Neurologist","headache": "Neurologist",
  "depression": "Psychiatrist","anxiety": "Psychiatrist"
};

function getDoctor(issue) {
  const text = (issue || "").toLowerCase();
  for (const k in diseaseMapping) {
    if (text.includes(k)) return diseaseMapping[k];
  }
  return "General Physician";
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// Book appointment (POST /api/book)
app.post("/api/book", (req, res) => {
  const { name, issue, date } = req.body;
  if (!name || !issue || !date) {
    return res.status(400).json({ error: "Please provide name, issue and date." });
  }
  const doctor = getDoctor(issue);
  const appt = {
    id: appointments.length + 1,
    name,
    issue,
    doctor,
    date,
    createdAt: new Date().toISOString()
  };
  appointments.push(appt);
  return res.json({ message: "Appointment booked", appointment: appt });
});

// Admin: list appointments
app.get("/api/appointments", (_req, res) => res.json(appointments));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
