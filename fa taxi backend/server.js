const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const accountSid = 'AC62065d08cb81f65011732cf3a80694f5';
const authToken = 'f8b5284f7b1f9dff52c6eec96476f0f8';
const client = twilio(accountSid, authToken);

const fromWhatsAppNumber = 'whatsapp:+14155238886'; 
const toWhatsAppNumber = 'whatsapp:+31647972301';

app.post('/send', async (req, res) => {
  const { message } = req.body;

  try {
    const msg = await client.messages.create({
      from: fromWhatsAppNumber,
      to: toWhatsAppNumber,
      body: message,
    });
    res.status(200).json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error('Fout bij verzenden via Twilio:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server draait op http://localhost:3000');
});