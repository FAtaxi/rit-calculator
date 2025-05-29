Je krijgt deze fout omdat Microsoft (Outlook/Hotmail) geen gewone wachtwoorden meer toestaat voor SMTP.

**Stappen om het op te lossen:**

1. Zet 2-stapsverificatie aan op je Outlook-account (fataxiservice@outlook.com).
2. Maak een app-wachtwoord aan via https://account.live.com/proofs/manage/additional.
3. Gebruik dit app-wachtwoord als MAIL_PASS in Render (niet je gewone wachtwoord!).
4. MAIL_USER blijft fataxiservice@outlook.com.
5. Herstart je Render service.

**Alternatief:**  
Gebruik een andere e-mailprovider (bijvoorbeeld Gmail met app-wachtwoord, of een SMTP-dienst als SendGrid/Mailgun).

**Let op Gmail:**  
- Gebruik altijd een app-wachtwoord, niet je gewone Gmail-wachtwoord.
- Zet 2-stapsverificatie aan op je Google-account.
- Maak een app-wachtwoord aan via https://myaccount.google.com/apppasswords
- Gebruik dat app-wachtwoord als MAIL_PASS in Render.
- MAIL_USER is je volledige Gmail-adres.

**Zie ook:**  
- https://nodemailer.com/usage/using-gmail/

**Let op:**  
- Je kunt je gewone Outlook-wachtwoord NIET meer gebruiken voor SMTP/Nodemailer.
- Zie de Microsoft uitleg: https://account.live.com/proofs/manage/additional

**Als je nog steeds een 500 Internal Server Error krijgt:**

- Controleer of je app-wachtwoord correct is ingevuld als MAIL_PASS in Render.
- Controleer of MAIL_USER exact fataxiservice@outlook.com is.
- Controleer of je mailbox niet vol is of tijdelijk geblokkeerd.
- Kijk in de Render logs voor de exacte foutmelding bij het verzenden van e-mail.
- Wacht enkele minuten na het aanmaken van een app-wachtwoord (soms duurt activatie even).
- Probeer eventueel een nieuw app-wachtwoord aan te maken en opnieuw in te vullen.

**Extra debugtip:**
- Test je SMTP-instellingen lokaal met een klein Node.js script en dezelfde credentials.
- Als het lokaal werkt maar niet op Render, controleer of Render niet wordt geblokkeerd door Microsoft (soms is er een tijdelijke blokkade).

**Samenvatting:**  
Gebruik altijd een app-wachtwoord voor SMTP, nooit je gewone wachtwoord.
- 500 betekent meestal: authenticatie of SMTP-connectie lukt niet.
- Los dit altijd op via de Render environment variables en controleer de logs voor details.
