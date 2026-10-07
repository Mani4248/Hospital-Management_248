const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Doctor data
const doctors = [
    {
        id: 1,
        name: "Dr. Ravi Kumar",
        specialization: "Cardiologist",
        experience: "10 Years"
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        specialization: "Dermatologist",
        experience: "8 Years"
    },
    {
        id: 3,
        name: "Dr. Arjun Reddy",
        specialization: "General Physician",
        experience: "12 Years"
    },
    {
        id: 4,
        name: "Dr. Sneha Patel",
        specialization: "Pediatrician",
        experience: "7 Years"
    }
];

// Appointment data
let appointments = [];

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all doctors
app.get("/api/doctors", (req, res) => {
    res.json(doctors);
});

// Get all appointments
app.get("/api/appointments", (req, res) => {
    res.json(appointments);
});

// Book appointment
app.post("/api/appointments", (req, res) => {

    const {
        patientName,
        age,
        phone,
        doctorId,
        date,
        time,
        reason
    } = req.body;

    if (!patientName || !age || !phone || !doctorId || !date || !time) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    const doctor = doctors.find(d => d.id == doctorId);

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found"
        });
    }

    const appointment = {
        id: appointments.length + 1,
        patientName,
        age,
        phone,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        date,
        time,
        reason: reason || "Not specified",
        status: "Confirmed"
    };

    appointments.push(appointment);

    res.status(201).json({
        message: "Appointment booked successfully!",
        appointment
    });
});

// Cancel appointment
app.delete("/api/appointments/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = appointments.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Appointment not found"
        });
    }

    appointments[index].status = "Cancelled";

    res.json({
        message: "Appointment cancelled successfully"
    });
});

// Server
app.listen(PORT, () => {
    console.log(`Hospital Management System running at http://localhost:${PORT}`);
});