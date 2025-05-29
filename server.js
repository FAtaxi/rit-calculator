const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const dataPath = path.join(__dirname, 'chauffeurs.json');

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
app.listen(port, () => {
  console.log(`🚀 Server draait op http://localhost:${port}`);
});
