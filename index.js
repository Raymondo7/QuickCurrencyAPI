const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

const apiKey = process.env.EXCHANGE_RATE_API_KEY;
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

app.get('/', (req, res) => {
    res.send("Ceci est mon accueil.");
});

app.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).send('Please provide "from", "to" and "amount" query parameters.');
    }

    try {
        const response = await axios.get(apiUrl);
        const rates = response.data.conversion_rates;
        const conversionRate = rates[to] / rates[from];
        const convertedAmount = amount * conversionRate;

        res.json({
            from,
            to,
            amount,
            convertedAmount,
            rate: conversionRate
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving exchange rates.');
    }
});

app.listen(port, () => {
    console.log(`Currency converter app listening at http://localhost:${port}`);
});
