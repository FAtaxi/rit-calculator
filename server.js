import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'chauffeurs.json');

// Pas deze aan naar je eigen e-mailprovider (voorbeeld: Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Zet in Render als environment variable
    pass: process.env.EMAIL_PASS  // Zet in Render als environment variable
  }
});

app.post("/api/send-verificatie", async (req, res) => {
  const { email, code, naam } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email en code verplicht" });
  try {
    await transporter.sendMail({
      from: `"FA Taxi Centrale" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Uw verificatiecode voor FA Taxi Centrale",
      text: `Beste ${naam || "klant"},\n\nUw verificatiecode is: ${code}\n\nMet vriendelijke groet,\nFA Taxi Centrale`
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "E-mail verzenden mislukt", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("FA Taxi Centrale backend draait!");
});

// 🚗 Registratie
app.post('/registreer', (req, res) => {
  const { naam, wachtwoord } = req.body;
  const gebruikers = JSON.parse(fs.readFileSync(dataPath));

  const bestaat = gebruikers.find((g) => g.naam === naam);
  if (bestaat) return res.status(400).json({ message: 'Gebruiker bestaat al' });

  gebruikers.push({ naam, wachtwoord });
  fs.writeFileSync(dataPath, JSON.stringify(gebruikers, null, 2));
  res.json({ message: 'Registratie gelukt!' });
});

// 🔐 Login
app.post('/login', (req, res) => {
  const { naam, wachtwoord } = req.body;
  const gebruikers = JSON.parse(fs.readFileSync(dataPath));

  const gebruiker = gebruikers.find((g) => g.naam === naam && g.wachtwoord === wachtwoord);
  if (!gebruiker) return res.status(401).json({ message: 'Onjuiste inloggegevens' });

  res.json({ message: 'Inloggen gelukt!' });
});

// 📍 Locatie ophalen
app.get('/locatie', (req, res) => {
  const locatie = {
    lat: 52.3784,  // Voorbeeld latitude
    lon: 4.9009   // Voorbeeld longitude
  };
  res.json(locatie);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server draait op http://localhost:${port}`);
});
