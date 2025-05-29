Om Mollie werkend te krijgen heb ik van jou nodig:

1. **Jouw Mollie API key**
   - Ga naar https://www.mollie.com/dashboard/developers/api-keys
   - Gebruik de test API key (begint met `test_...`) voor testen.

2. **Welke betaalflow wil je?**
   - Alleen iDEAL of ook andere betaalmethodes?
   - Moet de klant na betaling automatisch terug naar jouw site?

3. **Jouw frontend domein/URL**
   - Waar moet Mollie na betaling naar terugsturen? (bv. https://fa-taxi-centrale.onrender.com/bedankt.html)

4. **Wil je een webhook?**
   - Wil je dat Mollie jouw backend een seintje geeft als de betaling is afgerond? (aanbevolen voor betrouwbaarheid)

**Stappenplan:**
- Voeg je Mollie API key toe als environment variable op Render, bijvoorbeeld `MOLLIE_API_KEY`.
- Maak in je backend een endpoint `/api/mollie/betaling` dat een betaling aanmaakt via de Mollie API.
- Je frontend stuurt een POST naar `/api/mollie/betaling` met het bedrag, omschrijving, klant-id, etc.
- Je backend maakt de betaling aan bij Mollie en stuurt de klant door naar de Mollie-betaallink.
- (Optioneel) Je backend ontvangt een webhook van Mollie en slaat de status op.

**Laat weten:**
- Je Mollie test API key (of voeg toe als env var op Render)
- Welke betaalmethodes je wilt
- De URL waar de klant na betaling heen moet
- Of je een webhook wilt gebruiken

Dan maak ik de benodigde backend code voor je!
