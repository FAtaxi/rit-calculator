import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'chauffeurs.json');

// Gebruik Gmail SMTP, via environment variables (Render: MAIL_USER en MAIL_PASS)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // jouw gmail-adres
    pass: process.env.MAIL_PASS  // app-wachtwoord van Gmail
  }
});

app.post("/api/send-verificatie", async (req, res) => {
  const { email, code, naam } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email en code verplicht" });
  try {
    // Log voor debuggen
    console.log("Verificatie e-mail versturen naar:", email, "code:", code, "naam:", naam);
    await transporter.verify();
    await transporter.sendMail({
      from: `"FA Taxi Centrale" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Uw verificatiecode voor FA Taxi Centrale",
      text: `Beste ${naam || "klant"},\n\nUw verificatiecode is: ${code}\n\nMet vriendelijke groet,\nFA Taxi Centrale`
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Fout bij verzenden e-mail:", err);
    // Geef meer details terug voor debuggen (alleen tijdelijk!)
    res.status(500).json({ error: "E-mail verzenden mislukt", details: err.message, stack: err.stack });
  }
});

app.get("/", (req, res) => {
  res.send("<h1>FA Taxi Centrale backend draait!</h1>");
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

// Klantenbestand API (voor alle apparaten)
app.get("/api/klanten", (req, res) => {
  let klanten = [];
  try {
    if (fs.existsSync(path.join(__dirname, "klanten.json"))) {
      klanten = JSON.parse(fs.readFileSync(path.join(__dirname, "klanten.json")));
    }
  } catch (e) {
    klanten = [];
  }
  res.json(klanten);
});

// Rittenbestand API (voor alle apparaten)
app.get("/api/ritten", (req, res) => {
  let ritten = [];
  try {
    if (fs.existsSync(path.join(__dirname, "ritten.json"))) {
      ritten = JSON.parse(fs.readFileSync(path.join(__dirname, "ritten.json")));
    }
  } catch (e) {
    ritten = [];
  }
  res.json(ritten);
});

// Klant opslaan (POST)
app.post("/api/klant", (req, res) => {
  const klant = req.body;
  if (!klant || !klant.email) return res.status(400).json({ error: "Klantgegevens ongeldig" });
  let klanten = [];
  const klantenPath = path.join(__dirname, "klanten.json");
  if (fs.existsSync(klantenPath)) {
    try { klanten = JSON.parse(fs.readFileSync(klantenPath)); } catch (e) {}
  }
  klanten = klanten.filter(k =>
    !(k.email && klant.email && k.email === klant.email) &&
    !(k.telefoon && klant.telefoon && k.telefoon === klant.telefoon)
  );
  klanten.push(klant);
  fs.writeFileSync(klantenPath, JSON.stringify(klanten, null, 2));
  res.json({ success: true });
});

// Rit opslaan (POST)
app.post("/api/rit", (req, res) => {
  const rit = req.body;
  if (!rit || !rit.id) return res.status(400).json({ error: "Ritgegevens ongeldig" });
  let ritten = [];
  const rittenPath = path.join(__dirname, "ritten.json");
  if (fs.existsSync(rittenPath)) {
    try { ritten = JSON.parse(fs.readFileSync(rittenPath)); } catch (e) {}
  }
  ritten = ritten.filter(r => r.id !== rit.id);
  ritten.push(rit);
  fs.writeFileSync(rittenPath, JSON.stringify(ritten, null, 2));
  res.json({ success: true });
});

// Voeg favicon route toe om 404 te voorkomen
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Geen actie nodig in server.js voor 'text-fill-color' foutmelding.
// Deze fout hoort bij CSS in je HTML-bestanden, niet bij deze server code.

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server draait op http://localhost:${port}`);
});
