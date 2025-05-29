// sendMessage.js
const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;

// ✅ Jouw Twilio SID en Auth Token
const client = require('twilio')(
  'AC22f9046cc2b242a3a5f08cfabc005f78', // Vervangen door jouw SID
  'f8b5284f7b1f9dff52c6eec96476f0f8'   // Vervangen door jouw Auth Token
);

const app = express();
app.use(bodyParser.json());

// 📤 Endpoint om een WhatsApp-bericht te versturen
app.post('/send', async (req, res) => {
  const { message } = req.body;

  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886',     // Twilio Sandbox WhatsApp nummer
      to: 'whatsapp:+31636018209',       // Jouw eigen WhatsApp nummer
      body: message,
    });

    res.send("✅ Bericht is succesvol verstuurd!");
  } catch (e) {
    console.error("❌ Fout bij verzenden:", e);
    res.status(500).send("❌ Fout bij verzenden");
  }
});

// 🚀 Start de server op poort 3000
app.listen(3000, () => {
  console.log("🚀 WhatsApp server draait op poort 3000");
});
